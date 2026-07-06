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
    bucket = hass.data.get(DOMAIN, {}).get(DATA_ENTRIES, {}).get(entry.entry_id, {})
    subentry_runtimes = bucket.get("subentry_runtimes") or {}

    # The DB hub hosts canonical v3 watcher subentries. Legacy/top-level
    # watcher entries may also host them as a compatibility path for the HA UI.
    if entry.data.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_HUB:
        for sub_id, runtime in subentry_runtimes.items():
            async_add_entities(get_v3_sensors(runtime), config_subentry_id=sub_id)
        return

    entities = await async_get_entities(hass, entry, Platform.SENSOR)
    if entities:
        async_add_entities(entities)
    for sub_id, runtime in subentry_runtimes.items():
        async_add_entities(get_v3_sensors(runtime), config_subentry_id=sub_id)
