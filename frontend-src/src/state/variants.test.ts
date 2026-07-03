import { describe, expect, it } from "vitest";
import {
  candidateKey,
  markVariantCandidates,
  pickBestCluster,
  type ClusterInput,
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

function ce(
  id: string,
  key: string,
  extra: Partial<ClusterInput> = {}
): ClusterInput {
  return {
    id,
    key,
    normalized_key: key.toLowerCase(),
    media_type: "music",
    signal_type: "title",
    hidden: false,
    parent_id: null,
    variants: [],
    seen_count_total: 1,
    first_seen: "2026-01-01T00:00:00Z",
    ...extra,
  };
}

describe("pickBestCluster (Varianten-Assistent)", () => {
  it("returns null when there is no cluster", () => {
    expect(
      pickBestCluster([ce("a", "Track A"), ce("b", "Track B")])
    ).toBeNull();
  });

  it("finds the cluster and selects its members", () => {
    const pick = pickBestCluster([
      ce("a", "Sean Paul - No Lie"),
      ce("b", "Sean Paul feat. Dua Lipa - No Lie (Sam Feldt Remix)"),
      ce("x", "Other - Song"),
    ]);
    expect(pick).not.toBeNull();
    expect(new Set(pick!.ids)).toEqual(new Set(["a", "b"]));
    expect(pick!.reason).toMatch(/2 wahrscheinliche Varianten/);
  });

  it("prefers the largest cluster", () => {
    const pick = pickBestCluster([
      ce("a1", "Artist One - Hit"),
      ce("a2", "Artist One - Hit (Remix)"),
      ce("b1", "Band Two - Jam"),
      ce("b2", "Band Two - Jam (Live)"),
      ce("b3", "Band Two - Jam (Radio Edit)"),
    ]);
    expect(new Set(pick!.ids)).toEqual(new Set(["b1", "b2", "b3"]));
  });

  it("prefers an existing master as the preselected master", () => {
    const pick = pickBestCluster([
      ce("plain", "Ktrack - Tune (Remix)"),
      ce("master", "Ktrack - Tune", { variants: [{ id: "child" }] }),
    ]);
    expect(pick!.masterId).toBe("master");
  });

  it("falls back to most-seen when no existing master", () => {
    const pick = pickBestCluster([
      ce("low", "Ktrack - Tune (Remix)", { seen_count_total: 3 }),
      ce("high", "Ktrack - Tune", { seen_count_total: 40 }),
    ]);
    expect(pick!.masterId).toBe("high");
  });

  it("ignores hidden and already-grouped children", () => {
    const pick = pickBestCluster([
      ce("a", "Sean Paul - No Lie"),
      ce("h", "Sean Paul - No Lie (Remix)", { hidden: true }),
      ce("c", "Sean Paul - No Lie (Live)", { parent_id: "a" }),
    ]);
    // only "a" is eligible → no cluster of size >= 2
    expect(pick).toBeNull();
  });
});
