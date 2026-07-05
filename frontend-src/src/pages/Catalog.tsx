import { useMemo, useState } from "react";
import type { Hass } from "../ha";
import { createV3Api } from "../api/v3";
import type { V3Store } from "../state/store";
import type { DisplayEntry } from "../state/drafts";
import { useEntryDetail } from "../state/detail";
import { mediaTypeClass, mediaTypeLabel } from "../state/media";
import {
  buildCatalogTree,
  filterCatalog,
  selectByTab,
  type CatalogTab,
} from "../state/tree";
import {
  CATALOG_SORT_MODES,
  catalogRowStatus,
  masterCandidates,
  sortCatalog,
  type CatalogSortMode,
  type CatalogSortable,
} from "../state/catalog";
import type { Context, MediaType, SignalType } from "../state/types";
import { CONTEXTS, MEDIA_TYPES, SIGNAL_TYPES } from "../state/types";
import { DetailPanel } from "../components/DetailPanel";
import { DiagnosisModal } from "../components/DiagnosisModal";
import { SourceBadge } from "../components/SourceBadge";

const TABS: { id: CatalogTab; label: string }[] = [
  { id: "all", label: "Alle" },
  { id: "unsorted", label: "Unsortiert" },
  { id: "groups", label: "Gruppen" },
  { id: "hidden", label: "Ausgeblendet" },
];

const CONTEXT_LABEL: Record<Context, string> = {
  homepod: "HomePod",
  pc: "PC",
  ps5: "PS5",
  switch: "Switch",
  stash: "Stash",
  apple_tv: "Apple TV",
};

interface Row {
  entry: DisplayEntry;
  depth: number;
  isMaster: boolean;
  childCount: number;
  orphan: boolean;
}

function shortTime(ts: string): string {
  const d = new Date(ts);
  return isNaN(d.getTime()) ? ts : d.toLocaleString();
}

