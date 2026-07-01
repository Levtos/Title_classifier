import { describe, expect, it } from "vitest";
import {
  buildCatalogTree,
  filterCatalog,
  selectByTab,
  type CatalogEntryLike,
} from "./tree";

function e(
  id: string,
  key: string,
  parent_id: string | null = null,
  extra: Partial<CatalogEntryLike> = {}
): CatalogEntryLike {
  return {
    id,
    key,
    parent_id,
    media_type: "music",
    signal_type: "title",
    hidden: false,
    ...extra,
  };
}

describe("buildCatalogTree", () => {
  it("nests children under their master and keeps masters top-level", () => {
    const master = e("m", "Numb");
    const c1 = e("c1", "Numb Live", "m");
    const c2 = e("c2", "Numb Encore", "m");
    const solo = e("s", "Astro Bot");
    const tree = buildCatalogTree([c2, master, solo, c1]);

    const topKeys = tree.map((n) => n.entry.id);
    // masters/solo are top-level; children are NOT.
    expect(topKeys).toContain("m");
    expect(topKeys).toContain("s");
    expect(topKeys).not.toContain("c1");
    expect(topKeys).not.toContain("c2");

    const masterNode = tree.find((n) => n.entry.id === "m")!;
    // children sorted by key.
    expect(masterNode.children.map((c) => c.key)).toEqual([
      "Numb Encore",
      "Numb Live",
    ]);
    expect(masterNode.orphan).toBe(false);
  });

  it("surfaces orphan children (missing parent) as top-level orphan nodes", () => {
    const orphan = e("o", "Lost Variant", "missing-master");
    const tree = buildCatalogTree([orphan]);
    expect(tree).toHaveLength(1);
    expect(tree[0].entry.id).toBe("o");
    expect(tree[0].orphan).toBe(true);
    expect(tree[0].children).toEqual([]);
  });

  it("does not duplicate a child as top-level", () => {
    const master = e("m", "M");
    const child = e("c", "C", "m");
    const tree = buildCatalogTree([master, child]);
    const allIds = tree.flatMap((n) => [n.entry.id, ...n.children.map((c) => c.id)]);
    // each id appears exactly once across the whole tree
    expect(allIds.sort()).toEqual(["c", "m"]);
    expect(tree.map((n) => n.entry.id)).toEqual(["m"]);
  });
});

describe("selectByTab", () => {
  const master = e("m", "Master");
  const child = e("c", "Child", "m");
  const solo = e("s", "Solo");
  const hiddenSolo = e("h", "HiddenSolo", null, { hidden: true });
  const all = [master, child, solo, hiddenSolo];

  it("all → everything", () => {
    expect(selectByTab(all, "all").map((x) => x.id).sort()).toEqual([
      "c",
      "h",
      "m",
      "s",
    ]);
  });

  it("unsorted → no parent and no children", () => {
    // solo + hiddenSolo are standalone; master has a child, child has a parent.
    expect(selectByTab(all, "unsorted").map((x) => x.id).sort()).toEqual(["h", "s"]);
  });

  it("groups → masters with children + their children", () => {
    expect(selectByTab(all, "groups").map((x) => x.id).sort()).toEqual(["c", "m"]);
  });

  it("hidden → only hidden entries", () => {
    expect(selectByTab(all, "hidden").map((x) => x.id)).toEqual(["h"]);
  });
});

describe("filterCatalog", () => {
  const rows = [
    e("g", "Astro Bot", null, { media_type: "game" }),
    e("m", "Daft Punk - One More Time", null, {
      media_type: "music",
      signal_type: "title",
    }),
    e("a", "Netflix", null, { media_type: "video", signal_type: "app" }),
  ];

  it("filters by media_type, signal_type and search", () => {
    expect(filterCatalog(rows, { media: "music" }).map((r) => r.id)).toEqual(["m"]);
    expect(filterCatalog(rows, { signal: "app" }).map((r) => r.id)).toEqual(["a"]);
    expect(filterCatalog(rows, { search: "astro" }).map((r) => r.id)).toEqual(["g"]);
    expect(filterCatalog(rows, {}).length).toBe(3);
  });
});
