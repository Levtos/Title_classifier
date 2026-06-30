"""Title Classifier standalone Home Assistant integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import ConfigEntryError, ConfigEntryNotReady
from homeassistant.helpers import instance_id
from homeassistant.helpers.typing import ConfigType

from .const import DATA_ENTRIES, DATA_SERVICES_REGISTERED, DATA_WEBSOCKETS_REGISTERED, DOMAIN
from .const import (
    CONF_CATEGORY,
    CONF_ENTRY_TYPE,
    CONF_HUB_ENTRY_ID,
    CONF_MEDIA_TYPE,
    CONF_PLATFORM,
    CONF_SCOPE,
    CONF_WATCHER_TYPE,
    DEFAULT_SCOPE,
    ENTRY_TYPE_HUB,
    ENTRY_TYPE_WATCHER,
    ENTRY_TYPE_WATCHER_V3,
    MODULE_ID,
    WATCHER_TYPE_TO_CATEGORY,
    service_name,
)
from .db import (
    CONF_DB_HOST,
    CONF_DB_NAME,
    CONF_DB_PASSWORD,
    CONF_DB_PORT,
    CONF_DB_USER,
    async_get_pool,
    async_release_pool,
    build_dsn,
    resolve_db_data,
)
from .notify import async_ensure_listener, async_release_listener
from .entities import async_get_entities  # re-export
from .flow import ConfigFlowHelper, OptionsFlowHelper  # re-export
from .panel import async_register_panel  # re-export
from .postgres_store import PostgresMapperStore
from .runtime import WatcherRuntime
from .store_v3 import CatalogStoreV3
from .runtime_v3 import WatcherRuntimeV3
from .services_impl import SERVICES  # re-export
from .websockets_impl import WEBSOCKETS  # re-export
from .websockets_v3 import WEBSOCKETS_V3  # re-export

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SENSOR, Platform.NUMBER, Platform.BUTTON]
# v3 watchers expose only sensors (effective enum / raw / catalog).
V3_PLATFORMS: list[Platform] = [Platform.SENSOR]

__all__ = [
    "SERVICES",
    "WEBSOCKETS",
    "ConfigFlowHelper",
    "OptionsFlowHelper",
    "async_setup",
    "async_setup_entry",
    "async_unload_entry",
    "async_get_entities",
    "async_register_panel",
]


async def async_setup(hass: HomeAssistant, _config: ConfigType) -> bool:
    hass.data.setdefault(
        DOMAIN,
        {
            DATA_ENTRIES: {},
            DATA_SERVICES_REGISTERED: False,
            DATA_WEBSOCKETS_REGISTERED: False,
        },
    )
    await _async_register_services(hass)
    await _async_register_websockets(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.data.setdefault(
        DOMAIN,
        {
            DATA_ENTRIES: {},
            DATA_SERVICES_REGISTERED: False,
            DATA_WEBSOCKETS_REGISTERED: False,
        },
    )
    entry_type = entry.data.get(CONF_ENTRY_TYPE)
    if entry_type == ENTRY_TYPE_HUB:
        return await _async_setup_hub(hass, entry)
    if entry_type == ENTRY_TYPE_WATCHER_V3:
        return await _async_setup_watcher_v3(hass, entry)
    return await _async_setup_watcher(hass, entry)


async def _async_setup_hub(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """The DB hub owns the shared pool + listener; it has no entities."""
    db = resolve_db_data(hass, entry)
    if not db or not db.get(CONF_DB_HOST):
        raise ConfigEntryError("DB-Hub ohne Verbindungsdaten — bitte neu konfigurieren.")

    dsn = build_dsn(db)
    inst = await instance_id.async_get(hass)
    try:
        await async_get_pool(hass, dsn)
        await async_ensure_listener(hass, dsn, inst)
    except Exception as err:  # asyncpg connection/OS errors → retry later
        await async_release_pool(hass, dsn)
        raise ConfigEntryNotReady(f"Medien-Katalog-DB nicht erreichbar: {err}") from err

    hass.data[DOMAIN][DATA_ENTRIES][entry.entry_id] = {
        "module_id": MODULE_ID,
        "entry_type": ENTRY_TYPE_HUB,
        "dsn": dsn,
        "status": "ready",
    }
    # Attach all watchers to this hub (strip any embedded legacy DB), so the
    # connection lives in one place from now on.
    _attach_watchers_to_hub(hass, entry)
    return True


async def _async_setup_watcher(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.data[DOMAIN][DATA_ENTRIES][entry.entry_id] = {
        "module_id": MODULE_ID,
        "status": "loading",
    }

    db = resolve_db_data(hass, entry)
    if db is None:
        hass.data[DOMAIN][DATA_ENTRIES].pop(entry.entry_id, None)
        raise ConfigEntryError(
            "Keine Datenbank-Verbindung. Lege zuerst den „Title Classifier DB\"-"
            "Hub an (LXC 108) oder konfiguriere den Watcher neu."
        )

    dsn = build_dsn(db)
    inst = await instance_id.async_get(hass)
    try:
        pool = await async_get_pool(hass, dsn)
        await async_ensure_listener(hass, dsn, inst)
    except Exception as err:  # asyncpg connection/OS errors → retry later
        hass.data[DOMAIN][DATA_ENTRIES].pop(entry.entry_id, None)
        await async_release_pool(hass, dsn)
        raise ConfigEntryNotReady(f"Medien-Katalog-DB nicht erreichbar: {err}") from err

    store = PostgresMapperStore(
        hass,
        pool,
        scope=entry.data.get(CONF_SCOPE, DEFAULT_SCOPE),
        category=entry.data[CONF_CATEGORY],
        instance_id=inst,
    )

    runtime = WatcherRuntime(hass, entry, store)
    try:
        await runtime.async_setup()
    except Exception:
        hass.data[DOMAIN][DATA_ENTRIES].pop(entry.entry_id, None)
        await async_release_listener(hass, dsn)
        await async_release_pool(hass, dsn)
        raise

    bucket = hass.data[DOMAIN][DATA_ENTRIES].setdefault(entry.entry_id, {})
    bucket["module_id"] = MODULE_ID
    bucket["entry_type"] = ENTRY_TYPE_WATCHER
    bucket["runtime"] = runtime
    bucket["dsn"] = dsn
    bucket["status"] = "ready"

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await async_register_panel(hass)
    entry.async_on_unload(entry.add_update_listener(_async_reload_on_options))
    return True


async def _async_setup_watcher_v3(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up a v3 watcher — an observer feeding the shared v3 catalog.

    No HA entities yet (sensors arrive in Phase 6); the runtime only writes
    sightings and computes the effective enum. Shares the hub's pool/listener.
    """
    hass.data[DOMAIN][DATA_ENTRIES][entry.entry_id] = {
        "module_id": MODULE_ID,
        "status": "loading",
    }
    db = resolve_db_data(hass, entry)
    if db is None:
        hass.data[DOMAIN][DATA_ENTRIES].pop(entry.entry_id, None)
        raise ConfigEntryError(
            "Keine Datenbank-Verbindung. Lege zuerst den „Title Classifier DB\"-"
            "Hub an (LXC 108) oder konfiguriere den Watcher neu."
        )

    dsn = build_dsn(db)
    inst = await instance_id.async_get(hass)
    try:
        pool = await async_get_pool(hass, dsn)
        await async_ensure_listener(hass, dsn, inst)
    except Exception as err:  # asyncpg connection/OS errors → retry later
        hass.data[DOMAIN][DATA_ENTRIES].pop(entry.entry_id, None)
        await async_release_pool(hass, dsn)
        raise ConfigEntryNotReady(f"Medien-Katalog-DB nicht erreichbar: {err}") from err

    store = CatalogStoreV3(
        pool, scope=entry.data.get(CONF_SCOPE, DEFAULT_SCOPE), instance_id=inst
    )
    runtime = WatcherRuntimeV3(hass, entry, store)
    try:
        await runtime.async_setup()
    except Exception:
        hass.data[DOMAIN][DATA_ENTRIES].pop(entry.entry_id, None)
        await async_release_listener(hass, dsn)
        await async_release_pool(hass, dsn)
        raise

    bucket = hass.data[DOMAIN][DATA_ENTRIES].setdefault(entry.entry_id, {})
    bucket.update(
        module_id=MODULE_ID,
        entry_type=ENTRY_TYPE_WATCHER_V3,
        runtime=runtime,
        dsn=dsn,
        status="ready",
    )
    await hass.config_entries.async_forward_entry_setups(entry, V3_PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_reload_on_options))
    return True


