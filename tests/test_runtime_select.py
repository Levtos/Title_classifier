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
