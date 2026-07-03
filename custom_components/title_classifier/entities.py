"""Title-Classifier-Entities (Sensor + Number).

Werden vom Umbrella-Platform-Dispatcher über `async_get_entities` angefragt.

- unique_id-Schema: `title_classifier_<entry_id>_<key>`
- entity_id bleibt fachlich lesbar (`sensor.title_classifier_<slug>_<key>`)
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.button import ButtonEntity
from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_NAME, Platform
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity import EntityCategory

from .const import DOMAIN, unique_id
from ._lookup import runtime_from_hass
from .const import (
    ATTR_KEY,
    ATTR_WATCHER_ID,
    ATTR_WATCHER_NAME,
    ENTRY_TYPE_WATCHER_V3,
    MAX_ENUM,
    MIN_ENUM,
    MODULE_ID,
)
from .const import CONF_ENTRY_TYPE
from .runtime import WatcherRuntime
from .entities_v3 import get_v3_sensors
from . import feeder_v3 as feeder


async def async_get_entities(
    hass: HomeAssistant, entry: ConfigEntry, platform: Platform
) -> list:
    runtime = runtime_from_hass(hass, entry.entry_id)
    if runtime is None:
        return []
    # v3 watchers expose only sensors (effective enum / raw / catalog).
    if entry.data.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_WATCHER_V3:
        return get_v3_sensors(runtime) if platform == Platform.SENSOR else []
    if platform == Platform.SENSOR:
        return [
            TitleClassifierEnumSensor(runtime),
            TitleClassifierRawSensor(runtime),
            TitleClassifierCatalogSensor(runtime),
        ]
    if platform == Platform.NUMBER:
        return [TitleClassifierCurrentTitleEnumNumber(runtime)]
    if platform == Platform.BUTTON:
        return [TitleClassifierImportButton(runtime)]
    return []


def _device_info(runtime: WatcherRuntime) -> dict[str, Any]:
    return {
        "identifiers": {(DOMAIN, f"{MODULE_ID}_{runtime.entry.entry_id}")},
        "name": runtime.entry.data[CONF_NAME],
        "manufacturer": "Levtos",
        "model": "Title Classifier",
    }


def _slug(runtime: WatcherRuntime) -> str:
    return runtime.entry.data[CONF_NAME].lower().replace(" ", "_")


class _BaseSensor(SensorEntity):
    _attr_should_poll = False
    _attr_has_entity_name = True

    def __init__(self, runtime: WatcherRuntime) -> None:
        self._runtime = runtime
        self._attr_device_info = _device_info(runtime)

    async def async_added_to_hass(self) -> None:
        self._runtime.add_listener(self._handle_runtime_update)

    async def async_will_remove_from_hass(self) -> None:
        self._runtime.remove_listener(self._handle_runtime_update)

    @callback
    def _handle_runtime_update(self) -> None:
        self.async_write_ha_state()


class TitleClassifierEnumSensor(_BaseSensor):
    _attr_name = "Enum"
    _attr_icon = "mdi:numeric"

    def __init__(self, runtime: WatcherRuntime) -> None:
        super().__init__(runtime)
        self._attr_unique_id = unique_id(MODULE_ID, runtime.entry.entry_id, "enum")
        self.entity_id = f"sensor.title_classifier_{_slug(runtime)}_enum"

    @property
    def native_value(self) -> int | None:
        return self._runtime.current_enum

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            ATTR_KEY: self._runtime.current_key,
            ATTR_WATCHER_ID: self._runtime.entry.entry_id,
            ATTR_WATCHER_NAME: self._runtime.name,
            "entry_count": self._runtime.catalog_summary()["entry_count"],
        }


class TitleClassifierRawSensor(_BaseSensor):
    _attr_name = "Raw"
    _attr_icon = "mdi:form-textbox"

    def __init__(self, runtime: WatcherRuntime) -> None:
        super().__init__(runtime)
        self._attr_unique_id = unique_id(MODULE_ID, runtime.entry.entry_id, "raw")
        self.entity_id = f"sensor.title_classifier_{_slug(runtime)}_raw"

    @property
    def native_value(self) -> str:
        # Idle → configurable sentinel (default "idle"), never None/unavailable.
        return feeder.resolve_display_key(
            self._runtime.current_key, self._runtime.idle_value
        )

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            ATTR_KEY: self._runtime.current_key,
            ATTR_WATCHER_ID: self._runtime.entry.entry_id,
            ATTR_WATCHER_NAME: self._runtime.name,
            "entry_count": self._runtime.catalog_summary()["entry_count"],
        }


class TitleClassifierCatalogSensor(_BaseSensor):
    _attr_name = "Catalog"
    _attr_icon = "mdi:database-search"
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, runtime: WatcherRuntime) -> None:
        super().__init__(runtime)
        self._attr_unique_id = unique_id(MODULE_ID, runtime.entry.entry_id, "catalog")
        self.entity_id = f"sensor.title_classifier_{_slug(runtime)}_catalog"

    @property
    def native_value(self) -> int:
        return self._runtime.catalog_summary()["entry_count"]

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        entries = self._runtime.store.entries
        total = len(entries)
        mapped = sum(1 for e in entries.values() if e.enum != 0)
        return {
            ATTR_KEY: self._runtime.current_key,
            ATTR_WATCHER_ID: self._runtime.entry.entry_id,
            ATTR_WATCHER_NAME: self._runtime.name,
            "entry_count": total,
            "mapped_count": mapped,
            "unmapped_count": total - mapped,
        }


class TitleClassifierImportButton(ButtonEntity):
    """One-shot Apply button: import this watcher's legacy .storage into Postgres."""

    _attr_has_entity_name = True
    _attr_name = "Import local data"
    _attr_icon = "mdi:database-import"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, runtime: WatcherRuntime) -> None:
        self._runtime = runtime
        self._attr_unique_id = unique_id(MODULE_ID, runtime.entry.entry_id, "import_local")
        self.entity_id = f"button.title_classifier_{_slug(runtime)}_import_local"
        self._attr_device_info = _device_info(runtime)

    async def async_press(self) -> None:
        from .migration import async_import_local_storage

        await async_import_local_storage(self.hass, self._runtime)


