// Source-/Context-Badge helpers (v3.0.0). Pure + testable. Derives a compact
// "where does this title come from" label from data list_entries already ships
// (contexts / last_context / context_count / current_context /
// current_source_app) — no per-row entry_detail call, no API change.

import type { Context } from "./types";

const CONTEXT_LABEL: Record<Context, string> = {
  homepod: "HomePod",
  pc: "PC",
  ps5: "PS5",
  switch: "Switch",
  stash: "Stash",
  apple_tv: "Apple TV",
};

/** Human label for a context enum, or null when unknown/absent. */
export function contextLabel(ctx: Context | null | undefined): string | null {
  if (!ctx) return null;
  return CONTEXT_LABEL[ctx] ?? ctx;
}

export interface SourceInput {
  contexts?: Context[];
  last_context?: Context | null;
  current_context?: Context | null;
  current_source_app?: string | null;
  is_current?: boolean;
}

export interface SourceSummary {
  /** Primary source label incl. source_app, e.g. "PS5" or "Apple TV · Netflix".
   *  null when no context is known (→ caller shows a neutral fallback). */
  label: string | null;
  /** Distinct contexts beyond the primary one (for a compact "+N" badge). */
  extraCount: number;
}

/** Compact source summary for one entry: most-recent context (+ source_app when
 *  it belongs to that context) and a "+N" for additional distinct contexts. */
export function sourceSummary(entry: SourceInput): SourceSummary {
  const primary =
    entry.last_context ??
    (entry.is_current ? entry.current_context ?? null : null) ??
    null;
  const base = contextLabel(primary);
  if (base === null) return { label: null, extraCount: 0 };

  // Attach source_app only when it actually belongs to the shown context —
  // i.e. the entry is current AND the primary context is the current one.
  const app =
    entry.is_current &&
    primary === entry.current_context &&
    entry.current_source_app
      ? entry.current_source_app
      : null;
  const label = app ? `${base} · ${app}` : base;

  const distinct = entry.contexts?.length ?? 0;
  const extraCount = distinct > 1 ? distinct - 1 : 0;
  return { label, extraCount };
}
