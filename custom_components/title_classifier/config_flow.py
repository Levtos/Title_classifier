"""Config flow for Title Classifier."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigSubentryFlow,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult

from .const import DOMAIN, SUBENTRY_TYPE_WATCHER
from .flow import ConfigFlowHelper, OptionsFlowHelper, WatcherSubentryFlowHandler


class TitleClassifierConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 2

    def __init__(self) -> None:
        self._helper: ConfigFlowHelper | None = None

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        if self._helper is None:
            self._helper = ConfigFlowHelper(self.hass, self)
        return await self._helper.async_step_module_step(user_input)

    async def async_step_module_step(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        return await self.async_step_user(user_input)

    async def async_step_db(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        if self._helper is None:
            return self.async_abort(reason="invalid_flow_state")
        return await self._helper.async_step_db(user_input)

    async def async_step_artist(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        if self._helper is None:
            return self.async_abort(reason="invalid_flow_state")
        return await self._helper.async_step_artist(user_input)

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        if self._helper is None:
            self._helper = ConfigFlowHelper(self.hass, self)
        entry = self.hass.config_entries.async_get_entry(self.context["entry_id"])
        if entry is None:
            return self.async_abort(reason="invalid_flow_state")
        return await self._helper.async_step_reconfigure(entry, user_input)

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return TitleClassifierOptionsFlow()

    @classmethod
    @callback
    def async_get_supported_subentry_types(
        cls, config_entry: ConfigEntry
    ) -> dict[str, type[ConfigSubentryFlow]]:
        # The DB hub is the canonical parent for watcher subentries. We still
        # expose the same handler on legacy/top-level watcher entries as an
        # HA-UI compatibility guard: if the user opens "Add watcher" from a
        # watcher entry such as Stash, the flow must not fail with
        # UnknownHandler/Invalid handler specified.
        return {SUBENTRY_TYPE_WATCHER: WatcherSubentryFlowHandler}


class TitleClassifierOptionsFlow(OptionsFlow):
    def __init__(self) -> None:
        self._helper: OptionsFlowHelper | None = None

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        if self._helper is None:
            self._helper = OptionsFlowHelper(self.hass, self.config_entry, self)
        return await self._helper.async_step_init(user_input)