export function Catalog({ store, hass }: { store: V3Store; hass: Hass | null }) {
  const [tab, setTab] = useState<CatalogTab>("all");
  const [search, setSearch] = useState("");
  const [media, setMedia] = useState<MediaType | "">("");
  const [signal, setSignal] = useState<SignalType | "">("");
  const [context, setContext] = useState<Context | "">("");
  const [sortMode, setSortMode] = useState<CatalogSortMode>("title-asc");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [detailReload, setDetailReload] = useState(0);
  const [groupBusy, setGroupBusy] = useState(false);
  const [groupError, setGroupError] = useState<string | null>(null);
  const [diagOpen, setDiagOpen] = useState(false);

  const rows = useMemo<Row[]>(() => {
    const subset = selectByTab(store.displayEntries, tab);
    const filtered = filterCatalog(subset, { search, media, signal, context });
    const tree = buildCatalogTree(filtered);
    const byId = new Map(tree.map((n) => [n.entry.id, n]));
    const sortables: CatalogSortable[] = tree.map((n) => ({
      id: n.entry.id,
      key: n.entry.key,
      last_seen: n.entry.last_seen,
      first_seen: n.entry.first_seen,
      enum: n.entry.enum,
      hidden: n.entry.hidden,
      childCount: n.entry.variants.length,
      orphan: n.orphan,
    }));
    const out: Row[] = [];
    for (const s of sortCatalog(sortables, sortMode)) {
      const node = byId.get(s.id);
      if (!node) continue;
      const childCount = node.entry.variants.length;
      out.push({
        entry: node.entry,
        depth: 0,
        isMaster: childCount > 0,
        childCount,
        orphan: node.orphan,
      });
      for (const child of node.children) {
        out.push({
          entry: child,
          depth: 1,
          isMaster: false,
          childCount: 0,
          orphan: false,
        });
      }
    }
    return out;
  }, [store.displayEntries, tab, search, media, signal, context, sortMode]);

  const focused = focusedId ? store.getDisplayEntry(focusedId) : undefined;
  const detailState = useEntryDetail(hass, focusedId, detailReload);
  const artwork = focusedId
    ? store.sources.find((s) => s.current_entry_id === focusedId)
        ?.current_artwork ?? null
    : null;

  // Valid group masters for the focused entry (mirrors the backend guard).
  const masterOptions = useMemo(() => {
    if (!focused || focused.variants.length > 0) return [];
    return masterCandidates(store.displayEntries, focused).map((e) => ({
      id: e.id,
      key: e.key,
    }));
  }, [store.displayEntries, focused]);

  const doHide = async (id: string, hidden: boolean) => {
    await store.setHidden(id, hidden);
    setDetailReload((n) => n + 1);
    // Restoring while on the Hidden tab drops the entry out of the current view.
    if (tab === "hidden" && !hidden) setFocusedId(null);
  };

  const doGroup = async (childId: string, parentId: string) => {
    if (!hass) {
      setGroupError("Home Assistant ist nicht verbunden.");
      return;
    }
    setGroupBusy(true);
    setGroupError(null);
    try {
      const res = await createV3Api(hass).group(childId, parentId);
      if (!res?.ok) throw new Error("group rejected");
      setFocusedId(parentId); // focus the master so the fresh group is visible
      setDetailReload((n) => n + 1);
      store.refresh();
    } catch (e: unknown) {
      setGroupError(e instanceof Error ? e.message : String(e));
    } finally {
      setGroupBusy(false);
    }
  };

  const doUngroup = async (childId: string) => {
    if (!hass) {
      setGroupError("Home Assistant ist nicht verbunden.");
      return;
    }
    setGroupBusy(true);
    setGroupError(null);
    try {
      const res = await createV3Api(hass).ungroup(childId);
      if (!res?.ok) throw new Error("ungroup rejected");
      setDetailReload((n) => n + 1);
      store.refresh();
    } catch (e: unknown) {
      setGroupError(e instanceof Error ? e.message : String(e));
    } finally {
      setGroupBusy(false);
    }
  };

  return (
    <div className="tc-inbox">
      <div className="tc-inbox-main">
        <div className="tc-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tc-tab ${t.id === tab ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="tc-filters">
          <input
            className="tc-input"
            type="search"
            placeholder="Titel / Key suchen …"
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
            <option value="">Quelle: Alle</option>
            {CONTEXTS.map((c) => (
              <option key={c} value={c}>
                {CONTEXT_LABEL[c]}
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
            onChange={(e) => setSortMode(e.target.value as CatalogSortMode)}
            title="Sortierung"
          >
            {CATALOG_SORT_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <span className="tc-filters-info">{rows.length} Zeilen</span>
        </div>

        <div className="tc-table-wrap">
          <table className="tc-table">
            <thead>
              <tr>
                <th>Titel / Key</th>
                <th>Art</th>
                <th>Enum</th>
                <th>Status</th>
                <th>Sichtungen</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="tc-placeholder">
                    Keine Einträge in dieser Ansicht.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const badges = catalogRowStatus({
                    isMaster: r.isMaster,
                    childCount: r.childCount,
                    isChild: r.depth > 0,
                    orphan: r.orphan,
                    hidden: r.entry.hidden,
                    isCurrent: r.entry.is_current,
                    enum: r.entry.enum,
                  });
                  return (
                    <tr
                      key={r.entry.id}
                      className={`${mediaTypeClass(r.entry.media_type)} ${
                        r.entry.id === focusedId ? "focused" : ""
                      } ${r.depth > 0 ? "is-child" : ""}`}
                      onClick={() => setFocusedId(r.entry.id)}
                    >
                      <td
                        className="tc-key"
                        style={r.depth > 0 ? { paddingLeft: 26 } : undefined}
                      >
                        {r.depth > 0 ? "↳ " : ""}
                        {r.entry.key}
                      </td>
                      <td className="tc-art-cell">
                        {mediaTypeLabel(r.entry.media_type)}{" "}
                        <SourceBadge entry={r.entry} />
                      </td>
                      <td>
                        {r.entry.enum}
                        {r.entry.is_current &&
                        r.entry.effective_enum !== null &&
                        r.entry.effective_enum !== r.entry.enum ? (
                          <span className="tc-sub"> →{r.entry.effective_enum}</span>
                        ) : null}
                      </td>
                      <td className="tc-status-cell">
                        <div className="tc-status-badges">
                          {badges.length === 0 ? (
                            <span className="tc-muted">—</span>
                          ) : (
                            badges.map((b) => (
                              <span key={b.key} className={`badge ${b.tone}`}>
                                {b.label}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="tc-muted">
                        {r.entry.seen_count_total}× · {shortTime(r.entry.last_seen)}
                      </td>
                    </tr>
                  );
                })
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
        onHide={doHide}
        masterOptions={masterOptions}
        onGroup={doGroup}
        onUngroup={doUngroup}
        groupBusy={groupBusy}
        groupError={groupError}
        showTrace
        onOpenDiagnosis={() => setDiagOpen(true)}
      />

      {diagOpen ? (
        <DiagnosisModal
          entryId={focusedId}
          entry={focused}
          detail={detailState}
          connected={store.connected}
          onClose={() => setDiagOpen(false)}
        />
      ) : null}
    </div>
  );
}
