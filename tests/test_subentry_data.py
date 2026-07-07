"""Tests for the pure watcher / subentry form-data assembly (flow_data.py)."""

from __future__ import annotations

import tc_const as C
import tc_flow_data as F


def _form(**over):
    base = {
        # HA's standard "name" key (flow_data inlines CONF_NAME = "name").
        "name": "Stash Slot 1",
        C.CONF_SOURCE_ENTITY: "sensor.wohnzimmer_stash_slot_1_title",
        C.CONF_MEDIA_TYPE: "video",
        C.CONF_CONTEXT: "stash",
        C.CONF_SIGNAL_TYPE: "title",
        C.CONF_DEFAULT_ACTIVE_ENUM: 1,
        C.CONF_INACTIVE_VALUES: "Kein Stream aktiv",
        C.CONF_ARTWORK_ENTITY_ID: "image.wohnzimmer_stash_slot_1_cover",
    }
    base.update(over)
    return base


def test_watcher_subentry_data_shape():
    d = F.watcher_subentry_data(_form())
    assert d[C.CONF_ENTRY_TYPE] == C.ENTRY_TYPE_WATCHER_V3
    assert d["name"] == "Stash Slot 1"
    assert d[C.CONF_SOURCE_ENTITY] == "sensor.wohnzimmer_stash_slot_1_title"
    assert d[C.CONF_CONTEXT] == "stash"
    assert d[C.CONF_MEDIA_TYPE] == "video"
    assert d[C.CONF_DEFAULT_ACTIVE_ENUM] == 1
    assert d[C.CONF_INACTIVE_VALUES] == ["Kein Stream aktiv"]
    assert d[C.CONF_ARTWORK_ENTITY_ID] == "image.wohnzimmer_stash_slot_1_cover"
    # A subentry lives under the hub already — no hub_entry_id back-reference.
    assert C.CONF_HUB_ENTRY_ID not in d


def test_watcher_subentry_data_retention_optional():
    assert C.CONF_RETENTION_DAYS not in F.watcher_subentry_data(_form())
    with_ret = F.watcher_subentry_data(_form(**{C.CONF_RETENTION_DAYS: 30}))
    assert with_ret[C.CONF_RETENTION_DAYS] == 30


def test_inactive_parsing_roundtrip():
    assert F.inactive_to_list("a, b ,c") == ["a", "b", "c"]
    assert F.inactive_to_list(["x", " y ", ""]) == ["x", "y"]
    assert F.inactive_to_list(None) == []
    assert F.inactive_to_str(["a", "b"]) == "a, b"


def test_watcher_name_slug_matches_entity_id_contract():
    # Must equal entities_v3._slug: name.lower().replace(" ", "_") — this is the
    # slug two watchers would collide on (sensor.title_classifier_<slug>_enum).
    assert F.watcher_name_slug("Stash Slot 1") == "stash_slot_1"
    assert F.watcher_name_slug("Stash") == "stash"
    assert F.watcher_name_slug("STASH slot 1") == "stash_slot_1"
    assert F.watcher_name_slug(None) == ""
    # Two names that collapse to the same slug are detected as equal.
    assert F.watcher_name_slug("Stash Slot 1") == F.watcher_name_slug("stash slot 1")


def test_v3_axis_data_normalises_and_defaults():
    d = F.v3_axis_data(_form(**{C.CONF_SOURCE_APP: "  Netflix ", C.CONF_SCOPE: ""}))
    assert d[C.CONF_SOURCE_APP] == "Netflix"          # trimmed
    assert d[C.CONF_SCOPE] == C.DEFAULT_SCOPE          # empty → default
    assert d[C.CONF_IDLE_VALUE] == C.DEFAULT_IDLE_VALUE
    assert d[C.CONF_INACTIVE_VALUES] == ["Kein Stream aktiv"]
    # empty source_app → None (not "")
    assert F.v3_axis_data(_form(**{C.CONF_SOURCE_APP: "  "}))[C.CONF_SOURCE_APP] is None
