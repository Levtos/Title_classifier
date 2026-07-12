import type { MediaType, V3Source } from "../state/types";
import type { DisplayEntry } from "../state/drafts";
import { mediaTypeClass } from "../state/media";
import type { SourceGroup } from "../state/sourceGroups";
import { EnumSelect } from "./EnumSelect";

const MEDIA_LABEL: Record<MediaType, string> = {
  music: "Musik",
  game: "Spiel",
  video: "Video",
};

interface Props {
  s: V3Source;
  // The currently-playing catalog entry (when known) → classify inline.
  entry?: DisplayEntry;
  onDraftEnum?: (id: string, value: number) => void;
  onApply?: (id: string) => void;
}

export function WatcherCard({ s, entry, onDraftEnum, onApply }: Props) {
  const active = !!s.current_key;
  const canClassify = active && entry && onDraftEnum && onApply;
  return (
    <div className={`tc-watcher ${mediaTypeClass(s.media_type)}`}>
      {s.current_artwork ? (
        <img
          className="tc-art"
          src={s.current_artwork}
          alt=""
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
      ) : (
        <div className="tc-art tc-art-fallback">{s.online ? "♪" : "·"}</div>
      )}
      <div className="tc-w-main">
        <div className="tc-w-head">
          <span className="tc-w-name">{s.name}</span>
          <span className={`badge ${s.media_type}`}>{MEDIA_LABEL[s.media_type]}</span>
          <span className="badge">{s.context}</span>
          <span className="badge">{s.signal_type}</span>
          <span className={`badge ${s.online ? "ok" : "off"}`}>
            {s.online ? "online" : "offline"}
          </span>
        </div>
        <div className={`tc-w-cur ${active ? "" : "muted"}`}>
          {active ? `▶ ${s.current_key}` : "— inaktiv —"}
        </div>
        <div className="tc-w-meta">
          <span>
            Effective Enum: <b className="tc-enum">{s.current_enum ?? "—"}</b>
          </span>
          <span>
            {s.entry_count} Einträge · {s.unmapped_count} offen
          </span>
        </div>
        {canClassify ? (
          <div className="tc-w-classify">
            <span className="tc-muted">Enum:</span>
            <EnumSelect
              value={entry!.enum}
              dirty={entry!.dirty}
              onChange={(v) => onDraftEnum!(entry!.id, v)}
            />
            {entry!.dirty ? (
              <button
                className="tc-btn primary tc-mini"
                disabled={entry!.saving}
                onClick={() => onApply!(entry!.id)}
              >
                {entry!.saving ? "…" : "Apply"}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// One watcher with several technical sources (the four Stash slots): a SINGLE
// card whose shared facts (name, media type, online summary) appear once, with
// one compact row per slot underneath. The slots stay separate sources in the
// backend — this is display-only (control#27).
export function MultiSlotWatcherCard({ g }: { g: SourceGroup }) {
  const mediaType = g.sources[0]?.media_type ?? "video";
  return (
    <div className={`tc-watcher tc-watcher-multi ${mediaTypeClass(mediaType)}`}>
      <div className="tc-w-main">
        <div className="tc-w-head">
          <span className="tc-w-name">{g.label}</span>
          <span className={`badge ${mediaType}`}>{MEDIA_LABEL[mediaType]}</span>
          <span className="badge">{g.context}</span>
          <span className={`badge ${g.onlineCount > 0 ? "ok" : "off"}`}>
            {g.onlineCount}/{g.total} Slots online
          </span>
        </div>
        <div className="tc-w-meta">
          <span>
            {g.activeCount}/{g.total} Slots aktiv
            {g.maxActiveEnum != null ? (
              <>
                {" · max. Enum "}
                <b className="tc-enum">{g.maxActiveEnum}</b>
              </>
            ) : null}
          </span>
        </div>
        <div className="tc-slots">
          {g.sources.map((s) => (
            <div key={s.entry_id} className="tc-slot-row">
              <span className={`tc-slot-dot ${s.online ? "ok" : "off"}`} />
              <span className="tc-slot-name">{s.name}</span>
              <span className={`tc-slot-cur ${s.current_key ? "" : "muted"}`}>
                {s.current_key ? `▶ ${s.current_key}` : "— inaktiv —"}
              </span>
              <span className="tc-enum">{s.current_enum ?? "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
