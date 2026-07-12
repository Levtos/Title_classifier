import { describe, expect, it } from "vitest";
import { groupSourcesByContext, groupStats } from "./sourceGroups";
import type { V3Source } from "./types";

function src(over: Partial<V3Source>): V3Source {
  return {
    entry_id: "e",
    name: "W",
    media_type: "video",
    context: "stash",
    signal_type: "title",
    source_app: "",
    source_entity: "sensor.x",
    online: true,
    current_key: null,
    current_enum: 0,
    current_entry_id: null,
    current_artwork: null,
    entry_count: 0,
    unmapped_count: 0,
    inactive_keys: [],
    ...over,
  };
}

describe("groupSourcesByContext", () => {
  it("groups several stash slots under one master and counts actives", () => {
    const groups = groupSourcesByContext([
      src({ entry_id: "s1", name: "Stash Slot 1", current_key: "A", current_enum: 1 }),
      src({ entry_id: "s2", name: "Stash Slot 2", current_key: "B", current_enum: 1 }),
      src({ entry_id: "s3", name: "Stash Slot 3", current_key: null, current_enum: 0 }),
      src({ entry_id: "s4", name: "Stash Slot 4", current_key: null, current_enum: 0 }),
    ]);
    expect(groups).toHaveLength(1);
    const g = groups[0];
    expect(g.context).toBe("stash");
    expect(g.label).toBe("Stash");
    expect(g.total).toBe(4);
    expect(g.activeCount).toBe(2);
    expect(g.maxActiveEnum).toBe(1);
    expect(g.activeTitles).toEqual(["A", "B"]);
  });

  it("keeps distinct contexts as separate groups in first-appearance order", () => {
    const groups = groupSourcesByContext([
      src({ entry_id: "hp", context: "homepod", media_type: "music", name: "HP" }),
      src({ entry_id: "st1", context: "stash", name: "Stash Slot 1" }),
      src({ entry_id: "ps", context: "ps5", media_type: "game", name: "PS5" }),
      src({ entry_id: "st2", context: "stash", name: "Stash Slot 2" }),
    ]);
    expect(groups.map((g) => g.context)).toEqual(["homepod", "stash", "ps5"]);
    // The two stash watchers collapse into the single stash group.
    expect(groups[1].total).toBe(2);
    // Original per-group order is preserved.
    expect(groups[1].sources.map((s) => s.entry_id)).toEqual(["st1", "st2"]);
  });

  it("reports maxActiveEnum null when nothing in the group is active", () => {
    const groups = groupSourcesByContext([
      src({ entry_id: "s1", current_key: null, current_enum: 0 }),
      src({ entry_id: "s2", current_key: null, current_enum: 0 }),
    ]);
    expect(groups[0].activeCount).toBe(0);
    expect(groups[0].maxActiveEnum).toBeNull();
    expect(groups[0].activeTitles).toEqual([]);
  });

  it("takes the highest active enum, ignoring inactive watchers", () => {
    const groups = groupSourcesByContext([
      src({ entry_id: "s1", current_key: "A", current_enum: 1 }),
      src({ entry_id: "s2", current_key: "B", current_enum: 5 }),
      src({ entry_id: "s3", current_key: null, current_enum: 9 }),
    ]);
    expect(groups[0].maxActiveEnum).toBe(5);
  });

  it("returns an empty list for no sources", () => {
    expect(groupSourcesByContext([])).toEqual([]);
  });
});

describe("groupStats — five watchers, not eight sources", () => {
  const sources = [
    src({ entry_id: "hp", context: "homepod", media_type: "music", name: "HomePod" }),
    src({ entry_id: "ps", context: "ps5", media_type: "game", name: "PS5" }),
    src({ entry_id: "pc", context: "pc", media_type: "game", name: "PC" }),
    src({ entry_id: "atv", context: "apple_tv", name: "Apple TV" }),
    src({ entry_id: "s1", name: "Stash Slot 1" }),
    src({ entry_id: "s2", name: "Stash Slot 2" }),
    src({ entry_id: "s3", name: "Stash Slot 3", online: false }),
    src({ entry_id: "s4", name: "Stash Slot 4", online: false }),
  ];

  it("counts 5 watchers for 8 sources (4 stash slots = 1 watcher)", () => {
    const groups = groupSourcesByContext(sources);
    expect(groups).toHaveLength(5);
    expect(groupStats(groups).watcherCount).toBe(5);
  });

  it("a watcher is online when at least one slot is online", () => {
    const groups = groupSourcesByContext(sources);
    expect(groupStats(groups).onlineGroups).toBe(5); // stash: 2/4 online ⇒ online
    const stash = groups.find((g) => g.context === "stash")!;
    expect(stash.onlineCount).toBe(2);
    expect(stash.total).toBe(4);
  });

  it("a fully offline group does not count as online", () => {
    const groups = groupSourcesByContext([
      src({ entry_id: "s1", name: "Stash Slot 1", online: false }),
      src({ entry_id: "s2", name: "Stash Slot 2", online: false }),
    ]);
    expect(groupStats(groups)).toEqual({ watcherCount: 1, onlineGroups: 0 });
  });
});
