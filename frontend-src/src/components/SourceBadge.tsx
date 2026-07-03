import { sourceSummary, type SourceInput } from "../state/source";

/** Compact source-/context badge (PS5 / PC / HomePod / Apple TV · Netflix …).
 *  Derived from list_entries data only — no per-row detail call. Shown in Inbox
 *  and Katalog next to the media-type accent. Falls back to a neutral dash when
 *  no context is known. */
export function SourceBadge({ entry }: { entry: SourceInput }) {
  const s = sourceSummary(entry);
  if (!s.label) return <span className="tc-muted">—</span>;
  return (
    <span className="badge source" title={`Quelle: ${s.label}`}>
      {s.label}
      {s.extraCount > 0 ? (
        <span className="tc-sub"> +{s.extraCount}</span>
      ) : null}
    </span>
  );
}
