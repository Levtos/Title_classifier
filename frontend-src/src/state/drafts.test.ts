import { describe, expect, it } from "vitest";
import type { V3Entry } from "./types";
import {
  clearDraft,
  isDirty,
  patchServerEnum,
  setDraft,
  toDisplayEntries,
  type DraftMap,
} from "./drafts";

function entry(id: string, enumValue: number): V3Entry {
  return {
    id,
    scope: "default",
    media_type: "music",
    signal_type: "title",
    key: `Key ${id}`,
    normalized_key: `key ${id}`,
    enum: enumValue,
    parent_id: null,
    is_variant: false,
    variants: [],
    hidden: false,
    is_current: false,
    effective_enum: null,
    current_context: null,
    current_source_app: null,
    first_seen: "2026-01-01T00:00:00+00:00",
    last_seen: "2026-01-02T00:00:00+00:00",
    seen_count: 1,
  };
}

describe("draft reconcile — the 'enum springs back' regression", () => {
  it("keeps the draft after a poll returns the old server value", () => {
    const server = [entry("a", 0)];
    let drafts: DraftMap = {};

    // User sets the draft 0 -> 1.
    drafts = setDraft(drafts, "a", 1);
    let view = toDisplayEntries(server, drafts, {})[0];
    expect(view.enum).toBe(1);
    expect(view.serverEnum).toBe(0);
    expect(view.dirty).toBe(true);

    // A fresh poll still reports enum 0 — the draft must NOT be overwritten.
    const polled = [entry("a", 0)];
    view = toDisplayEntries(polled, drafts, {})[0];
    expect(view.enum).toBe(1);
    expect(view.dirty).toBe(true);

    // Apply succeeds: optimistic server patch + draft cleared.
    const patched = patchServerEnum(polled, "a", 1);
    drafts = clearDraft(drafts, "a");
    view = toDisplayEntries(patched, drafts, {})[0];
    expect(view.enum).toBe(1);
    expect(view.serverEnum).toBe(1);
    expect(view.dirty).toBe(false);
  });

  it("a draft equal to the server value is not dirty", () => {
    const server = [entry("a", 3)];
    const drafts = setDraft({}, "a", 3);
    expect(toDisplayEntries(server, drafts, {})[0].dirty).toBe(false);
    expect(isDirty(server, drafts, "a")).toBe(false);
  });

  it("clearDraft drops the draft and isDirty reflects it", () => {
    const server = [entry("a", 0)];
    let drafts = setDraft({}, "a", 5);
    expect(isDirty(server, drafts, "a")).toBe(true);
    drafts = clearDraft(drafts, "a");
    expect(isDirty(server, drafts, "a")).toBe(false);
    expect(toDisplayEntries(server, drafts, {})[0].enum).toBe(0);
  });

  it("surfaces a save error from the save map", () => {
    const server = [entry("a", 0)];
    const drafts = setDraft({}, "a", 1);
    const view = toDisplayEntries(server, drafts, {
      a: { saving: false, error: "boom" },
    })[0];
    expect(view.saveError).toBe("boom");
    expect(view.dirty).toBe(true);
  });
});
