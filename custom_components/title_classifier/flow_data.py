"""Pure (HA-free) form-data assembly for the config + subentry flows.

Kept import-light (only ``const``) so the watcher-data contract — including the
v3.3 subentry data shape — is unit-tested without Home Assistant.
"""

from __future__ import annotations

from typing import Any

from .const import (
    CONF_ARTIST_ATTRIBUTE,
    CONF_ARTWORK_ATTRIBUTE,
    CONF_ARTWORK_ENTITY_ID,
    CONF_CONTEXT,
    CONF_DEFAULT_ACTIVE_ENUM,
    CONF_ENTRY_TYPE,
    CONF_IDLE_VALUE,
    CONF_INACTIVE_VALUES,
    CONF_MEDIA_TYPE,
    CONF_MODULE_ID,
    CONF_ONLINE_ENTITY,
    CONF_RETENTION_DAYS,
    CONF_SCOPE,
    CONF_SIGNAL_TYPE,
    CONF_SOURCE_APP,
    CONF_SOURCE_ENTITY,
    DEFAULT_ARTWORK_ATTRIBUTE,
    DEFAULT_IDLE_VALUE,
    DEFAULT_SCOPE,
    ENTRY_TYPE_WATCHER_V3,
    MODULE_ID,
)

# Home Assistant's standard "name" key — inlined so this module stays HA-free.
CONF_NAME = "name"


def watcher_name_slug(name: Any) -> str:
    """The entity-id slug a watcher name maps to.

    MUST stay identical to ``entities_v3._slug`` and the top-level watcher
    unique_id (both ``name.lower().replace(" ", "_")``) so a name-collision
    check here catches the exact case where two watchers would fight over the
    same ``sensor.title_classifier_<slug>_enum`` entity_id.
    """
    return str(name or "").lower().replace(" ", "_")


def inactive_to_list(value: Any) -> list[str]:
    """Parse inactive values from the form — a single comma-separated text field
    (comfortable typing) OR a legacy list."""
    if isinstance(value, str):
        parts = value.split(",")
    else:
        parts = list(value or [])
    return [str(v).strip() for v in parts if str(v).strip()]


def inactive_to_str(value: Any) -> str:
    return ", ".join(inactive_to_list(value))


def v3_axis_data(src: dict[str, Any]) -> dict[str, Any]:
    """Assemble the explicit v3 axis fields from a form/user-input dict."""
    return {
        CONF_MEDIA_TYPE: src[CONF_MEDIA_TYPE],
        CONF_CONTEXT: src[CONF_CONTEXT],
        CONF_SIGNAL_TYPE: src.get(CONF_SIGNAL_TYPE, "title"),
        CONF_SOURCE_APP: (src.get(CONF_SOURCE_APP) or "").strip() or None,
        CONF_DEFAULT_ACTIVE_ENUM: int(src.get(CONF_DEFAULT_ACTIVE_ENUM) or 0),
        CONF_ONLINE_ENTITY: src.get(CONF_ONLINE_ENTITY) or None,
        CONF_ARTIST_ATTRIBUTE: (src.get(CONF_ARTIST_ATTRIBUTE) or "").strip() or None,
        CONF_INACTIVE_VALUES: inactive_to_list(src.get(CONF_INACTIVE_VALUES)),
        CONF_IDLE_VALUE: (src.get(CONF_IDLE_VALUE) or "").strip() or DEFAULT_IDLE_VALUE,
        CONF_ARTWORK_ENTITY_ID: src.get(CONF_ARTWORK_ENTITY_ID) or None,
        CONF_ARTWORK_ATTRIBUTE: src.get(CONF_ARTWORK_ATTRIBUTE)
        or DEFAULT_ARTWORK_ATTRIBUTE,
        CONF_SCOPE: src.get(CONF_SCOPE) or DEFAULT_SCOPE,
    }


def v3_reconfigure_data(user_input: dict[str, Any]) -> dict[str, Any]:
    """Data to merge into an existing v3 watcher on reconfigure (control#52).

    The axis fields plus an editable ``source_entity`` when the form supplied
    one. ``name`` is intentionally never here — it drives the
    ``sensor.title_classifier_<slug>_*`` entity_id contract and stays fixed.
    """
    data = v3_axis_data(user_input)
    source = user_input.get(CONF_SOURCE_ENTITY)
    if source:
        data[CONF_SOURCE_ENTITY] = source
    return data


def watcher_subentry_data(user_input: dict[str, Any]) -> dict[str, Any]:
    """Config-subentry data for a v3 watcher nested under the hub. No
    hub_entry_id — the subentry lives under the hub entry already."""
    data = {
        CONF_MODULE_ID: MODULE_ID,
        CONF_ENTRY_TYPE: ENTRY_TYPE_WATCHER_V3,
        CONF_NAME: user_input[CONF_NAME],
        CONF_SOURCE_ENTITY: user_input[CONF_SOURCE_ENTITY],
        **v3_axis_data(user_input),
    }
    retention = user_input.get(CONF_RETENTION_DAYS)
    if retention is not None:
        data[CONF_RETENTION_DAYS] = int(retention)
    return data
