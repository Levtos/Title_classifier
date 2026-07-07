// Overview grouping (v3.3.3). Pure + testable: groups watcher sources into one
// "master" block per context so several watchers of the same type (e.g. the
// four Stash slots) render under a single header with an aggregate summary,
// instead of as loose flat cards. UI-only — no backend/entity/contract change.

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
