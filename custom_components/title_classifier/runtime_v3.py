"""WatcherRuntimeV3 — HA-bound shell around the pure v3 feeder + resolver.

A v3 watcher is an observer: it reads its explicitly-configured axes, writes
sightings into the shared v3 catalog (store_v3) and exposes the *effective* enum
(effective.py). It owns no catalog rows. All decision logic lives in the pure
modules; this class only wires HA state events and the store.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_NAME
from homeassistant.core import Event, HomeAssistant, State, callback
from homeassistant.helpers.event import async_track_state_change_event

from . import artwork_v3 as artwork
from . import feeder_v3 as feeder
from .catalog_v3 import DEFAULT_ENUM, NO_SOURCE_APP
from .const import (
    CONF_ARTIST_ATTRIBUTE,
    CONF_ARTWORK_ATTRIBUTE,
    CONF_ARTWORK_ENTITY_ID,
    CONF_CONTEXT,
    CONF_DEFAULT_ACTIVE_ENUM,
    CONF_IDLE_VALUE,
    CONF_INACTIVE_VALUES,
    CONF_MEDIA_TYPE,
    CONF_ONLINE_ENTITY,
    CONF_SCOPE,
    CONF_SIGNAL_TYPE,
    CONF_SOURCE_APP,
    CONF_SOURCE_ENTITY,
    DEFAULT_ARTWORK_ATTRIBUTE,
    DEFAULT_IDLE_VALUE,
    DEFAULT_SCOPE,
)
from .effective import find_context_override, resolve_effective_enum
from .store_v3 import CatalogStoreV3


# Apple-TV media players can publish app/source before Plex or Jellyfin has
# populated the actual media metadata. The fallback remains visible as a live
# context value, but is not written to the catalog until it has been stable for
# this grace period. A content event cancels the pending write.
VIDEO_FALLBACK_GRACE_SECONDS = 5.0


class WatcherRuntimeV3:
    """Runtime state for one v3 watcher config entry."""

    def __init__(
        self, hass: HomeAssistant, entry: ConfigEntry, store: CatalogStoreV3
    ) -> None:
        self.hass = hass
        self.entry = entry
        self.store = store
        self.current_key: str | None = None
        self.current_enum: int | None = None
        self.current_entry_id: str | None = None
        self.current_artwork: str | None = None
        self._online: bool = True
        self._remove_listener: Callable[[], None] | None = None
        self._listeners: list[Callable[[], None]] = []
        self._fallback_task: asyncio.Task | None = None
        self._fallback_generation = 0
        self._inactive = feeder.build_inactive_values(
            entry.data.get(CONF_INACTIVE_VALUES)
        )

    # ------------------------------------------------------------- config

    @property
    def name(self) -> str:
        return self.entry.data[CONF_NAME]

    @property
    def source_entity(self) -> str:
        return self.entry.data[CONF_SOURCE_ENTITY]

    @property
    def online_entity(self) -> str | None:
        return self.entry.data.get(CONF_ONLINE_ENTITY) or None

    @property
    def media_type(self) -> str:
        return self.entry.data[CONF_MEDIA_TYPE]

    @property
    def context(self) -> str:
        return self.entry.data[CONF_CONTEXT]

    @property
    def signal_type(self) -> str:
        return self.entry.data[CONF_SIGNAL_TYPE]

    @property
    def source_app(self) -> str:
        return self.entry.data.get(CONF_SOURCE_APP) or NO_SOURCE_APP

    @property
    def scope(self) -> str:
        return self.entry.data.get(CONF_SCOPE, DEFAULT_SCOPE)

    @property
    def active_default_enum(self) -> int:
        try:
            return max(0, int(self.entry.data.get(CONF_DEFAULT_ACTIVE_ENUM) or 0))
        except (TypeError, ValueError):
            return 0

    @property
    def artist_attribute(self) -> str | None:
        return self.entry.data.get(CONF_ARTIST_ATTRIBUTE) or None

    @property
    def idle_value(self) -> str:
        return self.entry.data.get(CONF_IDLE_VALUE) or DEFAULT_IDLE_VALUE

    @property
    def artwork_entity_id(self) -> str | None:
        return self.entry.data.get(CONF_ARTWORK_ENTITY_ID) or None

    @property
    def artwork_attribute(self) -> str:
        return self.entry.data.get(CONF_ARTWORK_ATTRIBUTE) or DEFAULT_ARTWORK_ATTRIBUTE

    @property
    def online(self) -> bool:
        return self._online

    # ------------------------------------------------------------- lifecycle

    def add_listener(self, update_callback: Callable[[], None]) -> None:
        self._listeners.append(update_callback)

    def remove_listener(self, update_callback: Callable[[], None]) -> None:
        if update_callback in self._listeners:
            self._listeners.remove(update_callback)

    @callback
    def notify_listeners(self) -> None:
        for cb in list(self._listeners):
            cb()

    async def async_setup(self) -> None:
        await self.store.async_load(media_types=(self.media_type,))
        watched = [self.source_entity]
        if self.online_entity:
            watched.append(self.online_entity)
        self._remove_listener = async_track_state_change_event(
            self.hass, watched, self._async_source_changed
        )
        state = self.hass.states.get(self.source_entity)
        await self.async_process_state(state)

    async def async_unload(self) -> None:
        self._cancel_pending_fallback()
        if self._remove_listener is not None:
            self._remove_listener()
            self._remove_listener = None
        self.store.close() if hasattr(self.store, "close") else None
        self._listeners.clear()

    # ------------------------------------------------------------- processing

    def _compute_online(self) -> bool:
        eid = self.online_entity
        if not eid:
            return True
        state = self.hass.states.get(eid)
        return feeder.is_online(
            None if state is None else state.state, configured=True
        )

    async def _async_source_changed(self, event: Event) -> None:
        eid = event.data.get("entity_id")
        if self.online_entity and eid == self.online_entity:
            await self.async_process_state(self.hass.states.get(self.source_entity))
            return
        await self.async_process_state(event.data.get("new_state"))

    async def async_process_state(self, state: State | None) -> None:
        self._online = self._compute_online()
        resolution = feeder.KeyResolution(None, self.signal_type)
        if self._online and state is not None:
            # Media-player attributes can lag one state transition. Never
            # treat stale metadata on an inactive player as an active title.
            if _is_sensor(state) or feeder.clean_value(
                state.state, self._inactive
            ) is not None:
                resolution = feeder.derive_resolution(
                    media_type=self.media_type,
                    signal_type=self.signal_type,
                    state=state.state,
                    attributes=dict(state.attributes),
                    is_sensor=_is_sensor(state),
                    inactive_values=self._inactive,
                    artist_attribute=self.artist_attribute,
                    context=self.context,
                )

        if resolution.key is None:
            # Offline / nothing playing → effective 0, no catalog write.
            self._cancel_pending_fallback()
            self._set_inactive()
            return

        attrs = dict(state.attributes)
        if resolution.defer_persistence:
            self._show_pending_fallback(resolution.key, attrs)
            self._schedule_fallback_commit(resolution)
            return

        self._cancel_pending_fallback()
        await self._async_store_resolution(resolution, attrs)

    async def _async_store_resolution(
        self, resolution: feeder.KeyResolution, attrs: dict
    ) -> None:
        """Persist a resolved key and update the live sensor projection."""

        if resolution.key is None:
            return
        entry = await self.store.async_seen(
            media_type=self.media_type,
            signal_type=resolution.signal_type,
            key=resolution.key,
            context=self.context,
            source_app=self.source_app,
            artist=feeder.resolve_catalog_artist(
                media_type=self.media_type,
                context=self.context,
                attributes=attrs,
                inactive_values=self._inactive,
                configured_attribute=self.artist_attribute,
            ),
            title=feeder.clean_value(attrs.get("media_title"), self._inactive)
            or feeder.clean_value(attrs.get("title"), self._inactive),
            album=feeder.clean_value(attrs.get("media_album_name"), self._inactive),
            app_name=feeder.clean_value(attrs.get("app_name"), self._inactive),
            watcher_id=self.entry.entry_id,
        )
        self.current_key = entry.key
        self.current_entry_id = entry.id
        self.current_enum = await self._effective_for(entry)
        self.current_artwork = self._resolve_artwork(attrs)
        self.notify_listeners()

    def _show_pending_fallback(self, key: str, attrs: dict) -> None:
        """Expose a fallback without pretending it already has a catalog row."""

        artwork_url = self._resolve_artwork(attrs)
        changed = (
            self.current_key != key
            or self.current_entry_id is not None
            or self.current_enum != DEFAULT_ENUM
            or self.current_artwork != artwork_url
        )
        self.current_key = key
        self.current_entry_id = None
        self.current_enum = DEFAULT_ENUM
        self.current_artwork = artwork_url
        if changed:
            self.notify_listeners()

    def _schedule_fallback_commit(
        self, resolution: feeder.KeyResolution
    ) -> None:
        self._cancel_pending_fallback()
        self._fallback_generation += 1
        generation = self._fallback_generation
        self._fallback_task = asyncio.create_task(
            self._async_commit_fallback(generation, resolution.key or "")
        )

    async def _async_commit_fallback(
        self, generation: int, fallback_key: str
    ) -> None:
        try:
            await asyncio.sleep(VIDEO_FALLBACK_GRACE_SECONDS)
            if generation != self._fallback_generation:
                return

            # Re-read the source. This protects against a metadata update that
            # did not reach the listener before the grace timer elapsed.
            state = self.hass.states.get(self.source_entity)
            if state is None or not self._compute_online():
                return
            if not _is_sensor(state) and feeder.clean_value(
                state.state, self._inactive
            ) is None:
                return
            current = feeder.derive_resolution(
                media_type=self.media_type,
                signal_type=self.signal_type,
                state=state.state,
                attributes=dict(state.attributes),
                is_sensor=_is_sensor(state),
                inactive_values=self._inactive,
                artist_attribute=self.artist_attribute,
                context=self.context,
            )
            if current.key is None or generation != self._fallback_generation:
                return
            if not current.defer_persistence:
                # Metadata arrived without a corresponding state event; store
                # the content identity directly and discard the fallback path.
                await self._async_store_resolution(current, dict(state.attributes))
                return
            if current.key != fallback_key:
                return
            await self._async_store_resolution(current, dict(state.attributes))
        finally:
            if self._fallback_task is asyncio.current_task():
                self._fallback_task = None

    def _cancel_pending_fallback(self) -> None:
        self._fallback_generation += 1
        if self._fallback_task is not None:
            self._fallback_task.cancel()
            self._fallback_task = None

    def _resolve_artwork(self, source_attrs: dict) -> str | None:
        """Live artwork URL for the current source (never stored in the DB)."""
        art_attrs = None
        if self.artwork_entity_id:
            state = self.hass.states.get(self.artwork_entity_id)
            art_attrs = dict(state.attributes) if state is not None else None
        return artwork.resolve_artwork_url(
            source_attrs,
            artwork_attribute=self.artwork_attribute,
            artwork_attrs=art_attrs,
        )

    async def async_recompute_current(self) -> None:
        """Re-resolve the effective enum for the current entry after a catalog
        mutation (enum/parent/override change via WS). No-op when idle."""
        if self.current_entry_id is None:
            return
        entry = self.store.entries.get(self.current_entry_id)
        if entry is None:
            return
        new_enum = await self._effective_for(entry)
        if new_enum != self.current_enum:
            self.current_enum = new_enum
            self.notify_listeners()

    def _set_inactive(self) -> None:
        changed = (
            self.current_key is not None
            or self.current_enum != DEFAULT_ENUM
            or self.current_artwork is not None
        )
        self.current_key = None
        self.current_entry_id = None
        self.current_enum = DEFAULT_ENUM
        self.current_artwork = None
        if changed:
            self.notify_listeners()

    async def _effective_for(self, entry) -> int:
        parent_enum = None
        if entry.parent_id is not None:
            master = self.store.entries.get(entry.parent_id)
            parent_enum = master.enum if master is not None else None

        context_override = None
        if self.media_type == "game":
            rows = await self.store.async_contexts_for(entry.id)
            context_override = find_context_override(
                rows, self.context, self.source_app
            )

        return resolve_effective_enum(
            media_type=self.media_type,
            context=self.context,
            active=True,
            base_enum=entry.enum,
            is_variant=entry.parent_id is not None,
            parent_enum=parent_enum,
            context_override=context_override,
            active_default_enum=self.active_default_enum,
        )


def _is_sensor(state: State) -> bool:
    return str(getattr(state, "entity_id", "")).split(".", 1)[0] == "sensor"
