import type { DisplayEntry } from "../state/drafts";
import { EnumSelect } from "./EnumSelect";

interface Props {
  entry: DisplayEntry | undefined;
  onDraftEnum: (id: string, value: number) => void;
  onApply: (id: string) => void;
  onReset: (id: string) => void;
}

function fmt(ts: string | null): string {
  if (!ts) return "—";
  const d = new Date(ts);
  return isNaN(d.getTime()) ? ts : d.toLocaleString();
}

export function DetailPanel({ entry, onDraftEnum, onApply, onReset }: Props) {
  if (!entry) {
    return (
      <aside className="tc-detail">
        <div className="tc-placeholder">Eintrag auswählen, um Details zu sehen.</div>
      </aside>
    );
  }
  return (
    <aside className="tc-detail">
      <h3 className="tc-detail-title">{entry.key}</h3>
      <div className="tc-detail-badges">
        <span className={`badge ${entry.media_type}`}>{entry.media_type}</span>
        <span className="badge">{entry.signal_type}</span>
        {entry.is_current && entry.current_context ? (
          <span className="badge ok">{entry.current_context}</span>
        ) : null}
        {entry.hidden ? <span className="badge off">versteckt</span> : null}
        {entry.is_variant ? <span className="badge">Variante</span> : null}
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
        <dt>Effective</dt>
        <dd>{entry.is_current ? entry.effective_enum ?? "—" : "—"}</dd>
        <dt>Server-Enum</dt>
        <dd>{entry.serverEnum}</dd>
        <dt>Varianten</dt>
        <dd>{entry.variants.length}</dd>
        <dt>Sichtungen</dt>
        <dd>{entry.seen_count}</dd>
        <dt>Zuletzt</dt>
        <dd>{fmt(entry.last_seen)}</dd>
        <dt>Erstmals</dt>
        <dd>{fmt(entry.first_seen)}</dd>
      </dl>

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
      </div>
    </aside>
  );
}
