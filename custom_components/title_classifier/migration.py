"""One-time .storage → Postgres import (Apply button / migration service).

Reads the legacy per-watcher JSON file
``.storage/title_classifier_entries_<entry_id>`` via the unchanged JSON
:class:`MapperStore` and upserts it into the shared catalog under the target
watcher's ``(scope, category)``. Idempotent; the old JSON file is only read,
never modified — so a rollback stays possible.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant

from .runtime import WatcherRuntime
from .storage import MapperStore

_LOGGER = logging.getLogger(__name__)


async def async_import_local_storage(
    hass: HomeAssistant,
    runtime: WatcherRuntime,
    *,
    source_entry_id: str | None = None,
    dry_run: bool = False,
) -> dict[str, Any]:
    """Import a legacy .storage dataset into the target runtime's catalog.

    *source_entry_id* selects which old file to read; defaults to the target
    watcher's own entry_id (the common case once the same entry kept its id).
    """
    source = source_entry_id or runtime.entry.entry_id

    json_store = MapperStore(hass, source)
    await json_store.async_load()
    entries = list(json_store.entries.values())

    if dry_run:
        return {
            "source": source,
            "target": runtime.entry.entry_id,
            "scope": runtime.scope,
            "category": runtime.category,
            "found": len(entries),
            "imported": 0,
            "dry_run": True,
        }

    imported = await runtime.store.async_import_catalog(entries)
    runtime.refresh_current_enum()
    runtime.notify_listeners()
    _LOGGER.info(
        "Imported %s/%s entries from .storage[%s] into %s (%s/%s)",
        imported, len(entries), source, runtime.entry.entry_id,
        runtime.scope, runtime.category,
    )
    return {
        "source": source,
        "target": runtime.entry.entry_id,
        "scope": runtime.scope,
        "category": runtime.category,
        "found": len(entries),
        "imported": imported,
        "dry_run": False,
    }
