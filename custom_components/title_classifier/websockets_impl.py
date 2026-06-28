"""WebSocket-Befehle des Title-Classifier-Moduls.

Alle Befehle laufen unter `title_classifier/<command>`.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv

from .const import websocket_type
from ._lookup import all_runtimes, require_runtime
from .const import (
    ATTR_DELETED,
    ATTR_ENTRIES,
    ATTR_ENTRY_ID,
    ATTR_KEY,
    MAX_ENUM,
    MIN_ENUM,
    MODULE_ID,
)
from .runtime import normalise_user_key


def _wt(cmd: str) -> str:
    return websocket_type(MODULE_ID, cmd)


IMPORT_ENTRY_SCHEMA = vol.Schema({
    vol.Required(ATTR_KEY): cv.string,
    vol.Required("enum"): vol.All(vol.Coerce(int), vol.Range(min=MIN_ENUM, max=MAX_ENUM)),
})


@websocket_api.websocket_command({vol.Required("type"): _wt("list")})
@websocket_api.async_response
async def ws_list(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    connection.send_result(msg["id"], [rt.as_panel_dict() for rt in all_runtimes(hass)])


@websocket_api.websocket_command({
    vol.Required("type"): _wt("set_enum"),
    vol.Required(ATTR_ENTRY_ID): cv.string,
    vol.Required(ATTR_KEY): cv.string,
    vol.Required("enum"): vol.All(vol.Coerce(int), vol.Range(min=MIN_ENUM, max=MAX_ENUM)),
})
@websocket_api.async_response
async def ws_set_enum(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    runtime = require_runtime(hass, msg[ATTR_ENTRY_ID])
    key = normalise_user_key(msg[ATTR_KEY])
    await runtime.store.async_set_enum(key, msg["enum"])
    runtime.refresh_current_enum()
    runtime.notify_listeners()
    connection.send_result(msg["id"], runtime.as_panel_dict())


@websocket_api.websocket_command({
    vol.Required("type"): _wt("delete_entry"),
    vol.Required(ATTR_ENTRY_ID): cv.string,
    vol.Required(ATTR_KEY): cv.string,
})
@websocket_api.async_response
async def ws_delete_entry(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    runtime = require_runtime(hass, msg[ATTR_ENTRY_ID])
    deleted = await runtime.store.async_delete(msg[ATTR_KEY])
    if deleted:
        runtime.refresh_current_enum()
        runtime.notify_listeners()
    connection.send_result(msg["id"], {ATTR_DELETED: deleted})


@websocket_api.websocket_command({
    vol.Required("type"): _wt("import_entries"),
    vol.Required(ATTR_ENTRY_ID): cv.string,
    vol.Required(ATTR_ENTRIES): vol.All(cv.ensure_list, [IMPORT_ENTRY_SCHEMA]),
})
@websocket_api.async_response
async def ws_import_entries(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    runtime = require_runtime(hass, msg[ATTR_ENTRY_ID])
    entries = [
        {ATTR_KEY: normalise_user_key(item[ATTR_KEY]), "enum": item["enum"]}
        for item in msg[ATTR_ENTRIES]
    ]
    await runtime.store.async_import_entries(entries)
    runtime.refresh_current_enum()
    runtime.notify_listeners()
    connection.send_result(msg["id"], runtime.as_panel_dict())


@websocket_api.websocket_command({vol.Required("type"): _wt("get_sources")})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_get_sources(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    sources = []
    for runtime in all_runtimes(hass):
        runtime.refresh_current_enum()
        entries = runtime.store.entries
        total = len(entries)
        unmapped = sum(1 for entry in entries.values() if entry.enum == 0)
        cutoff = runtime.auto_hide_cutoff()
        hidden = sum(1 for entry in entries.values() if entry.is_hidden(cutoff))
        sources.append({
            "entry_id": runtime.entry.entry_id,
            "name": runtime.name,
            "watcher_type": runtime.entry.data["watcher_type"],
            "category": runtime.category,
            "source_entity": runtime.source_entity,
            "online": runtime.online,
            # Effektiver (zur Laufzeit gefloorter) Enum + aktueller Titel — die UX
            # zeigt sonst nur den Rohkatalog-Wert (bei Stash 0 trotz Floor auf 1).
            "current_key": runtime.current_key,
            "current_enum": runtime.current_enum,
            "entry_count": total,
            "unmapped_count": unmapped,
            "hidden_count": hidden,
            "auto_hide_hours": runtime.auto_hide_hours,
        })
    connection.send_result(msg["id"], sources)


@websocket_api.websocket_command({
    vol.Required("type"): _wt("list_entries"),
    vol.Optional("source"): cv.string,
    vol.Optional("unclassified"): bool,
    vol.Optional("search"): cv.string,
    vol.Optional("include_hidden"): bool,
    vol.Optional("limit"): vol.All(vol.Coerce(int), vol.Range(min=1, max=20000)),
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_list_entries(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    source_filter: str | None = msg.get("source")
    unclassified_only: bool = msg.get("unclassified", False)
    search: str = (msg.get("search") or "").lower().strip()
    include_hidden: bool = msg.get("include_hidden", False)
    limit: int | None = msg.get("limit")

    # The catalog is shared per (scope, category): several watchers (PC + ps5
    # both 'game') load the SAME rows. Dedupe by identity so each row appears
    # once instead of once-per-watcher with a fake "source" attribution.
    result = []
    seen_identity: set[tuple[str, str, str]] = set()
    for runtime in all_runtimes(hass):
        entry_id = runtime.entry.entry_id
        if source_filter and entry_id != source_filter:
            continue
        cutoff = None if include_hidden else runtime.auto_hide_cutoff()
        for entry in runtime.store.entries.values():
            identity = (runtime.scope, runtime.category, entry.key)
            if identity in seen_identity:
                continue
            if unclassified_only and entry.enum != 0:
                continue
            if search and search not in entry.key.lower():
                continue
            hidden = entry.is_hidden(cutoff)
            if not include_hidden and hidden:
                continue
            seen_identity.add(identity)
            result.append({
                "entry_id": entry_id,
                "source_name": runtime.name,
                "watcher_type": runtime.entry.data["watcher_type"],
                "category": runtime.category,
                "platform": entry.platform,
                "scope": runtime.scope,
                "key": entry.key,
                "enum": entry.enum,
                "first_seen": entry.first_seen,
                "last_seen": entry.last_seen,
                "seen_count": entry.seen_count,
                "is_current": entry.key == runtime.current_key,
                "hidden": hidden,
                "hidden_at": entry.hidden_at,
            })
            if limit and len(result) >= limit:
                break
        if limit and len(result) >= limit:
            break
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command({
    vol.Required("type"): _wt("rename_entry"),
    vol.Required(ATTR_ENTRY_ID): cv.string,
    vol.Required(ATTR_KEY): cv.string,
    vol.Required("new_key"): cv.string,
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_rename_entry(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    runtime = require_runtime(hass, msg[ATTR_ENTRY_ID])
    changed = await runtime.async_rename(msg[ATTR_KEY], msg["new_key"])
    connection.send_result(msg["id"], {"renamed": changed})


@websocket_api.websocket_command({
    vol.Required("type"): _wt("set_platform"),
    vol.Required(ATTR_ENTRY_ID): cv.string,
    vol.Required(ATTR_KEY): cv.string,
    vol.Optional("platform"): vol.Any(cv.string, None),
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_set_platform(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    runtime = require_runtime(hass, msg[ATTR_ENTRY_ID])
    changed = await runtime.async_set_platform(msg[ATTR_KEY], msg.get("platform"))
    connection.send_result(msg["id"], {"updated": changed})


@websocket_api.websocket_command({
    vol.Required("type"): _wt("unhide_entry"),
    vol.Required(ATTR_ENTRY_ID): cv.string,
    vol.Required(ATTR_KEY): cv.string,
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_unhide_entry(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    runtime = require_runtime(hass, msg[ATTR_ENTRY_ID])
    changed = await runtime.async_unhide(msg[ATTR_KEY])
    connection.send_result(msg["id"], {"unhidden": changed})


@websocket_api.websocket_command({
    vol.Required("type"): _wt("merge_entries"),
    vol.Required(ATTR_ENTRY_ID): cv.string,
    vol.Required("target_key"): cv.string,
    vol.Required("source_keys"): vol.All(cv.ensure_list, [cv.string]),
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_merge_entries(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    runtime = require_runtime(hass, msg[ATTR_ENTRY_ID])
    merged = await runtime.async_merge(
        normalise_user_key(msg["target_key"]), msg["source_keys"]
    )
    connection.send_result(msg["id"], {"merged": merged})


@websocket_api.websocket_command({
    vol.Required("type"): _wt("dedupe_catalog"),
    vol.Required(ATTR_ENTRY_ID): cv.string,
    vol.Optional("dry_run"): bool,
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_dedupe_catalog(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    runtime = require_runtime(hass, msg[ATTR_ENTRY_ID])
    report = await runtime.async_dedupe_catalog(dry_run=msg.get("dry_run", False))
    connection.send_result(msg["id"], report)


@websocket_api.websocket_command({
    vol.Required("type"): _wt("update_entry"),
    vol.Required(ATTR_ENTRY_ID): cv.string,
    vol.Required(ATTR_KEY): cv.string,
    vol.Required("enum_value"): vol.All(vol.Coerce(int), vol.Range(min=MIN_ENUM, max=MAX_ENUM)),
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_update_entry(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    runtime = require_runtime(hass, msg[ATTR_ENTRY_ID])
    key = normalise_user_key(msg[ATTR_KEY])
    await runtime.store.async_set_enum(key, msg["enum_value"])
    runtime.refresh_current_enum()
    runtime.notify_listeners()
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command({
    vol.Required("type"): _wt("hide_unmapped"),
    vol.Required(ATTR_ENTRY_ID): cv.string,
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_hide_unmapped(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    runtime = require_runtime(hass, msg[ATTR_ENTRY_ID])
    count = await runtime.store.async_hide_unmapped()
    if count:
        runtime.refresh_current_enum()
        runtime.notify_listeners()
    connection.send_result(msg["id"], {"hidden": count})


WEBSOCKETS = [
    ws_list,
    ws_set_enum,
    ws_delete_entry,
    ws_import_entries,
    ws_get_sources,
    ws_list_entries,
    ws_update_entry,
    ws_hide_unmapped,
    ws_rename_entry,
    ws_set_platform,
    ws_unhide_entry,
    ws_merge_entries,
    ws_dedupe_catalog,
]
