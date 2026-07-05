import { describe, expect, it } from "vitest";
import {
  enumSourceLabel,
  explainEffectiveEnum,
  sortSightings,
  type EffectiveTraceInput,
  type SightingLike,
} from "./trace";

function inp(extra: Partial<EffectiveTraceInput> = {}): EffectiveTraceInput {
  return {
    media_type: "music",
    storedEnum: 3,
    parentState: "none",
    parentEnum: null,
    ...extra,
  };
}

describe("explainEffectiveEnum", () => {
  it("own enum: non-variant uses its stored value", () => {
    const t = explainEffectiveEnum(inp({ storedEnum: 3 }));
    expect(t.effectiveEnum).toBe(3);
    expect(t.source).toBe("own");
    expect(t.inheritsFromMaster).toBe(false);
    expect(t.explainable).toBe(true);
  });

  it("enum 0: unclassified fallback", () => {
    const t = explainEffectiveEnum(inp({ storedEnum: 0 }));
    expect(t.effectiveEnum).toBe(0);
    expect(t.source).toBe("unclassified");
    expect(t.reason).toContain("Unklassifiziert");
  });

  it("music variant inherits the master enum", () => {
    const t = explainEffectiveEnum(
      inp({ media_type: "music", storedEnum: 0, parentState: "available", parentEnum: 1 })
    );
    expect(t.effectiveEnum).toBe(1);
    expect(t.source).toBe("master");
    expect(t.inheritsFromMaster).toBe(true);
    expect(t.reason).toContain("Master-Enum");
  });

  it("video variant inherits the master enum too", () => {
    const t = explainEffectiveEnum(
      inp({ media_type: "video", storedEnum: 2, parentState: "available", parentEnum: 5 })
    );
    expect(t.effectiveEnum).toBe(5);
    expect(t.source).toBe("master");
  });

  it("game variant does NOT inherit — uses its own enum", () => {
    const t = explainEffectiveEnum(
      inp({ media_type: "game", storedEnum: 4, parentState: "available", parentEnum: 1 })
    );
    expect(t.effectiveEnum).toBe(4);
    expect(t.source).toBe("own");
    expect(t.inheritsFromMaster).toBe(false);
    expect(t.reason).toContain("Game-Varianten erben nicht");
  });

  it("master (non-variant) explains from its own enum", () => {
    // A master is parentState "none" (it has no parent); its variants list is
    // shown separately. Its own effective comes from its own enum.
    const t = explainEffectiveEnum(inp({ storedEnum: 1, parentState: "none" }));
    expect(t.effectiveEnum).toBe(1);
    expect(t.source).toBe("own");
  });

  it("orphan variant (missing master) is honestly not explainable", () => {
    const t = explainEffectiveEnum(
      inp({ storedEnum: 0, parentState: "missing", parentEnum: null })
    );
    expect(t.effectiveEnum).toBeNull();
    expect(t.explainable).toBe(false);
    expect(t.source).toBe("unknown");
    expect(t.reason).toContain("Verwaiste Variante");
  });

  it("loading master: not explainable yet, no guess", () => {
    const t = explainEffectiveEnum(inp({ parentState: "loading" }));
    expect(t.effectiveEnum).toBeNull();
    expect(t.explainable).toBe(false);
  });

  it("hidden status is orthogonal — not an input, cannot skew the explanation", () => {
    // The same catalog facts always yield the same decision; hiding an entry
    // never changes its effective-enum reasoning.
    const a = explainEffectiveEnum(inp({ storedEnum: 3 }));
    const b = explainEffectiveEnum(inp({ storedEnum: 3 }));
    expect(a).toEqual(b);
    expect(a.source).toBe("own");
  });
});

describe("enumSourceLabel", () => {
  it("maps every source to a human label", () => {
    expect(enumSourceLabel("own")).toBe("eigener Eintrag");
    expect(enumSourceLabel("master")).toBe("Master");
    expect(enumSourceLabel("unclassified")).toContain("Fallback");
    expect(enumSourceLabel("unknown")).toBe("unbekannt");
  });
});

describe("sortSightings", () => {
  function s(
    context: SightingLike["context"],
    last_seen: string,
    extra: Partial<SightingLike> = {}
  ): SightingLike {
    return {
      context,
      source_app: "",
      seen_count: 1,
      first_seen: "2026-01-01T00:00:00Z",
      last_seen,
      ...extra,
    };
  }

  it("sorts multiple contexts newest-first by last_seen", () => {
    const rows = [
      s("ps5", "2026-07-01T00:00:00Z"),
      s("homepod", "2026-07-05T03:37:55Z"),
      s("pc", "2026-06-01T00:00:00Z"),
    ];
    expect(sortSightings(rows).map((r) => r.context)).toEqual([
      "homepod",
      "ps5",
      "pc",
    ]);
  });

  it("keeps source_app data and breaks ties stably (context, then app)", () => {
    const same = "2026-07-05T00:00:00Z";
    const a = s("apple_tv", same, { source_app: "Plex" });
    const b = s("apple_tv", same, { source_app: "Netflix" });
    const out = sortSightings([a, b]);
    // equal timestamp + context → source_app ASC (Netflix before Plex)
    expect(out.map((r) => r.source_app)).toEqual(["Netflix", "Plex"]);
  });

  it("returns an empty array for no contexts (honest empty state upstream)", () => {
    expect(sortSightings([])).toEqual([]);
  });

  it("does not mutate the input", () => {
    const rows = [s("pc", "2026-01-02T00:00:00Z"), s("ps5", "2026-01-01T00:00:00Z")];
    const before = rows.map((r) => r.context);
    sortSightings(rows);
    expect(rows.map((r) => r.context)).toEqual(before);
  });
});
