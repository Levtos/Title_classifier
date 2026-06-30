"""v3 media-catalog core — pure, HA-free identity + variant rules (FLEET-193).

This module deliberately imports nothing from Home Assistant or asyncpg so it
can be unit-tested standalone (see tests/test_catalog_v3.py). The Postgres I/O
lives in store_v3.py, which builds on the helpers here.

Identity (v3) is media-centric:
    (scope, media_type, signal_type, normalized_key)
`context` is NOT identity — it is an observation/override dimension carried by
:class:`ContextRow` / tc_v3_entry_context.
"""

from __future__ import annotations

from dataclasses import dataclass, field
import re
import uuid
from datetime import datetime
from typing import Any

# ---------------------------------------------------------------- vocabularies

MEDIA_TYPES: tuple[str, ...] = ("music", "game", "video")
CONTEXTS: tuple[str, ...] = ("homepod", "pc", "ps5", "switch", "stash", "apple_tv")
SIGNAL_TYPES: tuple[str, ...] = ("title", "app")

DEFAULT_SCOPE = "default"
DEFAULT_ENUM = 0
MIN_ENUM = 0
MAX_ENUM = 9

# Which media_type(s) each context can legitimately carry, by device semantics.
# Used to validate reclassify (set_media_type) and context moves (set_context);
# `pc` is multi-purpose. seen() itself is not gated by this (the watcher's
# configured axes are trusted) — only the corrective operations are.
CONTEXT_MEDIA_TYPES: dict[str, tuple[str, ...]] = {
    "homepod": ("music",),
    "pc": ("music", "game", "video"),
    "ps5": ("game",),
    "switch": ("game",),
    "stash": ("video",),
    "apple_tv": ("video",),
}

# Stash inverse semantics: an active title floors the effective enum to 1 when
# the entry itself is still the default 0 (resolved in effective.py, FLEET-194).
CONTEXT_STASH = "stash"
STASH_DEFAULT_ACTIVE_ENUM = 1

# Empty source-app sentinel (PK component, never NULL).
NO_SOURCE_APP = ""


def new_id() -> str:
    """Fresh catalog id — generated in Python (uuid4), never by the DB.

    Returned as ``str``; asyncpg accepts the canonical string form for uuid
    columns and the tests stay driver-free.
    """
    return str(uuid.uuid4())


# ----------------------------------------------------------------- normalising

_NON_ALNUM = re.compile(r"[^a-z0-9]+")


def normalize_key(raw: str) -> str:
    """Canonical identity key: lowercase, non-alphanumerics → single space.

    Deterministic and separator-agnostic, so ``"Daft Punk - One More Time"`` and
    ``"daft punk  one more time"`` collapse to the same identity. Display stays
    in the raw ``key`` column; this value only drives the UNIQUE identity.
    """
    return _NON_ALNUM.sub(" ", str(raw).lower()).strip()


def validate_media_type(value: str) -> str:
    if value not in MEDIA_TYPES:
        raise ValueError(f"unknown media_type {value!r} (expected {MEDIA_TYPES})")
    return value


def validate_signal_type(value: str) -> str:
    if value not in SIGNAL_TYPES:
        raise ValueError(f"unknown signal_type {value!r} (expected {SIGNAL_TYPES})")
    return value


def validate_context(value: str) -> str:
    if value not in CONTEXTS:
        raise ValueError(f"unknown context {value!r} (expected {CONTEXTS})")
    return value


def clamp_enum(value: int) -> int:
    return max(MIN_ENUM, min(MAX_ENUM, int(value)))


def context_allowed_for(media_type: str, context: str) -> bool:
    """Whether ``context`` may carry ``media_type`` (device semantics)."""
    return media_type in CONTEXT_MEDIA_TYPES.get(context, ())


def allowed_contexts(media_type: str) -> tuple[str, ...]:
    """Contexts that may carry ``media_type``."""
    return tuple(
        ctx for ctx, mts in CONTEXT_MEDIA_TYPES.items() if media_type in mts
    )


# -------------------------------------------------------------------- entities


@dataclass(slots=True)
class CatalogEntryV3:
    """One row of tc_v3_catalog."""

    id: str
    scope: str
    media_type: str
    signal_type: str
    normalized_key: str
    key: str
    enum: int = DEFAULT_ENUM
    parent_id: str | None = None
    artist: str | None = None
    title: str | None = None
    album: str | None = None
    app_name: str | None = None
    first_seen: str = ""
    last_seen: str = ""
    seen_count: int = 0
    hidden_at: str | None = None
    updated_by: str | None = None

    @property
    def is_variant(self) -> bool:
        """A child of some master (parent_id set)."""
        return self.parent_id is not None

    @property
    def is_hidden(self) -> bool:
        """Manually hidden/archived (hidden_at set)."""
        return bool(self.hidden_at)

    @property
    def identity(self) -> tuple[str, str, str, str]:
        return (self.scope, self.media_type, self.signal_type, self.normalized_key)

    def as_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "scope": self.scope,
            "media_type": self.media_type,
            "signal_type": self.signal_type,
            "normalized_key": self.normalized_key,
            "key": self.key,
            "enum": self.enum,
            "parent_id": self.parent_id,
            "artist": self.artist,
            "title": self.title,
            "album": self.album,
            "app_name": self.app_name,
            "first_seen": self.first_seen,
            "last_seen": self.last_seen,
            "seen_count": self.seen_count,
            "hidden_at": self.hidden_at,
        }


@dataclass(slots=True)
class ContextRow:
    """One row of tc_v3_entry_context (observation + optional override)."""

    entry_id: str
    context: str
    source_app: str = NO_SOURCE_APP
    enum_override: int | None = None
    first_seen: str = ""
    last_seen: str = ""
    seen_count: int = 0
    last_watcher_id: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {
            "entry_id": self.entry_id,
            "context": self.context,
            "source_app": self.source_app,
            "enum_override": self.enum_override,
            "first_seen": self.first_seen,
            "last_seen": self.last_seen,
            "seen_count": self.seen_count,
        }


# ------------------------------------------------------------- variant guard


class ParentGuardError(ValueError):
    """Raised when a requested parent_id link would violate the variant rules."""


def assert_can_set_parent(
    *,
    child: CatalogEntryV3,
    parent: CatalogEntryV3,
    parent_has_parent: bool,
    child_has_children: bool,
) -> None:
    """Enforce the one-level master/variant rules before linking a child.

    Rules (FLEET-177, bestätigt):
      * a row cannot be its own parent;
      * parent shares scope, media_type and signal_type (signal_type is part of
        identity, so variants of mixed signal types are disallowed);
      * only one level: the parent must not itself be a child
        (``parent_has_parent``), and the child must not already be a master with
        children (``child_has_children``).
    """
    if child.id == parent.id:
        raise ParentGuardError("an entry cannot be its own parent")
    if child.scope != parent.scope:
        raise ParentGuardError(
            f"parent scope {parent.scope!r} != child scope {child.scope!r}"
        )
    if child.media_type != parent.media_type:
        raise ParentGuardError(
            f"parent media_type {parent.media_type!r} != child {child.media_type!r}"
        )
    if child.signal_type != parent.signal_type:
        raise ParentGuardError(
            f"parent signal_type {parent.signal_type!r} != child {child.signal_type!r}"
        )
    if parent_has_parent:
        raise ParentGuardError(
            "parent is itself a variant — only one master/variant level allowed"
        )
    if child_has_children:
        raise ParentGuardError(
            "child is a master with its own variants — cannot become a variant"
        )
