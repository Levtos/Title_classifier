"""Tests for the pure v3 import/export helpers (FLEET-182)."""

from __future__ import annotations

import tc_catalog_v3 as C
import tc_io_v3 as IO


def _e(eid, key, **kw) -> C.CatalogEntryV3:
    base = dict(
        id=eid, scope="default", media_type="music", signal_type="title",
        normalized_key=C.normalize_key(key), key=key, enum=0,
        first_seen="2026-01-01T00:00:00+00:00", last_seen="2026-01-02T00:00:00+00:00",
        seen_count=3,
    )
    base.update(kw)
    return C.CatalogEntryV3(**base)


def _ctx(entry_id, context, **kw) -> C.ContextRow:
    base = dict(entry_id=entry_id, context=context, source_app="", seen_count=1)
    base.update(kw)
    return C.ContextRow(**base)


# ----------------------------------------------------------------- export


def test_export_omits_images_and_uses_parent_key():
    master = _e("m", "Master", enum=4)
    variant = _e("c", "Variant", parent_id="m")
    payload = IO.build_export_payload(
        [master, variant],
        {"m": [_ctx("m", "homepod")], "c": []},
    )
    assert payload["version"] == 3
    blob = repr(payload)
    for bad in ("cover_url", "cover_source", "image", "artwork", "entity_picture"):
        assert bad not in blob
    recs = {r["key"]: r for r in payload["entries"]}
    assert recs["Variant"]["parent_key"] == "master"
    assert recs["Master"]["parent_key"] is None
    assert recs["Master"]["enum"] == 4
    assert recs["Master"]["contexts"][0]["context"] == "homepod"


def test_export_without_telemetry():
    e = _e("x", "Track")
    payload = IO.build_export_payload([e], {"x": [_ctx("x", "homepod")]}, include_telemetry=False)
    rec = payload["entries"][0]
    assert "telemetry" not in rec
    assert "telemetry" not in rec["contexts"][0]


# ---------------------------------------------------------------- validate


def test_validate_accepts_good_record():
    rec = {
        "key": "Daft Punk - One More Time", "media_type": "music",
        "signal_type": "title", "enum": 5,
        "contexts": [{"context": "homepod", "enum_override": None}],
    }
    assert IO.validate_import_record(rec) == []


def test_validate_rejects_bad_axes_and_enum():
    assert IO.validate_import_record(
        {"key": "x", "media_type": "tv", "signal_type": "title"}
    )
    assert IO.validate_import_record(
        {"key": "x", "media_type": "music", "signal_type": "name"}
    )
    assert IO.validate_import_record(
        {"key": "x", "media_type": "music", "signal_type": "title", "enum": 99}
    )
    assert IO.validate_import_record(
        {"media_type": "music", "signal_type": "title"}
    )  # missing key


def test_validate_rejects_context_not_allowed_for_media_type():
    errors = IO.validate_import_record({
        "key": "Song", "media_type": "music", "signal_type": "title",
        "contexts": [{"context": "ps5"}],  # ps5 cannot carry music
    })
    assert any("not allowed" in e for e in errors)


def test_validate_rejects_image_data():
    errors = IO.validate_import_record({
        "key": "x", "media_type": "music", "signal_type": "title",
        "cover_url": "http://cdn/x.jpg",
    })
    assert any("image data not allowed" in e for e in errors)
    ctx_err = IO.validate_import_record({
        "key": "x", "media_type": "music", "signal_type": "title",
        "contexts": [{"context": "homepod", "artwork": "http://cdn/y.jpg"}],
    })
    assert any("image data not allowed" in e for e in ctx_err)


# ------------------------------------------------------------ merge telemetry


def test_merge_takes_source_override_when_target_empty():
    src = _ctx("e", "ps5", enum_override=7, seen_count=2,
               first_seen="2026-01-01T00:00:00+00:00", last_seen="2026-01-05T00:00:00+00:00")
    tgt = _ctx("e", "ps5", enum_override=None, seen_count=3,
               first_seen="2026-01-02T00:00:00+00:00", last_seen="2026-01-04T00:00:00+00:00")
    merged = IO.merge_context_telemetry(src, tgt)
    assert merged["seen_count"] == 5
    assert merged["first_seen"] == "2026-01-01T00:00:00+00:00"
    assert merged["last_seen"] == "2026-01-05T00:00:00+00:00"
    assert merged["enum_override"] == 7
    assert merged["override_conflict"] is False


def test_merge_flags_override_conflict_keeping_target():
    src = _ctx("e", "ps5", enum_override=7)
    tgt = _ctx("e", "ps5", enum_override=3)
    merged = IO.merge_context_telemetry(src, tgt)
    assert merged["enum_override"] == 3  # target kept
    assert merged["override_conflict"] is True


def test_import_identity():
    rec = {"media_type": "game", "signal_type": "title", "key": "Astro Bot"}
    assert IO.import_identity(rec, "default") == ("default", "game", "title", "astro bot")
