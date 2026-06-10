"""FLEET-43 — Stash-Auto-Enum (inverse Semantik ggü. Spiel/Musik).

Titel vorhanden ⇒ enum >= 1 automatisch, ohne Katalogpflege. Enum 0 ist allein
dem „nichts läuft"-Zustand vorbehalten (kein Titel / Offline-Fallback). Ein
manuell gemapptes Katalog-Enum > 1 gewinnt weiterhin. Andere Kategorien
behalten die klassische Semantik (Enum 0 = Default-/Leerwert mit Katalog).
"""

from __future__ import annotations

from types import SimpleNamespace

import tc_const as C
import tc_runtime as R


class _FakeStore:
    def __init__(self, enums: dict[str, int] | None = None):
        self._enums = enums or {}

    def get_enum(self, key):
        if not key or key not in self._enums:
            return C.DEFAULT_ENUM
        return self._enums[key]


def _make_runtime(category: str, enums: dict[str, int] | None = None):
    entry = SimpleNamespace(
        data={C.CONF_CATEGORY: category, C.CONF_WATCHER_TYPE: "media"},
        options={},
    )
    return R.WatcherRuntime(None, entry, _FakeStore(enums))


# ------------------------------------------------------------ stash semantics


def test_stash_unmapped_title_floors_to_active():
    rt = _make_runtime("stash")
    rt.current_key = "Some Scene Title"
    rt.refresh_current_enum()
    assert rt.current_enum == C.STASH_ACTIVE_ENUM


def test_stash_mapped_enum_above_floor_wins():
    rt = _make_runtime("stash", {"Some Scene Title": 3})
    rt.current_key = "Some Scene Title"
    rt.refresh_current_enum()
    assert rt.current_enum == 3


def test_stash_catalog_zero_is_still_floored():
    # Auch ein explizit auf 0 gemappter Katalogeintrag wird angehoben:
    # Enum 0 ist bei Stash dem „nichts läuft"-Zustand vorbehalten.
    rt = _make_runtime("stash", {"Some Scene Title": 0})
    rt.current_key = "Some Scene Title"
    rt.refresh_current_enum()
    assert rt.current_enum == C.STASH_ACTIVE_ENUM


def test_stash_no_title_stays_none():
    rt = _make_runtime("stash")
    rt.current_key = None
    rt.refresh_current_enum()
    assert rt.current_enum is None


def test_stash_offline_fallback_is_zero():
    # Offline (online_entity aus, z.B. stash_active_streams == "0")
    # → „nichts läuft" → Enum 0, kein Floor.
    rt = _make_runtime("stash")
    rt.current_key = "Some Scene Title"
    rt.current_enum = C.STASH_ACTIVE_ENUM
    rt._apply_offline_fallback()
    assert rt.current_key is None
    assert rt.current_enum == C.DEFAULT_ENUM


# -------------------------------------------------- other categories unchanged


def test_game_unmapped_title_stays_default():
    rt = _make_runtime("game")
    rt.current_key = "Stardew Valley"
    rt.refresh_current_enum()
    assert rt.current_enum == C.DEFAULT_ENUM


def test_music_unmapped_title_stays_default():
    rt = _make_runtime("music")
    rt.current_key = "Daft Punk - Around the World"
    rt.refresh_current_enum()
    assert rt.current_enum == C.DEFAULT_ENUM
