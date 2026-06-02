"""Config- und Options-Flow-Helfer.

Mehrstufiger Add-Flow:
  module_step → db (nur beim ersten Watcher) → (für `music`) artist → Entry
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry, OptionsFlow
from homeassistant.const import CONF_NAME
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import selector

from .const import CONF_MODULE_ID
from .const import (
    CATEGORY_TO_WATCHER_TYPE,
    CONF_ARTIST_ATTRIBUTE,
    CONF_AUTO_HIDE_HOURS,
    CONF_CATEGORY,
    CONF_ENTRY_TYPE,
    CONF_HUB_ENTRY_ID,
    CONF_PLATFORM,
    CONF_RETENTION_DAYS,
    CONF_SCOPE,
    CONF_SOURCE_ENTITY,
    CONF_WATCHER_TYPE,
    DEFAULT_ARTIST_ATTRIBUTE,
    DEFAULT_CATEGORY,
    DEFAULT_SCOPE,
    DOMAIN,
    ENTRY_TYPE_HUB,
    ENTRY_TYPE_WATCHER,
    HUB_TITLE,
    MODULE_ID,
)
from .db import (
    CONF_DB_HOST,
    CONF_DB_NAME,
    CONF_DB_PASSWORD,
    CONF_DB_PORT,
    CONF_DB_USER,
    DEFAULT_DB_NAME,
    DEFAULT_DB_PORT,
    hub_entries,
)

CATEGORY_OPTIONS = [
    {"value": "music", "label": "Musik / Medien"},
    {"value": "game", "label": "Spiel / Game"},
    {"value": "tv", "label": "TV"},
    {"value": "stash", "label": "Stash"},
]

_DB_KEYS = (CONF_DB_HOST, CONF_DB_PORT, CONF_DB_NAME, CONF_DB_USER, CONF_DB_PASSWORD)


def existing_db_config(hass: HomeAssistant) -> dict[str, Any] | None:
    """Return the DB connection from any already-configured watcher, if any.

    Lets the second and later watchers inherit the connection instead of
    re-typing it — the DB is the same for every watcher on this instance.
    """
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.data.get(CONF_DB_HOST):
            return {key: entry.data.get(key) for key in _DB_KEYS}
    return None


# ---------------------------------------------------------------------------
# ConfigFlowHelper
# ---------------------------------------------------------------------------


class ConfigFlowHelper:
    def __init__(self, hass: HomeAssistant, flow) -> None:
        self.hass = hass
        self.flow = flow
        self._user_input: dict[str, Any] = {}
        self._hub_id: str | None = None

    async def async_step_init(self) -> FlowResult:
        return await self.async_step_module_step()

    async def async_step_module_step(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        hubs = hub_entries(self.hass)
        if not hubs:
            # No DB hub yet (first run / upgrade) → create it before any watcher.
            return await self.async_step_db()
        self._hub_id = hubs[0].entry_id
        if user_input is None:
            return self._show_watcher_form()
        # Unique id per watcher name so duplicate names are rejected.
        await self.flow.async_set_unique_id(
            f"{MODULE_ID}_" + user_input[CONF_NAME].lower().replace(" ", "_")
        )
        self.flow._abort_if_unique_id_configured()
        self._user_input.update(user_input)
        if user_input[CONF_CATEGORY] == "music":
            return await self.async_step_artist()
        return self._create_watcher_entry()

    async def async_step_db(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        """Create the single DB-hub entry that holds the shared connection."""
        if user_input is not None:
            await self.flow.async_set_unique_id(f"{MODULE_ID}_hub")
            self.flow._abort_if_unique_id_configured()
            return self.flow.async_create_entry(
                title=HUB_TITLE, data=self._db_data(user_input, ENTRY_TYPE_HUB)
            )
        # On upgrade, prefill from a legacy watcher's embedded DB if present.
        return self.flow.async_show_form(
            step_id="db", data_schema=self._db_schema(existing_db_config(self.hass) or {})
        )

    async def async_step_artist(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        if user_input is not None:
            self._user_input.update(user_input)
            return self._create_watcher_entry()

        state = self.hass.states.get(self._user_input[CONF_SOURCE_ENTITY])
        attrs = sorted(state.attributes) if state else []
        artist_candidates = [
            attr for attr in attrs if "artist" in attr.lower() or "author" in attr.lower()
        ]
        options = artist_candidates or attrs or [DEFAULT_ARTIST_ATTRIBUTE]
        default = (
            DEFAULT_ARTIST_ATTRIBUTE
            if DEFAULT_ARTIST_ATTRIBUTE in options
            else options[0]
        )
        return self.flow.async_show_form(
            step_id="artist",
            data_schema=vol.Schema({
                vol.Required(CONF_ARTIST_ATTRIBUTE, default=default): selector.SelectSelector(
                    selector.SelectSelectorConfig(
                        options=options, mode="dropdown", custom_value=True
                    )
                )
            }),
        )

    async def async_step_reconfigure(
        self, entry: ConfigEntry, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Reconfigure: DB fields for the hub, identity fields for a watcher."""
        if entry.data.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_HUB:
            return await self._reconfigure_hub(entry, user_input)
        return await self._reconfigure_watcher(entry, user_input)

    async def _reconfigure_hub(
        self, entry: ConfigEntry, user_input: dict[str, Any] | None
    ) -> FlowResult:
        if user_input is not None:
            new_data = {**entry.data, **self._db_data(user_input, ENTRY_TYPE_HUB)}
            self.hass.config_entries.async_update_entry(entry, data=new_data)
            # Reload the hub and every watcher referencing it — the DSN may
            # have changed, so their pool/store must be rebuilt.
            for target in (entry, *self._watchers_of(entry.entry_id)):
                self.hass.async_create_task(
                    self.hass.config_entries.async_reload(target.entry_id)
                )
            return self.flow.async_abort(reason="reconfigure_successful")
        return self.flow.async_show_form(
            step_id="reconfigure", data_schema=self._db_schema(entry.data)
        )

    async def _reconfigure_watcher(
        self, entry: ConfigEntry, user_input: dict[str, Any] | None
    ) -> FlowResult:
        if user_input is not None:
            category = user_input[CONF_CATEGORY]
            new_data = {
                **entry.data,
                CONF_CATEGORY: category,
                CONF_PLATFORM: user_input.get(CONF_PLATFORM) or None,
                CONF_SCOPE: user_input.get(CONF_SCOPE) or DEFAULT_SCOPE,
                CONF_WATCHER_TYPE: CATEGORY_TO_WATCHER_TYPE.get(category, "media"),
            }
            return self.flow.async_update_reload_and_abort(entry, data=new_data)

        d = entry.data
        return self.flow.async_show_form(
            step_id="reconfigure",
            data_schema=vol.Schema({
                vol.Required(
                    CONF_CATEGORY, default=d.get(CONF_CATEGORY, DEFAULT_CATEGORY)
                ): selector.SelectSelector(
                    selector.SelectSelectorConfig(options=CATEGORY_OPTIONS)
                ),
                vol.Optional(
                    CONF_PLATFORM, default=d.get(CONF_PLATFORM) or ""
                ): selector.TextSelector(),
                vol.Required(
                    CONF_SCOPE, default=d.get(CONF_SCOPE, DEFAULT_SCOPE)
                ): selector.TextSelector(),
            }),
        )

    # --------------------------------------------------------------- helpers

    def _watchers_of(self, hub_id: str) -> list[ConfigEntry]:
        return [
            entry
            for entry in self.hass.config_entries.async_entries(DOMAIN)
            if entry.data.get(CONF_HUB_ENTRY_ID) == hub_id
        ]

    def _show_watcher_form(self) -> FlowResult:
        return self.flow.async_show_form(
            step_id="module_step",
            data_schema=vol.Schema({
                vol.Required(CONF_NAME): selector.TextSelector(),
                vol.Required(CONF_SOURCE_ENTITY): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain=["media_player", "sensor"])
                ),
                vol.Required(CONF_CATEGORY, default=DEFAULT_CATEGORY): selector.SelectSelector(
                    selector.SelectSelectorConfig(options=CATEGORY_OPTIONS)
                ),
                vol.Optional(CONF_PLATFORM): selector.TextSelector(),
                vol.Required(CONF_SCOPE, default=DEFAULT_SCOPE): selector.TextSelector(),
                vol.Optional(CONF_RETENTION_DAYS): selector.NumberSelector(
                    selector.NumberSelectorConfig(min=1, step=1, mode="box")
                ),
            }),
        )

    def _db_schema(self, defaults: dict[str, Any]) -> vol.Schema:
        def g(key: str, fallback: Any = "") -> Any:
            return defaults.get(key) or fallback

        return vol.Schema({
            vol.Required(CONF_DB_HOST, default=g(CONF_DB_HOST)): selector.TextSelector(),
            vol.Required(
                CONF_DB_PORT, default=int(g(CONF_DB_PORT, DEFAULT_DB_PORT))
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(min=1, max=65535, step=1, mode="box")
            ),
            vol.Required(
                CONF_DB_NAME, default=g(CONF_DB_NAME, DEFAULT_DB_NAME)
            ): selector.TextSelector(),
            vol.Required(CONF_DB_USER, default=g(CONF_DB_USER)): selector.TextSelector(),
            vol.Required(
                CONF_DB_PASSWORD, default=g(CONF_DB_PASSWORD)
            ): selector.TextSelector(selector.TextSelectorConfig(type="password")),
        })

    def _db_data(self, user_input: dict[str, Any], entry_type: str) -> dict[str, Any]:
        return {
            CONF_ENTRY_TYPE: entry_type,
            CONF_DB_HOST: user_input[CONF_DB_HOST],
            CONF_DB_PORT: int(user_input.get(CONF_DB_PORT, DEFAULT_DB_PORT)),
            CONF_DB_NAME: user_input.get(CONF_DB_NAME, DEFAULT_DB_NAME),
            CONF_DB_USER: user_input[CONF_DB_USER],
            CONF_DB_PASSWORD: user_input.get(CONF_DB_PASSWORD, ""),
        }

    def _create_watcher_entry(self) -> FlowResult:
        category = self._user_input[CONF_CATEGORY]
        data = {
            CONF_MODULE_ID: MODULE_ID,
            CONF_ENTRY_TYPE: ENTRY_TYPE_WATCHER,
            CONF_HUB_ENTRY_ID: self._hub_id,
            CONF_NAME: self._user_input[CONF_NAME],
            CONF_SOURCE_ENTITY: self._user_input[CONF_SOURCE_ENTITY],
            CONF_ARTIST_ATTRIBUTE: self._user_input.get(CONF_ARTIST_ATTRIBUTE),
            CONF_CATEGORY: category,
            CONF_PLATFORM: self._user_input.get(CONF_PLATFORM) or None,
            CONF_SCOPE: self._user_input.get(CONF_SCOPE) or DEFAULT_SCOPE,
            # Derived: runtime.py title extraction still keys off watcher_type.
            CONF_WATCHER_TYPE: CATEGORY_TO_WATCHER_TYPE.get(category, "media"),
        }
        options = {CONF_RETENTION_DAYS: self._user_input.get(CONF_RETENTION_DAYS)}
        return self.flow.async_create_entry(
            title=self._user_input[CONF_NAME], data=data, options=options
        )


# ---------------------------------------------------------------------------
# OptionsFlowHelper
# ---------------------------------------------------------------------------


class OptionsFlowHelper:
    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, flow: OptionsFlow) -> None:
        self.hass = hass
        self.entry = entry
        self.flow = flow

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        if user_input is not None:
            return self.flow.async_create_entry(title="", data=user_input)

        days_selector = selector.NumberSelector(
            selector.NumberSelectorConfig(min=1, step=1, mode="box")
        )
        hide_selector = selector.NumberSelector(
            selector.NumberSelectorConfig(min=0, step=1, mode="box")
        )

        current_days = self.entry.options.get(CONF_RETENTION_DAYS)
        days_field = (
            vol.Optional(CONF_RETENTION_DAYS, default=int(current_days))
            if current_days is not None
            else vol.Optional(CONF_RETENTION_DAYS)
        )
        current_hide = self.entry.options.get(CONF_AUTO_HIDE_HOURS)
        hide_field = (
            vol.Optional(CONF_AUTO_HIDE_HOURS, default=int(current_hide))
            if current_hide is not None
            else vol.Optional(CONF_AUTO_HIDE_HOURS)
        )
        return self.flow.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                days_field: days_selector,
                hide_field: hide_selector,
            }),
        )
