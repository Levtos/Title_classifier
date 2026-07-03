import { useMemo, useState } from "react";
import type { Hass } from "../ha";
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
import type { MediaType, SignalType } from "../state/types";
import { MEDIA_TYPES, SIGNAL_TYPES } from "../state/types";
import { DetailPanel } from "../components/DetailPanel";
import { SourceBadge } from "../components/SourceBadge";

const TABS: { id: CatalogTab; label: string }[] = [
  { id: "all", label: "Alle" },
  { id: "unsorted", label: "Unsortiert" },
  { id: "groups", label: "Gruppen" },
  { id: "hidden", label: "Ausgeblendet" },
];

interface Row {
  entry: DisplayEntry;
  depth: number;
  isMaster: boolean;
  childCount: number;
  orphan: boolean;
}

export function Catalog({ store, hass }: { store: V3Store; hass: Hass | null }) {
  const [tab, setTab] = useState<CatalogTab>("all");
  const [search, setSearch] = useState("");
  const [media, setMedia] = useState<MediaType | "">("");
  const [signal, setSignal] = useState<SignalType | "">("");
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const rows = useMemo<Row[]>(() => {
    const subset = selectByTab(store.displayEntries, tab);
    const filtered = filterCatalog(subset, { search, media, signal });
    const tree = buildCatalogTree(filtered);
    const out: Row[] = [];
    for (const node of tree) {
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
  }, [store.displayEntries, tab, search, media, signal]);

  const focused = focusedId ? store.getDisplayEntry(focusedId) : undefined;
  const detailState = useEntryDetail(hass, focusedId);
  const artwork = focusedId
    ? store.sources.find((s) => s.current_entry_id === focusedId)
        ?.current_artwork ?? null
    : null;

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
          <span className="tc-filters-info">{rows.length} Zeilen</span>
        </div>

        <div className="tc-table-wrap">
          <table className="tc-table">
            <thead>
              <tr>
                <th>Titel / Key</th>
                <th>Art</th>
                <th>Signal</th>
                <th>Enum</th>
                <th>Info</th>
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
                rows.map((r) => (
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
                    <td>{r.entry.signal_type}</td>
                    <td>{r.entry.enum}</td>
                    <td className="tc-muted">
                      {r.orphan ? (
                        <span className="badge off">verwaiste Variante</span>
                      ) : r.isMaster ? (
                        <span className="badge var">{r.childCount} Varianten</span>
                      ) : r.depth > 0 &&
                        (r.entry.media_type === "music" ||
                          r.entry.media_type === "video") ? (
                        "erbt Enum vom Master"
                      ) : r.entry.hidden ? (
                        <span className="badge off">versteckt</span>
                      ) : (
                        "—"
                      )}
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
        onHide={store.setHidden}
      />
    </div>
  );
}
