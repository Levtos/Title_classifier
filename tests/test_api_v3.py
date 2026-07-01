"""Tests for the pure v3 API serialisation (FLEET-197)."""

from __future__ import annotations

import tc_catalog_v3 as C
import tc_api_v3 as A


def _e(eid, key, **kw) -> C.CatalogEntryV3:
    base = dict(
        id=eid, scope="default", media_type="game", signal_type="title",
        normalized_key=key.lower(), key=key, last_seen="2026-01-01T00:00:00+00:00",
    )
    base.update(kw)
    return C.CatalogEntryV3(**base)


def _entries(*items) -> dict:
    return {e.id: e for e in items}


def test_build_children_map_groups_by_parent():
    master = _e("m", "Master")
    c1 = _e("c1", "C1", parent_id="m")
    c2 = _e("c2", "C2", parent_id="m")
    other = _e("o", "Other")
    cmap = A.build_children_map(_entries(master, c1, c2, other))
    assert {c.id for c in cmap["m"]} == {"c1", "c2"}
    assert "o" not in cmap


def test_select_includes_variants_and_parent_id():
    master = _e("m", "Master", enum=4)
    child = _e("c1", "Variant", parent_id="m")
    rows = A.select_and_view(_entries(master, child), {})
    by_id = {r["id"]: r for r in rows}
    assert by_id["m"]["variants"] == [{"id": "c1", "key": "Variant", "enum": 0}]
    assert by_id["m"]["is_variant"] is False
    assert by_id["c1"]["parent_id"] == "m"
    assert by_id["c1"]["is_variant"] is True


def test_hidden_entry_skipped_unless_included_or_current():
    visible = _e("v", "Visible")
    hidden = _e("h", "Hidden", hidden_at="2026-01-01T00:00:00+00:00")
    entries = _entries(visible, hidden)

    ids = {r["id"] for r in A.select_and_view(entries, {})}
    assert ids == {"v"}

    ids = {r["id"] for r in A.select_and_view(entries, {}, include_hidden=True)}
    assert ids == {"v", "h"}

    # is_current override: hidden but currently playing → shown.
    ids = {r["id"] for r in A.select_and_view(entries, {"h": (5, "ps5", "")})}
    assert ids == {"v", "h"}


def test_current_entry_carries_effective_and_context():
    e = _e("x", "Astro Bot", enum=2)
    rows = A.select_and_view(_entries(e), {"x": (7, "ps5", "")})
    row = rows[0]
    assert row["is_current"] is True
    assert row["effective_enum"] == 7
    assert row["current_context"] == "ps5"


def test_non_current_entry_has_null_effective():
    e = _e("x", "Idle Game", enum=3)
    row = A.select_and_view(_entries(e), {})[0]
    assert row["is_current"] is False
    assert row["effective_enum"] is None
    assert row["current_context"] is None


def test_filters_media_type_search_unclassified_limit():
    g = _e("g", "Astro Bot", media_type="game", enum=0)
    m = _e("m", "Daft Punk - One More Time", media_type="music", enum=4,
           normalized_key="daft punk one more time")
    entries = _entries(g, m)

    assert {r["id"] for r in A.select_and_view(entries, {}, media_type="music")} == {"m"}
    assert {r["id"] for r in A.select_and_view(entries, {}, search="astro")} == {"g"}
    assert {r["id"] for r in A.select_and_view(entries, {}, unclassified=True)} == {"g"}
    assert len(A.select_and_view(entries, {}, limit=1)) == 1


def _ctx(entry_id, context, **kw) -> C.ContextRow:
    base = dict(entry_id=entry_id, context=context, source_app="", seen_count=2)
    base.update(kw)
    return C.ContextRow(**base)


def test_build_entry_detail_game_contexts_and_overrides():
    game = _e("g", "Overwatch", media_type="game", enum=0)
    contexts = [
        _ctx("g", "pc"),
        _ctx("g", "ps5", enum_override=4),
    ]
    detail = A.build_entry_detail(game, contexts, None, [])
    assert detail["id"] == "g"
    assert detail["parent"] is None
    by_ctx = {c["context"]: c for c in detail["contexts"]}
    # pc: no override → catalog base 0; ps5: override 4 wins.
    assert by_ctx["pc"]["enum_override"] is None
    assert by_ctx["pc"]["effective_preview"] == 0
    assert by_ctx["ps5"]["enum_override"] == 4
    assert by_ctx["ps5"]["effective_preview"] == 4
    assert by_ctx["ps5"]["seen_count"] == 2


def test_build_entry_detail_variant_inherits_master_in_preview():
    master = _e("m", "Numb", enum=6, media_type="music")
    variant = _e("v", "Numb (Live)", enum=0, parent_id="m", media_type="music")
    detail = A.build_entry_detail(variant, [_ctx("v", "homepod")], master, [])
    assert detail["is_variant"] is True
    assert detail["parent"] == {"id": "m", "key": "Numb", "enum": 6}
    # music variant inherits the master enum in the effective preview.
    assert detail["contexts"][0]["effective_preview"] == 6


def test_build_entry_detail_lists_children():
    master = _e("m", "Master", enum=3)
    children = [_e("c1", "B Variant", parent_id="m"), _e("c2", "A Variant", parent_id="m")]
    detail = A.build_entry_detail(master, [], None, children)
    # children sorted by key.
    assert [v["key"] for v in detail["variants"]] == ["A Variant", "B Variant"]
    assert detail["variants"][0]["id"] == "c2"


def test_ordering_unmapped_first():
    a = _e("a", "Mapped", enum=5, last_seen="2026-01-10T00:00:00+00:00")
    b = _e("b", "Unmapped", enum=0, last_seen="2026-01-05T00:00:00+00:00")
    rows = A.select_and_view(_entries(a, b), {})
    assert [r["id"] for r in rows] == ["b", "a"]
