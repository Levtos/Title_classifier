// Pure Inbox work-queue filter (control#27). The Inbox is exclusively the
// queue of NEW, not-yet-reviewed titles: top-level, reviewed === false, not
// ignored (hidden), not a configured inactive value. The enum is deliberately
// NOT part of the criterion — enum 0 is a valid classification and an entry
// can be closed ("Erledigt") at enum 0.
//
// `countOpenEntries` is the single shared definition of "Offen" used by the
// Inbox, the Overview header and the status bar, so all surfaces agree.

import type { Context, MediaType, SignalType } from "./types";

export interface InboxEntryLike {
  id: string;
  key: string;
  normalized_key: string;
  parent_id: string | null;
  reviewed: boolean;
  hidden: boolean;
  media_type: MediaType;
  signal_type: SignalType;
  current_context?: Context | null;
}

export interface InboxFilterOptions {
  /** Normalized inactive keys (union across watchers). */
  inactiveKeys?: ReadonlySet<string>;
  /** Also show ignored (hidden) entries — rescue toggle. */
  includeIgnored?: boolean;
  media?: MediaType | "";
  signal?: SignalType | "";
  context?: Context | "";
  search?: string;
}

/** The Inbox working set: open (unreviewed) top-level entries. */
export function filterInbox<T extends InboxEntryLike>(
  entries: T[],
  {
    inactiveKeys,
    includeIgnored = false,
    media = "",
    signal = "",
    context = "",
    search = "",
  }: InboxFilterOptions = {}
): T[] {
  const needle = search.toLowerCase().trim();
  return entries.filter((e) => {
    if (e.parent_id !== null) return false;
    if (e.reviewed) return false;
    if (!includeIgnored && e.hidden) return false;
    if (inactiveKeys?.has(e.normalized_key)) return false;
    if (media && e.media_type !== media) return false;
    if (signal && e.signal_type !== signal) return false;
    if (context && e.current_context !== context) return false;
    if (needle && !e.key.toLowerCase().includes(needle)) return false;
    return true;
  });
}

/** Canonical "Offen" count (Overview header + status bar + Inbox agree):
 *  open top-level entries that are not ignored and not inactive values. */
export function countOpenEntries(
  entries: InboxEntryLike[],
  inactiveKeys?: ReadonlySet<string>
): number {
  return filterInbox(entries, { inactiveKeys }).length;
}
