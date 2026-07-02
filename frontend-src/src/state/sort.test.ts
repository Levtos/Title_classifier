import { describe, expect, it } from "vitest";
import { sortEntries, sortInbox, type InboxSortable } from "./sort";

function row(key: string, last: string, first = "2026-01-01T00:00:00Z"): InboxSortable {
  return { key, last_seen: last, first_seen: first };
}

describe("sortInbox — newest first", () => {
  it("sorts by last_seen DESC (B newer before A older)", () => {
    const a = row("A", "2026-01-01T10:00:00Z");
    const b = row("B", "2026-01-02T10:00:00Z");
    expect(sortInbox([a, b]).map((r) => r.key)).toEqual(["B", "A"]);
  });

  it("puts missing/invalid last_seen behind real timestamps", () => {
    const real = row("Real", "2026-01-05T10:00:00Z");
    const missing = row("Missing", "");
    const invalid = row("Invalid", "not-a-date");
    const out = sortInbox([missing, real, invalid]).map((r) => r.key);
    expect(out[0]).toBe("Real");
    expect(out.slice(1).sort()).toEqual(["Invalid", "Missing"]);
  });

  it("falls back to first_seen DESC when last_seen ties", () => {
    const same = "2026-01-03T10:00:00Z";
    const older = row("Older", same, "2026-01-01T00:00:00Z");
    const newer = row("Newer", same, "2026-01-02T00:00:00Z");
    expect(sortInbox([older, newer]).map((r) => r.key)).toEqual(["Newer", "Older"]);
  });

  it("uses key ASC as a stable tiebreak on full ties", () => {
    const same = "2026-01-03T10:00:00Z";
    const b = row("B", same, same);
    const a = row("A", same, same);
    expect(sortInbox([b, a]).map((r) => r.key)).toEqual(["A", "B"]);
  });
});

describe("sortEntries modes", () => {
  const a = row("Beta", "2026-01-01T10:00:00Z");
  const b = row("Alpha", "2026-01-03T10:00:00Z");

  it("newest → last_seen DESC", () => {
    expect(sortEntries([a, b], "newest").map((r) => r.key)).toEqual([
      "Alpha",
      "Beta",
    ]);
  });

  it("oldest → last_seen ASC", () => {
    expect(sortEntries([a, b], "oldest").map((r) => r.key)).toEqual([
      "Beta",
      "Alpha",
    ]);
  });

  it("title → key ASC", () => {
    expect(sortEntries([a, b], "title").map((r) => r.key)).toEqual([
      "Alpha",
      "Beta",
    ]);
  });
});
