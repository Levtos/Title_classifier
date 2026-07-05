// Trace full view (v3.2.1). The large, read-only diagnostic for one catalog
// entry, deep-linked by stable entry id. It reuses the same view model as the
// compact panel mini-trace (buildTraceView) — no duplicated reasoning — and
// never white-screens: empty / loading / not-found states are explicit.

import { useState } from "react";
import type { Hass } from "../ha";
import type { V3Store } from "../state/store";
import { useEntryDetail } from "../state/detail";
import { mediaTypeLabel } from "../state/media";
import { contextLabel } from "../state/source";
import { buildTraceView, enumSourceLabel, resolveTraceState } from "../state/trace";

function fmt(ts: string | null): string {
  if (!ts) return "—";
  const d = new Date(ts);
  return isNaN(d.getTime()) ? ts : d.toLocaleString();
}

interface Props {
  store: V3Store;
  hass: Hass | null;
  entryId: string | null;
  onOpenCatalog: () => void;
}

export function Trace({ store, hass, entryId, onOpenCatalog }: Props) {
  const [reload, setReload] = useState(0);
  const entry = entryId ? store.getDisplayEntry(entryId) : undefined;
  const state = resolveTraceState({
    entryId,
    hasEntry: entry !== undefined,
    connected: store.connected,
  });
  // Detail is loaded for the resolved entry only; passive polls keep the id
  // stable, so the open page never gets torn down by a refresh.
  const detailState = useEntryDetail(hass, entry ? entry.id : null, reload);

  if (state === "empty") {
    return (
      <div className="tc-page">
        <div className="tc-card tc-placeholder">
          <h2>Trace / Diagnose</h2>
          <p>Wähle einen Katalogeintrag und öffne „Trace groß".</p>
          <button className="tc-btn primary" type="button" onClick={onOpenCatalog}>
            Katalog öffnen
          </button>
        </div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="tc-page">
        <div className="tc-card tc-placeholder">
          <h2>Trace / Diagnose</h2>
          <p>Eintrag wird geladen …</p>
        </div>
      </div>
    );
  }

  if (state === "notfound" || !entry) {
    return (
      <div className="tc-page">
        <div className="tc-card tc-placeholder">
          <h2>Eintrag nicht gefunden</h2>
          <p>
            Der referenzierte Katalogeintrag existiert nicht (mehr) oder ist
            nicht geladen.
          </p>
          <button className="tc-btn primary" type="button" onClick={onOpenCatalog}>
            Katalog öffnen
          </button>
        </div>
      </div>
    );
  }

  const d =
    detailState.detail && detailState.detail.id === entry.id
      ? detailState.detail
      : null;
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
    <div className="tc-page">
      <div className="tc-card tc-trace-hero">
        <div className="tc-trace-hero-main">
          <h2>{entry.key}</h2>
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
          <button
            className="tc-btn"
            type="button"
            onClick={() => {
              store.refresh(true);
              setReload((n) => n + 1);
            }}
            disabled={store.refreshing}
          >
            {store.refreshing ? "…" : "Aktualisieren"}
          </button>
          <button className="tc-btn" type="button" onClick={onOpenCatalog}>
            Katalog öffnen
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
          {detailState.error ? (
            <div className="tc-detail-error">Detail-Fehler: {detailState.error}</div>
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
    </div>
  );
}
