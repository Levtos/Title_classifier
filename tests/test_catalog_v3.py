"""Pure-logic tests for the v3 catalog core (FLEET-193).

Covers identity/normalisation, enum clamping, vocabulary validation and the
one-level master/variant guard. No Home Assistant, no Postgres.
"""

from __future__ import annotations

import uuid

import pytest

import tc_catalog_v3 as C


# ------------------------------------------------------------------ normalise


def test_normalize_key_is_separator_agnostic():
    assert C.normalize_key("Daft Punk - One More Time") == "daft punk one more time"
    assert C.normalize_key("daft punk   one more time") == "daft punk one more time"
    assert C.normalize_key("  Hades  ") == "hades"
    assert C.normalize_key("Astro Bot!!") == "astro bot"


def test_normalize_key_collapses_unicode_punctuation_runs():
    assert C.normalize_key("A___B--C") == "a b c"
    assert C.normalize_key("") == ""


def test_new_id_is_unique_uuid4_string():
    a, b = C.new_id(), C.new_id()
    assert a != b
    parsed = uuid.UUID(a)
    assert parsed.version == 4


# ----------------------------------------------------------------- validators


def test_validators_accept_known_values():
    assert C.validate_media_type("game") == "game"
    assert C.validate_signal_type("app") == "app"
    assert C.validate_context("apple_tv") == "apple_tv"


@pytest.mark.parametrize(
    "fn,bad",
    [
        (C.validate_media_type, "tv"),     # old name, no longer valid
        (C.validate_media_type, "stash"),  # stash is a context now, not a type
        (C.validate_signal_type, "name"),
        (C.validate_context, "tablet"),
    ],
)
def test_validators_reject_unknown(fn, bad):
    with pytest.raises(ValueError):
        fn(bad)


def test_clamp_enum_bounds():
    assert C.clamp_enum(-3) == 0
    assert C.clamp_enum(0) == 0
    assert C.clamp_enum(5) == 5
    assert C.clamp_enum(99) == 9


def test_context_allowed_for_device_semantics():
    assert C.context_allowed_for("music", "homepod")
    assert C.context_allowed_for("game", "ps5")
    assert C.context_allowed_for("video", "stash")
    assert C.context_allowed_for("video", "apple_tv")
    # pc is multi-purpose.
    assert C.context_allowed_for("music", "pc")
    assert C.context_allowed_for("game", "pc")
    assert C.context_allowed_for("video", "pc")
    # mismatches.
    assert not C.context_allowed_for("music", "ps5")
    assert not C.context_allowed_for("game", "homepod")
    assert not C.context_allowed_for("video", "switch")


def test_allowed_contexts():
    assert set(C.allowed_contexts("game")) == {"pc", "ps5", "switch"}
    assert set(C.allowed_contexts("video")) == {"pc", "stash", "apple_tv"}
    assert set(C.allowed_contexts("music")) == {"pc", "homepod"}


def test_normalized_inactive_keys_case_and_trim():
    # All three variants normalise to the same key as normalize_key("No Game").
    for variant in ("No Game", "no game", "  No Game  "):
        assert C.normalized_inactive_keys([variant]) == [C.normalize_key("No Game")]
        assert C.normalized_inactive_keys([variant]) == ["no game"]


def test_normalized_inactive_keys_accepts_comma_string_and_dedupes():
    assert C.normalized_inactive_keys("No Game, no game ,Paused") == [
        "no game",
        "paused",
    ]
    assert C.normalized_inactive_keys(["", "  ", None]) == []
    assert C.normalized_inactive_keys(None) == []


# -------------------------------------------------------------------- entities


def _entry(**kw) -> C.CatalogEntryV3:
    base = dict(
        id=C.new_id(),
        scope="default",
        media_type="music",
        signal_type="title",
        normalized_key="daft punk one more time",
        key="Daft Punk - One More Time",
    )
    base.update(kw)
    return C.CatalogEntryV3(**base)


def test_identity_tuple_and_is_variant():
    e = _entry()
    assert e.identity == ("default", "music", "title", "daft punk one more time")
    assert e.is_variant is False
    e.parent_id = C.new_id()
    assert e.is_variant is True


# --------------------------------------------------------------- parent guard


def test_guard_allows_same_scope_type_signal():
    parent = _entry()
    child = _entry(normalized_key="one more time remix", key="One More Time (Remix)")
    # Must not raise.
    C.assert_can_set_parent(
        child=child, parent=parent, parent_has_parent=False, child_has_children=False
    )


def test_guard_rejects_self_parent():
    e = _entry()
    with pytest.raises(C.ParentGuardError):
        C.assert_can_set_parent(
            child=e, parent=e, parent_has_parent=False, child_has_children=False
        )


def test_guard_rejects_scope_mismatch():
    parent = _entry(scope="default")
    child = _entry(scope="eltern")
    with pytest.raises(C.ParentGuardError):
        C.assert_can_set_parent(
            child=child, parent=parent, parent_has_parent=False, child_has_children=False
        )


def test_guard_rejects_media_type_mismatch():
    parent = _entry(media_type="music")
    child = _entry(media_type="video")
    with pytest.raises(C.ParentGuardError):
        C.assert_can_set_parent(
            child=child, parent=parent, parent_has_parent=False, child_has_children=False
        )


def test_guard_rejects_signal_type_mismatch():
    parent = _entry(signal_type="title")
    child = _entry(signal_type="app")
    with pytest.raises(C.ParentGuardError):
        C.assert_can_set_parent(
            child=child, parent=parent, parent_has_parent=False, child_has_children=False
        )


def test_guard_rejects_two_levels_via_parent_with_parent():
    parent = _entry()
    child = _entry(normalized_key="variant", key="Variant")
    with pytest.raises(C.ParentGuardError):
        C.assert_can_set_parent(
            child=child, parent=parent, parent_has_parent=True, child_has_children=False
        )


def test_guard_rejects_master_with_children_becoming_child():
    parent = _entry()
    child = _entry(normalized_key="variant", key="Variant")
    with pytest.raises(C.ParentGuardError):
        C.assert_can_set_parent(
            child=child, parent=parent, parent_has_parent=False, child_has_children=True
        )
