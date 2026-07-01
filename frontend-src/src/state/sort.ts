// Pure Inbox sort: newest first. last_seen DESC, then first_seen DESC, then key
// ASC for a stable order. Missing/invalid timestamps sort to the bottom.

export interface InboxSortable {
  key: string;
  last_seen: string;
  first_seen: string;
}

function ts(value: string): number {
  const t = new Date(value).getTime();
  // Invalid / missing → -Infinity so it sorts last under DESC ordering.
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}

export function compareInbox(a: InboxSortable, b: InboxSortable): number {
  const la = ts(a.last_seen);
  const lb = ts(b.last_seen);
  if (la !== lb) return lb - la; // last_seen DESC
  const fa = ts(a.first_seen);
  const fb = ts(b.first_seen);
  if (fa !== fb) return fb - fa; // first_seen DESC
  return a.key.localeCompare(b.key); // key ASC (stable tiebreak)
}

export function sortInbox<T extends InboxSortable>(entries: T[]): T[] {
  return [...entries].sort(compareInbox);
}
