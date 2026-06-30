"""Pure runtime-bucket selectors — keep the v2 and v3 pools strictly separate.

Hotfix (v2.8.1): WatcherRuntimeV3 deliberately has no v2 surface (no ``category``
/ ``refresh_current_enum`` etc.). The v2 WebSocket/service layer must therefore
never receive a v3 runtime, or it crashes (``WatcherRuntimeV3 has no attribute
category``). These predicates classify a hass.data entry bucket; they are
HA-free so they can be unit-tested with plain dicts.
"""

from __future__ import annotations

from collections.abc import Iterable

from .const import ENTRY_TYPE_WATCHER_V3, MODULE_ID


def is_v2_watcher_bucket(bucket: dict) -> bool:
    """A loaded v2 watcher runtime (not a v3 watcher, not the hub)."""
    return (
        bucket.get("runtime") is not None
        and bucket.get("module_id", MODULE_ID) == MODULE_ID
        and bucket.get("entry_type") != ENTRY_TYPE_WATCHER_V3
    )


def is_v3_watcher_bucket(bucket: dict) -> bool:
    """A loaded v3 watcher runtime."""
    return (
        bucket.get("runtime") is not None
        and bucket.get("entry_type") == ENTRY_TYPE_WATCHER_V3
    )


def select_v2_runtimes(buckets: Iterable[dict]) -> list:
    return [b["runtime"] for b in buckets if is_v2_watcher_bucket(b)]


def select_v3_runtimes(buckets: Iterable[dict]) -> list:
    return [b["runtime"] for b in buckets if is_v3_watcher_bucket(b)]