def _attach_watchers_to_hub(hass: HomeAssistant, hub: ConfigEntry) -> None:
    """Point every watcher at the hub and strip any embedded legacy DB fields.

    entry_id is preserved → no entity churn. Covers both v2.0.x watchers (DB in
    their own data) and not-yet-configured ones (no DB at all). Reloads each so
    it re-resolves its connection from the hub.
    """
    db_keys = (CONF_DB_HOST, CONF_DB_PORT, CONF_DB_NAME, CONF_DB_USER, CONF_DB_PASSWORD)
    for entry in hass.config_entries.async_entries(DOMAIN):
        d = entry.data
        if d.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_HUB:
            continue
        new = {k: v for k, v in d.items() if k not in db_keys}
        # Preserve a v3 watcher's type; only legacy/unset entries become v2.
        new[CONF_ENTRY_TYPE] = d.get(CONF_ENTRY_TYPE) or ENTRY_TYPE_WATCHER
        new[CONF_HUB_ENTRY_ID] = hub.entry_id
        if new != dict(d):
            hass.config_entries.async_update_entry(entry, data=new)
        hass.async_create_task(hass.config_entries.async_reload(entry.entry_id))
        _LOGGER.info("Attached watcher %s to hub %s", entry.entry_id, hub.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    entry_type = entry.data.get(CONF_ENTRY_TYPE)
    unload_ok = True
    if entry_type == ENTRY_TYPE_WATCHER_V3:
        unload_ok = await hass.config_entries.async_unload_platforms(entry, V3_PLATFORMS)
    elif entry_type != ENTRY_TYPE_HUB:
        unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    bucket = hass.data.get(DOMAIN, {}).get(DATA_ENTRIES, {}).pop(entry.entry_id, None)
    runtime = bucket.get("runtime") if bucket else None
    if runtime is not None:
        await runtime.async_unload()
    dsn = bucket.get("dsn") if bucket else None
    if dsn is not None:
        await async_release_listener(hass, dsn)
        await async_release_pool(hass, dsn)
    return unload_ok


async def async_migrate_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Migrate v1 (per-instance JSON) config entries to the v2 catalog shape.

    Derives category/scope/platform from the legacy watcher_type. The DB
    connection cannot be invented here — entries without it fail to load with
    a clear message (see async_setup_entry) and are re-added.
    """
    if entry.version >= 2:
        return True

    data = dict(entry.data)
    data.setdefault(
        CONF_CATEGORY,
        WATCHER_TYPE_TO_CATEGORY.get(data.get(CONF_WATCHER_TYPE, "media"), "music"),
    )
    data.setdefault(CONF_SCOPE, DEFAULT_SCOPE)
    data.setdefault(CONF_PLATFORM, None)
    hass.config_entries.async_update_entry(entry, data=data, version=2)
    _LOGGER.info("Migrated %s to v2 catalog shape (DB must be re-entered)", entry.entry_id)
    return True


async def _async_reload_on_options(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def _async_register_services(hass: HomeAssistant) -> None:
    if hass.data[DOMAIN].get(DATA_SERVICES_REGISTERED):
        return

    for action, sdef in SERVICES.items():
        full = service_name(MODULE_ID, action)
        if hass.services.has_service(DOMAIN, full):
            continue

        async def _handle(call: ServiceCall, _handler=sdef.handler) -> Any:
            return await _handler(hass, call)

        hass.services.async_register(
            DOMAIN,
            full,
            _handle,
            schema=sdef.schema,
            supports_response=sdef.supports_response,
        )
        _LOGGER.debug("registered service %s.%s", DOMAIN, full)

    hass.data[DOMAIN][DATA_SERVICES_REGISTERED] = True


async def _async_register_websockets(hass: HomeAssistant) -> None:
    if hass.data[DOMAIN].get(DATA_WEBSOCKETS_REGISTERED):
        return

    for ws in (*WEBSOCKETS, *WEBSOCKETS_V3):
        websocket_api.async_register_command(hass, ws)

    hass.data[DOMAIN][DATA_WEBSOCKETS_REGISTERED] = True
