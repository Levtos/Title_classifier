import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Hass } from "../ha";
import { createV3Api } from "../api/v3";
import type { V3Entry, V3Source } from "./types";
import {
  clearDraft,
  clearSave,
  isDirty as isDirtyPure,
  patchServerEnum,
  setDraft,
  setSave,
  toDisplayEntries,
  type DisplayEntry,
  type DraftMap,
  type SaveMap,
} from "./drafts";

// Shared v3 data store: polls list_sources + list_entries and keeps a local
// draft-state that survives polls (see drafts.ts). The reconcile rule is simply
// "display = server entries with drafts overlaid", so a refresh can never
// clobber an unsaved enum edit.

export interface V3Store {
  sources: V3Source[];
  entries: V3Entry[];
  displayEntries: DisplayEntry[];
  entryCount: number | null;
  connected: boolean;
  error: string | null;
  lastSync: string | null;
  loading: boolean;
  refresh: () => void;
  // draft API
  setDraftEnum: (id: string, value: number) => void;
  resetDraft: (id: string) => void;
  applyDraft: (id: string) => Promise<void>;
  isDirty: (id: string) => boolean;
  getDisplayEntry: (id: string) => DisplayEntry | undefined;
  dirtyCount: number;
}

const POLL_MS = 5000;

export function useV3Store(hass: Hass | null): V3Store {
  const [sources, setSources] = useState<V3Source[]>([]);
  const [entries, setEntries] = useState<V3Entry[]>([]);
  const [drafts, setDrafts] = useState<DraftMap>({});
  const [saves, setSaves] = useState<SaveMap>({});
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hassRef = useRef<Hass | null>(hass);
  hassRef.current = hass;
  const draftsRef = useRef<DraftMap>(drafts);
  draftsRef.current = drafts;
  const inflight = useRef(false);
  const started = useRef(false);

  const refresh = useCallback(async () => {
    const h = hassRef.current;
    if (!h || inflight.current) return;
    inflight.current = true;
    setLoading(true);
    try {
      const api = createV3Api(h);
      const [srcs, ents] = await Promise.all([
        api.listSources(),
        api.listEntries({ include_hidden: true, limit: 20000 }),
      ]);
      setSources(srcs);
      setEntries(ents);
      setConnected(true);
      setError(null);
      setLastSync(new Date().toLocaleTimeString());
    } catch (e: unknown) {
      setConnected(false);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
      inflight.current = false;
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    if (hass && !started.current) {
      started.current = true;
      refresh();
    }
  }, [hass, refresh]);

  const setDraftEnum = useCallback((id: string, value: number) => {
    setDrafts((d) => setDraft(d, id, value));
    setSaves((s) => clearSave(s, id));
  }, []);

  const resetDraft = useCallback((id: string) => {
    setDrafts((d) => clearDraft(d, id));
    setSaves((s) => clearSave(s, id));
  }, []);

  const applyDraft = useCallback(
    async (id: string) => {
      const h = hassRef.current;
      const draft = draftsRef.current[id];
      if (!h || draft === undefined) return;
      setSaves((s) => setSave(s, id, { saving: true, error: null }));
      try {
        const api = createV3Api(h);
        const res = await api.setEnum(id, draft.enum);
        if (!res || !res.ok) throw new Error("set_enum rejected");
        // Optimistic patch + drop the draft so the row stays at the new value.
        setEntries((es) => patchServerEnum(es, id, res.enum ?? draft.enum));
        setDrafts((d) => clearDraft(d, id));
        setSaves((s) => clearSave(s, id));
        refresh();
      } catch (e: unknown) {
        setSaves((s) =>
          setSave(s, id, {
            saving: false,
            error: e instanceof Error ? e.message : String(e),
          })
        );
      }
    },
    [refresh]
  );

  const displayEntries = useMemo(
    () => toDisplayEntries(entries, drafts, saves),
    [entries, drafts, saves]
  );

  const isDirty = useCallback(
    (id: string) => isDirtyPure(entries, drafts, id),
    [entries, drafts]
  );

  const getDisplayEntry = useCallback(
    (id: string) => displayEntries.find((e) => e.id === id),
    [displayEntries]
  );

  return {
    sources,
    entries,
    displayEntries,
    entryCount: connected ? entries.length : null,
    connected,
    error,
    lastSync,
    loading,
    refresh,
    setDraftEnum,
    resetDraft,
    applyDraft,
    isDirty,
    getDisplayEntry,
    dirtyCount: Object.keys(drafts).length,
  };
}
