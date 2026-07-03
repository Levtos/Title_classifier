import { useEffect, useMemo, useState } from "react";
import type { Hass } from "../ha";
import { createV3Api } from "../api/v3";
import type { V3Store } from "../state/store";
import type { DisplayEntry } from "../state/drafts";
import { useEntryDetail } from "../state/detail";
import { buildGroupPayload } from "../state/group";
import { sortEntries, type SortMode } from "../state/sort";
import { mediaTypeClass, mediaTypeLabel } from "../state/media";
import {
  candidateKey,
  markVariantCandidates,
  pickBestCluster,
} from "../state/variants";
import type { Context, MediaType, SignalType } from "../state/types";
import { CONTEXTS, MEDIA_TYPES, SIGNAL_TYPES } from "../state/types";
import { EnumSelect } from "../components/EnumSelect";
import { DetailPanel } from "../components/DetailPanel";
import { SourceBadge } from "../components/SourceBadge";

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
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [detailReload, setDetailReload] = useState(0);
  const [groupOpen, setGroupOpen] = useState(false);
  const [groupMasterId, setGroupMasterId] = useState<string | null>(null);
  const [groupSaving, setGroupSaving] = useState(false);
  const [groupError, setGroupError] = useState<string | null>(null);
  // Snapshot of the entries selected at the moment the group dialog opened.
  // Passive polls / a new current_key may reshuffle `rows`, but the dialog must
  // stay pinned to what the user picked (stable master, stable payload).
  const [groupSnapshot, setGroupSnapshot] = useState<DisplayEntry[]>([]);
  // Why the assistant suggested this cluster (shown in the dialog); null for a
  // manually opened dialog.
  const [groupReason, setGroupReason] = useState<string | null>(null);

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
    const sorted = sortEntries(filtered, sortMode);
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
    sortMode,
  ]);

  const toggleSel = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Selection is ID-based and independent of the current filter/sort: derive the
  // selected entries from the full catalog, not from the filtered `rows`. That
  // way a poll or a new current_key that reshuffles `rows` never shrinks the
  // selection (bulk actions stay stable).
  const selectedEntries = useMemo(
    () => store.displayEntries.filter((e) => selected.has(e.id)),
    [store.displayEntries, selected]
  );

  // Prune only against entries that no longer exist (deleted). Never clear
  // wholesale on filter/sort/current_key changes.
  useEffect(() => {
    setSelected((prev) => {
      if (prev.size === 0) return prev;
      const existing = new Set(store.displayEntries.map((e) => e.id));
      let changed = false;
      const next = new Set<string>();
      for (const id of prev) {
        if (existing.has(id)) next.add(id);
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [store.displayEntries]);

  // "Select all visible" respects the exact filtered/sorted working list.
  const allVisibleSelected =
    rows.length > 0 && rows.every((e) => selected.has(e.id));

  const toggleSelectVisible = () => {
    const ids = rows.map((e) => e.id);
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        for (const id of ids) next.delete(id); // deselect only the visible ones
      } else {
        for (const id of ids) next.add(id); // keep off-screen selection intact
      }
      return next;
    });
  };

  // Do the selected entries look like one variant cluster? (group-dialog hint).
  // Computed from the dialog snapshot so a poll can't flip the hint mid-dialog.
  const groupIsCluster = useMemo(() => {
    if (groupSnapshot.length < 2) return false;
    const keys = new Set(
      groupSnapshot.map(
        (e) => `${e.media_type}|${e.signal_type}|${candidateKey(e.key)}`
      )
    );
    return keys.size === 1;
  }, [groupSnapshot]);

  const hideSelected = async () => {
    for (const e of selectedEntries) {
      if (!e.hidden) await store.setHidden(e.id, true);
    }
    setSelected(new Set());
  };

  const clearSelection = () => {
    setSelected(new Set());
    setGroupOpen(false);
    setGroupMasterId(null);
    setGroupSnapshot([]);
    setGroupReason(null);
    setGroupError(null);
  };

  const openGroupDialog = () => {
    if (selectedEntries.length < 2) return;
    setGroupSnapshot(selectedEntries);
    setGroupMasterId(selectedEntries[0].id);
    setGroupReason(null);
    setGroupError(null);
    setGroupOpen(true);
  };

  // Varianten-Assistent: find the best cluster in the *current view*, select it
  // and open the group dialog with a preselected master + a "why" hint. It only
  // prepares the confirmation dialog — nothing is grouped until the user saves.
  const suggestion = useMemo(() => pickBestCluster(rows), [rows]);

  const runVariantAssistant = () => {
    if (!suggestion) return;
    const ids = new Set(suggestion.ids);
    const snapshot = rows.filter((e) => ids.has(e.id));
    if (snapshot.length < 2) return;
    setSelected(new Set(suggestion.ids));
    setGroupSnapshot(snapshot);
    setGroupMasterId(suggestion.masterId);
    setGroupReason(suggestion.reason);
    setGroupError(null);
    setGroupOpen(true);
  };

  const saveGroup = async () => {
    if (!hass) {
      setGroupError("Home Assistant ist nicht verbunden.");
      return;
    }
    const masterId = groupMasterId ?? groupSnapshot[0]?.id;
    if (!masterId) return;

    setGroupSaving(true);
    setGroupError(null);
    try {
      const payload = buildGroupPayload(
        groupSnapshot.map((e) => e.id),
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
      setGroupSnapshot([]);
      setGroupReason(null);
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
          <select
            className="tc-select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            title="Sortierung"
          >
            <option value="newest">Neueste zuerst</option>
            <option value="oldest">Älteste zuerst</option>
            <option value="title">Titel A–Z</option>
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
          <button
            className="tc-btn"
            type="button"
            disabled={rows.length === 0}
            onClick={toggleSelectVisible}
            title="Wählt genau die aktuell gefilterten Einträge"
          >
            {allVisibleSelected ? "Sichtbare abwählen" : "Alle sichtbaren auswählen"}
          </button>
          <button
            className="tc-btn"
            type="button"
            disabled={!suggestion || groupSaving}
            onClick={runVariantAssistant}
            title={
              suggestion
                ? suggestion.reason
                : "Keine Varianten-Vorschläge in der aktuellen Ansicht."
            }
          >
            🪄 Varianten-Vorschlag
          </button>
          <span className="tc-filters-info">
            {rows.length} Einträge · Auswahl {selected.size} · offen{" "}
            {store.dirtyCount}
          </span>
          {selectedEntries.length >= 2 ? (
            <button
              className="tc-btn primary"
              type="button"
              disabled={!hass || groupSaving}
              onClick={openGroupDialog}
            >
              Gruppieren ({selectedEntries.length})
            </button>
          ) : null}
          {selectedEntries.length > 0 ? (
            <button
              className="tc-btn"
              type="button"
              disabled={!hass || groupSaving}
              onClick={hideSelected}
            >
              Ausblenden ({selectedEntries.length})
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
                    } ${e.dirty ? "dirty" : ""} ${
                      selected.has(e.id) ? "selected" : ""
                    }`}
                    onClick={() => setFocusedId(e.id)}
                  >
                    <td
                      className="tc-check-cell"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        toggleSel(e.id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(e.id)}
                        readOnly
                        tabIndex={-1}
                      />
                    </td>
                    <td className="tc-key">{e.key}</td>
                    <td>{mediaTypeLabel(e.media_type)}</td>
                    <td>
                      <SourceBadge entry={e} />
                    </td>
                    <td>{e.signal_type}</td>
                    <td>
                      <EnumSelect
                        value={e.enum}
                        dirty={e.dirty}
                        onChange={(v) => store.setDraftEnum(e.id, v)}
                      />
                    </td>
                    <td>{e.is_current ? e.effective_enum ?? "—" : "—"}</td>
                    <td className="tc-status-cell">
                      <div className="tc-status-badges">
                        {e.saving ? <span className="badge">speichert…</span> : null}
                        {e.saveError ? <span className="badge off">Fehler</span> : null}
                        {e.dirty ? (
                          <span className="badge dirtybadge">geändert</span>
                        ) : null}
                        {e.is_current ? (
                          <span className="badge cur">läuft</span>
                        ) : null}
                        {e.variants.length > 0 ? (
                          <span className="badge var">
                            Master · {e.variants.length}
                          </span>
                        ) : e.is_variant ? (
                          <span className="badge var">Variante</span>
                        ) : null}
                        {e.hidden ? <span className="badge off">versteckt</span> : null}
                        {isCand(e.id) ? (
                          <span
                            className="badge var"
                            title="Mögliche Variante — nicht automatisch gruppiert"
                          >
                            ⛓ {candidates.get(e.id)?.clusterSize}
                          </span>
                        ) : null}
                        {!(
                          e.saving ||
                          e.saveError ||
                          e.dirty ||
                          e.is_current ||
                          e.variants.length > 0 ||
                          e.is_variant ||
                          e.hidden ||
                          isCand(e.id)
                        ) ? (
                          <span className="tc-muted">—</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="tc-muted">
                      {e.seen_count}× · {shortTime(e.last_seen)}
                    </td>
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
            {groupReason ? (
              <p className="tc-hint-ok">🪄 Vorschlag: {groupReason}</p>
            ) : null}
            {groupIsCluster ? (
              <p className="tc-hint-ok">⛓ Mögliche Variante erkannt.</p>
            ) : (
              <p className="tc-hint-warn">
                Keine offensichtliche Varianten-Übereinstimmung erkannt. Trotzdem
                gruppieren?
              </p>
            )}
            <p className="tc-muted">
              Master wählen — die übrigen werden Varianten darunter:
            </p>
            <div className="tc-group-list">
              {groupSnapshot.map((entry) => (
                <label key={entry.id} className="tc-group-option">
                  <input
                    type="radio"
                    name="tc-group-master"
                    checked={(groupMasterId ?? groupSnapshot[0]?.id) === entry.id}
                    disabled={groupSaving}
                    onChange={() => setGroupMasterId(entry.id)}
                  />
                  <span>
                    <b>{entry.key}</b>
                    <small>
                      {entry.media_type} · {entry.signal_type}
                      {entry.variants.length > 0
                        ? ` · bestehende Gruppe (${entry.variants.length})`
                        : ""}
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
                disabled={groupSaving || groupSnapshot.length < 2}
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
        onHide={store.setHidden}
      />
    </div>
  );
}
