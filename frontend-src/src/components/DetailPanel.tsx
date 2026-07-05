import { useEffect, useState } from "react";
import type { DisplayEntry } from "../state/drafts";
import type { EntryDetailState } from "../state/detail";
import { mediaTypeLabel } from "../state/media";
import { contextLabel } from "../state/source";
import {
  enumSourceLabel,
  explainEffectiveEnum,
  sortSightings,
  type ParentState,
} from "../state/trace";
import { EnumSelect } from "./EnumSelect";

interface Props {
  entry: DisplayEntry | undefined;
  detail: EntryDetailState;
  artwork: string | null;
  onDraftEnum: (id: string, value: number) => void;
  onApply: (id: string) => void;
  onReset: (id: string) => void;
  onHide: (id: string, hidden: boolean) => void;
  // Catalog-only group management. When omitted (Inbox) the group section is not
  // rendered — the panel stays exactly as before.
  masterOptions?: { id: string; key: string }[];
  onGroup?: (childId: string, parentId: string) => void;
  onUngroup?: (childId: string) => void;
  groupBusy?: boolean;
  groupError?: string | null;
  // Catalog-only read-only Trace/Diagnose section. Omitted (Inbox) ⇒ not shown.
  showTrace?: boolean;
}

function fmt(ts: string | null): string {
  if (!ts) return "—";
  const d = new Date(ts);
  return isNaN(d.getTime()) ? ts : d.toLocaleString();
}

