"""Runtime regression tests for Apple-TV delayed metadata handling."""

from __future__ import annotations

import asyncio
from types import SimpleNamespace

import tc_runtime_v3 as R


class _State:
    def __init__(self, entity_id: str, state: str, **attributes) -> None:
        self.entity_id = entity_id
        self.state = state
        self.attributes = attributes


class _States:
    def __init__(self, state: _State) -> None:
        self._state = state

    def get(self, entity_id: str):
        return self._state if self._state.entity_id == entity_id else None

    def set(self, state: _State) -> None:
        self._state = state


class _Store:
    def __init__(self) -> None:
        self.entries = {}
        self.calls = []

    async def async_seen(self, **kwargs):
        self.calls.append(kwargs)
        entry = SimpleNamespace(
            id=f"entry-{len(self.calls)}",
            key=kwargs["key"],
            parent_id=None,
            enum=0,
        )
        self.entries[entry.id] = entry
        return entry


def _runtime(state: _State):
    entry = SimpleNamespace(
        entry_id="watcher-1",
        data={
            "name": "TV",
            "source_entity": state.entity_id,
            "media_type": "video",
            "context": "apple_tv",
            "signal_type": "app",
            "source_app": "Plex",
            "inactive_values": [],
        },
    )
    hass = SimpleNamespace(states=_States(state))
    store = _Store()
    return R.WatcherRuntimeV3(hass, entry, store), hass, store


def test_delayed_video_metadata_never_persists_the_technical_fallback():
    fallback = _State(
        "media_player.apple_tv",
        "playing",
        app_id="com.plexapp.plex",
        source="Plex",
    )
    content = _State(
        "media_player.apple_tv",
        "playing",
        app_id="com.plexapp.plex",
        source="Plex",
        media_artist="Battlestar Galactica",
        media_album_name="Staffel 1",
        media_title="S 1 · F 12: Kobol",
    )
    runtime, hass, store = _runtime(fallback)
    old_delay = R.VIDEO_FALLBACK_GRACE_SECONDS
    R.VIDEO_FALLBACK_GRACE_SECONDS = 0.02
    try:
        asyncio.run(runtime.async_process_state(fallback))
        assert store.calls == []

        hass.states.set(content)
        asyncio.run(runtime.async_process_state(content))
        assert [call["key"] for call in store.calls] == [
            "Battlestar Galactica"
        ]
        assert store.calls[0]["signal_type"] == "title"
    finally:
        R.VIDEO_FALLBACK_GRACE_SECONDS = old_delay


def test_stable_missing_video_metadata_commits_last_fallback():
    fallback = _State(
        "media_player.apple_tv",
        "playing",
        app_name="Netflix",
    )
    runtime, _hass, store = _runtime(fallback)
    old_delay = R.VIDEO_FALLBACK_GRACE_SECONDS
    R.VIDEO_FALLBACK_GRACE_SECONDS = 0.01
    try:
        async def run() -> None:
            await runtime.async_process_state(fallback)
            await asyncio.sleep(0.03)

        asyncio.run(run())
        assert [call["key"] for call in store.calls] == ["Netflix"]
        assert store.calls[0]["signal_type"] == "app"
    finally:
        R.VIDEO_FALLBACK_GRACE_SECONDS = old_delay
