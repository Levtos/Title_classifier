// Pure draft / reconcile logic for the Inbox (and later the Catalog). The whole
// point: a poll replaces the server entries but NEVER the user's unsaved drafts,
// because drafts live in a separate map and are overlaid at display time. This
// is the fix for the old "enum springs back to 0 on refresh" bug, and it is
// unit-tested in drafts.test.ts.

import type { V3Entry } from "./types";

export interface Draft {
  enum: number;
}
export type DraftMap = Record<string, Draft>;

export interface SaveState {
  saving: boolean;
  error: string | null;
}
export type SaveMap = Record<string, SaveState>;

export interface DisplayEntry extends V3Entry {
  /** The authoritative server enum (for the dirty comparison). */
  serverEnum: number;
  /** True when a draft differs from the server value. */
  dirty: boolean;
  saving: boolean;
  saveError: string | null;
}

export function toDisplayEntry(
  server: V3Entry,
  draft: Draft | undefined,
  save: SaveState | undefined
): DisplayEntry {
  const hasDraft = draft !== undefined;
  const value = hasDraft ? draft.enum : server.enum;
  return {
    ...server,
    enum: value,
    serverEnum: server.enum,
    dirty: hasDraft && draft.enum !== server.enum,
    saving: save?.saving ?? false,
    saveError: save?.error ?? null,
  };
}

export function toDisplayEntries(
  servers: V3Entry[],
  drafts: DraftMap,
  saves: SaveMap
): DisplayEntry[] {
  return servers.map((s) => toDisplayEntry(s, drafts[s.id], saves[s.id]));
}

export function setDraft(drafts: DraftMap, id: string, enumValue: number): DraftMap {
  return { ...drafts, [id]: { enum: enumValue } };
}

export function clearDraft(drafts: DraftMap, id: string): DraftMap {
  if (!(id in drafts)) return drafts;
  const next = { ...drafts };
  delete next[id];
  return next;
}

export function setSave(saves: SaveMap, id: string, state: SaveState): SaveMap {
  return { ...saves, [id]: state };
}

export function clearSave(saves: SaveMap, id: string): SaveMap {
  if (!(id in saves)) return saves;
  const next = { ...saves };
  delete next[id];
  return next;
}

/** Optimistically patch the server enum after a successful apply, so the row
 * never briefly flips back to the old value before the next poll lands. */
export function patchServerEnum(
  servers: V3Entry[],
  id: string,
  enumValue: number
): V3Entry[] {
  return servers.map((s) => (s.id === id ? { ...s, enum: enumValue } : s));
}

export function isDirty(
  servers: V3Entry[],
  drafts: DraftMap,
  id: string
): boolean {
  const draft = drafts[id];
  if (draft === undefined) return false;
  const server = servers.find((s) => s.id === id);
  return server === undefined || draft.enum !== server.enum;
}
