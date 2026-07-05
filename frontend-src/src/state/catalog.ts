// Pure Catalog management helpers (v3.1.0). The Catalog is the second working
// surface after the Inbox: it manages the *stock* (sort, group, hide/restore).
// These helpers are pure + unit-tested so the page stays a thin renderer.
//
// All sorts share one rule: a deterministic tiebreak (key ASC, then id ASC) so
// equal primary values never fall into a random / poll-dependent order.

import type { MediaType, SignalType } from "./types";

export type CatalogSortMode =
  | "title-asc"
  | "title-desc"
  | "newest"
  | "oldest"
  | "groups-first"
  | "masters-first"
  | "hidden-first"
  | "enum-asc"
  | "enum-desc";

export const CATALOG_SORT_MODES: { id: CatalogSortMode; label: string }[] = [
  { id: "title-asc", label: "Titel A–Z" },
  { id: "title-desc", label: "Titel Z–A" },
  { id: "newest", label: "Zuletzt gesehen — neueste" },
  { id: "oldest", label: "Zuletzt gesehen — älteste" },
  { id: "groups-first", label: "Gruppen/Varianten zuerst" },
  { id: "masters-first", label: "Master zuerst" },
  { id: "hidden-first", label: "Versteckte zuerst" },
  { id: "enum-asc", label: "Enum aufsteigend" },
  { id: "enum-desc", label: "Enum absteigend" },
];

/** Minimal shape the catalog sort needs; a tree node's master entry satisfies it
 *  (childCount = variant count, orphan = variant whose master is absent). */
export interface CatalogSortable {
  id: string;
  key: string;
  last_seen: string;
  first_seen: string;
  enum: number;
  hidden: boolean;
  childCount: number;
  orphan: boolean;
}

function ts(value: string): number {
  const t = Date.parse(value);
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}

/** Deterministic final tiebreak — key first, id as the last-resort stable key. */
function tie(a: CatalogSortable, b: CatalogSortable): number {
  return a.key.localeCompare(b.key) || a.id.localeCompare(b.id);
}

const groupRank = (a: CatalogSortable): number =>
  a.childCount > 0 || a.orphan ? 0 : 1;
const masterRank = (a: CatalogSortable): number => (a.childCount > 0 ? 0 : 1);

export function compareCatalog(
  mode: CatalogSortMode
): (a: CatalogSortable, b: CatalogSortable) => number {
  switch (mode) {
    case "title-desc":
      return (a, b) => b.key.localeCompare(a.key) || a.id.localeCompare(b.id);
    case "newest":
      return (a, b) =>
        ts(b.last_seen) - ts(a.last_seen) ||
        ts(b.first_seen) - ts(a.first_seen) ||
        tie(a, b);
    case "oldest":
      return (a, b) =>
        ts(a.last_seen) - ts(b.last_seen) ||
        ts(a.first_seen) - ts(b.first_seen) ||
        tie(a, b);
    case "groups-first":
      return (a, b) => groupRank(a) - groupRank(b) || tie(a, b);
    case "masters-first":
      return (a, b) => masterRank(a) - masterRank(b) || tie(a, b);
    case "hidden-first":
      return (a, b) => Number(b.hidden) - Number(a.hidden) || tie(a, b);
    case "enum-asc":
      return (a, b) => a.enum - b.enum || tie(a, b);
    case "enum-desc":
      return (a, b) => b.enum - a.enum || tie(a, b);
    case "title-asc":
    default:
      return (a, b) => a.key.localeCompare(b.key) || a.id.localeCompare(b.id);
  }
}

/** Non-mutating sort of catalog top-level items by mode (stable tiebreak). */
export function sortCatalog<T extends CatalogSortable>(
  items: T[],
  mode: CatalogSortMode
): T[] {
  return [...items].sort(compareCatalog(mode));
}

// --------------------------------------------------------------- row status

export type StatusTone = "ok" | "var" | "off";

export interface StatusBadge {
  key: string;
  label: string;
  tone: StatusTone;
}

export interface RowStatusInput {
  isMaster: boolean;
  childCount: number;
  isChild: boolean;
  orphan: boolean;
  hidden: boolean;
  isCurrent: boolean;
  enum: number;
}

/** Status badges for one catalog row. Deterministic order; a clean fallback (an
 *  empty array → caller renders "—") instead of undefined/null. */
export function catalogRowStatus(i: RowStatusInput): StatusBadge[] {
  const out: StatusBadge[] = [];
  if (i.isCurrent) out.push({ key: "active", label: "läuft", tone: "ok" });
  if (i.isMaster) {
    out.push({
      key: "master",
      label: `Master · ${i.childCount} ${
        i.childCount === 1 ? "Variante" : "Varianten"
      }`,
      tone: "var",
    });
  } else if (i.orphan) {
    out.push({ key: "orphan", label: "verwaiste Variante", tone: "off" });
  } else if (i.isChild) {
    out.push({ key: "variant", label: "Variante", tone: "var" });
  }
  if (i.hidden) out.push({ key: "hidden", label: "Versteckt", tone: "off" });
  if (!i.isChild && !i.isMaster && i.enum === 0) {
    out.push({ key: "unsorted", label: "Enum 0", tone: "off" });
  }
  return out;
}

// ----------------------------------------------------------- master targets

export interface MasterCandidateLike {
  id: string;
  key: string;
  scope: string;
  media_type: MediaType;
  signal_type: SignalType;
  parent_id: string | null;
}

/** Valid masters ``child`` may be grouped under — mirrors the backend
 *  assert_can_set_parent guard: same scope / media_type / signal_type, the
 *  target is itself top-level (parent_id === null), and not the child. The
 *  "child has no children" rule is enforced by the caller only offering this for
 *  non-masters. Key-sorted for a stable dropdown. */
export function masterCandidates<T extends MasterCandidateLike>(
  all: T[],
  child: MasterCandidateLike
): T[] {
  return all
    .filter(
      (e) =>
        e.id !== child.id &&
        e.parent_id === null &&
        e.scope === child.scope &&
        e.media_type === child.media_type &&
        e.signal_type === child.signal_type
    )
    .sort((a, b) => a.key.localeCompare(b.key));
}
