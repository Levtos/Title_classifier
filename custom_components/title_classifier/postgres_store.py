"""Postgres-backed MapperStore against the shared media catalog.

Drop-in replacement for the JSON :class:`MapperStore` (storage.py): same public
surface, but identity is ``(scope, category, key)`` in a shared table instead of
``.storage/<entry_id>`` files. Writes are row-level upserts (never load-all /
write-whole), so two HA instances can share one brain without clobbering.

``.entries`` is a read-through in-memory cache, refreshed on load and — once
LISTEN/NOTIFY is wired (step 5) — on every remote change.
"""

from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .const import DEFAULT_ENUM
from .storage import MANUAL_HIDE_GRACE, MapperEntry

_LOGGER = logging.getLogger(__name__)

# Postgres interval literal mirroring MANUAL_HIDE_GRACE (storage.py).
_GRACE_SQL = f"{int(MANUAL_HIDE_GRACE.total_seconds())} seconds"

_COLUMNS = (
    "scope, category, key, platform, enum, artist, title, album, app_name, "
    "cover_url, cover_source, first_seen, last_seen, seen_count, hidden_at, "
    "updated_by, updated_at"
)


def _iso(value: datetime | None) -> str | None:
    return value.isoformat() if value is not None else None


def _parse_dt(value: str | None) -> datetime | None:
    """Parse a stored ISO timestamp into a tz-aware datetime (UTC if naive)."""
    if not value:
        return None
    try:
        dt = datetime.fromisoformat(value)
    except ValueError:
        return None
    return dt.replace(tzinfo=dt_util.UTC) if dt.tzinfo is None else dt


def _row_to_entry(record: Any) -> MapperEntry:
    return MapperEntry(
        key=record["key"],
        enum=int(record["enum"]),
        first_seen=_iso(record["first_seen"]) or "",
        last_seen=_iso(record["last_seen"]) or "",
        seen_count=int(record["seen_count"]),
        hidden_at=_iso(record["hidden_at"]),
        platform=record["platform"],
        artist=record["artist"],
        title=record["title"],
        album=record["album"],
        app_name=record["app_name"],
        cover_url=record["cover_url"],
        cover_source=record["cover_source"],
    )


