// Diagnosis modal (v3.2.2). The large, read-only Trace/Diagnose view for one
// catalog entry, opened as an overlay from the Katalog detail panel — no longer
// a sidebar page. Reuses the shared trace view model (buildTraceView) so the
// reasoning is identical to the compact mini-trace; no duplicated logic.

import { useEffect } from "react";
import type { DisplayEntry } from "../state/drafts";
import type { EntryDetailState } from "../state/detail";
import { mediaTypeLabel } from "../state/media";
import { contextLabel } from "../state/source";
import { buildTraceView, enumSourceLabel, resolveTraceState } from "../state/trace";

function fmt(ts: string | null): string {
  if (!ts) return "—";
  const d = new Date(ts);
  return isNaN(d.getTime()) ? ts : d.toLocaleString();
}

interface Props {
  entryId: string | null;
  entry: DisplayEntry | undefined;
  detail: EntryDetailState;
  connected: boolean;
  onClose: () => void;
}

export function DiagnosisModal({
  entryId,
  entry,
  detail,
  connected,
  onClose,
}: Props) {
  // Close on Escape — matches the group dialog's expectations.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Guard the rare case where a passive poll removes the focused entry while the
  // modal is open — never white-screen the overlay.
  const state = resolveTraceState({
    entryId,
    hasEntry: entry !== undefined,
    connected,
  });

  return (
    <div className="tc-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="tc-modal tc-modal-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tc-diag-title"
        onClick={(e) => e.stopPropagation()}
      >
        {state !== "ready" || !entry ? (
          <div className="tc-placeholder">
            <h2 id="tc-diag-title">Diagnose</h2>
            <p>
              {state === "loading"
                ? "Eintrag wird geladen …"
                : "Eintrag nicht gefunden — er existiert nicht (mehr) oder ist nicht geladen."}
            </p>
            <div className="tc-modal-actions">
              <button className="tc-btn primary" type="button" onClick={onClose}>
                Schließen
              </button>
            </div>
          </div>
        ) : (
          <DiagnosisBody entry={entry} detail={detail} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

function DiagnosisBody({
  entry,
  detail,
  onClose,
}: {
  entry: DisplayEntry;
  detail: EntryDetailState;
  onClose: () => void;
}) {
  const d =
    detail.detail && detail.detail.id === entry.id ? detail.detail : null;
  const { parentState, trace, sightings, liveEffective, liveDiverges } =
    buildTraceView({
      media_type: entry.media_type,
      storedEnum: entry.serverEnum,
      parentId: entry.parent_id,
      detailLoaded: d != null,
      parentRef: d?.parent ?? null,
      contexts: d?.contexts ?? [],
      isCurrent: entry.is_current,
      liveEffective:
        entry.is_current && entry.effective_enum !== null
          ? entry.effective_enum
          : null,
    });

  return (
    <>
      <div className="tc-trace-hero">
        <div className="tc-trace-hero-main">
          <h2 id="tc-diag-title" className="tc-detail-title">
            {entry.key}
          </h2>
          <div className="tc-detail-badges">
            <span className={`badge ${entry.media_type}`}>
              {mediaTypeLabel(entry.media_type)}
            </span>
            <span className="badge">{entry.signal_type}</span>
            {entry.contexts.map((c) => (
              <span key={c} className="badge source">
                {contextLabel(c) ?? c}
              </span>
            ))}
            {entry.current_source_app ? (
              <span className="badge">{entry.current_source_app}</span>
            ) : null}
            {entry.hidden ? <span className="badge off">versteckt</span> : null}
            {entry.is_variant ? <span className="badge">Variante</span> : null}
            {entry.is_current ? <span className="badge ok">läuft</span> : null}
          </div>
        </div>
        <div className="tc-trace-hero-actions">
          <button className="tc-btn" type="button" onClick={onClose}>
            Schließen
          </button>
        </div>
      </div>

      <div className="tc-trace-grid">
        <section className="tc-card">
          <h3>Aktuelle Entscheidung</h3>
          <dl className="tc-detail-grid">
            <dt>Stored Enum</dt>
            <dd>{entry.serverEnum}</dd>
            <dt>Effective (Katalog)</dt>
            <dd>
              {trace.effectiveEnum ?? "nicht bestimmbar"}
              {trace.explainable ? "" : " *"}
            </dd>
            <dt>Effective (live)</dt>
            <dd>{liveEffective ?? "—"}</dd>
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
        </section>

        <section className="tc-card">
          <h3>Beteiligte Faktoren</h3>
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
            <dt>Hidden</dt>
            <dd>{entry.hidden ? "ja" : "nein"}</dd>
            <dt>Läuft</dt>
            <dd>{entry.is_current ? "ja" : "nein"}</dd>
          </dl>
        </section>

        <section className="tc-card">
          <h3>Vererbung / Varianten</h3>
          {parentState === "available" && d?.parent ? (
            <p>
              Variante von <b>{d.parent.key}</b> (Enum {d.parent.enum}).{" "}
              {trace.inheritsFromMaster
                ? "Effective kommt vom Master."
                : "Effective kommt NICHT vom Master (Game oder eigener Wert)."}
            </p>
          ) : parentState === "missing" ? (
            <p className="tc-hint-warn">
              Verwaiste Variante — der referenzierte Master (parent_id) ist nicht
              verfügbar. Keine automatische Reparatur.
            </p>
          ) : parentState === "loading" ? (
            <p className="tc-muted">Master wird geladen …</p>
          ) : entry.variants.length ? (
            <>
              <p>Master mit {entry.variants.length} Varianten:</p>
              <ul className="tc-variants">
                {(d?.variants ?? entry.variants).map((v) => (
                  <li key={v.id}>
                    {v.key} <span className="tc-muted">(Enum {v.enum})</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="tc-muted">
              Eigenständiger Eintrag — kein Master, keine Varianten.
            </p>
          )}
        </section>

        <section className="tc-card tc-trace-sightings">
          <h3>Sichtungen{d ? ` (${sightings.length})` : ""}</h3>
          {detail.error ? (
            <div className="tc-detail-error">Detail-Fehler: {detail.error}</div>
          ) : null}
          {sightings.length ? (
            <table className="tc-ctx-table">
              <thead>
                <tr>
                  <th>Kontext</th>
                  <th>App</th>
                  <th>Sicht.</th>
                  <th>Override</th>
                  <th>Eff.</th>
                  <th>Erstmals</th>
                  <th>Zuletzt</th>
                </tr>
              </thead>
              <tbody>
                {sightings.map((s) => (
                  <tr key={`${s.context}/${s.source_app}`}>
                    <td>{contextLabel(s.context) ?? s.context}</td>
                    <td className="tc-muted">{s.source_app || "—"}</td>
                    <td>{s.seen_count}×</td>
                    <td>{s.enum_override ?? "—"}</td>
                    <td>{s.effective_preview ?? "—"}</td>
                    <td className="tc-muted">{fmt(s.first_seen)}</td>
                    <td className="tc-muted">{fmt(s.last_seen)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : d ? (
            <div className="tc-muted">
              Noch keine Sichtungen erfasst. Einzel-Events werden nicht
              gespeichert — nur Aggregate pro Kontext.
            </div>
          ) : (
            <div className="tc-muted">lädt …</div>
          )}
        </section>
      </div>

      <p className="tc-trace-debug tc-muted">
        {trace.explainable
          ? "Read-only · beeinflusst keine HA-Automationen · keine vollständige Event-Historie, solange Einzelereignisse nicht gespeichert werden."
          : "* nicht vollständig erklärbar mit aktuellen Daten. Read-only · beeinflusst keine HA-Automationen · keine vollständige Event-Historie, solange Einzelereignisse nicht gespeichert werden."}
      </p>
    </>
  );
}
