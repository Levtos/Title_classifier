import { describe, expect, it } from "vitest";
import { contextLabel, sourceSummary } from "./source";

describe("contextLabel", () => {
  it("maps context enums to friendly labels", () => {
    expect(contextLabel("ps5")).toBe("PS5");
    expect(contextLabel("pc")).toBe("PC");
    expect(contextLabel("homepod")).toBe("HomePod");
    expect(contextLabel("apple_tv")).toBe("Apple TV");
    expect(contextLabel("stash")).toBe("Stash");
  });
  it("returns null for missing context", () => {
    expect(contextLabel(null)).toBeNull();
    expect(contextLabel(undefined)).toBeNull();
  });
});

describe("sourceSummary", () => {
  it("uses last_context as the primary label", () => {
    expect(sourceSummary({ last_context: "ps5", contexts: ["ps5"] })).toEqual({
      label: "PS5",
      extraCount: 0,
    });
  });

  it("appends source_app when it belongs to the current context", () => {
    expect(
      sourceSummary({
        last_context: "apple_tv",
        current_context: "apple_tv",
        current_source_app: "Netflix",
        is_current: true,
        contexts: ["apple_tv"],
      })
    ).toEqual({ label: "Apple TV · Netflix", extraCount: 0 });
  });

  it("does not attach source_app to a different context than the current one", () => {
    expect(
      sourceSummary({
        last_context: "pc",
        current_context: "apple_tv",
        current_source_app: "Netflix",
        is_current: true,
        contexts: ["pc", "apple_tv"],
      })
    ).toEqual({ label: "PC", extraCount: 1 });
  });

  it("reports extra distinct contexts as a count", () => {
    expect(
      sourceSummary({ last_context: "pc", contexts: ["pc", "ps5", "switch"] })
    ).toEqual({ label: "PC", extraCount: 2 });
  });

  it("falls back to null when no context is known", () => {
    expect(sourceSummary({ contexts: [] })).toEqual({
      label: null,
      extraCount: 0,
    });
  });
});
