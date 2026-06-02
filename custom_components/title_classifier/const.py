"""Title Classifier constants."""

from __future__ import annotations

from typing import Final

DOMAIN: Final[str] = "title_classifier"
MODULE_ID: Final[str] = "title_classifier"
NAME: Final[str] = "Title Classifier"

DATA_ENTRIES: Final[str] = "entries"
DATA_SERVICES_REGISTERED: Final[str] = "services_registered"
DATA_WEBSOCKETS_REGISTERED: Final[str] = "websockets_registered"

# Kept in ConfigEntry.data so migrated entries can still be inspected with the
# same field name used by the previous umbrella module.
CONF_MODULE_ID: Final[str] = "_module_id"

CONF_SOURCE_ENTITY = "source_entity"
CONF_ARTIST_ATTRIBUTE = "artist_attribute"
CONF_WATCHER_TYPE = "watcher_type"
CONF_RETENTION_DAYS = "retention_days"
CONF_AUTO_HIDE_HOURS = "auto_hide_hours"

# v2 shared-catalog identity fields.
CONF_CATEGORY = "category"
CONF_PLATFORM = "platform"
CONF_SCOPE = "scope"

WATCHER_TYPES = ("game", "media", "activity")
DEFAULT_ARTIST_ATTRIBUTE = "media_artist"

# Catalog categories (content type). `platform` (pc/ps5/switch/…) is a separate
# attribute, never part of the identity — one game is one row across platforms.
CATEGORIES = ("music", "game", "tv", "stash")
DEFAULT_CATEGORY = "music"
DEFAULT_SCOPE = "default"

# How each category drives the title-extraction behaviour in runtime.py
# (which still keys off the legacy watcher_type values).
CATEGORY_TO_WATCHER_TYPE = {
    "music": "media",
    "game": "game",
    "tv": "media",
    "stash": "media",
}
# Reverse map for the one-time .storage → Postgres migration (Apply button).
WATCHER_TYPE_TO_CATEGORY = {
    "media": "music",
    "game": "game",
    "activity": "game",
}

ARTIST_ATTRIBUTE_CANDIDATES: tuple[str, ...] = (
    "media_artist",
    "artist",
    "media_album_artist",
    "album_artist",
)

RADIO_STATION_ATTRIBUTE_CANDIDATES: tuple[str, ...] = (
    "radio_station_name",
    "media_station",
    "station",
    "channel",
    "media_channel",
)
DEFAULT_ENUM = 0
MIN_ENUM = 0
MAX_ENUM = 9

STORAGE_VERSION = 1

ATTR_KEY = "key"
ATTR_ENUM = "enum"
ATTR_ENTRY_ID = "entry_id"
ATTR_WATCHER_ID = "watcher_id"
ATTR_WATCHER_NAME = "watcher_name"
ATTR_DELETED = "deleted"
ATTR_ENTRIES = "entries"

SERVICE_SET_ENUM = "set_enum"
SERVICE_DELETE_ENTRY = "delete_entry"
SERVICE_CLEAR_OLD = "clear_old"
SERVICE_IMPORT_ENTRIES = "import_entries"
SERVICE_HIDE_UNMAPPED = "hide_unmapped"
SERVICE_IMPORT_LOCAL_STORAGE = "import_local_storage"

PANEL_TITLE = "Title Classifier"
PANEL_ICON = "mdi:tag-multiple"

TITLE_ATTRIBUTE_CANDIDATES = {
    "game": (
        "media_title",
        "title",
        "game_title",
        "game_name",
        "app_title",
        "app_name",
        "activity",
        "activity_name",
    ),
    "media": ("media_title", "title"),
    "activity": ("activity", "activity_name", "media_title", "title", "app_name"),
}
IGNORED_RAW_VALUES = {
    "",
    "unknown",
    "unavailable",
    "none",
    "off",
    "idle",
    "standby",
}
MEDIA_RICH_TITLE_MARKERS = ("remix", "mix", "edit", "version", "club", "vip", "bootleg")
MEDIA_FEATURE_MARKERS = (" feat", " ft", " featuring", " & ", ",")


def storage_key(_module_id: str, suffix: str) -> str:
    """Stable Home Assistant storage key for this standalone integration."""
    return f"{DOMAIN}_{suffix}"


def service_name(_module_id: str, action: str) -> str:
    """Standalone service name, e.g. `title_classifier.set_enum`."""
    return action


def websocket_type(_module_id: str, command: str) -> str:
    """Standalone WebSocket command, e.g. `title_classifier/list_entries`."""
    return f"{DOMAIN}/{command}"


def panel_url_path(_module_id: str) -> str:
    """Sidebar URL path."""
    return DOMAIN


def unique_id(_module_id: str, *parts: str) -> str:
    """Standalone unique_id with integration prefix."""
    return "_".join((DOMAIN, *parts))
