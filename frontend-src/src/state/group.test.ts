import { describe, expect, it } from "vitest";
import { buildGroupPayload } from "./group";

describe("buildGroupPayload", () => {
  it("uses the chosen master as parent and all other selected IDs as children", () => {
    expect(buildGroupPayload(["a", "b", "c"], "b")).toEqual({
      parent_id: "b",
      child_ids: ["a", "c"],
    });
  });

  it("deduplicates selected IDs while preserving child order", () => {
    expect(buildGroupPayload(["a", "b", "a", "c"], "a")).toEqual({
      parent_id: "a",
      child_ids: ["b", "c"],
    });
  });

  it("rejects a master outside the selection", () => {
    expect(() => buildGroupPayload(["a", "b"], "x")).toThrow(
      "master must be part of the selection"
    );
  });

  it("rejects selections with fewer than two entries", () => {
    expect(() => buildGroupPayload(["a"], "a")).toThrow(
      "at least two entries are required"
    );
  });
});
