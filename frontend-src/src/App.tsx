import { useState, type ReactElement } from "react";
import type { Hass } from "./ha";
import { useV3Store } from "./state/store";
import { PAGES, type PageId } from "./pages/registry";
import { Sidebar } from "./components/Sidebar";
import { CommandBar } from "./components/CommandBar";
import { StatusBar } from "./components/StatusBar";
import { Overview } from "./pages/Overview";
import { Inbox } from "./pages/Inbox";
import { Diary } from "./pages/Diary";
import { Catalog } from "./pages/Catalog";
import { ImportExport } from "./pages/ImportExport";
import { Settings } from "./pages/Settings";

interface Props {
  hass: Hass | null;
}

// Placeholder pages (replaced PR by PR). Pages that consume the live store are
// rendered explicitly below.
const PLACEHOLDER_VIEWS: Partial<Record<PageId, () => ReactElement>> = {
  diary: Diary,
  catalog: Catalog,
  io: ImportExport,
  settings: Settings,
};

export function App({ hass }: Props) {
  const [page, setPage] = useState<PageId>("overview");
  const store = useV3Store(hass);
  const meta = PAGES.find((p) => p.id === page)!;
  const Placeholder = PLACEHOLDER_VIEWS[page];

  const renderPage = (): ReactElement => {
    if (page === "inbox") return <Inbox store={store} />;
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
          loading={store.loading}
          onRefresh={store.refresh}
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
