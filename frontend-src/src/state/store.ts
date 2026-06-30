import { useCallback, useEffect, useRef, useState } from "react";
import type { Hass } from "../ha";
import { createV3Api } from "../api/v3";
import type { V3Entry, V3Source } from "./types";

// Shared v3 data store: polls list_sources + list_entries, tracks connection /
// error / last-sync, and exposes a manual refresh. This is the reconcile
// foundation — PR3 (Inbox) layers a draft-state on top that survives polls.

export interface V3Store {
  sources: V3Source[];
  entries: V3Entry[];
  entryCount: number | null;
  connected: boolean;
  error: string | null;
  lastSync: string | null;
  loading: boolean;
  refresh: () => void;
}

const POLL_MS = 5000;

export function useV3Store(hass: Hass | null): V3Store {
  const [sources, setSources] = useState<V3Source[]>([]);
  const [entries, setEntries] = useState<V3Entry[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hassRef = useRef<Hass | null>(hass);
  hassRef.current = hass;
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

  // Poll on an interval (uses the latest hass via the ref).
  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  // Refresh promptly the first time hass becomes available.
  useEffect(() => {
    if (hass && !started.current) {
      started.current = true;
      refresh();
    }
  }, [hass, refresh]);

  return {
    sources,
    entries,
    entryCount: connected ? entries.length : null,
    connected,
    error,
    lastSync,
    loading,
    refresh,
  };
}
