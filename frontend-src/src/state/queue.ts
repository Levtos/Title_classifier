// Pure state machine for the continuous variant queue mode (control#27).
// The queue is built ONCE from a snapshot of the current view (pickAllClusters)
// so polling / new sightings never reshuffle the work list mid-session. All
// transitions are pure and unit-tested; the Inbox/Catalog pages only render.

import type { ClusterPick } from "./variants";

/** What happened to a cluster the user has passed. */
export type QueueOutcome =
  | "grouped" // saved as master + variants (entries were marked reviewed)
  | "standalone" // no fitting master — deliberately closed as standalone
  | "skipped"; // no data change, entries stay open

export interface VariantQueueState {
  picks: ClusterPick[];
  /** Position in picks; picks.length ⇒ the queue has been worked through. */
  index: number;
  /** Per-cluster outcome; null = not decided (pending or skipped-back-onto). */
  outcomes: (QueueOutcome | null)[];
}

export function createQueue(picks: ClusterPick[]): VariantQueueState {
  return { picks, index: 0, outcomes: picks.map(() => null) };
}

export function currentPick(state: VariantQueueState): ClusterPick | null {
  return state.index < state.picks.length ? state.picks[state.index] : null;
}

/** True once the position has moved past the last cluster. */
export function isFinished(state: VariantQueueState): boolean {
  return state.index >= state.picks.length;
}

/** Record the outcome for the current cluster and advance to the next one. */
export function resolveCurrent(
  state: VariantQueueState,
  outcome: QueueOutcome
): VariantQueueState {
  if (isFinished(state)) return state;
  const outcomes = [...state.outcomes];
  outcomes[state.index] = outcome;
  return { ...state, outcomes, index: state.index + 1 };
}

/** Skip = advance without any data change; the entries stay open. */
export function skipCurrent(state: VariantQueueState): VariantQueueState {
  return resolveCurrent(state, "skipped");
}

/** Step back to the previous cluster (its earlier outcome stays recorded and
 *  is overwritten if the user decides again). No-op at the start. */
export function goBack(state: VariantQueueState): VariantQueueState {
  if (state.index === 0) return state;
  return { ...state, index: state.index - 1 };
}

export interface QueueProgress {
  position: number; // 1-based position for display; total when finished
  total: number;
  grouped: number;
  standalone: number;
  skipped: number;
}

export function queueProgress(state: VariantQueueState): QueueProgress {
  const counts = { grouped: 0, standalone: 0, skipped: 0 };
  for (const o of state.outcomes) {
    if (o !== null) counts[o] += 1;
  }
  return {
    position: Math.min(state.index + 1, Math.max(state.picks.length, 1)),
    total: state.picks.length,
    ...counts,
  };
}
