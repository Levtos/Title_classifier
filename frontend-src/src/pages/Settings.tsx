import type { V3Store } from "../state/store";
import { groupSourcesByContext } from "../state/sourceGroups";

// Minimal read-only status view (v3.0.0). Surfaces the connection/catalog state
// the store already holds so the Settings page no longer looks like "Postgres is
// off" — the catalog DB is reachable whenever list_sources/list_entries succeed
// (they query Postgres via the shared pool). This is NOT the full settings page:
// watcher config, artwork fallbacks, theme and debug tooling remain a follow-up.
// No connection string / secrets are read or shown.
export function Settings({ store }: { store: V3Store }) {
  const ok = store.connected;
  return (
    <div className="tc-page">
      <div className="tc-card">
        <div className="tc-section">
          <h3>Status</h3>
          <div className="tc-stats">
            <div className="tc-stat">
              <div className="tc-stat-val">
                <span className={`dot ${ok ? "ok" : "bad"}`} />
                {ok ? "Erreichbar" : "Getrennt"}
              </div>
              <div className="tc-stat-label">
                Backend &amp; Katalog-Datenbank
              </div>
            </div>
            <div className="tc-stat">
              <div className="tc-stat-val">
                {groupSourcesByContext(store.sources).length}
              </div>
              <div className="tc-stat-label">
                Watcher ({store.sources.length} Quellen)
              </div>
            </div>
            <div className="tc-stat">
              <div className="tc-stat-val">{store.entryCount ?? "—"}</div>
              <div className="tc-stat-label">Katalog-Einträge</div>
            </div>
            <div className="tc-stat">
              <div className="tc-stat-val" style={{ fontSize: "16px" }}>
                {store.lastSync ?? "—"}
              </div>
              <div className="tc-stat-label">Letzter Sync</div>
            </div>
          </div>
          {store.error ? (
            <div className="tc-card tc-error">Fehler: {store.error}</div>
          ) : null}
          <p className="tc-syshint">
            Der Katalog-DB-Status wird aus der laufenden Verbindung abgeleitet
            (erfolgreiche Katalog-Abfragen ⇒ PostgreSQL erreichbar). Detaillierte
            Diagnose, Watcher-Konfiguration, Artwork-Fallbacks, Theme und Debug
            folgen in einem separaten Settings-PR. Keine Zugangsdaten werden hier
            angezeigt.
          </p>
        </div>
      </div>
    </div>
  );
}
