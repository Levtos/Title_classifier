import { useMemo, useState } from "react";
import type { Hass } from "../ha";
import type { V3Store } from "../state/store";
import { useEntryDetail } from "../state/detail";
import { sortInbox } from "../state/sort";
import type { Context, MediaType, SignalType } from "../state/types";
import { CONTEXTS, MEDIA_TYPES, SIGNAL_TYPES } from "../state/types";
import { EnumSelect } from "../components/EnumSelect";
import { DetailPanel } from "../components/DetailPanel";

function shortTime(ts: string): string {
  const d = new Date(ts);
  return isNaN(d.getTime()) ? ts : d.toLocaleString();
}

export function Inbox({ store, hass }: { store: V3Store; hass: Hass | null }) {
  const [search, setSearch] = useState("");
  const [media, setMedia] = useState<MediaType | "">("");
  const [signal, setSignal] = useState<SignalType | "">("");
  const [context, setContext] = useState<Context | "">("");
  const [includeHidden, setIncludeHidden] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [focusedId, setFocusedId] = useState<string | null>(null);

  // Default Inbox filter: unclassified (server enum 0), not hidden, top-level.
  const rows = useMemo(
    () =>
      sortInbox(
        store.displayEntries.filter((e) => {
          if (e.parent_id !== null) return false;
          if (e.serverEnum !== 0) return false;
          if (!includeHidden && e.hidden) return false;
          if (media && e.media_type !== media) return false;
          if (signal && e.signal_type !== signal) return false;
          if (context && e.current_context !== context) return false;
          if (search && !e.key.toLowerCase().includes(search.toLowerCase()))
            return false;
          return true;
        })
      ),
    [store.displayEntries, includeHidden, media, signal, context, search]
  );

  const toggleSel = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const focused = focusedId ? store.getDisplayEntry(focusedId) : undefined;
  const detailState = useEntryDetail(hass, focusedId);
  const artwork = focusedId
    ? store.sources.find((s) => s.current_entry_id === focusedId)
        ?.current_artwork ?? null
    : null;

  return (
    <div className="tc-inbox">
      <div className="tc-inbox-main">
        <div className="tc-filters">
          <input
            className="tc-input"
            type="search"
            placeholder="Suche …"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="tc-select"
            value={media}
            onChange={(e) => setMedia(e.target.value as MediaType | "")}
          >
            <option value="">Medienart: Alle</option>
            {MEDIA_TYPES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="tc-select"
            value={context}
            onChange={(e) => setContext(e.target.value as Context | "")}
          >
            <option value="">Kontext: Alle</option>
            {CONTEXTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="tc-select"
            value={signal}
            onChange={(e) => setSignal(e.target.value as SignalType | "")}
          >
            <option value="">Signal: Alle</option>
            {SIGNAL_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <label className="tc-check">
            <input
              type="checkbox"
              checked={includeHidden}
              onChange={(e) => setIncludeHidden(e.target.checked)}
            />
            versteckte
          </label>
          <span className="tc-filters-info">
            {rows.length} Einträge · Auswahl {selected.size} · offen{" "}
            {store.dirtyCount}
          </span>
        </div>

        <div className="tc-table-wrap">
          <table className="tc-table">
            <thead>
              <tr>
                <th></th>
                <th>Key</th>
                <th>Art</th>
                <th>Kontext</th>
                <th>Signal</th>
                <th>Enum</th>
                <th>Eff.</th>
                <th>Status</th>
                <th>Zuletzt</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="tc-placeholder">
                    Keine unklassifizierten Einträge.
                  </td>
                </tr>
              ) : (
                rows.map((e) => (
                  <tr
                    key={e.id}
                    className={`${e.id === focusedId ? "focused" : ""} ${
                      e.dirty ? "dirty" : ""
                    }`}
                    onClick={() => setFocusedId(e.id)}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(e.id)}
                        onClick={(ev) => ev.stopPropagation()}
                        onChange={() => toggleSel(e.id)}
                      />
                    </td>
                    <td className="tc-key">{e.key}</td>
                    <td>{e.media_type}</td>
                    <td>{e.is_current ? e.current_context ?? "—" : "—"}</td>
                    <td>{e.signal_type}</td>
                    <td>
                      <EnumSelect
                        value={e.enum}
                        dirty={e.dirty}
                        onChange={(v) => store.setDraftEnum(e.id, v)}
                      />
                    </td>
                    <td>{e.is_current ? e.effective_enum ?? "—" : "—"}</td>
                    <td>
                      {e.saving ? (
                        <span className="badge">speichert…</span>
                      ) : e.saveError ? (
                        <span className="badge off">Fehler</span>
                      ) : e.dirty ? (
                        <span className="badge dirtybadge">geändert</span>
                      ) : e.hidden ? (
                        <span className="badge off">versteckt</span>
                      ) : (
                        <span className="tc-muted">—</span>
                      )}
                    </td>
                    <td className="tc-muted">{shortTime(e.last_seen)}</td>
                    <td>
                      {e.dirty ? (
                        <span
                          className="tc-row-actions"
                          onClick={(ev) => ev.stopPropagation()}
                        >
                          <button
                            className="tc-btn primary tc-mini"
                            disabled={e.saving}
                            onClick={() => store.applyDraft(e.id)}
                          >
                            ✓
                          </button>
                          <button
                            className="tc-btn tc-mini"
                            disabled={e.saving}
                            onClick={() => store.resetDraft(e.id)}
                          >
                            ↺
                          </button>
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailPanel
        entry={focused}
        detail={detailState}
        artwork={artwork}
        onDraftEnum={store.setDraftEnum}
        onApply={store.applyDraft}
        onReset={store.resetDraft}
      />
    </div>
  );
}
