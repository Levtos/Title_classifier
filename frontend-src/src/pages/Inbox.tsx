import { useMemo, useState } from "react";
import type { Hass } from "../ha";
import { createV3Api } from "../api/v3";
import type { V3Store } from "../state/store";
import { useEntryDetail } from "../state/detail";
import { buildGroupPayload } from "../state/group";
import { sortInbox } from "../state/sort";
import { mediaTypeClass } from "../state/media";
import { markVariantCandidates } from "../state/variants";
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
  const [variantsFirst, setVariantsFirst] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [detailReload, setDetailReload] = useState(0);
  const [groupOpen, setGroupOpen] = useState(false);
  const [groupMasterId, setGroupMasterId] = useState<string | null>(null);
  const [groupSaving, setGroupSaving] = useState(false);
  const [groupError, setGroupError] = useState<string | null>(null);

  // Union of configured inactive keys across watchers → hide stale rows like
  // "No Game" that were saved before the value was added.
  const inactiveKeys = useMemo(
    () => new Set(store.sources.flatMap((s) => s.inactive_keys ?? [])),
    [store.sources]
  );

  // Frontend-only variant-candidate hint (never auto-groups).
  const candidates = useMemo(
    () => markVariantCandidates(store.displayEntries),
    [store.displayEntries]
  );
  const isCand = (id: string) => candidates.get(id)?.candidate ?? false;

  // Default Inbox filter: unclassified (server enum 0), not hidden, top-level,
  // not an inactive value.
  const rows = useMemo(() => {
    const filtered = store.displayEntries.filter((e) => {
      if (e.parent_id !== null) return false;
      if (e.serverEnum !== 0) return false;
      if (!includeHidden && e.hidden) return false;
      if (inactiveKeys.has(e.normalized_key)) return false;
      if (media && e.media_type !== media) return false;
      if (signal && e.signal_type !== signal) return false;
      if (context && e.current_context !== context) return false;
      if (search && !e.key.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
    const sorted = sortInbox(filtered);
    // Stable second pass: candidate clusters to the top when toggled on.
    return variantsFirst
      ? [...sorted].sort((a, b) => Number(isCand(b.id)) - Number(isCand(a.id)))
      : sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    store.displayEntries,
    includeHidden,
    media,
    signal,
    context,
    search,
    inactiveKeys,
    candidates,
    variantsFirst,
  ]);

  const toggleSel = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectedRows = useMemo(
    () => rows.filter((e) => selected.has(e.id)),
    [rows, selected]
  );

  const clearSelection = () => {
    setSelected(new Set());
    setGroupOpen(false);
    setGroupMasterId(null);
    setGroupError(null);
  };

  const openGroupDialog = () => {
    if (selectedRows.length < 2) return;
    setGroupMasterId(selectedRows[0].id);
    setGroupError(null);
    setGroupOpen(true);
  };

  const saveGroup = async () => {
    if (!hass) {
      setGroupError("Home Assistant ist nicht verbunden.");
      return;
    }
    const masterId = groupMasterId ?? selectedRows[0]?.id;
    if (!masterId) return;

    setGroupSaving(true);
    setGroupError(null);
    try {
      const payload = buildGroupPayload(
        selectedRows.map((e) => e.id),
        masterId
      );
      const api = createV3Api(hass);
      for (const childId of payload.child_ids) {
        const res = await api.group(childId, payload.parent_id);
        if (!res?.ok) throw new Error("group rejected");
      }
      setSelected(new Set());
      setGroupOpen(false);
      setGroupMasterId(null);
      setFocusedId(payload.parent_id);
      setDetailReload((n) => n + 1);
      store.refresh();
    } catch (e: unknown) {
      setGroupError(e instanceof Error ? e.message : String(e));
      store.refresh();
    } finally {
      setGroupSaving(false);
    }
  };

  const focused = focusedId ? store.getDisplayEntry(focusedId) : undefined;
  const detailState = useEntryDetail(hass, focusedId, detailReload);
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
          <label className="tc-check">
            <input
              type="checkbox"
              checked={variantsFirst}
              onChange={(e) => setVariantsFirst(e.target.checked)}
            />
            mögliche Varianten zuerst
          </label>
          <span className="tc-filters-info">
            {rows.length} Einträge · Auswahl {selected.size} · offen{" "}
            {store.dirtyCount}
          </span>
          {selectedRows.length >= 2 ? (
            <button
              className="tc-btn primary"
              type="button"
              disabled={!hass || groupSaving}
              onClick={openGroupDialog}
            >
              Gruppieren ({selectedRows.length})
            </button>
          ) : null}
          {selected.size > 0 ? (
            <button
              className="tc-btn"
              type="button"
              disabled={groupSaving}
              onClick={clearSelection}
            >
              Auswahl aufheben
            </button>
          ) : null}
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
                    className={`${mediaTypeClass(e.media_type)} ${
                      e.id === focusedId ? "focused" : ""
                    } ${e.dirty ? "dirty" : ""}`}
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
                      {isCand(e.id) ? (
                        <span
                          className="badge var"
                          title="Mögliche Variante — nicht automatisch gruppiert"
                        >
                          ⛓ {candidates.get(e.id)?.clusterSize}
                        </span>
                      ) : null}
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

      {groupOpen ? (
        <div
          className="tc-modal-backdrop"
          role="presentation"
          onClick={() => {
            if (!groupSaving) setGroupOpen(false);
          }}
        >
          <div
            className="tc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tc-group-title"
            onClick={(ev) => ev.stopPropagation()}
          >
            <h3 id="tc-group-title">Einträge gruppieren</h3>
            <div className="tc-group-list">
              {selectedRows.map((entry) => (
                <label key={entry.id} className="tc-group-option">
                  <input
                    type="radio"
                    name="tc-group-master"
                    checked={(groupMasterId ?? selectedRows[0]?.id) === entry.id}
                    disabled={groupSaving}
                    onChange={() => setGroupMasterId(entry.id)}
                  />
                  <span>
                    <b>{entry.key}</b>
                    <small>
                      {entry.media_type} · {entry.signal_type}
                    </small>
                  </span>
                </label>
              ))}
            </div>
            {groupError ? (
              <div className="tc-detail-error">Gruppieren fehlgeschlagen: {groupError}</div>
            ) : null}
            <div className="tc-modal-actions">
              <button
                className="tc-btn"
                type="button"
                disabled={groupSaving}
                onClick={() => setGroupOpen(false)}
              >
                Abbrechen
              </button>
              <button
                className="tc-btn primary"
                type="button"
                disabled={groupSaving || selectedRows.length < 2}
                onClick={saveGroup}
              >
                {groupSaving ? "Speichert…" : "Speichern"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
