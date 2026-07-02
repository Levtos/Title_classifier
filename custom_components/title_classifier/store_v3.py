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
    CONTEXT_STASH,
    ContextRow,
    DEFAULT_ENUM,
    NO_SOURCE_APP,
    ParentGuardError,
    STASH_DEFAULT_ACTIVE_ENUM,
    assert_can_set_parent,
    clamp_enum,
    context_allowed_for,
    new_id,
    normalize_key,
    validate_context,
    validate_media_type,
    validate_signal_type,
)
from .io_v3 import (
    build_export_payload,
    import_identity,
    merge_context_telemetry,
    validate_import_record,
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

    async def async_context_rows(self, entry_ids: list[str]) -> list[ContextRow]:
        """All context rows for a set of entry ids (one query) — feeds the
        list-level context summary without a per-row entry_detail call."""
        if not entry_ids:
            return []
        rows = await self._pool.fetch(
            f"SELECT {_CTX_COLUMNS} FROM tc_v3_entry_context "
            "WHERE entry_id = ANY($1::uuid[])",
            list(entry_ids),
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

        # Stash inverse semantics (FLEET-43): a stash sighting means "a title is
        # playing" ⇒ it should never sit in the Inbox as an unclassified enum 0.
        # Seed new stash rows at STASH_DEFAULT_ACTIVE_ENUM and lift existing rows
        # only while they are still the unclassified default (enum 0) — a manual
        # enum > 0 always wins and is never overwritten. Non-stash sightings pass
        # DEFAULT_ENUM, so the CASE below is a no-op for them (enum untouched on
        # conflict, exactly as before).
        seed_enum = (
            STASH_DEFAULT_ACTIVE_ENUM if context == CONTEXT_STASH else DEFAULT_ENUM
        )

        row = await self._pool.fetchrow(
            f"""
            INSERT INTO tc_v3_catalog
                (id, scope, media_type, signal_type, normalized_key, key, enum,
                 artist, title, album, app_name,
                 first_seen, last_seen, seen_count, updated_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now(), now(), 1, $12)
            ON CONFLICT (scope, media_type, signal_type, normalized_key) DO UPDATE SET
                last_seen  = GREATEST(tc_v3_catalog.last_seen, EXCLUDED.last_seen),
                seen_count = tc_v3_catalog.seen_count + 1,
                key        = EXCLUDED.key,
                enum       = CASE
                    WHEN tc_v3_catalog.enum = 0 THEN EXCLUDED.enum
                    ELSE tc_v3_catalog.enum END,
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
            seed_enum, artist, title, album, app_name, self._instance_id,
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
               SET enum = $2::smallint,
                   hidden_at = CASE WHEN $2::smallint <> 0 THEN NULL ELSE hidden_at END,
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

    async def async_set_hidden(
        self, entry_id: str, hidden: bool
    ) -> CatalogEntryV3 | None:
        """Hide (archive) or unhide a catalog entry."""
        row = await self._pool.fetchrow(
            f"""
            UPDATE tc_v3_catalog
               SET hidden_at = CASE WHEN $2 THEN now() ELSE NULL END,
                   updated_by = $3, updated_at = now()
             WHERE id = $1
            RETURNING {_CAT_COLUMNS}
            """,
            entry_id, hidden, self._instance_id,
        )
        if row is None:
            return None
        entry = _row_to_entry(row)
        self._entries[entry.id] = entry
        return entry

    # ---------------------------------------------- reclassify / rename / move

    async def _find_by_identity(
        self, scope: str, media_type: str, signal_type: str, normalized_key: str
    ) -> CatalogEntryV3 | None:
        row = await self._pool.fetchrow(
            f"SELECT {_CAT_COLUMNS} FROM tc_v3_catalog "
            "WHERE scope = $1 AND media_type = $2 AND signal_type = $3 "
            "AND normalized_key = $4",
            scope, media_type, signal_type, normalized_key,
        )
        return None if row is None else _row_to_entry(row)

    async def async_rename(self, entry_id: str, new_key: str) -> tuple[str, Any]:
        """Rename an entry's display key (recomputes normalized_key).

        Returns ('ok', entry) / ('not_found', None) / ('conflict', other_id) when
        the new identity already exists on a different entry.
        """
        new_key = str(new_key).strip()
        if not new_key:
            return ("invalid", None)
        entry = await self._get_entry(entry_id)
        if entry is None:
            return ("not_found", None)
        new_norm = normalize_key(new_key)
        if new_norm == entry.normalized_key:
            row = await self._pool.fetchrow(
                f"UPDATE tc_v3_catalog SET key = $2, updated_by = $3, "
                f"updated_at = now() WHERE id = $1 RETURNING {_CAT_COLUMNS}",
                entry_id, new_key, self._instance_id,
            )
            updated = _row_to_entry(row)
            self._entries[entry_id] = updated
            return ("ok", updated)
        clash = await self._find_by_identity(
            entry.scope, entry.media_type, entry.signal_type, new_norm
        )
        if clash is not None and clash.id != entry_id:
            return ("conflict", clash.id)
        row = await self._pool.fetchrow(
            f"""
            UPDATE tc_v3_catalog
               SET key = $2, normalized_key = $3, updated_by = $4, updated_at = now()
             WHERE id = $1
            RETURNING {_CAT_COLUMNS}
            """,
            entry_id, new_key, new_norm, self._instance_id,
        )
        updated = _row_to_entry(row)
        self._entries[entry_id] = updated
        return ("ok", updated)

    async def async_reclassify_media_type(
        self, entry_id: str, new_media_type: str
    ) -> tuple[str, Any]:
        """Move an entry to a new media_type (changes identity).

        MVP: blocked when the entry has a parent or children (relations would
        break). Conflict-aware. Context rows no longer valid for the new
        media_type are dropped. Returns ('ok', entry) / ('not_found'|'has_parent'|
        'has_children', None) / ('conflict', other_id).
        """
        new_media_type = validate_media_type(new_media_type)
        entry = await self._get_entry(entry_id)
        if entry is None:
            return ("not_found", None)
        if new_media_type == entry.media_type:
            return ("ok", entry)
        if entry.parent_id is not None:
            return ("has_parent", None)
        if await self._has_children(entry_id):
            return ("has_children", None)
        clash = await self._find_by_identity(
            entry.scope, new_media_type, entry.signal_type, entry.normalized_key
        )
        if clash is not None and clash.id != entry_id:
            return ("conflict", clash.id)
        row = await self._pool.fetchrow(
            f"""
            UPDATE tc_v3_catalog
               SET media_type = $2, updated_by = $3, updated_at = now()
             WHERE id = $1
            RETURNING {_CAT_COLUMNS}
            """,
            entry_id, new_media_type, self._instance_id,
        )
        updated = _row_to_entry(row)
        self._entries[entry_id] = updated
        # Drop context rows that the new media_type may not carry.
        for ctx in await self.async_contexts_for(entry_id):
            if not context_allowed_for(new_media_type, ctx.context):
                await self._delete_context(entry_id, ctx.context, ctx.source_app)
        return ("ok", updated)

    async def _children_of(self, entry_id: str) -> list[CatalogEntryV3]:
        rows = await self._pool.fetch(
            f"SELECT {_CAT_COLUMNS} FROM tc_v3_catalog WHERE parent_id = $1",
            entry_id,
        )
        return [_row_to_entry(r) for r in rows]

    async def async_entry_detail(
        self, entry_id: str
    ) -> tuple[CatalogEntryV3, list[ContextRow], CatalogEntryV3 | None, list[CatalogEntryV3]] | None:
        """Gather full detail for one entry: the entry, its context rows, its
        parent (if a variant) and its child variants. None when not found."""
        entry = await self._get_entry(entry_id)
        if entry is None:
            return None
        contexts = await self.async_contexts_for(entry_id)
        parent = (
            await self._get_entry(entry.parent_id)
            if entry.parent_id is not None
            else None
        )
        children = await self._children_of(entry_id)
        return (entry, contexts, parent, children)

    async def _get_context(
        self, entry_id: str, context: str, source_app: str
    ) -> ContextRow | None:
        row = await self._pool.fetchrow(
            f"SELECT {_CTX_COLUMNS} FROM tc_v3_entry_context "
            "WHERE entry_id = $1 AND context = $2 AND source_app = $3",
            entry_id, context, source_app,
        )
        return None if row is None else _row_to_context(row)

    async def _delete_context(
        self, entry_id: str, context: str, source_app: str
    ) -> None:
        await self._pool.execute(
            "DELETE FROM tc_v3_entry_context "
            "WHERE entry_id = $1 AND context = $2 AND source_app = $3",
            entry_id, context, source_app,
        )

    async def async_move_context(
        self,
        entry_id: str,
        context: str,
        new_context: str,
        *,
        source_app: str = NO_SOURCE_APP,
        new_source_app: str = NO_SOURCE_APP,
    ) -> tuple[str, Any]:
        """Move/merge a context row to (new_context, new_source_app).

        Validates the target context against the entry's media_type. If the
        target already exists, telemetry is merged (seen_count add, first min,
        last max, override only if no conflict). Returns ('ok'|'merged', info) /
        ('not_found'|'context_not_allowed', None).
        """
        entry = await self._get_entry(entry_id)
        if entry is None:
            return ("not_found", None)
        if not context_allowed_for(entry.media_type, new_context):
            return ("context_not_allowed", None)
        src = await self._get_context(entry_id, context, source_app)
        if src is None:
            return ("not_found", None)
        if context == new_context and source_app == new_source_app:
            return ("ok", src)
        tgt = await self._get_context(entry_id, new_context, new_source_app)
        if tgt is None:
            await self._pool.execute(
                "UPDATE tc_v3_entry_context SET context = $4, source_app = $5 "
                "WHERE entry_id = $1 AND context = $2 AND source_app = $3",
                entry_id, context, source_app, new_context, new_source_app,
            )
            return ("ok", {"merged": False})
        merged = merge_context_telemetry(src, tgt)
        await self._pool.execute(
            """
            UPDATE tc_v3_entry_context
               SET seen_count = $4, first_seen = $5, last_seen = $6,
                   enum_override = $7
             WHERE entry_id = $1 AND context = $2 AND source_app = $3
            """,
            entry_id, new_context, new_source_app,
            merged["seen_count"], merged["first_seen"], merged["last_seen"],
            merged["enum_override"],
        )
        await self._delete_context(entry_id, context, source_app)
        return ("merged", {"merged": True, "override_conflict": merged["override_conflict"]})

    # ------------------------------------------------------------- export/import

    async def async_export(
        self, media_types: tuple[str, ...] | None = None, *, include_telemetry: bool = True
    ) -> dict:
        """Build an image-free v3 export document for this scope."""
        if media_types:
            rows = await self._pool.fetch(
                f"SELECT {_CAT_COLUMNS} FROM tc_v3_catalog "
                "WHERE scope = $1 AND media_type = ANY($2::text[])",
                self._scope, list(media_types),
            )
        else:
            rows = await self._pool.fetch(
                f"SELECT {_CAT_COLUMNS} FROM tc_v3_catalog WHERE scope = $1",
                self._scope,
            )
        entries = [_row_to_entry(r) for r in rows]
        contexts_by_entry: dict[str, list[ContextRow]] = {}
        for entry in entries:
            contexts_by_entry[entry.id] = await self.async_contexts_for(entry.id)
        return build_export_payload(
            entries, contexts_by_entry, include_telemetry=include_telemetry
        )

    async def _import_upsert_entry(self, record: dict) -> str:
        nkey = record.get("normalized_key") or normalize_key(record.get("key", ""))
        key = record.get("key") or nkey
        row = await self._pool.fetchrow(
            f"""
            INSERT INTO tc_v3_catalog
                (id, scope, media_type, signal_type, normalized_key, key, enum,
                 hidden_at, first_seen, last_seen, seen_count, updated_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7,
                    CASE WHEN $8 THEN now() ELSE NULL END, now(), now(), $9, $10)
            ON CONFLICT (scope, media_type, signal_type, normalized_key) DO UPDATE SET
                enum       = EXCLUDED.enum,
                key        = EXCLUDED.key,
                hidden_at  = EXCLUDED.hidden_at,
                seen_count = GREATEST(tc_v3_catalog.seen_count, EXCLUDED.seen_count),
                updated_by = EXCLUDED.updated_by,
                updated_at = now()
            RETURNING id
            """,
            new_id(), record.get("scope") or self._scope, record["media_type"],
            record["signal_type"], nkey, key, clamp_enum(record.get("enum", 0)),
            bool(record.get("hidden_at")), int(record.get("seen_count", 0)),
            self._instance_id,
        )
        return str(row["id"])

    async def _import_upsert_context(self, entry_id: str, ctx: dict) -> None:
        override = ctx.get("enum_override")
        override = None if override is None else clamp_enum(override)
        await self._pool.execute(
            """
            INSERT INTO tc_v3_entry_context
                (entry_id, context, source_app, enum_override,
                 first_seen, last_seen, seen_count, last_watcher_id)
            VALUES ($1, $2, $3, $4, now(), now(), $5, $6)
            ON CONFLICT (entry_id, context, source_app) DO UPDATE SET
                enum_override = EXCLUDED.enum_override,
                seen_count = GREATEST(tc_v3_entry_context.seen_count, EXCLUDED.seen_count)
            """,
            entry_id, ctx["context"], ctx.get("source_app") or NO_SOURCE_APP,
            override, int(ctx.get("seen_count", 0)), self._instance_id,
        )

    async def async_import(self, records: list[dict]) -> dict:
        """Validate + upsert v3 records. Never touches legacy tables.

        Two passes: entries first (so parent targets resolve), then parent links
        (via the parent's normalized_key) with the one-level guard. Returns a
        report with imported count, per-record errors and parent errors.
        """
        errors: list[dict] = []
        valid: list[dict] = []
        for index, record in enumerate(records):
            record_errors = validate_import_record(record)
            if record_errors:
                errors.append({"index": index, "errors": record_errors})
            else:
                valid.append(record)

        identity_to_id: dict[tuple[str, str, str, str], str] = {}
        for record in valid:
            entry_id = await self._import_upsert_entry(record)
            identity_to_id[import_identity(record, self._scope)] = entry_id
            for ctx in record.get("contexts", []) or []:
                ctx_seen = ctx.get("seen_count")
                payload = dict(ctx)
                if isinstance(ctx.get("telemetry"), dict):
                    payload["seen_count"] = ctx["telemetry"].get("seen_count", ctx_seen or 0)
                await self._import_upsert_context(entry_id, payload)

        parent_errors: list[dict] = []
        for record in valid:
            parent_key = record.get("parent_key")
            if not parent_key:
                continue
            child_id = identity_to_id[import_identity(record, self._scope)]
            parent_identity = (
                record.get("scope") or self._scope,
                record["media_type"],
                record["signal_type"],
                parent_key,
            )
            parent_id = identity_to_id.get(parent_identity)
            if parent_id is None:
                found = await self._find_by_identity(*parent_identity)
                parent_id = found.id if found is not None else None
            if parent_id is None:
                parent_errors.append({"child": child_id, "reason": "parent_not_found"})
                continue
            try:
                await self.async_set_parent(child_id, parent_id)
            except (ParentGuardError, ValueError) as err:
                parent_errors.append({"child": child_id, "reason": str(err)})

        return {
            "imported": len(valid),
            "rejected": len(errors),
            "errors": errors,
            "parent_errors": parent_errors,
        }

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
