import { describe, expect, it } from "vitest";
import { computeSignature } from "./signature";
import type { V3Entry, V3Source } from "./types";

function source(id: string, over: Partial<V3Source> = {}): V3Source {
  return {
    entry_id: id,
    name: id,
    media_type: "music",
    context: "homepod",
    signal_type: "title",
    source_app: "",
    source_entity: "media_player.x",
    online: true,
    current_key: "Track A",
    current_enum: 0,
    current_entry_id: null,
    current_artwork: null,
    entry_count: 3,
    unmapped_count: 1,
    inactive_keys: [],
    ...over,
  };
}

function entry(id: string, over: Partial<V3Entry> = {}): V3Entry {
  return {
    id,
    scope: "default",
    media_type: "music",
    signal_type: "title",
    key: `Key ${id}`,
    normalized_key: `key ${id}`,
    enum: 0,
    parent_id: null,
    is_variant: false,
    variants: [],
    hidden: false,
    is_current: false,
    effective_enum: null,
    current_context: null,
    current_source_app: null,
    first_seen: "2026-01-01T00:00:00Z",
    last_seen: "2026-01-02T00:00:00Z",
    seen_count: 5,
    contexts: [],
    last_context: null,
    context_count: 0,
    seen_count_total: 5,
    ...over,
  };
}

describe("computeSignature", () => {
  it("is identical for identical data (and order-independent)", () => {
    const s1 = [source("s1"), source("s2")];
    const e1 = [entry("a"), entry("b")];
    const s2 = [source("s2"), source("s1")]; // shuffled
    const e2 = [entry("b"), entry("a")];
    expect(computeSignature(s1, e1)).toBe(computeSignature(s2, e2));
  });

  it("changes when a watcher current_key changes", () => {
    const base = computeSignature([source("s1")], []);
    const changed = computeSignature([source("s1", { current_key: "Track B" })], []);
    expect(changed).not.toBe(base);
  });

  it("changes when an entry field changes (enum)", () => {
    const base = computeSignature([], [entry("a")]);
    const changed = computeSignature([], [entry("a", { enum: 4 })]);
    expect(changed).not.toBe(base);
  });

  it("changes when hidden or seen_count changes", () => {
    const base = computeSignature([], [entry("a")]);
    expect(computeSignature([], [entry("a", { hidden: true })])).not.toBe(base);
    expect(computeSignature([], [entry("a", { seen_count: 6 })])).not.toBe(base);
  });
});