export function DetailPanel({
  entry,
  detail,
  artwork,
  onDraftEnum,
  onApply,
  onReset,
  onHide,
  masterOptions,
  onGroup,
  onUngroup,
  groupBusy = false,
  groupError = null,
  showTrace = false,
}: Props) {
  // Selected master target for "Zu Gruppe hinzufügen" / "Master wechseln".
  // Reset whenever the focused entry changes so a stale pick can't leak across.
  const [groupTarget, setGroupTarget] = useState("");
  useEffect(() => setGroupTarget(""), [entry?.id]);
  if (!entry) {
    return (
      <aside className="tc-detail">
        <div className="tc-placeholder">Eintrag auswählen, um Details zu sehen.</div>
      </aside>
    );
  }
  const d = detail.detail && detail.detail.id === entry.id ? detail.detail : null;

  // --- Trace / Diagnose (read-only) ---------------------------------------
  // Master state: none (no parent) / loading (detail not ready) / available /
  // missing (detail loaded but no master → orphan variant).
  const parentState: ParentState =
    entry.parent_id == null
      ? "none"
      : d == null
        ? "loading"
        : d.parent
          ? "available"
          : "missing";
  const trace = explainEffectiveEnum({
    media_type: entry.media_type,
    // Persisted value, not an unsaved draft.
    storedEnum: entry.serverEnum,
    parentState,
    parentEnum: d?.parent?.enum ?? null,
  });
  const sightings = d ? sortSightings(d.contexts) : [];
  const liveEffective =
    entry.is_current && entry.effective_enum !== null
      ? entry.effective_enum
      : null;
  const liveDiverges =
    liveEffective !== null &&
    trace.effectiveEnum !== null &&
    liveEffective !== trace.effectiveEnum;

  return (
    <aside className="tc-detail">
      {artwork ? (
        <img
          className="tc-detail-art"
          src={artwork}
          alt=""
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
      ) : null}
      <h3 className="tc-detail-title">{entry.key}</h3>
      <div className="tc-detail-badges">
        <span className={`badge ${entry.media_type}`}>{entry.media_type}</span>
        <span className="badge">{entry.signal_type}</span>
        {entry.hidden ? <span className="badge off">versteckt</span> : null}
        {entry.is_variant ? <span className="badge">Variante</span> : null}
        {entry.is_current ? <span className="badge ok">aktiv</span> : null}
      </div>

      <dl className="tc-detail-grid">
        <dt>Enum</dt>
        <dd>
          <EnumSelect
            value={entry.enum}
            onChange={(v) => onDraftEnum(entry.id, v)}
            dirty={entry.dirty}
          />
        </dd>
        <dt>Effective (live)</dt>
        <dd>{entry.is_current ? entry.effective_enum ?? "—" : "—"}</dd>
        <dt>Server-Enum</dt>
        <dd>{entry.serverEnum}</dd>
        <dt>Sichtungen</dt>
        <dd>{d ? d.seen_count : entry.seen_count}</dd>
        <dt>Zuletzt</dt>
        <dd>{fmt(d ? d.last_seen : entry.last_seen)}</dd>
        <dt>Erstmals</dt>
        <dd>{fmt(d ? d.first_seen : entry.first_seen)}</dd>
      </dl>

      {d?.parent ? (
        <div className="tc-detail-parent">
          Master: <b>{d.parent.key}</b> (Enum {d.parent.enum}) — erbt Enum vom Master
        </div>
      ) : null}

      <section className="tc-detail-section">
        <h4>Kontexte {detail.loading ? "…" : d ? `(${d.contexts.length})` : ""}</h4>
        {detail.error ? (
          <div className="tc-detail-error">Detail-Fehler: {detail.error}</div>
        ) : null}
        {d && d.contexts.length ? (
          <table className="tc-ctx-table">
            <thead>
              <tr>
                <th>Kontext</th>
                <th>App</th>
                <th>Override</th>
                <th>Eff.</th>
                <th>Sicht.</th>
              </tr>
            </thead>
            <tbody>
              {d.contexts.map((c) => (
                <tr key={`${c.context}/${c.source_app}`}>
                  <td>{c.context}</td>
                  <td className="tc-muted">{c.source_app || "—"}</td>
                  <td>{c.enum_override ?? "—"}</td>
                  <td>{c.effective_preview}</td>
                  <td className="tc-muted">{c.seen_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : d ? (
          <div className="tc-muted">Noch keine Kontexte beobachtet.</div>
        ) : null}
      </section>

      {d && d.variants.length ? (
        <section className="tc-detail-section">
          <h4>Varianten ({d.variants.length})</h4>
          <ul className="tc-variants">
            {d.variants.map((v) => (
              <li key={v.id}>
                {v.key} <span className="tc-muted">(Enum {v.enum})</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {showTrace ? (
        <section className="tc-detail-section tc-trace">
          <h4>Trace / Diagnose</h4>

          <div className="tc-trace-block">
            <div className="tc-trace-head">Aktuelle Entscheidung</div>
            <dl className="tc-detail-grid">
              <dt>Stored Enum</dt>
              <dd>{entry.serverEnum}</dd>
              <dt>Katalog-Enum</dt>
              <dd>
                {trace.effectiveEnum ?? "nicht bestimmbar"}
                {trace.explainable ? "" : " *"}
              </dd>
              {entry.is_current ? (
                <>
                  <dt>Effective (live)</dt>
                  <dd>{liveEffective ?? "—"}</dd>
                </>
              ) : null}
              <dt>Quelle des Werts</dt>
              <dd>{enumSourceLabel(trace.source)}</dd>
            </dl>
            <p className="tc-trace-reason">{trace.reason}</p>
            {liveDiverges ? (
              <p className="tc-hint-warn">
                Live-Wert weicht ab: enthält evtl. Online-Gate, Watcher-Floor
                (z.B. Stash ⇒ 1) oder aktiven Kontext-Override — diese liegen
                außerhalb der Katalogdaten.
              </p>
            ) : null}
          </div>

          <div className="tc-trace-block">
            <div className="tc-trace-head">Beteiligte Faktoren</div>
            <dl className="tc-detail-grid">
              <dt>Medienart</dt>
              <dd>{mediaTypeLabel(entry.media_type)}</dd>
              <dt>Signal</dt>
              <dd>{entry.signal_type}</dd>
              <dt>Kontexte</dt>
              <dd>
                {entry.contexts.length
                  ? entry.contexts.map((c) => contextLabel(c) ?? c).join(", ")
                  : "—"}
              </dd>
              <dt>Source App</dt>
              <dd>{entry.current_source_app || "—"}</dd>
              <dt>Master</dt>
              <dd>
                {parentState === "available" && d?.parent
                  ? `${d.parent.key} (Enum ${d.parent.enum})`
                  : parentState === "missing"
                    ? "verwaiste Variante"
                    : parentState === "loading"
                      ? "…"
                      : entry.variants.length > 0
                        ? `Master · ${entry.variants.length} Varianten`
                        : "—"}
              </dd>
              <dt>Hidden</dt>
              <dd>{entry.hidden ? "ja" : "nein"}</dd>
              <dt>Läuft</dt>
              <dd>{entry.is_current ? "ja" : "nein"}</dd>
            </dl>
          </div>

          <div className="tc-trace-block">
            <div className="tc-trace-head">
              Sichtungen{d ? ` (${sightings.length})` : ""}
            </div>
            {detail.error ? (
              <div className="tc-detail-error">Detail-Fehler: {detail.error}</div>
            ) : null}
            {sightings.length ? (
              <ul className="tc-sightings">
                {sightings.map((s) => (
                  <li key={`${s.context}/${s.source_app}`}>
                    <span className="badge source">
                      {contextLabel(s.context) ?? s.context}
                    </span>
                    {s.source_app ? (
                      <span className="tc-muted"> · {s.source_app}</span>
                    ) : null}
                    <span> · {s.seen_count}×</span>
                    <span className="tc-muted"> · zuletzt {fmt(s.last_seen)}</span>
                  </li>
                ))}
              </ul>
            ) : d ? (
              <div className="tc-muted">
                Noch keine Sichtungen erfasst. Einzel-Events werden nicht
                gespeichert — nur Aggregate pro Kontext.
              </div>
            ) : (
              <div className="tc-muted">lädt …</div>
            )}
          </div>

          <p className="tc-trace-debug tc-muted">
            {trace.explainable
              ? "Read-only · beeinflusst keine HA-Automationen."
              : "* nicht vollständig erklärbar mit aktuellen Daten. Read-only · beeinflusst keine HA-Automationen."}
          </p>
        </section>
      ) : null}

      {onGroup ? (
        <section className="tc-detail-section">
          <h4>Gruppe</h4>
          {entry.variants.length > 0 ? (
            <div className="tc-muted">
              Master dieser Gruppe — Varianten oben. Ein Master kann nicht selbst
              Variante werden.
            </div>
          ) : (
            <>
              {entry.parent_id ? (
                <div className="tc-detail-group-cur">
                  Variante von <b>{d?.parent?.key ?? "…"}</b>
                </div>
              ) : null}
              <div className="tc-detail-group-row">
                <select
                  className="tc-select"
                  value={groupTarget}
                  disabled={groupBusy || (masterOptions?.length ?? 0) === 0}
                  onChange={(e) => setGroupTarget(e.target.value)}
                >
                  <option value="">
                    {(masterOptions?.length ?? 0) === 0
                      ? "Kein passender Master"
                      : "Master wählen …"}
                  </option>
                  {(masterOptions ?? []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.key}
                    </option>
                  ))}
                </select>
                <button
                  className="tc-btn primary"
                  type="button"
                  disabled={!groupTarget || groupBusy}
                  onClick={() => onGroup(entry.id, groupTarget)}
                >
                  {entry.parent_id ? "Master wechseln" : "Zu Gruppe hinzufügen"}
                </button>
              </div>
              {entry.parent_id && onUngroup ? (
                <button
                  className="tc-btn"
                  type="button"
                  disabled={groupBusy}
                  onClick={() => onUngroup(entry.id)}
                >
                  Aus Gruppe lösen
                </button>
              ) : null}
            </>
          )}
          {groupError ? (
            <div className="tc-detail-error">Gruppe: {groupError}</div>
          ) : null}
        </section>
      ) : null}

      {entry.saveError ? (
        <div className="tc-detail-error">Fehler: {entry.saveError}</div>
      ) : null}

      <div className="tc-detail-actions">
        <button
          className="tc-btn primary"
          disabled={!entry.dirty || entry.saving}
          onClick={() => onApply(entry.id)}
        >
          {entry.saving ? "…" : "Apply"}
        </button>
        <button
          className="tc-btn"
          disabled={!entry.dirty || entry.saving}
          onClick={() => onReset(entry.id)}
        >
          Zurücksetzen
        </button>
        <button
          className="tc-btn"
          onClick={() => onHide(entry.id, !entry.hidden)}
        >
          {entry.hidden ? "Wiederherstellen" : "Ausblenden"}
        </button>
      </div>
    </aside>
  );
}
