import { describe, expect, it } from "vitest";
import type { ClusterPick } from "./variants";
import {
  createQueue,
  currentPick,
  goBack,
  isFinished,
  queueProgress,
  resolveCurrent,
  skipCurrent,
} from "./queue";

function pick(masterId: string, ...others: string[]): ClusterPick {
  return {
    ids: [masterId, ...others],
    masterId,
    reason: `${1 + others.length} Varianten von ${masterId}`,
  };
}

describe("variant queue state machine", () => {
  it("starts at the first cluster and is finished after the last", () => {
    let q = createQueue([pick("a", "a2"), pick("b", "b2")]);
    expect(currentPick(q)?.masterId).toBe("a");
    expect(isFinished(q)).toBe(false);

    q = resolveCurrent(q, "grouped");
    expect(currentPick(q)?.masterId).toBe("b");

    q = resolveCurrent(q, "grouped");
    expect(currentPick(q)).toBeNull();
    expect(isFinished(q)).toBe(true);
  });

  it("skip advances without recording a data change as grouped", () => {
    let q = createQueue([pick("a", "a2"), pick("b", "b2")]);
    q = skipCurrent(q);
    expect(currentPick(q)?.masterId).toBe("b");
    expect(queueProgress(q).skipped).toBe(1);
    expect(queueProgress(q).grouped).toBe(0);
  });

  it("goBack returns to the previous cluster and allows a new decision", () => {
    let q = createQueue([pick("a", "a2"), pick("b", "b2")]);
    q = resolveCurrent(q, "skipped");
    q = goBack(q);
    expect(currentPick(q)?.masterId).toBe("a");
    // Deciding again overwrites the earlier outcome.
    q = resolveCurrent(q, "grouped");
    expect(queueProgress(q).grouped).toBe(1);
    expect(queueProgress(q).skipped).toBe(0);
  });

  it("goBack at the start is a no-op", () => {
    const q = createQueue([pick("a", "a2")]);
    expect(goBack(q)).toBe(q);
  });

  it("resolving a finished queue is a no-op", () => {
    let q = createQueue([pick("a", "a2")]);
    q = resolveCurrent(q, "standalone");
    expect(resolveCurrent(q, "grouped")).toBe(q);
    expect(queueProgress(q).standalone).toBe(1);
  });

  it("progress reports position/total and per-outcome counts", () => {
    let q = createQueue([pick("a", "a2"), pick("b", "b2"), pick("c", "c2")]);
    expect(queueProgress(q)).toMatchObject({ position: 1, total: 3 });
    q = resolveCurrent(q, "grouped");
    q = resolveCurrent(q, "standalone");
    expect(queueProgress(q)).toMatchObject({
      position: 3,
      total: 3,
      grouped: 1,
      standalone: 1,
      skipped: 0,
    });
  });

  it("an empty queue is immediately finished", () => {
    const q = createQueue([]);
    expect(currentPick(q)).toBeNull();
    expect(isFinished(q)).toBe(true);
  });
});
