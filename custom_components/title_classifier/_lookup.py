"""Runtime-Lookup-Helfer für das Title-Classifier-Modul.

v2 und v3 haben getrennte Runtime-Pools: ``all_runtimes`` / ``require_runtime``
liefern AUSSCHLIESSLICH v2-Watcher (die v2-WS-/Service-Schicht darf nie eine
WatcherRuntimeV3 sehen). v3 nutzt ``all_v3_runtimes`` / ``v3_runtime_for_entry``.
``runtime_from_hass`` bleibt generisch (die Sensor-Plattform fragt damit beide).
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError

from .const import DATA_ENTRIES, DOMAIN
from .runtime import WatcherRuntime
from .runtime_select import is_v2_watcher_bucket, select_v3_runtimes


def _buckets(hass: HomeAssistant) -> dict:
    return hass.data.get(DOMAIN, {}).get(DATA_ENTRIES, {})


def runtime_from_hass(hass: HomeAssistant, entry_id: str):
    """The runtime for ``entry_id`` regardless of v2/v3 (used by the sensors)."""
    bucket = _buckets(hass).get(entry_id)
    if not bucket:
        return None
    return bucket.get("runtime")


def require_runtime(hass: HomeAssistant, entry_id: str) -> WatcherRuntime:
    """A v2 watcher runtime, or raise. Rejects v3 ids so v2 handlers never
    operate on a WatcherRuntimeV3."""
    bucket = _buckets(hass).get(entry_id)
    if bucket is not None and is_v2_watcher_bucket(bucket):
        return bucket["runtime"]
    raise ServiceValidationError(
        f"Unknown or non-v2 Title Classifier watcher entry_id: {entry_id}"
    )


def all_runtimes(hass: HomeAssistant) -> list[WatcherRuntime]:
    """Every loaded v2 watcher runtime (v3 runtimes are excluded)."""
    return [b["runtime"] for b in _buckets(hass).values() if is_v2_watcher_bucket(b)]


def all_v3_runtimes(hass: HomeAssistant):
    """Every loaded v3 watcher runtime (WatcherRuntimeV3).

    Covers both top-level v3 watcher entries and watcher subentries nested
    under a hub/watcher — see ``select_v3_runtimes``. This is what makes several
    slot watchers (e.g. Stash Slot 1..4) show up individually in the overview
    and share the catalog.
    """
    return select_v3_runtimes(_buckets(hass).values())


def v3_runtime_for_entry(hass: HomeAssistant, entry_id: str):
    """The v3 runtime whose store cache currently holds catalog entry ``entry_id``.

    Falls back to the first v3 runtime (its store shares the same pool, so any
    can perform an id-scoped DB write).
    """
    runtimes = all_v3_runtimes(hass)
    for rt in runtimes:
        if entry_id in rt.store.entries:
            return rt
    return runtimes[0] if runtimes else None
