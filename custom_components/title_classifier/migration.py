"""One-time .storage → Postgres import (Apply button / migration service).

Reads a legacy HA ``.storage`` dataset and upserts it into the shared catalog.
Two source shapes are supported:

- a Title Classifier watcher's own file
  (``title_classifier_entries_<entry_id>``) via *source_entry_id*, and
- any raw storage key (e.g. the old ``etm`` integration's
  ``etm_<entry_id>`` files) via *source_storage_key*.

Two targets are supported: an existing watcher runtime, or — for importing into
a catalog without a live watcher (e.g. a VM that is being decommissioned) —
``(scope, category)`` directly, using the DB hub's pool.

The source file is only read, never modified, so a rollback stays possible.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import instance_id
from homeassistant.helpers.storage import Store

from .db import build_dsn, get_existing_pool, hub_entries, resolve_db_data
from .postgres_store import PostgresMapperStore
from .runtime import WatcherRuntime
from .storage import MapperEntry, MapperStore

_LOGGER = logging.getLogger(__name__)


async def _load_entries(
    hass: HomeAssistant,
    *,
    source_storage_key: str | None,
    source_entry_id: str | None,
) -> list[MapperEntry]:
    """Load MapperEntry objects from a legacy .storage dataset."""
    if source_storage_key:
        data = await Store(hass, 1, source_storage_key).async_load()
        return [
            MapperEntry.from_dict(item)
            for item in (data or {}).get("entries", [])
            if item.get("key")
        ]
    json_store = MapperStore(hass, source_entry_id)
    await json_store.async_load()
    return list(json_store.entries.values())


async def _hub_store(
    hass: HomeAssistant, scope: str, category: str
) -> PostgresMapperStore:
    """Build a transient store for ``(scope, category)`` on the hub's pool."""
    hubs = hub_entries(hass)
    if not hubs:
        raise ServiceValidationError("Kein DB-Hub konfiguriert.")
    db = resolve_db_data(hass, hubs[0])
    if not db:
        raise ServiceValidationError("DB-Hub hat keine Verbindungsdaten.")
    pool = get_existing_pool(hass, build_dsn(db))
    if pool is None:
        raise ServiceValidationError("DB-Hub ist noch nicht bereit.")
    inst = await instance_id.async_get(hass)
    return PostgresMapperStore(
        hass, pool, scope=scope, category=category, instance_id=inst
    )


async def async_import_local_storage(
    hass: HomeAssistant,
    runtime: WatcherRuntime,
    *,
    source_entry_id: str | None = None,
    source_storage_key: str | None = None,
    dry_run: bool = False,
) -> dict[str, Any]:
    """Import a legacy dataset into the target *runtime*'s catalog (Apply button)."""
    entries = await _load_entries(
        hass,
        source_storage_key=source_storage_key,
        source_entry_id=source_entry_id or runtime.entry.entry_id,
    )
    result = {
        "source": source_storage_key or source_entry_id or runtime.entry.entry_id,
        "target": runtime.entry.entry_id,
        "scope": runtime.scope,
        "category": runtime.category,
        "found": len(entries),
    }
    if dry_run:
        return {**result, "imported": 0, "dry_run": True}

    imported = await runtime.store.async_import_catalog(entries)
    runtime.refresh_current_enum()
    runtime.notify_listeners()
    _LOGGER.info("Imported %s/%s entries into %s", imported, len(entries), runtime.entry.entry_id)
    return {**result, "imported": imported, "dry_run": False}


async def async_import_to_catalog(
    hass: HomeAssistant,
    *,
    scope: str,
    category: str,
    source_storage_key: str | None = None,
    source_entry_id: str | None = None,
    dry_run: bool = False,
) -> dict[str, Any]:
    """Import a legacy dataset straight into ``(scope, category)`` (no watcher)."""
    entries = await _load_entries(
        hass, source_storage_key=source_storage_key, source_entry_id=source_entry_id
    )
    result = {
        "source": source_storage_key or source_entry_id,
        "scope": scope,
        "category": category,
        "found": len(entries),
    }
    if dry_run:
        return {**result, "imported": 0, "dry_run": True}

    store = await _hub_store(hass, scope, category)
    imported = await store.async_import_catalog(entries)
    _LOGGER.info(
        "Imported %s/%s entries into catalog (%s/%s)", imported, len(entries), scope, category
    )
    return {**result, "imported": imported, "dry_run": False}
