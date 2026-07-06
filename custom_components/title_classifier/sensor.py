"""Sensor platform for Title Classifier."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CONF_ENTRY_TYPE, DATA_ENTRIES, DOMAIN, ENTRY_TYPE_HUB
from .entities import async_get_entities
from .entities_v3 import get_v3_sensors


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    # The DB hub hosts v3 watchers as config subentries — one nested device and
    # its 3 sensors per subentry, attributed via config_subentry_id.
    if entry.data.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_HUB:
        bucket = hass.data.get(DOMAIN, {}).get(DATA_ENTRIES, {}).get(entry.entry_id, {})
        for sub_id, runtime in (bucket.get("subentry_runtimes") or {}).items():
            async_add_entities(get_v3_sensors(runtime), config_subentry_id=sub_id)
        return
    async_add_entities(await async_get_entities(hass, entry, Platform.SENSOR))
