import { describe, expect, it } from "vitest";
import { countOpenEntries, filterInbox, type InboxEntryLike } from "./inbox";

function e(
  id: string,
  key: string,
  extra: Partial<InboxEntryLike> = {}
): InboxEntryLike {
  return {
    id,
    key,
    normalized_key: key.toLowerCase(),
    parent_id: null,
    reviewed: false,
    hidden: false,
    media_type: "music",
    signal_type: "title",
    current_context: null,
    ...extra,
  };
}

describe("filterInbox — reviewed-based work queue (control#27)", () => {
  it("shows only open (unreviewed) entries — the enum is NOT a criterion", () => {
    const rows = filterInbox([
      e("open0", "Open at zero"), // enum 0 equivalent: open
      e("done0", "Done at zero", { reviewed: true }), // deliberately closed at enum 0
      e("done5", "Done at five", { reviewed: true }),
    ]);
    expect(rows.map((r) => r.id)).toEqual(["open0"]);
  });

  it("an entry closed at enum 0 leaves the Inbox (Erledigt bei Enum 0)", () => {
    const before = filterInbox([e("a", "Track")]);
    expect(before).toHaveLength(1);
    const after = filterInbox([e("a", "Track", { reviewed: true })]);
    expect(after).toHaveLength(0);
  });

  it("hides variants (non top-level) and ignored entries by default", () => {
    const rows = filterInbox([
      e("child", "Variant", { parent_id: "m" }),
      e("ignored", "Ignored", { hidden: true }),
      e("open", "Open"),
    ]);
    expect(rows.map((r) => r.id)).toEqual(["open"]);
  });

  it("includeIgnored surfaces ignored-but-open entries (rescue toggle)", () => {
    const rows = filterInbox(
      [e("ignored", "Ignored", { hidden: true }), e("open", "Open")],
      { includeIgnored: true }
    );
    expect(rows.map((r) => r.id)).toEqual(["ignored", "open"]);
  });

  it("drops configured inactive values (e.g. stale 'No Game' rows)", () => {
    const rows = filterInbox(
      [e("ng", "No Game", { normalized_key: "no game" }), e("open", "Open")],
      { inactiveKeys: new Set(["no game"]) }
    );
    expect(rows.map((r) => r.id)).toEqual(["open"]);
  });

  it("applies media/signal/context/search filters", () => {
    const entries = [
      e("m", "Music Track"),
      e("g", "Astro Bot", { media_type: "game", current_context: "ps5" }),
    ];
    expect(filterInbox(entries, { media: "game" }).map((r) => r.id)).toEqual(["g"]);
    expect(filterInbox(entries, { context: "ps5" }).map((r) => r.id)).toEqual(["g"]);
    expect(filterInbox(entries, { search: "astro" }).map((r) => r.id)).toEqual(["g"]);
  });
});

describe("countOpenEntries — shared 'Offen' definition", () => {
  it("counts open top-level entries once, ignoring done/hidden/variants", () => {
    const entries = [
      e("a", "Open A"),
      e("b", "Open B"),
      e("done", "Done", { reviewed: true }),
      e("hid", "Hidden", { hidden: true }),
      e("child", "Child", { parent_id: "a" }),
      e("ng", "No Game", { normalized_key: "no game" }),
    ];
    expect(countOpenEntries(entries, new Set(["no game"]))).toBe(2);
  });
});
