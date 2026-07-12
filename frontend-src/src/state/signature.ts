// Pure change-detection for the poll loop. The store only replaces React state
// when this signature changes, so an identical poll response causes no re-render
// (no flicker / scroll / focus loss). Drafts live in a separate map, so they are
// never touched by a skipped poll.

import type { V3Entry, V3Source } from "./types";

function sourceKey(s: V3Source): unknown[] {
  return [
    s.entry_id,
    s.online,
    s.current_key,
    s.current_enum,
    s.current_entry_id,
    s.current_artwork,
    s.entry_count,
    s.unmapped_count,
    (s.inactive_keys ?? []).join(","),
  ];
}

function entryKey(e: V3Entry): unknown[] {
  return [
    e.id,
    e.enum,
    e.hidden,
    e.reviewed,
    e.parent_id,
    e.key,
    e.last_seen,
    e.seen_count,
    e.seen_count_total,
    e.context_count,
    e.last_context,
    e.is_current,
    e.effective_enum,
    e.variants.length,
  ];
}

/** Stable signature over the fields the UI renders. Order-independent. */
export function computeSignature(
  sources: V3Source[],
  entries: V3Entry[]
): string {
  const s = [...sources]
    .sort((a, b) => a.entry_id.localeCompare(b.entry_id))
    .map(sourceKey);
  const e = [...entries].sort((a, b) => a.id.localeCompare(b.id)).map(entryKey);
  return JSON.stringify([s, e]);
}
