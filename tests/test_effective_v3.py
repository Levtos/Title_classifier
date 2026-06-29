"""Tests for the v3 effective-enum resolver (FLEET-194).

Pure logic — covers all four resolution stages and their fixed ordering.
"""

from __future__ import annotations

import tc_catalog_v3 as C
import tc_effective_v3 as E


# --------------------------------------------------------------- online gate


def test_offline_is_always_zero():
    # Even a mapped, non-default entry collapses to 0 when nothing is active.
    assert E.resolve_effective_enum(
        media_type="game", context="ps5", active=False, base_enum=5
    ) == 0


def test_active_default_stays_default_for_normal_context():
    assert E.resolve_effective_enum(
        media_type="game", context="ps5", active=True, base_enum=0
    ) == 0


def test_active_mapped_returns_base():
    assert E.resolve_effective_enum(
        media_type="game", context="pc", active=True, base_enum=4
    ) == 4


# ---------------------------------------------------------- variant inherit


def test_music_variant_inherits_master_enum():
    assert E.resolve_effective_enum(
        media_type="music", context="homepod", active=True,
        base_enum=0, is_variant=True, parent_enum=6,
    ) == 6


def test_video_variant_inherits_master_enum():
    assert E.resolve_effective_enum(
        media_type="video", context="apple_tv", active=True,
        base_enum=1, is_variant=True, parent_enum=3,
    ) == 3


def test_game_variant_does_not_inherit():
    # Games express intent via context overrides, not master inheritance.
    assert E.resolve_effective_enum(
        media_type="game", context="ps5", active=True,
        base_enum=2, is_variant=True, parent_enum=8,
    ) == 2


def test_non_variant_ignores_parent_enum():
    assert E.resolve_effective_enum(
        media_type="music", context="homepod", active=True,
        base_enum=1, is_variant=False, parent_enum=9,
    ) == 1


# ---------------------------------------------------------- game overrides


def test_game_context_override_replaces():
    assert E.resolve_effective_enum(
        media_type="game", context="ps5", active=True,
        base_enum=2, context_override=7,
    ) == 7


def test_game_override_zero_is_respected():
    assert E.resolve_effective_enum(
        media_type="game", context="switch", active=True,
        base_enum=5, context_override=0,
    ) == 0


def test_override_ignored_for_non_game():
    # context_override only applies to games.
    assert E.resolve_effective_enum(
        media_type="music", context="homepod", active=True,
        base_enum=4, context_override=9,
    ) == 4


# ----------------------------------------------------------------- stash


def test_stash_active_zero_floors_to_one():
    assert E.resolve_effective_enum(
        media_type="video", context="stash", active=True, base_enum=0
    ) == C.STASH_DEFAULT_ACTIVE_ENUM


def test_stash_mapped_enum_wins_over_floor():
    assert E.resolve_effective_enum(
        media_type="video", context="stash", active=True, base_enum=3
    ) == 3


def test_stash_offline_is_zero_not_floored():
    assert E.resolve_effective_enum(
        media_type="video", context="stash", active=False, base_enum=0
    ) == 0


def test_stash_variant_inherit_then_floor():
    # Variant inherits master 0, then stash floors to 1.
    assert E.resolve_effective_enum(
        media_type="video", context="stash", active=True,
        base_enum=0, is_variant=True, parent_enum=0,
    ) == C.STASH_DEFAULT_ACTIVE_ENUM


# --------------------------------------------------------- override lookup


def _ctx(context, source_app="", enum_override=None):
    return C.ContextRow(
        entry_id="e1", context=context, source_app=source_app,
        enum_override=enum_override,
    )


def test_find_context_override_exact_match():
    rows = [_ctx("pc"), _ctx("ps5", enum_override=7)]
    assert E.find_context_override(rows, "ps5") == 7
    assert E.find_context_override(rows, "pc") is None  # row exists, no override
    assert E.find_context_override(rows, "switch") is None  # no row


def test_find_context_override_distinguishes_source_app():
    rows = [
        _ctx("apple_tv", source_app="Plex", enum_override=4),
        _ctx("apple_tv", source_app="Jellyfin", enum_override=5),
    ]
    assert E.find_context_override(rows, "apple_tv", "Jellyfin") == 5
    assert E.find_context_override(rows, "apple_tv", "Plex") == 4
    assert E.find_context_override(rows, "apple_tv") is None  # empty source_app
