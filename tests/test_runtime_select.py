"""Tests for the v2/v3 runtime-pool split (v2.8.1 hotfix).

A mixed pool must never let a v3 runtime reach the v2 selection — that is what
crashed the v2 WS layer (WatcherRuntimeV3 has no `category`/`refresh_current_enum`).
"""

from __future__ import annotations

import tc_const as C
import tc_runtime_select as RS


def _mixed_pool():
    return [
        {"module_id": C.MODULE_ID, "entry_type": C.ENTRY_TYPE_WATCHER, "runtime": "V2"},
        {"module_id": C.MODULE_ID, "entry_type": C.ENTRY_TYPE_WATCHER_V3, "runtime": "V3"},
        {"module_id": C.MODULE_ID, "entry_type": C.ENTRY_TYPE_HUB},  # hub: no runtime
    ]


def test_v2_selection_excludes_v3_and_hub():
    assert RS.select_v2_runtimes(_mixed_pool()) == ["V2"]


def test_v3_selection_only_v3():
    assert RS.select_v3_runtimes(_mixed_pool()) == ["V3"]


def test_v3_selection_includes_hub_subentry_runtimes():
    # A DB hub has no own runtime, but hosts watcher subentries — each of those
    # runtimes must surface (else nested slot watchers are invisible).
    pool = [
        {
            "entry_type": C.ENTRY_TYPE_HUB,
            "subentry_runtimes": {"s1": "SLOT1", "s2": "SLOT2"},
        },
    ]
    assert RS.select_v3_runtimes(pool) == ["SLOT1", "SLOT2"]


def test_v3_selection_top_level_and_subentries_no_double_count():
    # A top-level v3 watcher that also hosts subentries: own runtime once, plus
    # each subentry runtime once.
    pool = [
        {
            "entry_type": C.ENTRY_TYPE_WATCHER_V3,
            "runtime": "TOP",
            "subentry_runtimes": {"s1": "SLOT1"},
        },
        {"entry_type": C.ENTRY_TYPE_HUB, "subentry_runtimes": {"s2": "SLOT2"}},
    ]
    assert RS.select_v3_runtimes(pool) == ["TOP", "SLOT1", "SLOT2"]


def test_v3_selection_tolerates_missing_or_empty_subentry_map():
    pool = [
        {"entry_type": C.ENTRY_TYPE_WATCHER_V3, "runtime": "V3"},
        {"entry_type": C.ENTRY_TYPE_HUB, "subentry_runtimes": {}},
        {"entry_type": C.ENTRY_TYPE_HUB},
    ]
    assert RS.select_v3_runtimes(pool) == ["V3"]


def test_v3_bucket_is_not_a_v2_bucket():
    bucket = {"entry_type": C.ENTRY_TYPE_WATCHER_V3, "runtime": object()}
    assert RS.is_v3_watcher_bucket(bucket)
    assert not RS.is_v2_watcher_bucket(bucket)


def test_v2_bucket_is_not_a_v3_bucket():
    bucket = {
        "module_id": C.MODULE_ID,
        "entry_type": C.ENTRY_TYPE_WATCHER,
        "runtime": object(),
    }
    assert RS.is_v2_watcher_bucket(bucket)
    assert not RS.is_v3_watcher_bucket(bucket)


def test_hub_and_runtimeless_buckets_are_neither():
    for bucket in ({"entry_type": C.ENTRY_TYPE_HUB}, {"runtime": None}, {}):
        assert not RS.is_v2_watcher_bucket(bucket)
        assert not RS.is_v3_watcher_bucket(bucket)


def test_legacy_v2_bucket_without_entry_type_still_selected():
    # Older v2 watcher buckets may predate the entry_type tag.
    bucket = {"module_id": C.MODULE_ID, "runtime": "V2"}
    assert RS.is_v2_watcher_bucket(bucket)
