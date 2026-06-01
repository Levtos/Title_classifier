"""Title Classifier standalone Home Assistant integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.typing import ConfigType

from .const import DATA_ENTRIES, DATA_SERVICES_REGISTERED, DATA_WEBSOCKETS_REGISTERED, DOMAIN
from .const import MODULE_ID, service_name
from .entities import async_get_entities  # re-export
from .flow import ConfigFlowHelper, OptionsFlowHelper  # re-export
from .panel import async_register_panel  # re-export
from .runtime import WatcherRuntime
from .services_impl import SERVICES  # re-export
from .websockets_impl import WEBSOCKETS  # re-export

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SENSOR, Platform.NUMBER]

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
    hass.data[DOMAIN][DATA_ENTRIES][entry.entry_id] = {
        "module_id": MODULE_ID,
        "status": "loading",
    }

    runtime = WatcherRuntime(hass, entry)
    try:
        await runtime.async_setup()
    except Exception:
        hass.data[DOMAIN][DATA_ENTRIES].pop(entry.entry_id, None)
        raise

    bucket = hass.data[DOMAIN][DATA_ENTRIES].setdefault(entry.entry_id, {})
    bucket["module_id"] = MODULE_ID
    bucket["runtime"] = runtime
    bucket["status"] = "ready"

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await async_register_panel(hass)
    entry.async_on_unload(entry.add_update_listener(_async_reload_on_options))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    bucket = hass.data.get(DOMAIN, {}).get(DATA_ENTRIES, {}).pop(entry.entry_id, None)
    runtime = bucket.get("runtime") if bucket else None
    if runtime is not None:
        await runtime.async_unload()
    return unload_ok


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

        hass.services.async_register(DOMAIN, full, _handle, schema=sdef.schema)
        _LOGGER.debug("registered service %s.%s", DOMAIN, full)

    hass.data[DOMAIN][DATA_SERVICES_REGISTERED] = True


async def _async_register_websockets(hass: HomeAssistant) -> None:
    if hass.data[DOMAIN].get(DATA_WEBSOCKETS_REGISTERED):
        return

    for ws in WEBSOCKETS:
        websocket_api.async_register_command(hass, ws)

    hass.data[DOMAIN][DATA_WEBSOCKETS_REGISTERED] = True
