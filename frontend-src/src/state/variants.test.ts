import { describe, expect, it } from "vitest";
import {
  candidateKey,
  markVariantCandidates,
  type VariantInput,
} from "./variants";
import { mediaTypeClass } from "./media";

function e(
  id: string,
  key: string,
  extra: Partial<VariantInput> = {}
): VariantInput {
  return {
    id,
    key,
    media_type: "music",
    signal_type: "title",
    hidden: false,
    parent_id: null,
    ...extra,
  };
}

describe("candidateKey", () => {
  it("reduces feat. and remix parentheses to the same seed", () => {
    expect(candidateKey("Sean Paul - No Lie")).toBe(
      candidateKey("Sean Paul feat. Dua Lipa - No Lie (Sam Feldt Remix)")
    );
  });
});

describe("markVariantCandidates", () => {
  it("marks the two Sean Paul entries as candidates (cluster size 2)", () => {
    const a = e("a", "Sean Paul - No Lie");
    const b = e("b", "Sean Paul feat. Dua Lipa - No Lie (Sam Feldt Remix)");
    const m = markVariantCandidates([a, b]);
    expect(m.get("a")).toEqual({ candidate: true, clusterSize: 2 });
    expect(m.get("b")).toEqual({ candidate: true, clusterSize: 2 });
  });

  it("does not mark different titles", () => {
    const a = e("a", "Sean Paul - No Lie");
    const b = e("b", "Sean Paul - Temperature");
    const m = markVariantCandidates([a, b]);
    expect(m.get("a")!.candidate).toBe(false);
    expect(m.get("b")!.candidate).toBe(false);
  });

  it("does not cluster across different media_type", () => {
    const a = e("a", "Sean Paul - No Lie", { media_type: "music" });
    const b = e("b", "Sean Paul - No Lie", { media_type: "video" });
    const m = markVariantCandidates([a, b]);
    expect(m.get("a")!.candidate).toBe(false);
    expect(m.get("b")!.candidate).toBe(false);
  });

  it("ignores hidden and already-grouped children", () => {
    const a = e("a", "Sean Paul - No Lie");
    const hidden = e("h", "Sean Paul - No Lie (Remix)", { hidden: true });
    const child = e("c", "Sean Paul - No Lie (Live)", { parent_id: "a" });
    const m = markVariantCandidates([a, hidden, child]);
    // Only "a" is eligible → cluster size 1 → not a candidate.
    expect(m.get("a")!.candidate).toBe(false);
    expect(m.get("h")!.candidate).toBe(false);
    expect(m.get("c")!.candidate).toBe(false);
  });
});

describe("mediaTypeClass", () => {
  it("maps media types to reusable accent classes", () => {
    expect(mediaTypeClass("music")).toBe("media-type-music");
    expect(mediaTypeClass("game")).toBe("media-type-game");
    expect(mediaTypeClass("video")).toBe("media-type-video");
  });
});
