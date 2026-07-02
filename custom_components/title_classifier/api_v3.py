"""Pure serialisation for the v3 WebSocket/API surface (FLEET-197).

HA-free so it can be unit-tested. The HA-bound handlers (websockets_v3.py)
gather the union of catalog entries across all v3 runtimes plus the
currently-playing map, then delegate the shaping here.
"""

from __future__ import annotations

from collections.abc import Mapping

from .catalog_v3 import DEFAULT_ENUM, CatalogEntryV3, ContextRow
from .effective import resolve_effective_enum

# current map: entry_id -> (effective_enum, context, source_app)
CurrentMap = Mapping[str, tuple[int, str, str]]


def build_children_map(
    entries: Mapping[str, CatalogEntryV3],
) -> dict[str, list[CatalogEntryV3]]:
    """parent_id -> its child variants, within the given entry set."""
    out: dict[str, list[CatalogEntryV3]] = {}
    for entry in entries.values():
        if entry.parent_id:
            out.setdefault(entry.parent_id, []).append(entry)
    return out


def summarize_contexts(rows: list[ContextRow]) -> dict[str, dict]:
    """Aggregate context rows into a per-entry summary for the list view:
    distinct contexts (recency-ordered), last_context, context_count and the
    total seen_count across contexts. Pure — no DB, no guessing."""
    by_entry: dict[str, list[ContextRow]] = {}
    for row in rows:
        by_entry.setdefault(row.entry_id, []).append(row)
    out: dict[str, dict] = {}
    for entry_id, ctx_rows in by_entry.items():
        ordered = sorted(ctx_rows, key=lambda c: c.last_seen, reverse=True)
        distinct: list[str] = []
        for c in ordered:
            if c.context not in distinct:
                distinct.append(c.context)
        out[entry_id] = {
            "contexts": distinct,
            "last_context": distinct[0] if distinct else None,
            "context_count": len(distinct),
            "seen_count_total": sum(c.seen_count for c in ctx_rows),
        }
    return out


def entry_view(
    entry: CatalogEntryV3,
    *,
    children: list[CatalogEntryV3],
    is_current: bool,
    effective_enum: int | None,
    current_context: str | None,
    current_source_app: str | None,
    summary: dict | None = None,
) -> dict:
    """One catalog entry as a v3 API row."""
    return {
        "id": entry.id,
        "scope": entry.scope,
        "media_type": entry.media_type,
        "signal_type": entry.signal_type,
        "key": entry.key,
        "normalized_key": entry.normalized_key,
        "enum": entry.enum,
        "parent_id": entry.parent_id,
        "is_variant": entry.is_variant,
        "variants": [
            {"id": c.id, "key": c.key, "enum": c.enum}
            for c in sorted(children, key=lambda c: c.key.lower())
        ],
        "hidden": entry.is_hidden,
        "is_current": is_current,
        # effective_enum / context only meaningful while the entry is playing.
        "effective_enum": effective_enum if is_current else None,
        "current_context": current_context if is_current else None,
        "current_source_app": current_source_app if is_current else None,
        "first_seen": entry.first_seen,
        "last_seen": entry.last_seen,
        "seen_count": entry.seen_count,
        # Context summary (from tc_v3_entry_context), so the list shows source /
        # sighting info without a per-row entry_detail call.
        "contexts": summary["contexts"] if summary else [],
        "last_context": summary["last_context"] if summary else None,
        "context_count": summary["context_count"] if summary else 0,
        "seen_count_total": summary["seen_count_total"]
        if summary
        else entry.seen_count,
    }


def select_and_view(
    entries: Mapping[str, CatalogEntryV3],
    current: CurrentMap,
    *,
    media_type: str | None = None,
    search: str = "",
    unclassified: bool = False,
    include_hidden: bool = False,
    limit: int | None = None,
    summaries: Mapping[str, dict] | None = None,
) -> list[dict]:
    """Filter + shape the union of catalog entries for the panel.

    Hidden entries are skipped unless ``include_hidden`` OR the entry is the one
    currently playing (the is_current override, criterion 10). Unmapped-first,
    then by last_seen — same ordering the v2 panel used.
    """
    children_map = build_children_map(entries)
    needle = (search or "").lower().strip()
    out: list[dict] = []
    ordered = sorted(
        entries.values(),
        key=lambda e: (e.enum != DEFAULT_ENUM, e.last_seen),
    )
    for entry in ordered:
        if media_type and entry.media_type != media_type:
            continue
        is_current = entry.id in current
        if entry.is_hidden and not include_hidden and not is_current:
            continue
        if unclassified and entry.enum != DEFAULT_ENUM:
            continue
        if needle and needle not in entry.key.lower():
            continue
        cur = current.get(entry.id)
        out.append(
            entry_view(
                entry,
                children=children_map.get(entry.id, []),
                is_current=is_current,
                effective_enum=cur[0] if cur else None,
                current_context=cur[1] if cur else None,
                current_source_app=cur[2] if cur else None,
                summary=summaries.get(entry.id) if summaries else None,
            )
        )
        if limit and len(out) >= limit:
            break
    return out


def _ref(entry: CatalogEntryV3 | None) -> dict | None:
    if entry is None:
        return None
    return {"id": entry.id, "key": entry.key, "enum": entry.enum}


def build_entry_detail(
    entry: CatalogEntryV3,
    contexts: list[ContextRow],
    parent: CatalogEntryV3 | None,
    children: list[CatalogEntryV3],
) -> dict:
    """Full detail view for one entry (v3/entry_detail).

    ``effective_preview`` per context is the catalog-derivable effective enum
    (variant inheritance + game override, active=True). It deliberately omits
    the watcher's ``active_default_enum`` floor (e.g. stash ⇒ 1) since that lives
    in the watcher config, not the catalog — the live sensor applies it. No
    artwork is included here: artwork is live-only (per watcher/source), never
    stored on the catalog entry.
    """
    is_variant = entry.parent_id is not None
    parent_enum = parent.enum if parent is not None else None
    ctxs = []
    for c in contexts:
        preview = resolve_effective_enum(
            media_type=entry.media_type,
            context=c.context,
            active=True,
            base_enum=entry.enum,
            is_variant=is_variant,
            parent_enum=parent_enum,
            context_override=c.enum_override,
            active_default_enum=DEFAULT_ENUM,
        )
        ctxs.append(
            {
                "context": c.context,
                "source_app": c.source_app,
                "enum_override": c.enum_override,
                "seen_count": c.seen_count,
                "first_seen": c.first_seen,
                "last_seen": c.last_seen,
                "effective_preview": preview,
            }
        )
    return {
        "id": entry.id,
        "scope": entry.scope,
        "media_type": entry.media_type,
        "signal_type": entry.signal_type,
        "key": entry.key,
        "normalized_key": entry.normalized_key,
        "enum": entry.enum,
        "parent_id": entry.parent_id,
        "is_variant": is_variant,
        "hidden": entry.is_hidden,
        "first_seen": entry.first_seen,
        "last_seen": entry.last_seen,
        "seen_count": entry.seen_count,
        "parent": _ref(parent),
        "variants": [_ref(c) for c in sorted(children, key=lambda c: c.key.lower())],
        "contexts": ctxs,
    }
