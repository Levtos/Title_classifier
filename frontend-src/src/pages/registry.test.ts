import { describe, expect, it } from "vitest";
import { PAGES } from "./registry";

describe("sidebar registry", () => {
  it("has exactly the five main pages, in order", () => {
    expect(PAGES.map((p) => p.id)).toEqual([
      "overview",
      "inbox",
      "catalog",
      "io",
      "settings",
    ]);
  });

  it("no longer exposes a Trace / Tagebuch main menu entry", () => {
    // Trace is a diagnosis modal inside the Katalog, not a sidebar page. The
    // "diary" id is gone from PageId, so check it at runtime via a string view.
    const ids = PAGES.map((p) => p.id as string);
    expect(ids).not.toContain("diary");
    expect(PAGES.some((p) => p.label === "Trace")).toBe(false);
    expect(PAGES.some((p) => p.label === "Tagebuch")).toBe(false);
  });

  it("every page has a non-empty label, icon and desc", () => {
    for (const p of PAGES) {
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.icon.length).toBeGreaterThan(0);
      expect(p.desc.length).toBeGreaterThan(0);
    }
  });
});
