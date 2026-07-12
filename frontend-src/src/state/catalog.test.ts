import { describe, expect, it } from "vitest";
import {
  catalogRowStatus,
  filterRowsByStructure,
  masterCandidates,
  sortCatalog,
  type CatalogSortable,
  type MasterCandidateLike,
} from "./catalog";

function s(
  id: string,
  key: string,
  extra: Partial<CatalogSortable> = {}
): CatalogSortable {
  return {
    id,
    key,
    last_seen: "2026-01-01T00:00:00Z",
    first_seen: "2026-01-01T00:00:00Z",
    enum: 0,
    hidden: false,
    childCount: 0,
    orphan: false,
    ...extra,
  };
}

describe("sortCatalog", () => {
  it("title-asc / title-desc sort by key with id tiebreak", () => {
    const rows = [s("b", "Beta"), s("a", "Alpha"), s("c", "Charlie")];
    expect(sortCatalog(rows, "title-asc").map((r) => r.key)).toEqual([
      "Alpha",
      "Beta",
      "Charlie",
    ]);
    expect(sortCatalog(rows, "title-desc").map((r) => r.key)).toEqual([
      "Charlie",
      "Beta",
      "Alpha",
    ]);
  });

  it("newest / oldest sort by last_seen then first_seen", () => {
    const older = s("o", "Older", { last_seen: "2026-01-01T00:00:00Z" });
    const newer = s("n", "Newer", { last_seen: "2026-02-01T00:00:00Z" });
    expect(sortCatalog([older, newer], "newest").map((r) => r.id)).toEqual([
      "n",
      "o",
    ]);
    expect(sortCatalog([older, newer], "oldest").map((r) => r.id)).toEqual([
      "o",
      "n",
    ]);
  });

  it("groups-first puts masters and orphans before solos", () => {
    const solo = s("solo", "Solo");
    const master = s("m", "Master", { childCount: 2 });
    const orphan = s("orp", "Orphan", { orphan: true });
    const out = sortCatalog([solo, master, orphan], "groups-first").map(
      (r) => r.id
    );
    // solo is last; master + orphan (both rank 0) come first, key-tiebroken.
    expect(out[out.length - 1]).toBe("solo");
    expect(out.slice(0, 2).sort()).toEqual(["m", "orp"]);
  });

  it("masters-first puts only masters (with children) on top", () => {
    const solo = s("solo", "Solo");
    const master = s("m", "Master", { childCount: 1 });
    const orphan = s("orp", "Orphan", { orphan: true });
    const out = sortCatalog([solo, master, orphan], "masters-first").map(
      (r) => r.id
    );
    expect(out[0]).toBe("m");
  });

  it("hidden-first surfaces hidden entries", () => {
    const visible = s("v", "Visible");
    const hidden = s("h", "Hidden", { hidden: true });
    expect(sortCatalog([visible, hidden], "hidden-first").map((r) => r.id)).toEqual(
      ["h", "v"]
    );
  });

  it("enum-asc / enum-desc sort numerically with key tiebreak", () => {
    const a = s("a", "A", { enum: 5 });
    const b = s("b", "B", { enum: 1 });
    const c = s("c", "C", { enum: 9 });
    expect(sortCatalog([a, b, c], "enum-asc").map((r) => r.enum)).toEqual([1, 5, 9]);
    expect(sortCatalog([a, b, c], "enum-desc").map((r) => r.enum)).toEqual([9, 5, 1]);
  });

  it("is deterministic on equal values (stable key,id tiebreak)", () => {
    // Same last_seen → newest must fall back to a stable order, not input order.
    const x = s("x2", "Same");
    const y = s("x1", "Same");
    const a = sortCatalog([x, y], "newest").map((r) => r.id);
    const b = sortCatalog([y, x], "newest").map((r) => r.id);
    expect(a).toEqual(b);
    expect(a).toEqual(["x1", "x2"]); // id ASC tiebreak
  });

  it("does not mutate the input array", () => {
    const rows = [s("b", "Beta"), s("a", "Alpha")];
    const before = rows.map((r) => r.id);
    sortCatalog(rows, "title-asc");
    expect(rows.map((r) => r.id)).toEqual(before);
  });
});

