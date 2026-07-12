// Overview grouping (v3.4.0). Pure + testable: groups watcher sources by
// context so each context renders as exactly ONE watcher — a single card for
// single-source contexts (HomePod/PC/PS5/Apple TV) and one card with compact
// slot rows for multi-source contexts (the four Stash slots). The backend
// watcher model (one subentry per slot) is untouched; this is display-only.

import { contextLabel } from "./source";
import type { Context, V3Source } from "./types";

export interface SourceGroup {
  context: Context;
  /** Friendly master label, e.g. "Stash". */
  label: string;
  /** The watchers in this group, in their original (config) order. */
  sources: V3Source[];
  total: number;
  activeCount: number;
  onlineCount: number;
  /** Highest effective enum among the currently-active watchers; null when
   *  none are active (so the header can drop the "· Enum N" part). */
  maxActiveEnum: number | null;
  /** current_key of every active watcher — a compact "what's playing" list. */
  activeTitles: string[];
}

/** Group watcher sources by context, preserving first-appearance order, and
 *  precompute the per-type master aggregates the Overview header shows. */
export function groupSourcesByContext(sources: V3Source[]): SourceGroup[] {
  const order: Context[] = [];
  const byContext = new Map<Context, V3Source[]>();
  for (const s of sources) {
    let bucket = byContext.get(s.context);
    if (!bucket) {
      bucket = [];
      byContext.set(s.context, bucket);
      order.push(s.context);
    }
    bucket.push(s);
  }

  return order.map((context) => {
    const groupSources = byContext.get(context)!;
    const activeSources = groupSources.filter((s) => s.current_key);
    const maxActiveEnum = activeSources.reduce<number | null>((max, s) => {
      const e = s.current_enum;
      if (e == null) return max;
      return max == null || e > max ? e : max;
    }, null);
    return {
      context,
      label: contextLabel(context) ?? context,
      sources: groupSources,
      total: groupSources.length,
      activeCount: activeSources.length,
      onlineCount: groupSources.filter((s) => s.online).length,
      maxActiveEnum,
      activeTitles: activeSources
        .map((s) => s.current_key)
        .filter((k): k is string => !!k),
    };
  });
}

export interface GroupStats {
  /** Number of distinct watchers = context groups (the business count: 5). */
  watcherCount: number;
  /** Groups with at least one online slot — a watcher is online when ≥1 of
   *  its sources is online. */
  onlineGroups: number;
}

/** Header/status-bar statistics over the grouped watchers. Never counts the
 *  raw sources (slots) — the four Stash slots are ONE watcher. */
export function groupStats(groups: SourceGroup[]): GroupStats {
  return {
    watcherCount: groups.length,
    onlineGroups: groups.filter((g) => g.onlineCount > 0).length,
  };
}
