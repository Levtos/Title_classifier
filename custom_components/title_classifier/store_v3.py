"""Postgres store for the v3 media catalog (FLEET-193).

Row-level upserts against tc_v3_catalog / tc_v3_entry_context. Identity is
``(scope, media_type, signal_type, normalized_key)``; the surrogate ``id`` is a
uuid generated in Python (catalog_v3.new_id) — the DB has no uuid default.

Runtime-only imports avoid Home Assistant and asyncpg at module import time so
this layer can be unit-tested with a fake pool (see tests/test_store_v3.py).
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Any

from .catalog_v3 import (
    CatalogEntryV3,
    ContextRow,
    NO_SOURCE_APP,
    assert_can_set_parent,
    clamp_enum,
    new_id,
    normalize_key,
    validate_context,
    validate_media_type,
    validate_signal_type,
)

_LOGGER = logging.getLogger(__name__)

# Re-seeing a manually hidden entry clears the hide only after this grace, so a
# single late event doesn't immediately un-hide what the user just archived.
_MANUAL_HIDE_GRACE = timedelta(minutes=5)
_GRACE_SQL = f"{int(_MANUAL_HIDE_GRACE.total_seconds())} seconds"

_CAT_COLUMNS = (
    "id, scope, media_type, signal_type, normalized_key, key, parent_id, enum, "
    "artist, title, album, app_name, first_seen, last_seen, seen_count, "
    "hidden_at, updated_by, updated_at"
)
_CTX_COLUMNS = (
    "entry_id, context, source_app, enum_override, first_seen, last_seen, "
    "seen_count, last_watcher_id"
)


def _iso(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, datetime):
        return value.isoformat()
    return str(value)


def _opt_str(value: Any) -> str | None:
    return None if value is None else str(value)


def _row_to_entry(record: Any) -> CatalogEntryV3:
    return CatalogEntryV3(
        id=str(record["id"]),
        scope=record["scope"],
        media_type=record["media_type"],
        signal_type=record["signal_type"],
        normalized_key=record["normalized_key"],
        key=record["key"],
        enum=int(record["enum"]),
        parent_id=_opt_str(record["parent_id"]),
        artist=record["artist"],
        title=record["title"],
        album=record["album"],
        app_name=record["app_name"],
        first_seen=_iso(record["first_seen"]),
        last_seen=_iso(record["last_seen"]),
        seen_count=int(record["seen_count"]),
        hidden_at=_iso(record["hidden_at"]) or None,
        updated_by=record["updated_by"],
    )


def _row_to_context(record: Any) -> ContextRow:
    override = record["enum_override"]
    return ContextRow(
        entry_id=str(record["entry_id"]),
        context=record["context"],
        source_app=record["source_app"],
        enum_override=None if override is None else int(override),
        first_seen=_iso(record["first_seen"]),
        last_seen=_iso(record["last_seen"]),
        seen_count=int(record["seen_count"]),
        last_watcher_id=record["last_watcher_id"],
    )


class CatalogStoreV3:
    """Shared v3-catalog facade for one ``scope``.

    Unlike the v2 store (one per scope+category), this is media-centric: methods
    carry ``media_type``/``signal_type`` and the store spans all of them within
    its scope. ``instance_id`` tags writes for NOTIFY echo suppression.
    """

    def __init__(self, pool: Any, *, scope: str, instance_id: str) -> None:
        self._pool = pool
        self._scope = scope
        self._instance_id = instance_id
        self._entries: dict[str, CatalogEntryV3] = {}

    @property
    def scope(self) -> str:
        return self._scope

    @property
    def entries(self) -> dict[str, CatalogEntryV3]:
        """Read-through cache keyed by entry id (populated by async_load)."""
        return self._entries

    # ----------------------------------------------------------------- loading

    async def async_load(self, media_types: tuple[str, ...] | None = None) -> None:
        if media_types:
            rows = await self._pool.fetch(
                f"SELECT {_CAT_COLUMNS} FROM tc_v3_catalog "
                "WHERE scope = $1 AND media_type = ANY($2::text[])",
                self._scope,
                list(media_types),
            )
        else:
            rows = await self._pool.fetch(
                f"SELECT {_CAT_COLUMNS} FROM tc_v3_catalog WHERE scope = $1",
                self._scope,
            )
        self._entries = {str(r["id"]): _row_to_entry(r) for r in rows}

    async def async_contexts_for(self, entry_id: str) -> list[ContextRow]:
        rows = await self._pool.fetch(
            f"SELECT {_CTX_COLUMNS} FROM tc_v3_entry_context WHERE entry_id = $1",
            entry_id,
        )
        return [_row_to_context(r) for r in rows]

    # ------------------------------------------------------------------ writes

    async def async_seen(
        self,
        *,
        media_type: str,
        signal_type: str,
        key: str,
        context: str,
        source_app: str = NO_SOURCE_APP,
        artist: str | None = None,
        title: str | None = None,
        album: str | None = None,
        app_name: str | None = None,
        watcher_id: str | None = None,
    ) -> CatalogEntryV3:
        """Record a sighting: upsert the catalog row by identity AND its context
        observation row. The watcher is an observer only — it never owns the row.
        """
        media_type = validate_media_type(media_type)
        signal_type = validate_signal_type(signal_type)
        context = validate_context(context)
        normalized = normalize_key(key)

        row = await self._pool.fetchrow(
            f"""
            INSERT INTO tc_v3_catalog
                (id, scope, media_type, signal_type, normalized_key, key,
                 artist, title, album, app_name,
                 first_seen, last_seen, seen_count, updated_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now(), now(), 1, $11)
            ON CONFLICT (scope, media_type, signal_type, normalized_key) DO UPDATE SET
                last_seen  = GREATEST(tc_v3_catalog.last_seen, EXCLUDED.last_seen),
                seen_count = tc_v3_catalog.seen_count + 1,
                key        = EXCLUDED.key,
                artist     = COALESCE(EXCLUDED.artist,   tc_v3_catalog.artist),
                title      = COALESCE(EXCLUDED.title,    tc_v3_catalog.title),
                album      = COALESCE(EXCLUDED.album,    tc_v3_catalog.album),
                app_name   = COALESCE(EXCLUDED.app_name, tc_v3_catalog.app_name),
                hidden_at  = CASE
                    WHEN tc_v3_catalog.hidden_at IS NOT NULL
                         AND tc_v3_catalog.hidden_at < now() - INTERVAL '{_GRACE_SQL}'
                    THEN NULL ELSE tc_v3_catalog.hidden_at END,
                updated_by = EXCLUDED.updated_by,
                updated_at = now()
            RETURNING {_CAT_COLUMNS}
            """,
            new_id(), self._scope, media_type, signal_type, normalized, key,
            artist, title, album, app_name, self._instance_id,
        )
        entry = _row_to_entry(row)
        self._entries[entry.id] = entry

        await self._pool.execute(
            """
            INSERT INTO tc_v3_entry_context
                (entry_id, context, source_app, first_seen, last_seen,
                 seen_count, last_watcher_id)
            VALUES ($1, $2, $3, now(), now(), 1, $4)
            ON CONFLICT (entry_id, context, source_app) DO UPDATE SET
                last_seen       = now(),
                seen_count      = tc_v3_entry_context.seen_count + 1,
                last_watcher_id = EXCLUDED.last_watcher_id
            """,
            entry.id, context, source_app or NO_SOURCE_APP, watcher_id,
        )
        return entry

    async def async_set_enum(self, entry_id: str, enum: int) -> CatalogEntryV3 | None:
        enum = clamp_enum(enum)
        row = await self._pool.fetchrow(
            f"""
            UPDATE tc_v3_catalog
               SET enum = $2,
                   hidden_at = CASE WHEN $2 <> 0 THEN NULL ELSE hidden_at END,
                   updated_by = $3, updated_at = now()
             WHERE id = $1
            RETURNING {_CAT_COLUMNS}
            """,
            entry_id, enum, self._instance_id,
        )
        if row is None:
            return None
        entry = _row_to_entry(row)
        self._entries[entry.id] = entry
        return entry

    async def async_set_context_override(
        self,
        entry_id: str,
        context: str,
        enum_override: int | None,
        *,
        source_app: str = NO_SOURCE_APP,
        watcher_id: str | None = None,
    ) -> ContextRow | None:
        """Set/clear the game-context enum_override for one (context, source_app).

        Upserts the context row so an override can be set before the context has
        ever been observed.
        """
        context = validate_context(context)
        override = None if enum_override is None else clamp_enum(enum_override)
        row = await self._pool.fetchrow(
            f"""
            INSERT INTO tc_v3_entry_context
                (entry_id, context, source_app, enum_override,
                 first_seen, last_seen, seen_count, last_watcher_id)
            VALUES ($1, $2, $3, $4, now(), now(), 0, $5)
            ON CONFLICT (entry_id, context, source_app) DO UPDATE SET
                enum_override   = EXCLUDED.enum_override,
                last_watcher_id = EXCLUDED.last_watcher_id
            RETURNING {_CTX_COLUMNS}
            """,
            entry_id, context, source_app or NO_SOURCE_APP, override,
            watcher_id,
        )
        return None if row is None else _row_to_context(row)

    # ---------------------------------------------------------- master/variant

    async def _has_children(self, entry_id: str) -> bool:
        row = await self._pool.fetchrow(
            "SELECT 1 FROM tc_v3_catalog WHERE parent_id = $1 LIMIT 1", entry_id
        )
        return row is not None

    async def _get_entry(self, entry_id: str) -> CatalogEntryV3 | None:
        row = await self._pool.fetchrow(
            f"SELECT {_CAT_COLUMNS} FROM tc_v3_catalog WHERE id = $1", entry_id
        )
        return None if row is None else _row_to_entry(row)

    async def async_set_parent(
        self, child_id: str, parent_id: str
    ) -> CatalogEntryV3:
        """Group ``child_id`` under master ``parent_id`` (variant link).

        Enforces the one-level rules via catalog_v3.assert_can_set_parent; raises
        ParentGuardError on violation. Returns the updated child.
        """
        child = await self._get_entry(child_id)
        if child is None:
            raise ValueError(f"child entry {child_id} not found")
        parent = await self._get_entry(parent_id)
        if parent is None:
            raise ValueError(f"parent entry {parent_id} not found")

        assert_can_set_parent(
            child=child,
            parent=parent,
            parent_has_parent=parent.parent_id is not None,
            child_has_children=await self._has_children(child_id),
        )

        row = await self._pool.fetchrow(
            f"""
            UPDATE tc_v3_catalog
               SET parent_id = $2, updated_by = $3, updated_at = now()
             WHERE id = $1
            RETURNING {_CAT_COLUMNS}
            """,
            child_id, parent_id, self._instance_id,
        )
        entry = _row_to_entry(row)
        self._entries[entry.id] = entry
        return entry

    async def async_clear_parent(self, child_id: str) -> CatalogEntryV3 | None:
        """Split a variant back into a standalone entry (parent_id → NULL)."""
        row = await self._pool.fetchrow(
            f"""
            UPDATE tc_v3_catalog
               SET parent_id = NULL, updated_by = $2, updated_at = now()
             WHERE id = $1
            RETURNING {_CAT_COLUMNS}
            """,
            child_id, self._instance_id,
        )
        if row is None:
            return None
        entry = _row_to_entry(row)
        self._entries[entry.id] = entry
        return entry

    # ------------------------------------------------------------- maintenance

    async def async_delete(self, entry_id: str) -> bool:
        """Delete a catalog entry (its context rows cascade)."""
        row = await self._pool.fetchrow(
            "DELETE FROM tc_v3_catalog WHERE id = $1 RETURNING id", entry_id
        )
        if row is None:
            return False
        self._entries.pop(entry_id, None)
        return True

    async def async_refresh_entry(self, entry_id: str) -> bool:
        """Reload one row into the cache (LISTEN/NOTIFY handler, later phase)."""
        entry = await self._get_entry(entry_id)
        if entry is None:
            return self._entries.pop(entry_id, None) is not None
        self._entries[entry_id] = entry
        return True
