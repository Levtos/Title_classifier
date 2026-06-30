interface Props {
  connected: boolean;
  entryCount: number | null;
  selectedCount: number;
  lastSync: string | null;
  error?: string | null;
  watcherCount?: number;
}

export function StatusBar({
  connected,
  entryCount,
  selectedCount,
  lastSync,
  error,
  watcherCount,
}: Props) {
  return (
    <div className="tc-statusbar">
      <span>
        <span className={`dot ${connected ? "ok" : "bad"}`} />
        {connected ? "verbunden" : "getrennt"}
      </span>
      {watcherCount !== undefined ? <span>Watcher: {watcherCount}</span> : null}
      <span>Einträge: {entryCount ?? "—"}</span>
      <span>Auswahl: {selectedCount}</span>
      <span>Letzter Sync: {lastSync ?? "—"}</span>
      {error ? (
        <span style={{ color: "var(--tc-danger)" }}>Fehler: {error}</span>
      ) : null}
      <span className="right">Title Classifier v3</span>
    </div>
  );
}
