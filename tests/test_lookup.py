"""Tests for runtime lookup helpers."""

from __future__ import annotations

from types import SimpleNamespace

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
