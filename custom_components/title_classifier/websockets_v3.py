"""v3 WebSocket commands (FLEET-197).

Namespace ``title_classifier/v3/<command>``. The catalog is shared, so the
catalog commands operate on the union of all v3 runtimes' caches; id-scoped
mutations run through whichever v3 store owns the entry (they share the pool).
Pure shaping lives in api_v3.py.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv

from . import api_v3
from ._lookup import all_v3_runtimes, v3_runtime_for_entry
from .catalog_v3 import CONTEXTS, MAX_ENUM, MIN_ENUM, ParentGuardError
from .const import MODULE_ID, websocket_type


def _wt(cmd: str) -> str:
    return websocket_type(MODULE_ID, f"v3/{cmd}")


def _gather(hass: HomeAssistant):
    """Union of catalog entries (by id) + currently-playing map across runtimes."""
    entries: dict[str, Any] = {}
    current: dict[str, tuple[int, str, str]] = {}
    for rt in all_v3_runtimes(hass):
        entries.update(rt.store.entries)
        if rt.current_entry_id is not None and rt.current_enum is not None:
            current[rt.current_entry_id] = (rt.current_enum, rt.context, rt.source_app)
    return entries, current


def _source_payload(rt) -> dict[str, Any]:
    entries = rt.store.entries
    total = len(entries)
    unmapped = sum(1 for e in entries.values() if e.enum == 0)
    return {
        "entry_id": rt.entry.entry_id,
        "name": rt.name,
        "media_type": rt.media_type,
        "context": rt.context,
        "signal_type": rt.signal_type,
        "source_app": rt.source_app,
        "source_entity": rt.source_entity,
        "online": rt.online,
        "current_key": rt.current_key,
        "current_enum": rt.current_enum,
        "current_entry_id": rt.current_entry_id,
        "entry_count": total,
        "unmapped_count": unmapped,
    }


async def _after_mutation(hass: HomeAssistant, entry_id: str) -> None:
    """Refresh the mutated entry in every v3 cache and re-notify sensors."""
    for rt in all_v3_runtimes(hass):
        await rt.store.async_refresh_entry(entry_id)
        await rt.async_recompute_current()
        rt.notify_listeners()


# ------------------------------------------------------------------ read


@websocket_api.websocket_command({vol.Required("type"): _wt("list_sources")})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_v3_list_sources(hass, connection, msg) -> None:
    connection.send_result(
        msg["id"], [_source_payload(rt) for rt in all_v3_runtimes(hass)]
    )


@websocket_api.websocket_command({
    vol.Required("type"): _wt("list_entries"),
    vol.Optional("media_type"): cv.string,
    vol.Optional("search"): cv.string,
    vol.Optional("unclassified"): bool,
    vol.Optional("include_hidden"): bool,
    vol.Optional("limit"): vol.All(vol.Coerce(int), vol.Range(min=1, max=20000)),
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_v3_list_entries(hass, connection, msg) -> None:
    entries, current = _gather(hass)
    connection.send_result(
        msg["id"],
        api_v3.select_and_view(
            entries, current,
            media_type=msg.get("media_type"),
            search=msg.get("search", ""),
            unclassified=msg.get("unclassified", False),
            include_hidden=msg.get("include_hidden", False),
            limit=msg.get("limit"),
        ),
    )


# ------------------------------------------------------------------ mutate


@websocket_api.websocket_command({
    vol.Required("type"): _wt("set_enum"),
    vol.Required("entry_id"): cv.string,
    vol.Required("enum"): vol.All(vol.Coerce(int), vol.Range(min=MIN_ENUM, max=MAX_ENUM)),
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_v3_set_enum(hass, connection, msg) -> None:
    rt = v3_runtime_for_entry(hass, msg["entry_id"])
    if rt is None:
        connection.send_error(msg["id"], "not_found", "no v3 watcher available")
        return
    entry = await rt.store.async_set_enum(msg["entry_id"], msg["enum"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "entry not found")
        return
    await _after_mutation(hass, msg["entry_id"])
    connection.send_result(msg["id"], {"ok": True, "enum": entry.enum})


@websocket_api.websocket_command({
    vol.Required("type"): _wt("group"),
    vol.Required("child_id"): cv.string,
    vol.Required("parent_id"): cv.string,
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_v3_group(hass, connection, msg) -> None:
    rt = v3_runtime_for_entry(hass, msg["child_id"])
    if rt is None:
        connection.send_error(msg["id"], "not_found", "no v3 watcher available")
        return
    try:
        await rt.store.async_set_parent(msg["child_id"], msg["parent_id"])
    except ParentGuardError as err:
        connection.send_error(msg["id"], "invalid_parent", str(err))
        return
    except ValueError as err:
        connection.send_error(msg["id"], "not_found", str(err))
        return
    await _after_mutation(hass, msg["child_id"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): _wt("ungroup"),
    vol.Required("child_id"): cv.string,
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_v3_ungroup(hass, connection, msg) -> None:
    rt = v3_runtime_for_entry(hass, msg["child_id"])
    if rt is None:
        connection.send_error(msg["id"], "not_found", "no v3 watcher available")
        return
    entry = await rt.store.async_clear_parent(msg["child_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "entry not found")
        return
    await _after_mutation(hass, msg["child_id"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): _wt("set_context_override"),
    vol.Required("entry_id"): cv.string,
    vol.Required("context"): vol.In(CONTEXTS),
    vol.Optional("source_app", default=""): cv.string,
    # null clears the override.
    vol.Required("enum_override"): vol.Any(
        None, vol.All(vol.Coerce(int), vol.Range(min=MIN_ENUM, max=MAX_ENUM))
    ),
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_v3_set_context_override(hass, connection, msg) -> None:
    rt = v3_runtime_for_entry(hass, msg["entry_id"])
    if rt is None:
        connection.send_error(msg["id"], "not_found", "no v3 watcher available")
        return
    await rt.store.async_set_context_override(
        msg["entry_id"], msg["context"], msg["enum_override"],
        source_app=msg.get("source_app", ""),
    )
    await _after_mutation(hass, msg["entry_id"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): _wt("set_hidden"),
    vol.Required("entry_id"): cv.string,
    vol.Required("hidden"): bool,
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_v3_set_hidden(hass, connection, msg) -> None:
    rt = v3_runtime_for_entry(hass, msg["entry_id"])
    if rt is None:
        connection.send_error(msg["id"], "not_found", "no v3 watcher available")
        return
    entry = await rt.store.async_set_hidden(msg["entry_id"], msg["hidden"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "entry not found")
        return
    await _after_mutation(hass, msg["entry_id"])
    connection.send_result(msg["id"], {"ok": True, "hidden": entry.is_hidden})


@websocket_api.websocket_command({
    vol.Required("type"): _wt("delete_entry"),
    vol.Required("entry_id"): cv.string,
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_v3_delete_entry(hass, connection, msg) -> None:
    rt = v3_runtime_for_entry(hass, msg["entry_id"])
    if rt is None:
        connection.send_error(msg["id"], "not_found", "no v3 watcher available")
        return
    deleted = await rt.store.async_delete(msg["entry_id"])
    for other in all_v3_runtimes(hass):
        other.store.entries.pop(msg["entry_id"], None)
        other.notify_listeners()
    connection.send_result(msg["id"], {"deleted": deleted})


WEBSOCKETS_V3 = [
    ws_v3_list_sources,
    ws_v3_list_entries,
    ws_v3_set_enum,
    ws_v3_group,
    ws_v3_ungroup,
    ws_v3_set_context_override,
    ws_v3_set_hidden,
    ws_v3_delete_entry,
]