describe("catalogRowStatus", () => {
  const base = {
    isMaster: false,
    childCount: 0,
    isChild: false,
    orphan: false,
    hidden: false,
    isCurrent: false,
    enum: 3,
    reviewed: true,
  };

  it("marks a running entry as läuft", () => {
    const out = catalogRowStatus({ ...base, isCurrent: true });
    expect(out.map((b) => b.key)).toContain("active");
  });

  it("labels a master with its variant count (singular/plural)", () => {
    expect(catalogRowStatus({ ...base, isMaster: true, childCount: 1 })[0].label).toBe(
      "Master · 1 Variante"
    );
    expect(catalogRowStatus({ ...base, isMaster: true, childCount: 3 })[0].label).toBe(
      "Master · 3 Varianten"
    );
  });

  it("labels a child variant and an orphan variant distinctly", () => {
    expect(catalogRowStatus({ ...base, isChild: true }).map((b) => b.key)).toContain(
      "variant"
    );
    expect(catalogRowStatus({ ...base, orphan: true }).map((b) => b.key)).toContain(
      "orphan"
    );
  });

  it("labels hidden as Ignoriert and open (unreviewed) as offen", () => {
    const hiddenOpen = catalogRowStatus({
      ...base,
      hidden: true,
      reviewed: false,
    });
    expect(hiddenOpen.map((b) => b.key)).toEqual(["hidden", "open"]);
    expect(hiddenOpen.find((b) => b.key === "hidden")!.label).toBe("Ignoriert");
    expect(hiddenOpen.find((b) => b.key === "open")!.label).toBe("offen");
  });

  it("enum 0 alone is NOT a status — a reviewed enum-0 entry has no badge", () => {
    expect(catalogRowStatus({ ...base, enum: 0, reviewed: true })).toEqual([]);
    // …while an open entry carries the offen badge regardless of enum.
    expect(
      catalogRowStatus({ ...base, enum: 4, reviewed: false }).map((b) => b.key)
    ).toContain("open");
  });

  it("returns an empty array (clean fallback) when nothing applies", () => {
    expect(catalogRowStatus(base)).toEqual([]);
  });
});

describe("masterCandidates", () => {
  function m(
    id: string,
    key: string,
    extra: Partial<MasterCandidateLike> = {}
  ): MasterCandidateLike {
    return {
      id,
      key,
      scope: "default",
      media_type: "music",
      signal_type: "title",
      parent_id: null,
      ...extra,
    };
  }

  it("offers same scope/media/signal top-level entries, excluding self", () => {
    const child = m("child", "Numb Live");
    const all = [
      child,
      m("ok", "Numb"),
      m("self-dup", "Numb", { id: "child" }), // same id as child → excluded
      m("child2", "Other", { parent_id: "ok" }), // already a child → excluded
      m("wrong-media", "Astro", { media_type: "game" }),
      m("wrong-signal", "App", { signal_type: "app" }),
      m("wrong-scope", "Scoped", { scope: "other" }),
    ];
    expect(masterCandidates(all, child).map((e) => e.id)).toEqual(["ok"]);
  });

  it("returns key-sorted candidates", () => {
    const child = m("c", "Child");
    const all = [child, m("z", "Zulu"), m("a", "Alpha"), m("m", "Mike")];
    expect(masterCandidates(all, child).map((e) => e.key)).toEqual([
      "Alpha",
      "Mike",
      "Zulu",
    ]);
  });
});

describe("filterRowsByStructure", () => {
  const rows = [
    { id: "m", isMaster: true, depth: 0, orphan: false },
    { id: "m.c", isMaster: false, depth: 1, orphan: false },
    { id: "solo", isMaster: false, depth: 0, orphan: false },
    { id: "orphan", isMaster: false, depth: 0, orphan: true },
  ];

  it("master keeps master rows with their nested variants", () => {
    expect(filterRowsByStructure(rows, "master").map((r) => r.id)).toEqual([
      "m",
      "m.c",
    ]);
  });

  it("variant yields a flat list of variants incl. orphans", () => {
    expect(filterRowsByStructure(rows, "variant").map((r) => r.id)).toEqual([
      "m.c",
      "orphan",
    ]);
  });

  it("standalone keeps entries that are neither master nor variant", () => {
    expect(filterRowsByStructure(rows, "standalone").map((r) => r.id)).toEqual([
      "solo",
    ]);
  });

  it("empty filter returns the rows unchanged", () => {
    expect(filterRowsByStructure(rows, "")).toEqual(rows);
  });
});
