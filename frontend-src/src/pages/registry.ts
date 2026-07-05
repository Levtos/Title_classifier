// Page identity + sidebar metadata. No Archive/Watcher main screen — archive is
// a filter inside Catalog, watcher status lives on Overview/Settings. Trace is
// NOT a page — it is a diagnosis modal opened from the Katalog detail panel.

export type PageId =
  | "overview"
  | "inbox"
  | "catalog"
  | "io"
  | "settings";

export interface PageMeta {
  id: PageId;
  label: string;
  icon: string;
  desc: string;
}

export const PAGES: PageMeta[] = [
  { id: "overview", label: "Übersicht", icon: "▦", desc: "Systemzustand & aktueller Titel" },
  { id: "inbox", label: "Inbox", icon: "✉", desc: "Unklassifizierte Einträge abarbeiten" },
  { id: "catalog", label: "Katalog", icon: "▤", desc: "Bibliothek & Pflege · Diagnose" },
  { id: "io", label: "Import / Export", icon: "⇅", desc: "v3-JSON, bildfrei" },
  { id: "settings", label: "Einstellungen", icon: "⚙", desc: "Watcher, DB, Theme, Debug" },
];
