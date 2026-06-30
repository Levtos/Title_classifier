"""Pure v3 import/export + context-merge helpers (FLEET-182).

HA-free and image-free: the export payload carries catalog entries, their
master/variant structure (as the parent's normalized_key, so it survives id
regeneration), contexts, enum overrides, hidden_at and optional telemetry — but
never cover URLs or image bytes. Import validation is pure so it is fully tested
before any DB write.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping

from .catalog_v3 import (
    CONTEXTS,
    MAX_ENUM,
    MEDIA_TYPES,
    MIN_ENUM,
    SIGNAL_TYPES,
    CatalogEntryV3,
    ContextRow,
    context_allowed_for,
    normalize_key,
)

EXPORT_VERSION = 3


def _ctx_record(ctx: ContextRow, *, include_telemetry: bool) -> dict:
    rec = {
        "context": ctx.context,
        "source_app": ctx.source_app,
        "enum_override": ctx.enum_override,
    }
    if include_telemetry:
        rec["telemetry"] = {
            "first_seen": ctx.first_seen,
            "last_seen": ctx.last_seen,
            "seen_count": ctx.seen_count,
        }
    return rec


def build_export_payload(
    entries: Iterable[CatalogEntryV3],
    contexts_by_entry: Mapping[str, list[ContextRow]],
    *,
    include_telemetry: bool = True,
) -> dict:
    """Shape a full, image-free v3 export document."""
    entries = list(entries)
    by_id = {e.id: e for e in entries}
    records = []
    for entry in entries:
        parent = by_id.get(entry.parent_id) if entry.parent_id else None
        rec = {
            "key": entry.key,
            "normalized_key": entry.normalized_key,
            "scope": entry.scope,
            "media_type": entry.media_type,
            "signal_type": entry.signal_type,
            "enum": entry.enum,
            "hidden_at": entry.hidden_at,
            # Parent referenced by its normalized_key (id-independent).
            "parent_key": parent.normalized_key if parent is not None else None,
            "contexts": [
                _ctx_record(c, include_telemetry=include_telemetry)
                for c in contexts_by_entry.get(entry.id, [])
            ],
        }
        if include_telemetry:
            rec["telemetry"] = {
                "first_seen": entry.first_seen,
                "last_seen": entry.last_seen,
                "seen_count": entry.seen_count,
            }
        records.append(rec)
    return {"version": EXPORT_VERSION, "entries": records}


_IMAGE_KEYS = ("cover_url", "cover_source", "image", "artwork", "entity_picture")


def validate_import_record(record: dict) -> list[str]:
    """Return a list of validation errors for one import record (empty = ok)."""
    errors: list[str] = []
    key = str(record.get("key") or record.get("normalized_key") or "").strip()
    if not key:
        errors.append("missing key")
    media_type = record.get("media_type")
    if media_type not in MEDIA_TYPES:
        errors.append(f"invalid media_type {media_type!r}")
    if record.get("signal_type") not in SIGNAL_TYPES:
        errors.append(f"invalid signal_type {record.get('signal_type')!r}")
    enum = record.get("enum", 0)
    if not isinstance(enum, int) or not (MIN_ENUM <= enum <= MAX_ENUM):
        errors.append(f"invalid enum {enum!r}")
    # Image data must never be imported.
    for bad in _IMAGE_KEYS:
        if record.get(bad):
            errors.append(f"image data not allowed ({bad})")
    for ctx in record.get("contexts", []) or []:
        c = ctx.get("context")
        if c not in CONTEXTS:
            errors.append(f"invalid context {c!r}")
        elif media_type in MEDIA_TYPES and not context_allowed_for(media_type, c):
            errors.append(f"context {c!r} not allowed for media_type {media_type!r}")
        ov = ctx.get("enum_override")
        if ov is not None and (not isinstance(ov, int) or not (MIN_ENUM <= ov <= MAX_ENUM)):
            errors.append(f"invalid enum_override {ov!r}")
        for bad in _IMAGE_KEYS:
            if ctx.get(bad):
                errors.append(f"image data not allowed in context ({bad})")
    return errors


def import_identity(record: dict, default_scope: str) -> tuple[str, str, str, str]:
    """The (scope, media_type, signal_type, normalized_key) identity of a record."""
    nkey = record.get("normalized_key") or normalize_key(record.get("key", ""))
    return (
        record.get("scope") or default_scope,
        record["media_type"],
        record["signal_type"],
        nkey,
    )


def _min_iso(a: str, b: str) -> str:
    vals = [v for v in (a, b) if v]
    return min(vals) if vals else (a or b)


def _max_iso(a: str, b: str) -> str:
    vals = [v for v in (a, b) if v]
    return max(vals) if vals else (a or b)


def merge_context_telemetry(src: ContextRow, tgt: ContextRow) -> dict:
    """Merge a source context row into a target (set_context onto an existing one).

    seen_count adds, first_seen=min, last_seen=max. enum_override is only taken
    from the source when the target has none; if both are set and differ it is a
    conflict (target value kept, ``override_conflict`` flagged) — the merge still
    proceeds for telemetry.
    """
    if tgt.enum_override is None:
        override = src.enum_override
        conflict = False
    elif src.enum_override is None or src.enum_override == tgt.enum_override:
        override = tgt.enum_override
        conflict = False
    else:
        override = tgt.enum_override
        conflict = True
    return {
        "seen_count": src.seen_count + tgt.seen_count,
        "first_seen": _min_iso(src.first_seen, tgt.first_seen),
        "last_seen": _max_iso(src.last_seen, tgt.last_seen),
        "enum_override": override,
        "override_conflict": conflict,
    }
