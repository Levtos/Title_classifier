"""v3 watcher entities (FLEET-198).

Sensors for a v3 watcher. The enum sensor exposes the *effective* enum from the
resolver and keeps the v2 slug contract — ``sensor.title_classifier_<slug>_enum``
— so downstream consumers (light_policy / media_context) read the same entity_id
after a watcher is recreated as v3. Offline ⇒ 0 (never unavailable).
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.const import CONF_NAME
from homeassistant.core import callback
from homeassistant.helpers.entity import EntityCategory

from .const import DOMAIN, MODULE_ID, unique_id
from .runtime_v3 import WatcherRuntimeV3


def get_v3_sensors(runtime: WatcherRuntimeV3) -> list:
    return [
        TC3EnumSensor(runtime),
        TC3RawSensor(runtime),
        TC3CatalogSensor(runtime),
    ]


def _device_info(runtime: WatcherRuntimeV3) -> dict[str, Any]:
    return {
        "identifiers": {(DOMAIN, f"{MODULE_ID}_{runtime.entry.entry_id}")},
        "name": runtime.entry.data[CONF_NAME],
        "manufacturer": "Levtos",
        "model": "Title Classifier v3",
    }


def _slug(runtime: WatcherRuntimeV3) -> str:
    return runtime.entry.data[CONF_NAME].lower().replace(" ", "_")


class _TC3Base(SensorEntity):
    _attr_should_poll = False
    _attr_has_entity_name = True

    def __init__(self, runtime: WatcherRuntimeV3) -> None:
        self._runtime = runtime
        self._attr_device_info = _device_info(runtime)

    async def async_added_to_hass(self) -> None:
        self._runtime.add_listener(self._handle_runtime_update)

    async def async_will_remove_from_hass(self) -> None:
        self._runtime.remove_listener(self._handle_runtime_update)

    @callback
    def _handle_runtime_update(self) -> None:
        self.async_write_ha_state()

    def _common_attrs(self) -> dict[str, Any]:
        rt = self._runtime
        return {
            "key": rt.current_key,
            "watcher_id": rt.entry.entry_id,
            "watcher_name": rt.name,
            "media_type": rt.media_type,
            "context": rt.context,
            "signal_type": rt.signal_type,
            "source_app": rt.source_app or None,
        }


class TC3EnumSensor(_TC3Base):
    _attr_name = "Enum"
    _attr_icon = "mdi:numeric"

    def __init__(self, runtime: WatcherRuntimeV3) -> None:
        super().__init__(runtime)
        self._attr_unique_id = unique_id(MODULE_ID, runtime.entry.entry_id, "enum")
        self.entity_id = f"sensor.title_classifier_{_slug(runtime)}_enum"

    @property
    def native_value(self) -> int | None:
        # Effective enum; offline fallback is a valid 0, not unavailable.
        return self._runtime.current_enum

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            **self._common_attrs(),
            "current_entry_id": self._runtime.current_entry_id,
            "entry_count": len(self._runtime.store.entries),
        }


class TC3RawSensor(_TC3Base):
    _attr_name = "Raw"
    _attr_icon = "mdi:form-textbox"

    def __init__(self, runtime: WatcherRuntimeV3) -> None:
        super().__init__(runtime)
        self._attr_unique_id = unique_id(MODULE_ID, runtime.entry.entry_id, "raw")
        self.entity_id = f"sensor.title_classifier_{_slug(runtime)}_raw"

    @property
    def native_value(self) -> str | None:
        return self._runtime.current_key

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return self._common_attrs()


class TC3CatalogSensor(_TC3Base):
    _attr_name = "Catalog"
    _attr_icon = "mdi:database-search"
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, runtime: WatcherRuntimeV3) -> None:
        super().__init__(runtime)
        self._attr_unique_id = unique_id(MODULE_ID, runtime.entry.entry_id, "catalog")
        self.entity_id = f"sensor.title_classifier_{_slug(runtime)}_catalog"

    @property
    def native_value(self) -> int:
        return len(self._runtime.store.entries)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        entries = self._runtime.store.entries
        total = len(entries)
        mapped = sum(1 for e in entries.values() if e.enum != 0)
        return {
            **self._common_attrs(),
            "entry_count": total,
            "mapped_count": mapped,
            "unmapped_count": total - mapped,
        }