class TitleClassifierCurrentTitleEnumNumber(NumberEntity):
    _attr_has_entity_name = True
    _attr_icon = "mdi:numeric"
    _attr_mode = NumberMode.BOX
    _attr_name = "Current title enum"
    _attr_native_max_value = MAX_ENUM
    _attr_native_min_value = MIN_ENUM
    _attr_native_step = 1
    _attr_should_poll = False

    def __init__(self, runtime: WatcherRuntime) -> None:
        self._runtime = runtime
        self._attr_unique_id = unique_id(
            MODULE_ID, runtime.entry.entry_id, "current_title_enum"
        )
        self.entity_id = f"number.title_classifier_{_slug(runtime)}_current_title_enum"
        self._attr_device_info = _device_info(runtime)

    async def async_added_to_hass(self) -> None:
        self._runtime.add_listener(self._handle_runtime_update)

    async def async_will_remove_from_hass(self) -> None:
        self._runtime.remove_listener(self._handle_runtime_update)

    @callback
    def _handle_runtime_update(self) -> None:
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        # Entkoppelt vom current_key: der Offline-Fallback (DEFAULT_ENUM) ist ein
        # gültiger Wert → Entity bleibt verfügbar und zeigt 0 statt "Unbekannt".
        return self._runtime.current_enum is not None

    @property
    def native_value(self) -> int | None:
        return self._runtime.current_enum

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {ATTR_KEY: self._runtime.current_key}

    async def async_set_native_value(self, value: float) -> None:
        enum = int(value)
        if enum != value:
            raise HomeAssistantError("Title Classifier enum must be a whole number")
        if enum < MIN_ENUM or enum > MAX_ENUM:
            raise HomeAssistantError(
                f"Title Classifier enum must be between {MIN_ENUM} and {MAX_ENUM}"
            )
        await self._runtime.async_set_current_enum(enum)
