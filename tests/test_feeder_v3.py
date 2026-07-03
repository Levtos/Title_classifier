"""Tests for the pure v3 feeder logic (FLEET-195).

Covers inactive-value handling, online gating and key derivation per
signal_type / media_type — matching the watcher examples Benni specified.
"""

from __future__ import annotations

import tc_feeder_v3 as F


# ----------------------------------------------------------- inactive values


def test_build_inactive_values_merges_defaults_and_extra():
    iv = F.build_inactive_values(["No Game", "  PAUSED  "])
    assert "no game" in iv
    assert "paused" in iv
    assert "unavailable" in iv  # default kept
    # None / blanks are ignored.
    assert F.build_inactive_values(None) == F.DEFAULT_INACTIVE_VALUES


def test_clean_value_filters_inactive():
    iv = F.build_inactive_values(["No Game"])
    assert F.clean_value("Astro Bot", iv) == "Astro Bot"
    assert F.clean_value("  ", iv) is None
    assert F.clean_value("No Game", iv) is None
    assert F.clean_value("unavailable", iv) is None
    assert F.clean_value(None, iv) is None


# ------------------------------------------------------------------- online


def test_is_online_without_entity_is_always_true():
    assert F.is_online(None, configured=False) is True
    assert F.is_online("anything", configured=False) is True


def test_is_online_with_entity_gates_on_state():
    assert F.is_online("on", configured=True) is True
    assert F.is_online("playing", configured=True) is True
    assert F.is_online("off", configured=True) is False
    assert F.is_online("unavailable", configured=True) is False
    assert F.is_online(None, configured=True) is False  # missing ⇒ offline


# -------------------------------------------------------------- derive_key


_IV = F.build_inactive_values(None)


def test_homepod_music_builds_artist_title():
    key = F.derive_key(
        media_type="music", signal_type="title",
        state="playing",
        attributes={"media_title": "One More Time", "media_artist": "Daft Punk"},
        is_sensor=False, inactive_values=_IV,
    )
    assert key == "Daft Punk - One More Time"


def test_music_without_artist_uses_title_only():
    key = F.derive_key(
        media_type="music", signal_type="title",
        state="playing", attributes={"media_title": "Some Track"},
        is_sensor=False, inactive_values=_IV,
    )
    assert key == "Some Track"


def test_ps5_game_title_from_attribute():
    key = F.derive_key(
        media_type="game", signal_type="title",
        state="on", attributes={"media_title": "Astro Bot"},
        is_sensor=False, inactive_values=_IV,
    )
    assert key == "Astro Bot"


def test_game_title_from_sensor_state_fallback():
    key = F.derive_key(
        media_type="game", signal_type="title",
        state="Stardew Valley", attributes={}, is_sensor=True,
        inactive_values=_IV,
    )
    assert key == "Stardew Valley"


def test_media_player_title_without_attr_does_not_fall_back_to_state():
    # Non-sensor (media_player) state like "playing" must not become the key.
    key = F.derive_key(
        media_type="game", signal_type="title",
        state="playing", attributes={}, is_sensor=False,
        inactive_values=_IV,
    )
    assert key is None


def test_apple_tv_app_signal_netflix():
    key = F.derive_key(
        media_type="video", signal_type="app",
        state="playing", attributes={"app_name": "Netflix"},
        is_sensor=False, inactive_values=_IV,
    )
    assert key == "Netflix"


def test_app_signal_from_sensor_state():
    key = F.derive_key(
        media_type="video", signal_type="app",
        state="Plex", attributes={}, is_sensor=True, inactive_values=_IV,
    )
    assert key == "Plex"


def test_inactive_state_yields_no_key():
    key = F.derive_key(
        media_type="game", signal_type="title",
        state="No Game", attributes={}, is_sensor=True,
        inactive_values=F.build_inactive_values(["No Game"]),
    )
    assert key is None


def test_inactive_value_matches_case_insensitively_and_trimmed():
    # Configured "No Game" must catch these before any catalog write.
    iv = F.build_inactive_values(["No Game"])
    for state in ("No Game", "no game", "  No Game  ", "NO GAME"):
        assert (
            F.derive_key(
                media_type="game", signal_type="title",
                state=state, attributes={}, is_sensor=True, inactive_values=iv,
            )
            is None
        )


def test_stash_video_title_from_sensor():
    key = F.derive_key(
        media_type="video", signal_type="title",
        state="Some Scene", attributes={}, is_sensor=True, inactive_values=_IV,
    )
    assert key == "Some Scene"


# --------------------------------------------------- raw-sensor idle display


def test_resolve_display_key_returns_live_key_when_playing():
    assert F.resolve_display_key("Astro Bot", "idle") == "Astro Bot"


def test_resolve_display_key_falls_back_to_idle_when_none():
    # None (nothing playing) → the configured idle sentinel, never None.
    assert F.resolve_display_key(None, "idle") == "idle"
    assert F.resolve_display_key(None, "No Game") == "No Game"


def test_resolve_display_key_treats_empty_key_as_idle():
    assert F.resolve_display_key("", "idle") == "idle"
