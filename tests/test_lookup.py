"""Tests for runtime lookup helpers."""

from __future__ import annotations

from types import SimpleNamespace

import tc_const as C
from tc_pure_pkg import _lookup as L


def test_all_runtimes_keeps_standalone_buckets_without_module_id():
    runtime = SimpleNamespace(name="Musikkatalog")
    hass = SimpleNamespace(data={
        "title_classifier": {
            "entries": {
                "wid": {
                    "status": "ready",
                    "runtime": runtime,
                },
            },
        },
    })

    assert L.all_runtimes(hass) == [runtime]


def test_all_runtimes_filters_foreign_module_id():
    runtime = SimpleNamespace(name="Musikkatalog")
    hass = SimpleNamespace(data={
        "title_classifier": {
            "entries": {
                "wid": {
                    "module_id": "other",
                    "runtime": runtime,
                },
            },
        },
    })

    assert L.all_runtimes(hass) == []


def test_all_v3_runtimes_includes_top_level_and_subentry_runtimes():
    # A hub hosts nested watcher subentries (no own runtime); a top-level v3
    # watcher has its own. Both kinds must surface for the overview/catalog.
    hass = SimpleNamespace(data={
        "title_classifier": {
            "entries": {
                "hub": {
                    "entry_type": C.ENTRY_TYPE_HUB,
                    "subentry_runtimes": {"s1": "SLOT1", "s2": "SLOT2"},
                },
                "top": {
                    "entry_type": C.ENTRY_TYPE_WATCHER_V3,
                    "runtime": "TOP",
                },
            },
        },
    })
    assert set(L.all_v3_runtimes(hass)) == {"TOP", "SLOT1", "SLOT2"}
