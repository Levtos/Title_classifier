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
from dataclasses import dataclass

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
_SOURCE_ATTRS: tuple[str, ...] = ("source",)
_ARTIST_ATTRS: tuple[str, ...] = (
    "media_artist", "artist", "media_album_artist", "album_artist",
)

_AUDIO_CONTENT_TYPES: frozenset[str] = frozenset(
    {"music", "audio", "track", "song", "podcast", "audiobook"}
)


@dataclass(frozen=True, slots=True)
class KeyResolution:
    """The live key plus the identity axis used for the catalog write.

    ``defer_persistence`` is reserved for an app/source-only video fallback.
    Apple-TV integrations can publish those attributes before delayed Plex or
    Jellyfin metadata arrives; the runtime may show the fallback immediately,
    but must wait before creating a durable catalog row.
    """

    key: str | None
    signal_type: str
    defer_persistence: bool = False


def resolve_display_key(current_key: str | None, idle_value: str) -> str:
    """Raw-sensor display value: the live key, or the configured idle sentinel
    when nothing is playing.

    Keeps the raw/title sensor from ever going ``None`` (HA ``unknown`` /
    ``unavailable``) — a stable string means downstream binding checks stay green
    and the idle state is expressible as a declared inactive value.
    """
    return current_key if current_key else idle_value


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


def _normalise_marker(value: str) -> str:
    return value.strip().lower().replace("-", "_").replace(" ", "_")


def _is_audio_like_video_source(
    attributes: dict, inactive_values: frozenset[str]
) -> bool:
    """Reject music-player metadata from a video watcher.

    The live Apple-TV wiring can observe a Music Assistant mirror. Its track
    artist/title are valid music metadata, but they are not a video series and
    must not become a video catalog identity. Explicit Plex/Jellyfin markers
    take precedence because those services can legitimately be mirrored by a
    Music Assistant player.
    """

    content_type = _first_clean(
        attributes, ("media_content_type", "content_type"), inactive_values
    )
    if content_type:
        content_type_lower = content_type.strip().lower()
        if content_type_lower in _AUDIO_CONTENT_TYPES:
            return True
        if content_type_lower in {"video", "movie", "episode"}:
            return False

    values = [
        value
        for value in (
            _first_clean(attributes, ("app_name",), inactive_values),
            _first_clean(attributes, ("app_id",), inactive_values),
            _first_clean(attributes, _SOURCE_ATTRS, inactive_values),
        )
        if value
    ]
    markers = {_normalise_marker(value) for value in values}
    has_video_app = any(
        "plex" in marker or "jellyfin" in marker for marker in markers
    )
    if has_video_app:
        return False
    return any(
        "music_assistant" in marker
        or marker in {"music", "audio", "spotify", "apple_music"}
        for marker in markers
    )


def _video_content_key(
    attributes: dict, inactive_values: frozenset[str]
) -> str | None:
    """Return the semantic video identity, or ``None`` when it is absent."""

    if _is_audio_like_video_source(attributes, inactive_values):
        return None

    # For video, media_artist is the semantic series identity when present.
    # Do not use the configurable music artist attribute here: on a Music
    # Assistant mirror it can be an implementation identifier such as an
    # active_queue value.
    series = _first_clean(attributes, _ARTIST_ATTRS, inactive_values)
    if series:
        return series
    return _first_clean(attributes, _TITLE_ATTRS, inactive_values)


def _uses_video_content_identity(media_type: str, context: str | None) -> bool:
    # Stash scenes are an existing title watcher and intentionally retain their
    # established title-only semantics. All other video watchers use the
    # media-centric series/film rule; ``None`` makes the pure helper useful for
    # callers that do not carry a context axis.
    return media_type == "video" and (context or "").strip().lower() != "stash"


def resolve_catalog_artist(
    *,
    media_type: str,
    context: str | None,
    attributes: dict,
    inactive_values: frozenset[str],
    configured_attribute: str | None = None,
) -> str | None:
    """Return the artist/series metadata that may be stored for an entry."""

    if media_type == "music":
        return resolve_artist(attributes, inactive_values, configured_attribute)
    if _uses_video_content_identity(media_type, context):
        if _is_audio_like_video_source(attributes, inactive_values):
            return None
        return _first_clean(attributes, _ARTIST_ATTRS, inactive_values)
    return None


def derive_resolution(
    *,
    media_type: str,
    signal_type: str,
    state: str | None,
    attributes: dict | None,
    is_sensor: bool,
    inactive_values: frozenset[str],
    artist_attribute: str | None = None,
    context: str | None = None,
) -> KeyResolution:
    """Resolve a source event into a key and effective catalog signal type.

    Apple-TV video watchers deliberately prefer real content metadata over the
    configured app axis. That makes Plex/Jellyfin series use ``media_artist``
    as identity and films use ``media_title``. App name, app id and source are
    only an app watcher fallback when content is genuinely absent.
    """

    attributes = attributes or {}

    if _uses_video_content_identity(media_type, context):
        content_key = _video_content_key(attributes, inactive_values)
        if content_key is not None:
            return KeyResolution(content_key, "title")

    if signal_type == "app":
        fallback_attrs = (
            (*_APP_ATTRS, *_SOURCE_ATTRS)
            if media_type == "video"
            else _APP_ATTRS
        )
        value = _first_clean(
            attributes, fallback_attrs, inactive_values
        )
        if value is None and is_sensor:
            value = clean_value(state, inactive_values)
        return KeyResolution(
            value,
            "app",
            defer_persistence=(
                value is not None
                and _uses_video_content_identity(media_type, context)
            ),
        )

    # signal_type == "title" (and the unchanged non-video paths)
    title = _first_clean(attributes, _TITLE_ATTRS, inactive_values)
    if title is None and is_sensor:
        title = clean_value(state, inactive_values)
    if title is None:
        return KeyResolution(None, signal_type)

    if media_type == "music":
        artist = resolve_artist(attributes, inactive_values, artist_attribute)
        if artist:
            return KeyResolution(f"{artist} - {title}", signal_type)
    return KeyResolution(title, signal_type)


def derive_key(
    *,
    media_type: str,
    signal_type: str,
    state: str | None,
    attributes: dict | None,
    is_sensor: bool,
    inactive_values: frozenset[str],
    artist_attribute: str | None = None,
    context: str | None = None,
) -> str | None:
    """Turn a source state into a catalog key, or None when inactive.

    signal_type ``app``  → app name/id, source, or sensor state fallback.
    signal_type ``title`` → title attr, else the sensor state.
    For ``music`` titles an artist (when present) yields ``"Artist - Title"``.
    Non-stash video watchers prefer a series name from ``media_artist`` and
    otherwise a film/episode title, even if their configured signal is ``app``.
    """
    return derive_resolution(
        media_type=media_type,
        signal_type=signal_type,
        state=state,
        attributes=attributes,
        is_sensor=is_sensor,
        inactive_values=inactive_values,
        artist_attribute=artist_attribute,
        context=context,
    ).key
