"""Effective-enum resolver for the v3 catalog (FLEET-194).

Pure and HA-free — the single source of truth for turning a raw catalog enum
into the value downstream policies actually react to. Both the runtime (entity
state) and the WebSocket/API layer must route every effective-enum decision
through here, so the logic lives in exactly one place.

Resolution order (fixed):
  1. Online gate — offline / no active title ⇒ DEFAULT_ENUM (0). "Nothing is
     playing" is always 0.
  2. Variant inheritance — a child (variant) inherits its master's enum, but
     only for ``music`` and ``video``. ``game`` variants do NOT inherit; games
     express per-context intent via overrides instead (criterion 8).
  3. Game context override — ``media_type == 'game'`` with an ``enum_override``
     for the active context replaces the value (criterion 7).
  4. Stash floor — ``context == 'stash'`` with an active title and an otherwise
     effective 0 floors to 1; a non-zero entry enum wins (criterion 6).
"""

from __future__ import annotations

from collections.abc import Iterable

from .catalog_v3 import (
    CONTEXT_STASH,
    DEFAULT_ENUM,
    NO_SOURCE_APP,
    STASH_DEFAULT_ACTIVE_ENUM,
    ContextRow,
)

_INHERITING_MEDIA_TYPES = ("music", "video")


def resolve_effective_enum(
    *,
    media_type: str,
    context: str,
    active: bool,
    base_enum: int,
    is_variant: bool = False,
    parent_enum: int | None = None,
    context_override: int | None = None,
) -> int:
    """Compute the effective enum for one active observation.

    Args:
        media_type: ``music`` | ``game`` | ``video``.
        context: the active context (``homepod``/``pc``/.../``stash``).
        active: online AND a title/key is currently present. False ⇒ 0.
        base_enum: the entry's own raw catalog enum.
        is_variant: whether the entry is a child of a master.
        parent_enum: the master's enum (only consulted for music/video variants).
        context_override: ``enum_override`` for the active context (games only).
    """
    # 1. Online gate — nothing playing is always 0.
    if not active:
        return DEFAULT_ENUM

    enum = base_enum

    # 2. Variant inheritance (music & video only).
    if (
        is_variant
        and parent_enum is not None
        and media_type in _INHERITING_MEDIA_TYPES
    ):
        enum = parent_enum

    # 3. Game context override.
    if media_type == "game" and context_override is not None:
        enum = context_override

    # 4. Stash floor — active stash title with effective 0 ⇒ 1.
    if context == CONTEXT_STASH and enum == DEFAULT_ENUM:
        enum = STASH_DEFAULT_ACTIVE_ENUM

    return enum


def find_context_override(
    context_rows: Iterable[ContextRow],
    context: str,
    source_app: str = NO_SOURCE_APP,
) -> int | None:
    """Return the ``enum_override`` for ``(context, source_app)``, or None.

    Exact match on both components — ``source_app`` distinguishes e.g. Plex vs
    Jellyfin on apple_tv. Returns None when no row matches or the matched row
    carries no override.
    """
    for row in context_rows:
        if row.context == context and row.source_app == source_app:
            return row.enum_override
    return None
