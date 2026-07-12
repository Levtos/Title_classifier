import { useMemo } from "react";
import type { V3Store } from "../state/store";
import { MultiSlotWatcherCard, WatcherCard } from "../components/WatcherCard";
import { countOpenEntries } from "../state/inbox";
import { groupSourcesByContext, groupStats } from "../state/sourceGroups";

// Overview (v3.4.0): exactly ONE watcher per context. Single-source contexts
// (HomePod/PC/PS5/Apple TV) render as a plain card without any extra group
// frame; a multi-source context (Stash) renders as one card with compact slot
// rows. Statistics are deduplicated: "Einträge" comes from the union entry
// store and "Offen" uses the shared reviewed-based definition (state/inbox) —
// never a sum of per-source catalog counts, which counted the same media-type
// catalog once per slot.
export function Overview({ store }: { store: V3Store }) {
  const { sources, entryCount, connected, error, lastSync } = store;
  const groups = useMemo(() => groupSourcesByContext(sources), [sources]);
  const stats = groupStats(groups);
  const active = sources.filter((s) => s.current_key);

  const inactiveKeys = useMemo(
    () => new Set(sources.flatMap((s) => s.inactive_keys ?? [])),
    [sources]
  );
  const openCount = useMemo(
    () => countOpenEntries(store.displayEntries, inactiveKeys),
    [store.displayEntries, inactiveKeys]
  );

  return (
    <div className="tc-page">
      {error ? (
        <div className="tc-card tc-error">
          Verbindungsfehler: {error} — letzte bekannte Daten werden angezeigt.
        </div>
      ) : null}

      <div className="tc-stats">
        <Stat label="Watcher" value={stats.watcherCount} />
        <Stat
          label="Online"
          value={`${stats.onlineGroups}/${stats.watcherCount}`}
        />
        <Stat label="Einträge" value={entryCount ?? "—"} />
        <Stat label="Offen" value={connected ? openCount : "—"} />
      </div>

      <section className="tc-section">
        <h3>Jetzt aktiv</h3>
        {active.length ? (
          <div className="tc-active">
            {active.map((s) => (
              <div key={s.entry_id} className="tc-active-row">
                <span className="tc-active-name">{s.name}</span>
                <span className="tc-active-key">{s.current_key}</span>
                <span className="tc-enum">{s.current_enum ?? "—"}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="tc-placeholder">Aktuell spielt nichts.</div>
        )}
      </section>

      <section className="tc-section">
        <h3>Watcher</h3>
        {groups.length ? (
          <div className="tc-watchers">
            {groups.map((g) =>
              g.total === 1 ? (
                <WatcherCard
                  key={g.context}
                  s={g.sources[0]}
                  entry={
                    g.sources[0].current_entry_id
                      ? store.getDisplayEntry(g.sources[0].current_entry_id)
                      : undefined
                  }
                  onDraftEnum={store.setDraftEnum}
                  onApply={store.applyDraft}
                />
              ) : (
                <MultiSlotWatcherCard key={g.context} g={g} />
              )
            )}
          </div>
        ) : (
          <div className="tc-placeholder">
            {connected
              ? "Keine v3-Watcher konfiguriert."
              : "Verbinde mit Home Assistant …"}
          </div>
        )}
      </section>

      <div className="tc-syshint">
        System: WebSocket {connected ? "verbunden" : "getrennt"} · letzter Sync{" "}
        {lastSync ?? "—"}. (PostgreSQL-/DB-Status folgt mit den Einstellungen.)
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="tc-stat">
      <div className="tc-stat-val">{value}</div>
      <div className="tc-stat-label">{label}</div>
    </div>
  );
}
