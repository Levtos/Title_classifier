// Pure Inbox/Catalog sort helpers. Timestamps compared numerically; missing /
// invalid values sort to the bottom under newest-first.

export interface InboxSortable {
  key: string;
  last_seen: string;
  first_seen: string;
}

export type SortMode = "newest" | "oldest" | "title";

function ts(value: string): number {
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}

export function compareInbox(a: InboxSortable, b: InboxSortable): number {
  const la = ts(a.last_seen);
  const lb = ts(b.last_seen);
  if (la !== lb) return lb - la; // last_seen DESC (newest first)
  const fa = ts(a.first_seen);
  const fb = ts(b.first_seen);
  if (fa !== fb) return fb - fa; // first_seen DESC
  return a.key.localeCompare(b.key); // key ASC (stable tiebreak)
}

function compareOldest(a: InboxSortable, b: InboxSortable): number {
  const la = ts(a.last_seen);
  const lb = ts(b.last_seen);
  if (la !== lb) return la - lb; // last_seen ASC
  const fa = ts(a.first_seen);
  const fb = ts(b.first_seen);
  if (fa !== fb) return fa - fb; // first_seen ASC
  return a.key.localeCompare(b.key);
}

function compareTitle(a: InboxSortable, b: InboxSortable): number {
  const byKey = a.key.localeCompare(b.key);
  return byKey !== 0 ? byKey : compareInbox(a, b);
}

/** Newest-first (default). */
export function sortInbox<T extends InboxSortable>(entries: T[]): T[] {
  return [...entries].sort(compareInbox);
}

export function sortEntries<T extends InboxSortable>(
  entries: T[],
  mode: SortMode
): T[] {
  const cmp =
    mode === "oldest"
      ? compareOldest
      : mode === "title"
        ? compareTitle
        : compareInbox;
  return [...entries].sort(cmp);
}
