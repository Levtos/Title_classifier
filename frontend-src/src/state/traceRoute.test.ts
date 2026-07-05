import { describe, expect, it } from "vitest";
import { buildTraceHash, parseTraceHash } from "./traceRoute";

describe("buildTraceHash", () => {
  it("builds a bare trace hash with no entry", () => {
    expect(buildTraceHash(null)).toBe("#trace");
  });

  it("deep-links an entry id and URL-encodes it", () => {
    expect(buildTraceHash("abc-123")).toBe("#trace/abc-123");
    expect(buildTraceHash("a/b c")).toBe("#trace/a%2Fb%20c");
  });
});

describe("parseTraceHash", () => {
  it("recognises the bare trace hash (with and without '#')", () => {
    expect(parseTraceHash("#trace")).toEqual({ isTrace: true, entryId: null });
    expect(parseTraceHash("trace")).toEqual({ isTrace: true, entryId: null });
  });

  it("extracts and decodes a deep-linked entry id", () => {
    expect(parseTraceHash("#trace/abc-123")).toEqual({
      isTrace: true,
      entryId: "abc-123",
    });
    expect(parseTraceHash("#trace/a%2Fb%20c")).toEqual({
      isTrace: true,
      entryId: "a/b c",
    });
  });

  it("is a round-trip with buildTraceHash", () => {
    for (const id of ["x", "uuid-like-9f8", "a/b c", "ünïcode"]) {
      expect(parseTraceHash(buildTraceHash(id)).entryId).toBe(id);
    }
    expect(parseTraceHash(buildTraceHash(null)).entryId).toBeNull();
  });

  it("returns isTrace=false for other/empty hashes", () => {
    expect(parseTraceHash("")).toEqual({ isTrace: false, entryId: null });
    expect(parseTraceHash("#catalog")).toEqual({ isTrace: false, entryId: null });
  });

  it("treats a trailing slash with no id as no deep-link (never throws)", () => {
    expect(parseTraceHash("#trace/")).toEqual({ isTrace: true, entryId: null });
  });

  it("tolerates malformed percent-encoding without throwing", () => {
    const out = parseTraceHash("#trace/%E0%A4%A");
    expect(out.isTrace).toBe(true);
    expect(typeof out.entryId).toBe("string");
  });
});
