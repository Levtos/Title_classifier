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
