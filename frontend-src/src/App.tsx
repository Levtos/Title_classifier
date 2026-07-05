import { useCallback, useEffect, useState, type ReactElement } from "react";
import type { Hass } from "./ha";
import { useV3Store } from "./state/store";
import { buildTraceHash, parseTraceHash } from "./state/traceRoute";
import { PAGES, type PageId } from "./pages/registry";
import { Sidebar } from "./components/Sidebar";
import { CommandBar } from "./components/CommandBar";
import { StatusBar } from "./components/StatusBar";
import { Overview } from "./pages/Overview";
import { Inbox } from "./pages/Inbox";
import { Trace } from "./pages/Trace";
import { Catalog } from "./pages/Catalog";
import { ImportExport } from "./pages/ImportExport";
import { Settings } from "./pages/Settings";

interface Props {
  hass: Hass | null;
}

// Placeholder pages (replaced PR by PR). Pages that consume the live store are
// rendered explicitly below.
const PLACEHOLDER_VIEWS: Partial<Record<PageId, () => ReactElement>> = {
  io: ImportExport,
};

export function App({ hass }: Props) {
  // Restore a deep-linked Trace view from the URL hash on first load.
  const initialHash =
    typeof window !== "undefined" ? window.location.hash : "";
  const initialTrace = parseTraceHash(initialHash);
  const [page, setPage] = useState<PageId>(
    initialTrace.isTrace ? "diary" : "overview"
  );
  const [traceEntryId, setTraceEntryId] = useState<string | null>(
    initialTrace.entryId
  );
  const store = useV3Store(hass);
  const meta = PAGES.find((p) => p.id === page)!;
  const Placeholder = PLACEHOLDER_VIEWS[page];

  const openTrace = useCallback((entryId: string) => {
    setTraceEntryId(entryId);
    setPage("diary");
  }, []);

  // Keep the URL hash in sync with the Trace view so a reload re-opens the same
  // entry; other pages clear it. replaceState only — no history spam, no reload.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const target = page === "diary" ? buildTraceHash(traceEntryId) : "";
    const current = window.location.hash;
    if (current !== target && !(target === "" && current === "")) {
      window.history.replaceState(
        null,
        "",
        target || window.location.pathname + window.location.search
      );
    }
  }, [page, traceEntryId]);

  const renderPage = (): ReactElement => {
    if (page === "inbox") return <Inbox store={store} hass={hass} />;
    if (page === "catalog")
      return <Catalog store={store} hass={hass} onOpenTrace={openTrace} />;
    if (page === "diary")
      return (
        <Trace
          store={store}
          hass={hass}
          entryId={traceEntryId}
          onOpenCatalog={() => setPage("catalog")}
        />
      );
    if (page === "settings") return <Settings store={store} />;
    if (page === "overview" || !Placeholder) return <Overview store={store} />;
    return <Placeholder />;
  };

  return (
    <div className="tc3">
      <Sidebar current={page} onSelect={setPage} />
      <div className="tc3-body">
        <CommandBar
          title={meta.label}
          desc={meta.desc}
          loading={store.refreshing}
          onRefresh={() => store.refresh(true)}
        />
        <main className="tc3-main">{renderPage()}</main>
        <StatusBar
          connected={store.connected}
          entryCount={store.entryCount}
          selectedCount={0}
          lastSync={store.lastSync}
          error={store.error}
          watcherCount={store.sources.length}
        />
      </div>
    </div>
  );
}
