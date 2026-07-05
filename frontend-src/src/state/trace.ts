// Pure, read-only Catalog Trace helpers (v3.2.0). They explain *why* an entry's
// effective enum is what it is, using only fields the frontend already has
// (list_entries + entry_detail). They mirror the backend resolver
// (effective.py / build_entry_detail's effective_preview): active=True,
// variant inheritance for music/video only, games do not inherit. They
// deliberately DO NOT model the online gate, the watcher's active_default floor
// (e.g. stash ⇒ 1) or the active-context game override — those live outside the
// catalog data, so when the live value differs the UI says so instead of
// guessing. Nothing here changes a decision; Trace never touches HA.

import type { Context, MediaType } from "./types";

export type EnumSource = "own" | "master" | "unclassified" | "unknown";

/** What we know about the entry's master at explain time. */
export type ParentState = "none" | "loading" | "available" | "missing";

export interface EffectiveTraceInput {
  media_type: MediaType;
  /** The persisted catalog enum (use serverEnum, not an unsaved draft). */
  storedEnum: number;
  parentState: ParentState;
  /** Master enum — only meaningful when parentState === "available". */
  parentEnum: number | null;
}

export interface EffectiveTrace {
  storedEnum: number;
  /** Catalog-derivable effective enum (while active). null when not explainable
   *  from current data (orphan / master still loading). */
  effectiveEnum: number | null;
  source: EnumSource;
  inheritsFromMaster: boolean;
  reason: string;
  /** False ⇒ show "nicht vollständig erklärbar mit aktuellen Daten". */
  explainable: boolean;
}

const INHERITING_MEDIA: MediaType[] = ["music", "video"];

function ownEnumTrace(
  i: EffectiveTraceInput,
  isVariant: boolean
): EffectiveTrace {
  const gameVariantNote =
    isVariant && i.media_type === "game"
      ? " Game-Varianten erben nicht — Kontext-Overrides bestimmen den Wert."
      : "";
  if (i.storedEnum === 0) {
    return {
      storedEnum: 0,
      effectiveEnum: 0,
      source: "unclassified",
      inheritsFromMaster: false,
      reason:
        "Unklassifiziert — kein aktiver Enum gesetzt (0)." + gameVariantNote,
      explainable: true,
    };
  }
  return {
    storedEnum: i.storedEnum,
    effectiveEnum: i.storedEnum,
    source: "own",
    inheritsFromMaster: false,
    reason: "Eigener gespeicherter Enum wird verwendet." + gameVariantNote,
    explainable: true,
  };
}

/** Explain the catalog-derivable effective enum for one entry. Deterministic,
 *  never guesses: unknown states return explainable=false with an honest note. */
export function explainEffectiveEnum(i: EffectiveTraceInput): EffectiveTrace {
  switch (i.parentState) {
    case "loading":
      return {
        storedEnum: i.storedEnum,
        effectiveEnum: null,
        source: "unknown",
        inheritsFromMaster: false,
        reason: "Master wird geladen … Vererbung noch nicht bestimmbar.",
        explainable: false,
      };
    case "missing":
      return {
        storedEnum: i.storedEnum,
        effectiveEnum: null,
        source: "unknown",
        inheritsFromMaster: false,
        reason:
          "Verwaiste Variante — der referenzierte Master (parent_id) ist nicht " +
          "verfügbar; effective_enum ist mit den aktuellen Daten nicht " +
          "vollständig erklärbar.",
        explainable: false,
      };
    case "available":
      if (INHERITING_MEDIA.includes(i.media_type) && i.parentEnum !== null) {
        return {
          storedEnum: i.storedEnum,
          effectiveEnum: i.parentEnum,
          source: "master",
          inheritsFromMaster: true,
          reason: `Variante übernimmt den Master-Enum (${i.media_type}: Varianten erben).`,
          explainable: true,
        };
      }
      // Game variant (or an unexpectedly missing parent enum): no inheritance.
      return ownEnumTrace(i, true);
    case "none":
    default:
      return ownEnumTrace(i, false);
  }
}

export function enumSourceLabel(source: EnumSource): string {
  switch (source) {
    case "own":
      return "eigener Eintrag";
    case "master":
      return "Master";
    case "unclassified":
      return "Fallback (unklassifiziert)";
    case "unknown":
    default:
      return "unbekannt";
  }
}

// ------------------------------------------------------------- sightings

/** Aggregated per-context sighting row (from entry_detail.contexts). The
 *  frontend has no single-event history — only these per-context aggregates. */
export interface SightingLike {
  context: Context;
  source_app: string;
  seen_count: number;
  first_seen: string;
  last_seen: string;
}

function ts(value: string): number {
  const t = Date.parse(value);
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}

/** Newest-first by last_seen, with a stable tiebreak (context, then app) so
 *  equal timestamps never fall into a random / poll-dependent order. */
export function sortSightings<T extends SightingLike>(rows: T[]): T[] {
  return [...rows].sort(
    (a, b) =>
      ts(b.last_seen) - ts(a.last_seen) ||
      a.context.localeCompare(b.context) ||
      a.source_app.localeCompare(b.source_app)
  );
}
