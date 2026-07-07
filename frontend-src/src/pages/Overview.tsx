import { useState } from "react";
import type { V3Store } from "../state/store";
import { WatcherCard } from "../components/WatcherCard";
import { groupSourcesByContext, type SourceGroup } from "../state/sourceGroups";

export function Overview({ store }: { store: V3Store }) {
  const { sources, entryCount, connected, error, lastSync } = store;
  const online = sources.filter((s) => s.online).length;
  const unmapped = sources.reduce((n, s) => n + s.unmapped_count, 0);
  const active = sources.filter((s) => s.current_key);
  const groups = groupSourcesByContext(sources);

  // Collapsed master groups (by context). Empty = all expanded.
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggle = (context: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(context) ? next.delete(context) : next.add(context);
      return next;
    });

  return (
    <div className="tc-page">
      {error ? (
        <div className="tc-card tc-error">
          Verbindungsfehler: {error} — letzte bekannte Daten werden angezeigt.
        </div>
      ) : null}

      <div className="tc-stats">
        <Stat label="Watcher" value={sources.length} />
        <Stat label="Online" value={`${online}/${sources.length}`} />
        <Stat label="Einträge" value={entryCount ?? "—"} />
        <Stat label="Unklassifiziert" value={unmapped} />
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
        {sources.length ? (
          <div className="tc-groups">
            {groups.map((g) => (
              <WatcherGroup
                key={g.context}
                g={g}
                store={store}
                collapsed={collapsed.has(g.context)}
                onToggle={() => toggle(g.context)}
              />
            ))}
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

function WatcherGroup({
  g,
  store,
  collapsed,
  onToggle,
}: {
  g: SourceGroup;
  store: V3Store;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="tc-group">
      <button
        className="tc-group-head"
        onClick={onToggle}
        aria-expanded={!collapsed}
      >
        <span className="tc-group-caret">{collapsed ? "▸" : "▾"}</span>
        <span className="tc-group-label">{g.label}</span>
        <span className="tc-group-count">{g.total}</span>
        <span className="tc-group-agg">
          Master · {g.activeCount}/{g.total} aktiv
          {g.maxActiveEnum != null ? (
            <>
              {" · Enum "}
              <b className="tc-enum">{g.maxActiveEnum}</b>
            </>
          ) : null}
        </span>
      </button>
      {!collapsed ? (
        <div className="tc-watchers">
          {g.sources.map((s) => (
            <WatcherCard
              key={s.entry_id}
              s={s}
              entry={
                s.current_entry_id
                  ? store.getDisplayEntry(s.current_entry_id)
                  : undefined
              }
              onDraftEnum={store.setDraftEnum}
              onApply={store.applyDraft}
            />
          ))}
        </div>
      ) : null}
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
