"""v3 feeder logic — pure, HA-free source→key/active derivation (FLEET-195).

A v3 watcher is a pure observer. It reads explicitly-configured axes
(media_type / context / signal_type / source_app) and turns a source state into
either a catalog key (active) or nothing (inactive). No heuristics derive the
axes from entity names — those come from the config flow (FLEET-196).

The HA-bound shell (runtime_v3.py) wires state listeners and the store around
these helpers; everything decision-relevant lives here so it is unit-testable.
"""

from __future__ import annotations

from collections.abc import Iterable

# Raw source values that mean "nothing is playing" by default. A watcher may add
# its own (e.g. "No Game") via the configurable inactive_values.
DEFAULT_INACTIVE_VALUES: frozenset[str] = frozenset(
    {"unknown", "unavailable", "none", "null", "", "off", "idle", "standby"}
)

# online_entity states treated as "device offline".
OFFLINE_ONLINE_STATES: frozenset[str] = frozenset(
    {
        "off", "false", "no", "closed", "0", "standby", "not_home", "away",
        "unavailable", "unknown", "none", "",
    }
)

_TITLE_ATTRS: tuple[str, ...] = ("media_title", "title")
_APP_ATTRS: tuple[str, ...] = ("app_name", "app_id")
_ARTIST_ATTRS: tuple[str, ...] = (
    "media_artist", "artist", "media_album_artist", "album_artist",
)


def build_inactive_values(extra: Iterable[str] | None) -> frozenset[str]:
    """Merge the configured per-watcher inactive values with the defaults."""
    merged = set(DEFAULT_INACTIVE_VALUES)
    for value in extra or ():
        cleaned = str(value).strip().lower()
        if cleaned:
            merged.add(cleaned)
    return frozenset(merged)


def clean_value(value: object, inactive_values: frozenset[str]) -> str | None:
    """Strip and return a value, or None if it is empty / counts as inactive."""
    if value is None:
        return None
    text = str(value).strip()
    if text.lower() in inactive_values:
        return None
    return text


def is_online(online_state: str | None, *, configured: bool) -> bool:
    """True when no online_entity is configured, or it reports an "on" state.

    A configured but missing/None state is treated as offline (safer than
    assuming online when the availability source has vanished).
    """
    if not configured:
        return True
    if online_state is None:
        return False
    return str(online_state).strip().lower() not in OFFLINE_ONLINE_STATES


def _first_clean(
    attributes: dict, attrs: tuple[str, ...], inactive_values: frozenset[str]
) -> str | None:
    for attr in attrs:
        value = clean_value(attributes.get(attr), inactive_values)
        if value is not None:
            return value
    return None


def resolve_artist(
    attributes: dict,
    inactive_values: frozenset[str],
    configured_attribute: str | None = None,
) -> str | None:
    """Pull an artist string for music keys (configured attribute first)."""
    attrs: tuple[str, ...] = _ARTIST_ATTRS
    if configured_attribute:
        attrs = (configured_attribute, *(_ARTIST_ATTRS))
    return _first_clean(attributes, attrs, inactive_values)


def derive_key(
    *,
    media_type: str,
    signal_type: str,
    state: str | None,
    attributes: dict | None,
    is_sensor: bool,
    inactive_values: frozenset[str],
    artist_attribute: str | None = None,
) -> str | None:
    """Turn a source state into a catalog key, or None when inactive.

    signal_type ``app``  → app name (app_name/app_id attr, else sensor state).
    signal_type ``title`` → title attr, else the sensor state.
    For ``music`` titles an artist (when present) yields ``"Artist - Title"``.
    """
    attributes = attributes or {}

    if signal_type == "app":
        value = _first_clean(attributes, _APP_ATTRS, inactive_values)
        if value is None and is_sensor:
            value = clean_value(state, inactive_values)
        return value

    # signal_type == "title"
    title = _first_clean(attributes, _TITLE_ATTRS, inactive_values)
    if title is None and is_sensor:
        title = clean_value(state, inactive_values)
    if title is None:
        return None

    if media_type == "music":
        artist = resolve_artist(attributes, inactive_values, artist_attribute)
        if artist:
            return f"{artist} - {title}"
    return title
