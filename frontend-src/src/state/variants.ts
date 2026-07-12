// Pure variant-candidate detection: a FRONTEND-only hint that two catalog
// entries might be variants of the same track/game. It never groups or assigns
// parent/child — the user decides. Marked entries get a badge + cluster size.

import type { MediaType, SignalType } from "./types";

export interface VariantInput {
  id: string;
  key: string;
  media_type: MediaType;
  signal_type: SignalType;
  hidden: boolean;
  parent_id: string | null;
}

export interface CandidateInfo {
  candidate: boolean;
  clusterSize: number;
}

const FEAT = /\s+(?:feat\.?|ft\.?|featuring)\s+/i;

function words(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function artistSeed(artist: string): string {
  const primary = artist.split(FEAT)[0].split(/\s*[&,]\s*/)[0];
  return words(primary).slice(0, 2).join(" ");
}

function titleSeed(title: string): string {
  const noParens = title.replace(/\([^)]*\)/g, " ");
  return words(noParens).slice(0, 3).join(" ");
}

/** artist_seed|title_seed. `Artist - Title` is parsed; without ` - ` the whole
 * key is the title. */
export function candidateKey(key: string): string {
  const idx = key.indexOf(" - ");
  const artist = idx >= 0 ? key.slice(0, idx) : "";
  const title = idx >= 0 ? key.slice(idx + 3) : key;
  return `${artistSeed(artist)}|${titleSeed(title)}`;
}

export interface ClusterInput extends VariantInput {
  normalized_key: string;
  variants: { id: string }[];
  seen_count_total: number;
  first_seen: string;
}

export interface ClusterPick {
  /** entry_ids of the chosen cluster (>= 2). */
  ids: string[];
  /** Pre-selected master entry_id. */
  masterId: string;
  /** Human-readable "why these were suggested" hint. */
  reason: string;
}

function collectClusters(rows: ClusterInput[]): ClusterInput[][] {
  const clusters = new Map<string, ClusterInput[]>();
  for (const e of rows) {
    if (e.hidden) continue; // never use hidden entries (matches candidate logic)
    if (e.parent_id !== null) continue; // top-level only
    const ck = candidateKey(e.key);
    if (ck === "|") continue; // no usable seed
    const clusterKey = `${e.media_type}|${e.signal_type}|${ck}`;
    const arr = clusters.get(clusterKey) ?? [];
    arr.push(e);
    clusters.set(clusterKey, arr);
  }
  // Map preserves first-appearance order → deterministic, respects the view.
  return [...clusters.values()].filter((members) => members.length >= 2);
}

function toPick(members: ClusterInput[]): ClusterPick {
  const master = pickMaster(members);
  return {
    ids: members.map((e) => e.id),
    masterId: master.id,
    reason: `${members.length} wahrscheinliche Varianten von „${master.key}".`,
  };
}

/** Pick the single best variant cluster from the *visible* rows and prepare a
 *  group-dialog selection — the Varianten-Assistent. Never groups; just returns
 *  what to select + which master to preselect + why. Pure & testable.
 *
 *  Selection: the largest cluster; ties keep the one appearing first in the
 *  given (already filtered/sorted) row order — deterministic, respects the view.
 *  Master: an existing master (has variants) wins; otherwise the most-seen /
 *  oldest / shortest-key entry, tie-broken by id for stability. */
export function pickBestCluster(rows: ClusterInput[]): ClusterPick | null {
  // Largest cluster; we only replace on strictly greater size, so a size tie
  // keeps the earliest-in-view cluster.
  let best: ClusterInput[] | null = null;
  for (const members of collectClusters(rows)) {
    if (best === null || members.length > best.length) best = members;
  }
  return best === null ? null : toPick(best);
}

/** EVERY candidate cluster in the given rows, largest first (ties keep the
 *  first-appearance order) — the work list for the continuous variant queue
 *  mode. Same cluster/master rules as pickBestCluster. Pure & testable. */
export function pickAllClusters(rows: ClusterInput[]): ClusterPick[] {
  return collectClusters(rows)
    .map((members, order) => ({ members, order }))
    .sort((a, b) => b.members.length - a.members.length || a.order - b.order)
    .map(({ members }) => toPick(members));
}

function pickMaster(members: ClusterInput[]): ClusterInput {
  return [...members].sort(compareMasterPreference)[0];
}

/** Lower = preferred master. Existing master (has variants) first, then most
 *  seen, then oldest, then shortest normalized key, then id for stability. */
function compareMasterPreference(a: ClusterInput, b: ClusterInput): number {
  const am = a.variants.length > 0 ? 1 : 0;
  const bm = b.variants.length > 0 ? 1 : 0;
  if (am !== bm) return bm - am; // masters first
  if (a.seen_count_total !== b.seen_count_total)
    return b.seen_count_total - a.seen_count_total; // most seen
  if (a.first_seen !== b.first_seen)
    return a.first_seen < b.first_seen ? -1 : 1; // oldest first
  if (a.normalized_key.length !== b.normalized_key.length)
    return a.normalized_key.length - b.normalized_key.length; // shortest key
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; // stable tie-break
}

export function markVariantCandidates<T extends VariantInput>(
  entries: T[]
): Map<string, CandidateInfo> {
  const clusters = new Map<string, string[]>();
  const clusterOf = new Map<string, string>();

  for (const e of entries) {
    if (e.hidden) continue; // ignore hidden/inactive
    if (e.parent_id !== null) continue; // already-grouped children are not candidates
    const ck = candidateKey(e.key);
    if (ck === "|") continue; // no usable seeds
    const clusterKey = `${e.media_type}|${e.signal_type}|${ck}`;
    const arr = clusters.get(clusterKey) ?? [];
    arr.push(e.id);
    clusters.set(clusterKey, arr);
    clusterOf.set(e.id, clusterKey);
  }

  const result = new Map<string, CandidateInfo>();
  for (const e of entries) {
    const clusterKey = clusterOf.get(e.id);
    const size = clusterKey ? clusters.get(clusterKey)?.length ?? 0 : 0;
    result.set(e.id, { candidate: size >= 2, clusterSize: size });
  }
  return result;
}
