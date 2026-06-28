"""Pure-helper tests for the Title Classifier module.

Covers key extraction, media duplicate resolution, scoring, and
user-input normalisation — everything that decides whether two
different player reports map to the same classifiable key.
"""

from __future__ import annotations

import asyncio

import pytest

import tc_runtime as R
import tc_storage as S


class _FakeStore:
    """Minimal store double exposing the .entries surface dedupe reads."""

    def __init__(self, entries):
        self.entries = entries
        self.merged = []

    async def async_merge_keys(self, target_key, source_keys):
        self.merged.append((target_key, list(source_keys)))


def _runtime_with_entries(entries):
    runtime = R.WatcherRuntime.__new__(R.WatcherRuntime)
    runtime.store = _FakeStore(entries)
    return runtime


# --------------------------------------------------------------- clean_value


@pytest.mark.parametrize("raw", ["", "Unknown", "unavailable", "none", "off", "idle", "standby"])
def test_clean_value_drops_idle_markers(raw):
    assert R.clean_value(raw) is None


def test_clean_value_strips_and_keeps():
    assert R.clean_value("  Stardew Valley  ") == "Stardew Valley"
    assert R.clean_value(None) is None
    assert R.clean_value(0) == "0"  # numeric coerced to str, not in IGNORED


# ---------------------------------------------------------------- split_key


def test_split_media_key_with_artist():
    assert R.split_media_key("Daft Punk - Around the World") == (
        "Daft Punk", "Around the World"
    )


def test_split_media_key_without_artist():
    assert R.split_media_key("Standalone Title") == ("", "Standalone Title")


# -------------------------------------------------------------- normalise


def test_normalise_artist_drops_features():
    assert R.normalise_artist("Daft Punk feat. Pharrell Williams") == "daft punk"
    assert R.normalise_artist("Daft Punk & Pharrell") == "daft punk"
    assert R.normalise_artist("Daft Punk, Pharrell") == "daft punk"


def test_normalise_title_drops_brackets():
    assert R.normalise_title("Get Lucky (Radio Edit)") == "get lucky"


# ----------------------------------------------------------- duplicate match


def test_media_keys_match_for_same_song_different_metadata():
    a = "Daft Punk feat. Pharrell - Get Lucky"
    b = "Daft Punk - Get Lucky (Radio Edit)"
    assert R.media_keys_match(a, b)


def test_media_keys_no_match_for_different_titles():
    assert not R.media_keys_match(
        "Daft Punk - Get Lucky",
        "Daft Punk - One More Time",
    )


def test_media_keys_no_match_for_different_artists():
    assert not R.media_keys_match(
        "Daft Punk - Get Lucky",
        "Justice - Get Lucky",
    )


# ------------------------------------------------------------------ scoring


def test_media_title_score_prefers_remix_marker():
    plain = R.media_title_score("Get Lucky")
    remix = R.media_title_score("Get Lucky (Radio Edit)")
    assert remix > plain


def test_media_key_score_prefers_feature_artist():
    plain = R.media_key_score("Daft Punk - Get Lucky")
    feat = R.media_key_score("Daft Punk feat. Pharrell - Get Lucky")
    assert feat > plain


# ----------------------------------------------------------------- normalise


def test_normalise_user_key_strips_and_validates():
    assert R.normalise_user_key("  Helldivers  ") == "Helldivers"
    # ServiceValidationError comes through our stubbed homeassistant.exceptions.
    with pytest.raises(R.ServiceValidationError):
        R.normalise_user_key("   ")


def test_seen_write_throttle_skips_unchanged_recent_state():
    runtime = R.WatcherRuntime.__new__(R.WatcherRuntime)
    signature = ("pc", "Artist", "Title", None, None, None, None)
    runtime._last_seen_key = "Artist - Title"
    runtime._last_seen_signature = signature
    runtime._last_seen_write_at = R.dt_util.utcnow()

    assert runtime._should_skip_seen_write("Artist - Title", signature)


def test_duplicate_groups_collapses_paren_variants():
    plain = "Teddy Swims - Mr. Know It All"
    remix = "Teddy Swims - Mr. Know It All (DJ Dark Remix)"
    other = "Daft Punk - Get Lucky"
    entries = {
        plain: S.MapperEntry(key=plain, seen_count=5),
        remix: S.MapperEntry(key=remix, seen_count=2),
        other: S.MapperEntry(key=other, seen_count=1),
    }
    groups = _runtime_with_entries(entries)._duplicate_groups()
    assert len(groups) == 1
    assert set(groups[0]) == {plain, remix}


def test_dedupe_dry_run_keeps_most_played_canonical():
    plain = "Teddy Swims - Mr. Know It All"
    remix = "Teddy Swims - Mr. Know It All (DJ Dark Remix)"
    entries = {
        plain: S.MapperEntry(key=plain, seen_count=5),
        remix: S.MapperEntry(key=remix, seen_count=2),
    }
    runtime = _runtime_with_entries(entries)
    report = asyncio.run(runtime.async_dedupe_catalog(dry_run=True))
    assert report["groups"] == 1
    assert report["duplicates"] == 1
    assert report["merged"] == 0
    # Most-played variant survives; nothing written on a dry run.
    assert report["preview"][0]["target"] == plain
    assert report["preview"][0]["sources"] == [remix]
    assert runtime.store.merged == []


def test_seen_write_throttle_allows_changed_title():
    runtime = R.WatcherRuntime.__new__(R.WatcherRuntime)
    runtime._last_seen_key = "Artist - Old"
    runtime._last_seen_signature = ("pc", "Artist", "Old", None, None, None, None)
    runtime._last_seen_write_at = R.dt_util.utcnow()

    assert not runtime._should_skip_seen_write(
        "Artist - New", ("pc", "Artist", "New", None, None, None, None)
    )
