import { useMemo, useState } from "react";
import type { Hass } from "../ha";
import { createV3Api } from "../api/v3";
import type { V3Store } from "../state/store";
import type { DisplayEntry } from "../state/drafts";
import { pickAllClusters } from "../state/variants";
import {
  createQueue,
  currentPick,
  goBack,
  queueProgress,
  resolveCurrent,
  skipCurrent,
} from "../state/queue";

// Continuous variant queue mode (control#27), shared by Inbox and Catalog.
// The queue is snapshotted ONCE from the entries passed at open time —
// polling / new sightings never reshuffle the running session. Per cluster the
// user picks a master and either saves (group + mark reviewed + auto-advance),
// closes the members as deliberate standalones, skips, or steps back. The
// modal stays open until the queue is done or the user ends it.

interface Props {
  store: V3Store;
  hass: Hass | null;
  /** The (already filtered) working set the queue is built from. */
  entries: DisplayEntry[];
  onClose: () => void;
}

export function VariantQueueModal({ store, hass, entries, onClose }: Props) {
  // One-time snapshot: clusters + the member entries as they looked at start.
  const [queue, setQueue] = useState(() => createQueue(pickAllClusters(entries)));
  const [snapshot] = useState(() => new Map(entries.map((e) => [e.id, e])));
  // Master override for the current cluster (null = suggested master).
  const [masterOverride, setMasterOverride] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = currentPick(queue);
  const progress = queueProgress(queue);
  const members = useMemo(
    () =>
      (pick?.ids ?? [])
        .map((id) => snapshot.get(id))
        .filter((e): e is DisplayEntry => e !== undefined),
    [pick, snapshot]
  );
  const masterId = masterOverride ?? pick?.masterId ?? null;

  const advance = (next: typeof queue) => {
    setQueue(next);
    setMasterOverride(null);
    setError(null);
  };

  /** Mark every still-open member reviewed (grouping/standalone counts as the
   *  deliberate review of these entries). */
  const reviewMembers = async () => {
    for (const m of members) {
      if (!m.reviewed) await store.setReviewed(m.id, true);
    }
  };

  const saveAsVariants = async () => {
    if (!hass || !pick || masterId === null) return;
    setSaving(true);
    setError(null);
    try {
      const api = createV3Api(hass);
      for (const m of members) {
        if (m.id === masterId) continue;
        const res = await api.group(m.id, masterId);
        if (!res?.ok) throw new Error(`Gruppieren von „${m.key}" abgelehnt`);
      }
      await reviewMembers();
      store.refresh();
      advance(resolveCurrent(queue, "grouped"));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      store.refresh();
    } finally {
      setSaving(false);
    }
  };

  const closeAsStandalone = async () => {
    setSaving(true);
    setError(null);
    try {
      await reviewMembers();
      store.refresh();
      advance(resolveCurrent(queue, "standalone"));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="tc-modal-backdrop"
      role="presentation"
      onClick={() => {
        if (!saving) onClose();
      }}
    >
      <div
        className="tc-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tc-queue-title"
        onClick={(ev) => ev.stopPropagation()}
      >
        <h3 id="tc-queue-title">
          🪄 Variantenmodus{" "}
          <span className="tc-muted">
            {progress.total === 0
              ? ""
              : `— Kandidat ${Math.min(progress.position, progress.total)}/${
                  progress.total
                }`}
          </span>
        </h3>

        {pick === null ? (
          <>
            <p className="tc-hint-ok">
              {progress.total === 0
                ? "Keine Varianten-Kandidaten in der aktuellen Ansicht."
                : `Fertig: ${progress.grouped} gruppiert, ${progress.standalone} eigenständig erledigt, ${progress.skipped} übersprungen.`}
            </p>
            <div className="tc-modal-actions">
              {progress.total > 0 ? (
                <button
                  className="tc-btn"
                  type="button"
                  onClick={() => advance(goBack(queue))}
                >
                  ← Zurück
                </button>
              ) : null}
              <button className="tc-btn primary" type="button" onClick={onClose}>
                Schließen
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="tc-hint-ok">🪄 {pick.reason}</p>
            <p className="tc-muted">
              Master wählen — die übrigen werden Varianten darunter und der
              Kandidat gilt als geprüft:
            </p>
            <div className="tc-group-list">
              {members.map((entry) => (
                <label key={entry.id} className="tc-group-option">
                  <input
                    type="radio"
                    name="tc-queue-master"
                    checked={masterId === entry.id}
                    disabled={saving}
                    onChange={() => setMasterOverride(entry.id)}
                  />
                  <span>
                    <b>{entry.key}</b>
                    <small>
                      {entry.media_type} · {entry.signal_type} ·{" "}
                      {entry.seen_count_total}× gesehen
                      {entry.variants.length > 0
                        ? ` · bestehende Gruppe (${entry.variants.length})`
                        : ""}
                    </small>
                  </span>
                </label>
              ))}
            </div>
            {members.length < 2 ? (
              <p className="tc-hint-warn">
                Dieser Kandidat ist nicht mehr vollständig verfügbar — bitte
                überspringen.
              </p>
            ) : null}
            {error ? (
              <div className="tc-detail-error">Fehler: {error}</div>
            ) : null}
            <div className="tc-modal-actions tc-queue-actions">
              <button
                className="tc-btn"
                type="button"
                disabled={saving || queue.index === 0}
                onClick={() => advance(goBack(queue))}
              >
                ← Zurück
              </button>
              <button
                className="tc-btn"
                type="button"
                disabled={saving}
                onClick={() => advance(skipCurrent(queue))}
                title="Keine Datenänderung — die Einträge bleiben offen."
              >
                Überspringen
              </button>
              <button
                className="tc-btn"
                type="button"
                disabled={saving}
                onClick={closeAsStandalone}
                title="Kein passender Master — alle Einträge bewusst als eigenständig erledigen."
              >
                Kein Master — eigenständig erledigen
              </button>
              <button
                className="tc-btn primary"
                type="button"
                disabled={saving || !hass || members.length < 2}
                onClick={saveAsVariants}
              >
                {saving ? "Speichert…" : "Als Variante speichern & weiter"}
              </button>
              <button
                className="tc-btn"
                type="button"
                disabled={saving}
                onClick={onClose}
              >
                Beenden
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
