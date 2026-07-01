import { useEffect, useRef, useState } from "react";
import type { Hass } from "../ha";
import { createV3Api } from "../api/v3";
import type { V3EntryDetail } from "./types";

export interface EntryDetailState {
  detail: V3EntryDetail | null;
  loading: boolean;
  error: string | null;
}

const EMPTY: EntryDetailState = { detail: null, loading: false, error: null };

// Loads title_classifier/v3/entry_detail for the selected entry. Never guesses
// contexts — they come straight from the API. Errors stay visible.
export function useEntryDetail(
  hass: Hass | null,
  id: string | null,
  reloadKey: number | string = 0
): EntryDetailState {
  const [state, setState] = useState<EntryDetailState>(EMPTY);
  const hassRef = useRef<Hass | null>(hass);
  hassRef.current = hass;

  useEffect(() => {
    const h = hassRef.current;
    if (!id || !h) {
      setState(EMPTY);
      return;
    }
    let cancelled = false;
    setState((s) => ({
      detail: s.detail && s.detail.id === id ? s.detail : null,
      loading: true,
      error: null,
    }));
    createV3Api(h)
      .entryDetail(id)
      .then((detail) => {
        if (!cancelled) setState({ detail, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setState({
            detail: null,
            loading: false,
            error: e instanceof Error ? e.message : String(e),
          });
      });
    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  return state;
}
