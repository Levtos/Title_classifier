import type { MediaType, V3Source } from "../state/types";
import { mediaTypeClass } from "../state/media";

const MEDIA_LABEL: Record<MediaType, string> = {
  music: "Musik",
  game: "Spiel",
  video: "Video",
};

export function WatcherCard({ s }: { s: V3Source }) {
  const active = !!s.current_key;
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
      </div>
    </div>
  );
}
