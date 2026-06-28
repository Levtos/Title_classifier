"""Service handlers for Title Classifier."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv

from .services import ServiceDef
from ._lookup import all_runtimes, require_runtime
from .const import (
    ATTR_ENTRIES,
    ATTR_ENTRY_ID,
    ATTR_KEY,
    CATEGORIES,
    MAX_ENUM,
    MIN_ENUM,
    SERVICE_CLEAR_OLD,
    SERVICE_DEDUPE_CATALOG,
    SERVICE_DELETE_ENTRY,
    SERVICE_IMPORT_ENTRIES,
    SERVICE_IMPORT_LOCAL_STORAGE,
    SERVICE_SET_ENUM,
)
from .migration import async_import_local_storage, async_import_to_catalog
from .runtime import normalise_user_key

IMPORT_ENTRY_SCHEMA = vol.Schema({
    vol.Required(ATTR_KEY): cv.string,
    vol.Required("enum"): vol.All(vol.Coerce(int), vol.Range(min=MIN_ENUM, max=MAX_ENUM)),
})


async def _set_enum(hass: HomeAssistant, call: ServiceCall) -> None:
    runtime = require_runtime(hass, call.data[ATTR_ENTRY_ID])
    key = normalise_user_key(call.data[ATTR_KEY])
    await runtime.store.async_set_enum(key, call.data["enum"])
    runtime.refresh_current_enum()
    runtime.notify_listeners()


async def _delete_entry(hass: HomeAssistant, call: ServiceCall) -> None:
    runtime = require_runtime(hass, call.data[ATTR_ENTRY_ID])
    if await runtime.store.async_delete(call.data[ATTR_KEY]):
        runtime.refresh_current_enum()
        runtime.notify_listeners()


async def _clear_old(hass: HomeAssistant, call: ServiceCall) -> None:
    entry_id = call.data.get(ATTR_ENTRY_ID)
    runtimes = [require_runtime(hass, entry_id)] if entry_id else all_runtimes(hass)
    for runtime in runtimes:
        if await runtime.store.async_clear_old(call.data["days"]):
            runtime.refresh_current_enum()
            runtime.notify_listeners()


async def _import_entries(hass: HomeAssistant, call: ServiceCall) -> None:
    runtime = require_runtime(hass, call.data[ATTR_ENTRY_ID])
    entries = [
        {ATTR_KEY: normalise_user_key(item[ATTR_KEY]), "enum": item["enum"]}
        for item in call.data[ATTR_ENTRIES]
    ]
    await runtime.store.async_import_entries(entries)
    runtime.refresh_current_enum()
    runtime.notify_listeners()


async def _import_local_storage(hass: HomeAssistant, call: ServiceCall) -> dict:
    entry_id = call.data.get(ATTR_ENTRY_ID)
    source_entry_id = call.data.get("source_entry_id")
    source_storage_key = call.data.get("source_storage_key")
    dry_run = call.data.get("dry_run", False)

    if entry_id:
        runtime = require_runtime(hass, entry_id)
        return await async_import_local_storage(
            hass,
            runtime,
            source_entry_id=source_entry_id,
            source_storage_key=source_storage_key,
            dry_run=dry_run,
        )

    scope = call.data.get("scope")
    category = call.data.get("category")
    if not scope or not category:
        raise ServiceValidationError(
            "Entweder entry_id, oder scope + category angeben."
        )
    return await async_import_to_catalog(
        hass,
        scope=scope,
        category=category,
        source_entry_id=source_entry_id,
        source_storage_key=source_storage_key,
        dry_run=dry_run,
    )


async def _dedupe_catalog(hass: HomeAssistant, call: ServiceCall) -> dict:
    entry_id = call.data.get(ATTR_ENTRY_ID)
    dry_run = call.data.get("dry_run", False)
    runtimes = [require_runtime(hass, entry_id)] if entry_id else all_runtimes(hass)
    reports = {}
    for runtime in runtimes:
        reports[runtime.entry.entry_id] = await runtime.async_dedupe_catalog(
            dry_run=dry_run
        )
    return {"watchers": reports}


SERVICES: dict[str, ServiceDef] = {
    SERVICE_SET_ENUM: ServiceDef(
        handler=_set_enum,
        schema=vol.Schema({
            vol.Required(ATTR_ENTRY_ID): cv.string,
            vol.Required(ATTR_KEY): cv.string,
            vol.Required("enum"): vol.All(vol.Coerce(int), vol.Range(min=MIN_ENUM, max=MAX_ENUM)),
        }),
    ),
    SERVICE_DELETE_ENTRY: ServiceDef(
        handler=_delete_entry,
        schema=vol.Schema({
            vol.Required(ATTR_ENTRY_ID): cv.string,
            vol.Required(ATTR_KEY): cv.string,
        }),
    ),
    SERVICE_CLEAR_OLD: ServiceDef(
        handler=_clear_old,
        schema=vol.Schema({
            vol.Optional(ATTR_ENTRY_ID): cv.string,
            vol.Optional("days", default=30): vol.All(vol.Coerce(int), vol.Range(min=1)),
        }),
    ),
    SERVICE_IMPORT_ENTRIES: ServiceDef(
        handler=_import_entries,
        schema=vol.Schema({
            vol.Required(ATTR_ENTRY_ID): cv.string,
            vol.Required(ATTR_ENTRIES): vol.All(cv.ensure_list, [IMPORT_ENTRY_SCHEMA]),
        }),
    ),
    SERVICE_IMPORT_LOCAL_STORAGE: ServiceDef(
        handler=_import_local_storage,
        schema=vol.Schema({
            vol.Optional(ATTR_ENTRY_ID): cv.string,
            vol.Optional("scope"): cv.string,
            vol.Optional("category"): vol.In(CATEGORIES),
            vol.Optional("source_entry_id"): cv.string,
            vol.Optional("source_storage_key"): cv.string,
            vol.Optional("dry_run", default=False): cv.boolean,
        }),
        supports_response=SupportsResponse.OPTIONAL,
    ),
    SERVICE_DEDUPE_CATALOG: ServiceDef(
        handler=_dedupe_catalog,
        schema=vol.Schema({
            vol.Optional(ATTR_ENTRY_ID): cv.string,
            vol.Optional("dry_run", default=False): cv.boolean,
        }),
        supports_response=SupportsResponse.OPTIONAL,
    ),
}
