import { useState, type ReactElement } from "react";
import type { Hass } from "./ha";
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

const PAGE_VIEWS: Record<PageId, () => ReactElement> = {
  overview: Overview,
  inbox: Inbox,
  diary: Diary,
  catalog: Catalog,
  io: ImportExport,
  settings: Settings,
};

export function App({ hass }: Props) {
  const [page, setPage] = useState<PageId>("overview");
  const meta = PAGES.find((p) => p.id === page)!;
  const View = PAGE_VIEWS[page];

  return (
    <div className="tc3">
      <Sidebar current={page} onSelect={setPage} />
      <div className="tc3-body">
        <CommandBar title={meta.label} desc={meta.desc} />
        <main className="tc3-main">
          <View />
        </main>
        <StatusBar
          connected={hass !== null}
          entryCount={null}
          selectedCount={0}
          lastSync={null}
        />
      </div>
    </div>
  );
}
