// Pure catalog tree + tab/filter helpers. Master/variant structure comes from
// parent_id (the authoritative relation); per-entry contexts/overrides are NOT
// built here — those are lazy-loaded per selection via v3/entry_detail.

import type { MediaType, SignalType } from "./types";

export type CatalogTab = "all" | "unsorted" | "groups" | "hidden";

// Minimal shape the tree/filter logic needs; DisplayEntry satisfies it.
export interface CatalogEntryLike {
  id: string;
  key: string;
  parent_id: string | null;
  media_type: MediaType;
  signal_type: SignalType;
  hidden: boolean;
}

export interface CatalogNode<T extends CatalogEntryLike> {
  entry: T;
  children: T[];
  /** parent_id is set but the master is not in the current set. */
  orphan: boolean;
}

function byKey<T extends CatalogEntryLike>(a: T, b: T): number {
  return a.key.localeCompare(b.key);
}

/** Build a one-level master → children tree. Children with a present parent are
 * nested (never top-level); children whose parent is missing surface as orphan
 * top-level nodes so nothing is lost. Masters and children are key-sorted. */
export function buildCatalogTree<T extends CatalogEntryLike>(
  entries: T[]
): CatalogNode<T>[] {
  const ids = new Set(entries.map((e) => e.id));
  const childrenOf = new Map<string, T[]>();
  for (const e of entries) {
    if (e.parent_id) {
      const arr = childrenOf.get(e.parent_id) ?? [];
      arr.push(e);
      childrenOf.set(e.parent_id, arr);
    }
  }
  const nodes: CatalogNode<T>[] = [];
  for (const e of entries) {
    if (e.parent_id === null) {
      nodes.push({
        entry: e,
        children: (childrenOf.get(e.id) ?? []).slice().sort(byKey),
        orphan: false,
      });
    } else if (!ids.has(e.parent_id)) {
      nodes.push({ entry: e, children: [], orphan: true });
    }
    // else: child with a present parent → rendered under its master.
  }
  return nodes.sort((a, b) => byKey(a.entry, b.entry));
}

/** Structural tab selection over the FULL entry set (filter-independent). */
export function selectByTab<T extends CatalogEntryLike>(
  all: T[],
  tab: CatalogTab
): T[] {
  const parentIds = new Set(
    all.filter((e) => e.parent_id).map((e) => e.parent_id as string)
  );
  switch (tab) {
    case "unsorted":
      // No parent and not a master (no children referencing it).
      return all.filter((e) => e.parent_id === null && !parentIds.has(e.id));
    case "groups": {
      const masters = new Set(
        all
          .filter((e) => e.parent_id === null && parentIds.has(e.id))
          .map((e) => e.id)
      );
      return all.filter(
        (e) => masters.has(e.id) || (e.parent_id !== null && masters.has(e.parent_id))
      );
    }
    case "hidden":
      return all.filter((e) => e.hidden);
    case "all":
    default:
      return all;
  }
}

export interface CatalogTextFilter {
  search?: string;
  media?: MediaType | "";
  signal?: SignalType | "";
}

export function filterCatalog<T extends CatalogEntryLike>(
  entries: T[],
  { search = "", media = "", signal = "" }: CatalogTextFilter
): T[] {
  const q = search.toLowerCase().trim();
  return entries.filter((e) => {
    if (media && e.media_type !== media) return false;
    if (signal && e.signal_type !== signal) return false;
    if (q && !e.key.toLowerCase().includes(q)) return false;
    return true;
  });
}