class PostgresMapperStore:
    """Storage facade for one watcher, backed by the shared catalog table.

    A watcher is addressed by ``(scope, category)``; several watchers (even
    across instances) that share those two values share their rows — that *is*
    the shared brain. ``instance_id`` tags writes for NOTIFY echo suppression.
    """

    def __init__(
        self,
        hass: HomeAssistant,
        pool: Any,
        *,
        scope: str,
        category: str,
        instance_id: str,
    ) -> None:
        self._hass = hass
        self._pool = pool
        self._scope = scope
        self._category = category
        self._instance_id = instance_id
        self._entries: dict[str, MapperEntry] = {}

    @property
    def entries(self) -> dict[str, MapperEntry]:
        return self._entries

    async def async_load(self) -> None:
        rows = await self._pool.fetch(
            f"SELECT {_COLUMNS} FROM catalog_entry WHERE scope = $1 AND category = $2",
            self._scope,
            self._category,
        )
        self._entries = {row["key"]: _row_to_entry(row) for row in rows}

    def get_enum(self, key: str | None) -> int:
        if not key or key not in self._entries:
            return DEFAULT_ENUM
        return self._entries[key].enum

    async def async_seen(
        self,
        key: str,
        *,
        platform: str | None = None,
        artist: str | None = None,
        title: str | None = None,
        album: str | None = None,
        app_name: str | None = None,
        cover_url: str | None = None,
        cover_source: str | None = None,
    ) -> MapperEntry:
        """Record a sighting (atomic seen_count++); fill attrs/native cover.

        Native-first: when the source supplies a cover it wins (overwrites a
        previously resolved one); when it does not, the existing cover is kept
        so a MAW-resolved cover is never nulled out.
        """
        try:
            row = await self._pool.fetchrow(
                f"""
                INSERT INTO catalog_entry
                    (scope, category, key, platform, artist, title, album, app_name,
                     cover_url, cover_source, first_seen, last_seen, seen_count, updated_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now(), now(), 1, $11)
                ON CONFLICT (scope, category, key) DO UPDATE SET
                    last_seen    = GREATEST(catalog_entry.last_seen, EXCLUDED.last_seen),
                    seen_count   = catalog_entry.seen_count + 1,
                    platform     = COALESCE(EXCLUDED.platform,  catalog_entry.platform),
                    artist       = COALESCE(EXCLUDED.artist,    catalog_entry.artist),
                    title        = COALESCE(EXCLUDED.title,     catalog_entry.title),
                    album        = COALESCE(EXCLUDED.album,     catalog_entry.album),
                    app_name     = COALESCE(EXCLUDED.app_name,  catalog_entry.app_name),
                    cover_url    = COALESCE(EXCLUDED.cover_url,    catalog_entry.cover_url),
                    cover_source = COALESCE(EXCLUDED.cover_source, catalog_entry.cover_source),
                    hidden_at    = CASE
                        WHEN catalog_entry.hidden_at IS NOT NULL
                             AND catalog_entry.hidden_at < now() - INTERVAL '{_GRACE_SQL}'
                        THEN NULL ELSE catalog_entry.hidden_at END,
                    updated_by   = EXCLUDED.updated_by,
                    updated_at   = now()
                RETURNING {_COLUMNS}
                """,
                self._scope, self._category, key, platform, artist, title, album,
                app_name, cover_url, cover_source, self._instance_id,
            )
        except Exception as err:  # noqa: BLE001 — DB down: degrade to cache
            _LOGGER.warning("Catalog seen-write failed for %r (cached): %s", key, err)
            return self._optimistic_seen(
                key, platform, artist, title, album, app_name, cover_url, cover_source
            )
        entry = _row_to_entry(row)
        self._entries[key] = entry
        return entry

    def _optimistic_seen(
        self,
        key: str,
        platform: str | None,
        artist: str | None,
        title: str | None,
        album: str | None,
        app_name: str | None,
        cover_url: str | None,
        cover_source: str | None,
    ) -> MapperEntry:
        """In-memory fallback when the DB is unreachable; reconciles on resync."""
        now = dt_util.utcnow().isoformat()
        entry = self._entries.get(key)
        if entry is None:
            entry = MapperEntry(key=key, first_seen=now, last_seen=now, seen_count=0)
        entry.last_seen = now
        entry.seen_count += 1
        entry.platform = platform or entry.platform
        entry.artist = artist or entry.artist
        entry.title = title or entry.title
        entry.album = album or entry.album
        entry.app_name = app_name or entry.app_name
        if cover_url:
            entry.cover_url = cover_url
            entry.cover_source = cover_source
        self._entries[key] = entry
        return entry

    async def async_set_enum(self, key: str, enum: int) -> MapperEntry:
        row = await self._pool.fetchrow(
            f"""
            INSERT INTO catalog_entry
                (scope, category, key, enum, first_seen, last_seen, seen_count, updated_by)
            VALUES ($1, $2, $3, $4, now(), now(), 0, $5)
            ON CONFLICT (scope, category, key) DO UPDATE SET
                enum       = EXCLUDED.enum,
                hidden_at  = CASE WHEN EXCLUDED.enum <> {DEFAULT_ENUM}
                                  THEN NULL ELSE catalog_entry.hidden_at END,
                updated_by = EXCLUDED.updated_by,
                updated_at = now()
            RETURNING {_COLUMNS}
            """,
            self._scope, self._category, key, enum, self._instance_id,
        )
        entry = _row_to_entry(row)
        self._entries[key] = entry
        return entry

    async def async_set_cover(
        self, key: str, cover_url: str | None, cover_source: str | None
    ) -> MapperEntry | None:
        """Column-scoped cover write (MAW resolver / native refresh).

        Touches only the cover columns, so it never clobbers a concurrent
        enum/seen write from Title Classifier.
        """
        row = await self._pool.fetchrow(
            f"""
            UPDATE catalog_entry
               SET cover_url = $4, cover_source = $5, updated_by = $6, updated_at = now()
             WHERE scope = $1 AND category = $2 AND key = $3
            RETURNING {_COLUMNS}
            """,
            self._scope, self._category, key, cover_url, cover_source, self._instance_id,
        )
        if row is None:
            return None
        entry = _row_to_entry(row)
        self._entries[key] = entry
        return entry

    async def async_import_entries(
        self, entries: list[dict[str, Any]]
    ) -> list[MapperEntry]:
        imported: list[MapperEntry] = []
        async with self._pool.acquire() as conn:
            async with conn.transaction():
                for item in entries:
                    row = await conn.fetchrow(
                        f"""
                        INSERT INTO catalog_entry
                            (scope, category, key, enum, first_seen, last_seen,
                             seen_count, updated_by)
                        VALUES ($1, $2, $3, $4, now(), now(), 0, $5)
                        ON CONFLICT (scope, category, key) DO UPDATE SET
                            enum       = EXCLUDED.enum,
                            hidden_at  = CASE WHEN EXCLUDED.enum <> {DEFAULT_ENUM}
                                              THEN NULL ELSE catalog_entry.hidden_at END,
                            updated_by = EXCLUDED.updated_by,
                            updated_at = now()
                        RETURNING {_COLUMNS}
                        """,
                        self._scope, self._category, item["key"], item["enum"],
                        self._instance_id,
                    )
                    entry = _row_to_entry(row)
                    self._entries[entry.key] = entry
                    imported.append(entry)
        return imported

    async def async_import_catalog(self, entries: list[MapperEntry]) -> int:
        """Conflict-aware bulk import (Apply button / .storage migration).

        Idempotent and re-run safe. Per the agreed rule the non-default enum
        wins; when both rows carry a non-default enum the newest ``last_seen``
        wins. ``seen_count`` uses GREATEST (not sum) so re-running does not
        inflate counts. Never touches cover columns.
        """
        if not entries:
            return 0
        imported = 0
        async with self._pool.acquire() as conn:
            async with conn.transaction():
                for entry in entries:
                    row = await conn.fetchrow(
                        f"""
                        INSERT INTO catalog_entry
                            (scope, category, key, enum, first_seen, last_seen,
                             seen_count, hidden_at, updated_by)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                        ON CONFLICT (scope, category, key) DO UPDATE SET
                            enum = CASE
                                WHEN catalog_entry.enum = {DEFAULT_ENUM} THEN EXCLUDED.enum
                                WHEN EXCLUDED.enum = {DEFAULT_ENUM} THEN catalog_entry.enum
                                WHEN EXCLUDED.last_seen > catalog_entry.last_seen
                                    THEN EXCLUDED.enum
                                ELSE catalog_entry.enum END,
                            first_seen = LEAST(catalog_entry.first_seen, EXCLUDED.first_seen),
                            last_seen  = GREATEST(catalog_entry.last_seen, EXCLUDED.last_seen),
                            seen_count = GREATEST(catalog_entry.seen_count, EXCLUDED.seen_count),
                            hidden_at  = COALESCE(catalog_entry.hidden_at, EXCLUDED.hidden_at),
                            updated_by = EXCLUDED.updated_by,
                            updated_at = now()
                        RETURNING {_COLUMNS}
                        """,
                        self._scope, self._category, entry.key, entry.enum,
                        _parse_dt(entry.first_seen) or dt_util.utcnow(),
                        _parse_dt(entry.last_seen) or dt_util.utcnow(),
                        entry.seen_count, _parse_dt(entry.hidden_at), self._instance_id,
                    )
                    self._entries[entry.key] = _row_to_entry(row)
                    imported += 1
        return imported

    async def async_merge_keys(self, target_key: str, source_keys: list[str]) -> None:
        """Merge source rows into ``target_key`` (media duplicate dedupe).

        Done in one transaction so the merged totals are race-safe against the
        sibling instance: max(last_seen), min(first_seen), summed seen_count,
        and the non-default enum wins.
        """
        sources = [k for k in source_keys if k and k != target_key]
        if not sources:
            return
        async with self._pool.acquire() as conn:
            async with conn.transaction():
                src_rows = await conn.fetch(
                    f"SELECT {_COLUMNS} FROM catalog_entry "
                    "WHERE scope = $1 AND category = $2 AND key = ANY($3::text[]) "
                    "FOR UPDATE",
                    self._scope, self._category, sources,
                )
                if not src_rows:
                    return
                tgt = await conn.fetchrow(
                    f"SELECT {_COLUMNS} FROM catalog_entry "
                    "WHERE scope = $1 AND category = $2 AND key = $3 FOR UPDATE",
                    self._scope, self._category, target_key,
                )

                enum = int(tgt["enum"]) if tgt else DEFAULT_ENUM
                first_seen = tgt["first_seen"] if tgt else None
                last_seen = tgt["last_seen"] if tgt else None
                seen_count = int(tgt["seen_count"]) if tgt else 0
                for src in src_rows:
                    if enum == DEFAULT_ENUM and int(src["enum"]) != DEFAULT_ENUM:
                        enum = int(src["enum"])
                    first_seen = min(x for x in (first_seen, src["first_seen"]) if x)
                    last_seen = max(x for x in (last_seen, src["last_seen"]) if x)
                    seen_count += int(src["seen_count"])

                await conn.execute(
                    "DELETE FROM catalog_entry "
                    "WHERE scope = $1 AND category = $2 AND key = ANY($3::text[])",
                    self._scope, self._category, sources,
                )
                row = await conn.fetchrow(
                    f"""
                    INSERT INTO catalog_entry
                        (scope, category, key, enum, first_seen, last_seen,
                         seen_count, updated_by)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (scope, category, key) DO UPDATE SET
                        enum       = EXCLUDED.enum,
                        first_seen = LEAST(catalog_entry.first_seen, EXCLUDED.first_seen),
                        last_seen  = GREATEST(catalog_entry.last_seen, EXCLUDED.last_seen),
                        seen_count = EXCLUDED.seen_count,
                        updated_by = EXCLUDED.updated_by,
                        updated_at = now()
                    RETURNING {_COLUMNS}
                    """,
                    self._scope, self._category, target_key, enum,
                    first_seen or dt_util.utcnow(), last_seen or dt_util.utcnow(),
                    seen_count, self._instance_id,
                )
        for key in sources:
            self._entries.pop(key, None)
        self._entries[target_key] = _row_to_entry(row)

    async def async_hide_unmapped(self) -> int:
        rows = await self._pool.fetch(
            """
            UPDATE catalog_entry
               SET hidden_at = now(), updated_by = $3, updated_at = now()
             WHERE scope = $1 AND category = $2
               AND enum = 0 AND hidden_at IS NULL
            RETURNING key
            """,
            self._scope, self._category, self._instance_id,
        )
        for row in rows:
            if (entry := self._entries.get(row["key"])) is not None:
                entry.hidden_at = dt_util.utcnow().isoformat()
        return len(rows)

    async def async_delete(self, key: str) -> bool:
        row = await self._pool.fetchrow(
            "DELETE FROM catalog_entry "
            "WHERE scope = $1 AND category = $2 AND key = $3 RETURNING key",
            self._scope, self._category, key,
        )
        if row is None:
            return False
        self._entries.pop(key, None)
        return True

    async def async_clear_old(self, days: int) -> int:
        cutoff = dt_util.utcnow() - timedelta(days=days)
        rows = await self._pool.fetch(
            "DELETE FROM catalog_entry "
            "WHERE scope = $1 AND category = $2 AND last_seen < $3 RETURNING key",
            self._scope, self._category, cutoff,
        )
        for row in rows:
            self._entries.pop(row["key"], None)
        return len(rows)

    async def async_refresh_key(self, key: str) -> bool:
        """Reload a single row into the cache (LISTEN/NOTIFY handler, step 5).

        Returns True if the cached view changed.
        """
        row = await self._pool.fetchrow(
            f"SELECT {_COLUMNS} FROM catalog_entry "
            "WHERE scope = $1 AND category = $2 AND key = $3",
            self._scope, self._category, key,
        )
        if row is None:
            return self._entries.pop(key, None) is not None
        self._entries[key] = _row_to_entry(row)
        return True

    def sorted_entries(self) -> list[MapperEntry]:
        return sorted(
            self._entries.values(),
            key=lambda item: (item.enum != DEFAULT_ENUM, item.last_seen),
        )
