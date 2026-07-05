// The former "Tagebuch" route. There is no standalone journal — Trace/Diagnose
// lives per-entry in the Katalog detail panel. This page is an honest signpost,
// not a placeholder for missing work.

export function Trace({ onOpenCatalog }: { onOpenCatalog: () => void }) {
  return (
    <div className="tc-page">
      <div className="tc-card tc-placeholder">
        <h2>Trace / Diagnose</h2>
        <p>
          Trace befindet sich aktuell im Katalog-Detailpanel. Wähle einen
          Katalogeintrag und öffne den Trace-Bereich, um zu sehen, warum ein
          effective_enum entsteht — inklusive Master-/Varianten-Vererbung,
          Quelle/Kontext und aggregierten Sichtungen.
        </p>
        <p className="tc-muted">
          Es gibt bewusst keine globale Audit-/Event-Historie, solange keine
          Einzel-Events gespeichert werden.
        </p>
        <button className="tc-btn primary" type="button" onClick={onOpenCatalog}>
          Katalog öffnen
        </button>
      </div>
    </div>
  );
}
