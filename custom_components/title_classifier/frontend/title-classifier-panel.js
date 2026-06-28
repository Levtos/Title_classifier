// Title Classifier Workbench
// Standalone Home Assistant panel using the existing title_classifier WebSocket API.

(() => {
if (customElements.get("title-classifier-panel")) return;

const STORAGE_KEY = "title-classifier-workbench-state-v2";
const ENUMS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const VIEWS = [
  ["overview", "Uebersicht"],
  ["inbox", "Inbox"],
  ["catalog", "Katalog"],
  ["archive", "Archiv"],
  ["watchers", "Watcher"],
  ["import", "Import / Export"],
  ["settings", "Einstellungen"],
];
const PLATFORMS = ["", "pc", "ps5", "switch", "tv", "mobile"];

class TitleClassifierPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._sources = [];
    this._allEntries = [];
    this._entries = [];
    this._loading = false;
    this._timer = null;
    this._selected = null;

    this._view = "overview";
    this._filterSource = "";
    this._filterClass = "all";
    this._filterType = "all";
    this._filterSearch = "";
    this._includeHidden = false;
    this._groupByArtist = false;
    this._sortBy = "last_seen";
    this._sortAsc = false;
    this._exportText = "";
    this._importText = "";
    this._draftEnums = new Map();
    this._mergeMode = false;
    this._selection = new Set();
    this._mergeCanonical = null;

    this._loadState();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._loading && this._sources.length === 0) this._load();
  }

  connectedCallback() {
    this._render();
    this._timer = setInterval(() => this._load({ quiet: true }), 30_000);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
  }

  _loadState() {
    try {
      const raw = window.localStorage?.getItem(STORAGE_KEY);
      if (!raw) return;
      const state = JSON.parse(raw);
      for (const key of [
        "view", "filterSource", "filterClass", "filterType", "filterSearch",
        "sortBy",
      ]) {
        const prop = `_${key}`;
        if (typeof state[key] === "string") this[prop] = state[key];
      }
      if (typeof state.includeHidden === "boolean") this._includeHidden = state.includeHidden;
      if (typeof state.groupByArtist === "boolean") this._groupByArtist = state.groupByArtist;
      if (typeof state.sortAsc === "boolean") this._sortAsc = state.sortAsc;
    } catch { /* ignore local state */ }
  }

  _saveState() {
    try {
      window.localStorage?.setItem(STORAGE_KEY, JSON.stringify({
        view: this._view,
        filterSource: this._filterSource,
        filterClass: this._filterClass,
        filterType: this._filterType,
        filterSearch: this._filterSearch,
        includeHidden: this._includeHidden,
        groupByArtist: this._groupByArtist,
        sortBy: this._sortBy,
        sortAsc: this._sortAsc,
      }));
    } catch { /* localStorage unavailable */ }
  }

  async _ws(message) {
    if (!this._hass?.connection) throw new Error("Home Assistant Verbindung nicht verfuegbar");
    return this._hass.connection.sendMessagePromise(message);
  }

  async _load({ quiet = false } = {}) {
    if (!this._hass) return;
    this._loading = !quiet;
    this._render();
    try {
      const [sources, entries] = await Promise.all([
        this._ws({ type: "title_classifier/get_sources" }),
        // No row cap: the catalog is deduped server-side per (scope, category)
        // now, but Musikkatalog alone is >1300 titles — a 1000-cap silently
        // dropped the tail (and the whole archive). Pull everything.
        this._ws({ type: "title_classifier/list_entries", include_hidden: true }),
      ]);
      this._sources = Array.isArray(sources) ? sources : [];
      this._allEntries = Array.isArray(entries) ? entries : [];
      if (this._filterSource && !this._sources.some(s => s.entry_id === this._filterSource)) {
        this._filterSource = "";
      }
      if (this._selected && !this._allEntries.some(e => this._sameEntry(e, this._selected))) {
        this._selected = null;
      }
      this._applyFilters();
      this._saveState();
    } catch (err) {
      this._toast(`Laden fehlgeschlagen: ${err.message}`, "error");
    } finally {
      this._loading = false;
      this._render();
    }
  }

  _applyFilters() {
    const query = this._filterSearch.trim().toLowerCase();
    let rows = [...this._allEntries];
    if (this._view === "inbox") rows = rows.filter(e => e.enum === 0);
    // Archive = exactly the hidden entries, regardless of the include-hidden toggle.
    if (this._view === "archive") rows = rows.filter(e => e.hidden);
    if (this._filterSource) rows = rows.filter(e => e.entry_id === this._filterSource);
    if (this._filterType !== "all") rows = rows.filter(e => e.watcher_type === this._filterType);
    if (this._filterClass === "unclassified") rows = rows.filter(e => e.enum === 0);
    if (this._filterClass === "classified") rows = rows.filter(e => e.enum !== 0);
    if (this._view !== "archive" && !this._includeHidden) rows = rows.filter(e => !e.hidden);
    if (query) rows = rows.filter(e =>
      e.key.toLowerCase().includes(query)
      || (e.source_name || "").toLowerCase().includes(query)
    );
    rows.sort((a, b) => this._compareEntries(a, b));
    this._entries = rows;
  }

  _compareEntries(a, b) {
    let cmp = 0;
    switch (this._sortBy) {
      case "key":
        cmp = a.key.localeCompare(b.key);
        break;
      case "source":
        cmp = (a.source_name || "").localeCompare(b.source_name || "");
        break;
      case "enum":
        cmp = a.enum - b.enum;
        break;
      case "seen_count":
        cmp = (a.seen_count || 0) - (b.seen_count || 0);
        break;
      default:
        cmp = new Date(a.last_seen || 0) - new Date(b.last_seen || 0);
    }
    return this._sortAsc ? cmp : -cmp;
  }

  _stats() {
    // Derive from the deduped entry list, not the per-watcher source counts —
    // those double-count rows shared across watchers of the same category
    // (PC + ps5 both 'game' reported 10 + 10 for the same 10 games).
    const total = this._allEntries.length;
    const unclassified = this._allEntries.reduce((n, e) => n + (e.enum === 0 ? 1 : 0), 0);
    const hidden = this._allEntries.reduce((n, e) => n + (e.hidden ? 1 : 0), 0);
    const activeWatchers = this._sources.length;
    const current = this._currentEntry();
    const last = [...this._allEntries].sort((a, b) =>
      new Date(b.last_seen || 0) - new Date(a.last_seen || 0)
    )[0];
    return { total, unclassified, hidden, activeWatchers, current, last };
  }

  _currentEntry() {
    return this._allEntries.find(e => e.is_current)
      || [...this._allEntries].sort((a, b) =>
        new Date(b.last_seen || 0) - new Date(a.last_seen || 0)
      )[0]
      || null;
  }

  _source(entryId) {
    return this._sources.find(s => s.entry_id === entryId);
  }

  _sameEntry(a, b) {
    return a?.entry_id === b?.entry_id && a?.key === b?.key;
  }

  _entryToken(entry) {
    return encodeURIComponent(`${entry.entry_id}\u0000${entry.key}`);
  }

  _entryByToken(token) {
    const decoded = decodeURIComponent(token || "");
    const [entryId, key] = decoded.split("\u0000");
    return this._allEntries.find(entry => entry.entry_id === entryId && entry.key === key);
  }

  _draftEnum(entry) {
    const token = this._entryToken(entry);
    return this._draftEnums.has(token) ? this._draftEnums.get(token) : entry.enum;
  }

  _setDraftEnum(entry, value) {
    this._draftEnums.set(this._entryToken(entry), value);
    this._replaceDrawer();
  }

  async _applyDraftEnum(entry) {
    const token = this._entryToken(entry);
    const value = this._draftEnum(entry);
    const previous = entry.enum;
    this._draftEnums.delete(token);
    this._setEnumLocal({ ...entry }, value, token);
    this._toast(`Enum ${value} uebernommen`, "success");
    this._persistEnum({ ...entry }, value, previous, token);
  }

  _setEnumLocal(entry, value, token) {
    entry.enum = value;
    this._syncEntry(entry);
    this._updateEnumDisplay(token, value);
    this._replaceDrawer();
  }

  async _persistEnum(entry, value, previous, token) {
    try {
      await this._ws({
        type: "title_classifier/update_entry",
        entry_id: entry.entry_id,
        key: entry.key,
        enum_value: value,
      });
      this._toast(`Enum ${value} gespeichert`, "success");
    } catch (err) {
      this._toast(`Speichern fehlgeschlagen: ${err.message}`, "error");
      this._setEnumLocal({ ...entry, enum: previous }, previous, token);
    }
  }

  _replaceDrawer() {
    const drawer = this.shadowRoot?.querySelector(".drawer");
    if (!drawer) {
      this._render();
      return;
    }
    drawer.outerHTML = this._drawerHtml();
    this._wireDrawer();
  }

  _updateEnumDisplay(token, value) {
    this.shadowRoot
      .querySelectorAll(`.enum-pill[data-token="${token}"]`)
      .forEach(btn => btn.classList.toggle("active", Number(btn.dataset.enum) === value));
    this.shadowRoot.querySelectorAll(".row").forEach(row => {
      if (row.dataset.token !== token) return;
      const slot = row.querySelector(".enum-slot");
      if (slot) slot.innerHTML = this._enumSummaryHtml(value);
    });
  }

  _syncEntry(entry) {
    const idx = this._allEntries.findIndex(e => this._sameEntry(e, entry));
    if (idx >= 0) this._allEntries[idx] = { ...this._allEntries[idx], ...entry };
    if (this._selected && this._sameEntry(this._selected, entry)) {
      this._selected = { ...this._selected, ...entry };
    }
  }

  _selectEntry(entry) {
    // Open/close the detail drawer WITHOUT rebuilding the whole catalog table
    // (that full re-render of ~1000 rows was the multi-second freeze).
    this._selected = entry;
    const root = this.shadowRoot;
    const drawer = root.querySelector(".drawer");
    if (!drawer) {
      this._render();
      return;
    }
    root.querySelectorAll(".row.selected").forEach(r => r.classList.remove("selected"));
    if (entry) {
      root.querySelectorAll(".row").forEach(r => {
        if (r.dataset.eid === entry.entry_id && r.dataset.key === entry.key) {
          r.classList.add("selected");
        }
      });
    }
    this._replaceDrawer();
  }

  _wireDrawer() {
    const root = this.shadowRoot;
    root.querySelector("#close-detail")?.addEventListener("click", () => this._selectEntry(null));
    root.querySelector("#delete-entry")?.addEventListener("click", ev => {
      const target = ev.currentTarget;
      const entry = this._allEntries.find(e => e.entry_id === target.dataset.eid && e.key === target.dataset.key);
      if (entry) this._deleteEntry(entry);
    });
    root.querySelectorAll(".drawer .enum-pill").forEach(btn => btn.addEventListener("click", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const entry = this._entryByToken(btn.dataset.token);
      if (entry) this._setDraftEnum({ ...entry }, Number(btn.dataset.enum));
    }));
    root.querySelector("#apply-enum")?.addEventListener("click", ev => {
      const entry = this._entryByToken(ev.currentTarget.dataset.token);
      if (entry) this._applyDraftEnum(entry);
    });
    root.querySelector("#rename-apply")?.addEventListener("click", () => {
      const input = root.querySelector("#rename-input");
      if (input) this._renameEntry(input.dataset.eid, input.dataset.key, input.value);
    });
    root.querySelector("#rename-input")?.addEventListener("keydown", ev => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        this._renameEntry(ev.target.dataset.eid, ev.target.dataset.key, ev.target.value);
      }
    });
    root.querySelector("#platform-apply")?.addEventListener("click", () => {
      const sel = root.querySelector("#platform-select");
      if (sel) this._setPlatform(sel.dataset.eid, sel.dataset.key, sel.value);
    });
    root.querySelector("#unhide-entry")?.addEventListener("click", ev => {
      const t = ev.currentTarget;
      this._unhideEntry(t.dataset.eid, t.dataset.key);
    });
  }

  async _deleteEntry(entry) {
    if (!window.confirm(`Eintrag "${entry.key}" wirklich loeschen?`)) return;
    try {
      await this._ws({ type: "title_classifier/delete_entry", entry_id: entry.entry_id, key: entry.key });
      this._selected = null;
      await this._load({ quiet: true });
      this._toast("Eintrag geloescht", "success");
    } catch (err) {
      this._toast(`Loeschen fehlgeschlagen: ${err.message}`, "error");
    }
  }

  async _hideUnmapped(sourceId) {
    if (!sourceId) {
      this._toast("Bitte zuerst eine Source waehlen", "error");
      return;
    }
    const src = this._source(sourceId);
    if (!src?.unmapped_count) {
      this._toast("Keine unklassifizierten Eintraege", "info");
      return;
    }
    try {
      await this._ws({ type: "title_classifier/hide_unmapped", entry_id: sourceId });
      await this._load({ quiet: true });
      this._toast("Unklassifizierte Eintraege ausgeblendet", "success");
    } catch (err) {
      this._toast(`Ausblenden fehlgeschlagen: ${err.message}`, "error");
    }
  }

  async _renameEntry(entryId, oldKey, newKey) {
    newKey = (newKey || "").trim();
    if (!newKey || newKey === oldKey) return;
    try {
      const res = await this._ws({
        type: "title_classifier/rename_entry",
        entry_id: entryId, key: oldKey, new_key: newKey,
      });
      this._selected = null;
      await this._load({ quiet: true });
      this._toast(res?.renamed ? "Titel umbenannt" : "Keine Aenderung", res?.renamed ? "success" : "info");
    } catch (err) {
      this._toast(`Umbenennen fehlgeschlagen: ${err.message}`, "error");
    }
  }

  async _setPlatform(entryId, key, platform) {
    try {
      await this._ws({
        type: "title_classifier/set_platform",
        entry_id: entryId, key, platform: platform || null,
      });
      await this._load({ quiet: true });
      this._toast(`Plattform: ${platform || "—"}`, "success");
    } catch (err) {
      this._toast(`Plattform setzen fehlgeschlagen: ${err.message}`, "error");
    }
  }

  async _unhideEntry(entryId, key) {
    try {
      await this._ws({ type: "title_classifier/unhide_entry", entry_id: entryId, key });
      this._selected = null;
      await this._load({ quiet: true });
      this._toast("Wiederhergestellt", "success");
    } catch (err) {
      this._toast(`Wiederherstellen fehlgeschlagen: ${err.message}`, "error");
    }
  }

  _toggleSelect(token, on) {
    if (on) this._selection.add(token);
    else {
      this._selection.delete(token);
      if (this._mergeCanonical === token) this._mergeCanonical = null;
    }
    this._render();
  }

  _clearMerge() {
    this._selection.clear();
    this._mergeCanonical = null;
    this._render();
  }

  async _runMerge() {
    const tokens = [...this._selection];
    const target = this._entryByToken(this._mergeCanonical);
    if (!target || tokens.length < 2) {
      this._toast("Mindestens 2 Eintraege + ein Ziel waehlen", "error");
      return;
    }
    const sources = tokens
      .map(t => this._entryByToken(t))
      .filter(e => e && !(e.entry_id === target.entry_id && e.key === target.key));
    // All rows of one shared (scope, category) carry the same entry_id surface;
    // use the target's entry_id as the routing handle for the merge call.
    const sourceKeys = sources.map(e => e.key);
    if (!window.confirm(`${sourceKeys.length} Eintrag/Eintraege in "${target.key}" zusammenfuehren?`)) return;
    try {
      const res = await this._ws({
        type: "title_classifier/merge_entries",
        entry_id: target.entry_id, target_key: target.key, source_keys: sourceKeys,
      });
      this._clearMerge();
      this._selected = null;
      await this._load({ quiet: true });
      this._toast(`${res?.merged ?? 0} zusammengefuehrt`, "success");
    } catch (err) {
      this._toast(`Merge fehlgeschlagen: ${err.message}`, "error");
    }
  }

  async _runDedupe() {
    if (!this._filterSource) {
      this._toast("Bitte zuerst eine Quelle waehlen", "error");
      return;
    }
    try {
      const dry = await this._ws({
        type: "title_classifier/dedupe_catalog",
        entry_id: this._filterSource, dry_run: true,
      });
      const dupes = dry?.duplicates ?? 0;
      if (!dupes) { this._toast("Keine Dubletten gefunden", "info"); return; }
      if (!window.confirm(`${dupes} Dublette(n) in ${dry.groups} Gruppe(n) zusammenfuehren?`)) return;
      const res = await this._ws({
        type: "title_classifier/dedupe_catalog",
        entry_id: this._filterSource, dry_run: false,
      });
      await this._load({ quiet: true });
      this._toast(`${res?.merged ?? 0} Dubletten zusammengefuehrt`, "success");
    } catch (err) {
      this._toast(`Dedupe fehlgeschlagen: ${err.message}`, "error");
    }
  }

  _exportJson() {
    const payload = {
      version: 1,
      exported_at: new Date().toISOString(),
      domain: "title_classifier",
      sources: this._sources.map(s => ({
        entry_id: s.entry_id,
        name: s.name,
        watcher_type: s.watcher_type,
        source_entity: s.source_entity,
      })),
      entries: this._allEntries.map(e => ({
        entry_id: e.entry_id,
        source_name: e.source_name,
        watcher_type: e.watcher_type,
        key: e.key,
        enum: e.enum,
        first_seen: e.first_seen,
        last_seen: e.last_seen,
        seen_count: e.seen_count,
        hidden_at: e.hidden_at || null,
      })),
    };
    this._exportText = JSON.stringify(payload, null, 2);
    this._render();
  }

  async _importJson() {
    try {
      const payload = JSON.parse(this._importText || "{}");
      const rows = Array.isArray(payload) ? payload : payload.entries;
      if (!Array.isArray(rows)) throw new Error("JSON muss ein entries-Array enthalten");
      const grouped = new Map();
      for (const row of rows) {
        if (!row.key || row.enum === undefined) continue;
        const entryId = row.entry_id || this._filterSource;
        if (!entryId) throw new Error("entry_id fehlt; bitte Source waehlen oder exportiertes Format nutzen");
        if (!grouped.has(entryId)) grouped.set(entryId, []);
        grouped.get(entryId).push({ key: String(row.key), enum: Number(row.enum) });
      }
      for (const [entryId, entries] of grouped) {
        await this._ws({ type: "title_classifier/import_entries", entry_id: entryId, entries });
      }
      await this._load({ quiet: true });
      this._toast("Import abgeschlossen", "success");
    } catch (err) {
      this._toast(`Import fehlgeschlagen: ${err.message}`, "error");
    }
  }

  _setView(view) {
    this._view = view;
    if (view === "inbox") this._filterClass = "unclassified";
    if (view === "catalog" && this._filterClass === "unclassified") this._filterClass = "all";
    this._applyFilters();
    this._saveState();
    this._render();
  }

  _setFilter(name, value) {
    this[name] = value;
    this._applyFilters();
    this._saveState();
    this._render();
  }

  _toggleSort(sortBy) {
    if (this._sortBy === sortBy) this._sortAsc = !this._sortAsc;
    else {
      this._sortBy = sortBy;
      this._sortAsc = sortBy !== "last_seen" && sortBy !== "seen_count";
    }
    this._applyFilters();
    this._saveState();
    this._render();
  }

  _render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
<style>
:host {
  --tc-bg: #0b1020;
  --tc-panel: #11172a;
  --tc-card: #161d33;
  --tc-card-2: #1a2240;
  --tc-border: rgba(148, 163, 184, .18);
  --tc-text: #f8f8f2;
  --tc-muted: #a6adc8;
  --tc-soft: #69708e;
  --tc-cyan: #8be9fd;
  --tc-purple: #bd93f9;
  --tc-green: #50fa7b;
  --tc-orange: #ffb86c;
  --tc-red: #ff5555;
  --tc-pink: #ff79c6;
  --tc-yellow: #f1fa8c;
  --tc-radius: 8px;
  --tc-shadow: 0 18px 50px rgba(0, 0, 0, .28);
  --enum-0: #6272a4;
  --enum-1: #50fa7b;
  --enum-2: #8be9fd;
  --enum-3: #bd93f9;
  --enum-4: #ff79c6;
  --enum-5: #ff5555;
  --enum-6: #ffb86c;
  --enum-7: #f1fa8c;
  --enum-8: #00c7d4;
  --enum-9: #94a3b8;
  display: block;
  min-height: 100%;
  color: var(--tc-text);
  background:
    radial-gradient(circle at 12% 0%, rgba(189, 147, 249, .14), transparent 28rem),
    linear-gradient(180deg, #0c1224 0%, var(--tc-bg) 60%);
  font-family: Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
* { box-sizing: border-box; }
button, input, select, textarea { font: inherit; }
.shell { display: grid; grid-template-columns: 236px minmax(0, 1fr); min-height: 100vh; }
.side {
  border-right: 1px solid var(--tc-border);
  background: rgba(10, 14, 28, .76);
  padding: 18px 12px;
  position: sticky;
  top: 0;
  height: 100vh;
}
.brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1.05rem; margin: 0 10px 26px; }
.brand-mark {
  width: 34px; height: 34px; border-radius: 8px; display: grid; place-items: center;
  background: linear-gradient(135deg, rgba(139, 233, 253, .16), rgba(189, 147, 249, .28));
  border: 1px solid rgba(189, 147, 249, .42); color: var(--tc-purple);
}
.nav { display: grid; gap: 8px; }
.nav-btn {
  width: 100%; height: 44px; border: 1px solid transparent; border-radius: var(--tc-radius);
  background: transparent; color: var(--tc-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: space-between; padding: 0 12px;
}
.nav-btn span:first-child { display: flex; align-items: center; gap: 10px; }
.nav-btn.active {
  color: var(--tc-text); border-color: rgba(189, 147, 249, .5);
  background: linear-gradient(90deg, rgba(189, 147, 249, .26), rgba(139, 233, 253, .05));
}
.badge-count {
  min-width: 24px; height: 24px; padding: 0 7px; display: inline-grid; place-items: center;
  background: rgba(189, 147, 249, .32); color: var(--tc-text); border-radius: 999px; font-size: .8rem;
}
.side-foot { position: absolute; left: 18px; right: 18px; bottom: 18px; color: var(--tc-muted); font-size: .82rem; display: grid; gap: 10px; }
.main { padding: 22px 28px 32px; min-width: 0; }
.top { display: flex; gap: 18px; align-items: start; justify-content: space-between; margin-bottom: 18px; }
h1 { margin: 0; font-size: 1.55rem; line-height: 1.1; }
.sub { color: var(--tc-muted); margin-top: 6px; font-size: .88rem; }
.actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: end; }
.search {
  width: min(360px, 42vw); height: 40px; border: 1px solid var(--tc-border); border-radius: var(--tc-radius);
  background: rgba(10, 14, 28, .72); color: var(--tc-text); padding: 0 13px;
}
.btn {
  min-height: 38px; border-radius: var(--tc-radius); border: 1px solid var(--tc-border);
  background: rgba(255,255,255,.04); color: var(--tc-text); cursor: pointer; padding: 0 14px;
}
.btn.primary { border: 0; background: linear-gradient(135deg, #7c3aed, #6d28d9); box-shadow: 0 10px 24px rgba(124, 58, 237, .28); font-weight: 700; }
.btn.danger { color: var(--tc-red); border-color: rgba(255, 85, 85, .35); }
.grid { display: grid; gap: 14px; }
.summary { grid-template-columns: repeat(5, minmax(130px, 1fr)); margin-bottom: 16px; }
.card {
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.025));
  border: 1px solid var(--tc-border); border-radius: var(--tc-radius); box-shadow: var(--tc-shadow);
}
.metric { padding: 18px; min-height: 106px; display: flex; gap: 14px; align-items: center; }
.metric .ico, .watch-ico {
  width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center;
  background: rgba(139, 233, 253, .12); color: var(--tc-cyan); font-size: 1.35rem;
}
.metric strong { display: block; font-size: 1.5rem; }
.metric span { color: var(--tc-muted); font-size: .82rem; }
.watchers { grid-template-columns: repeat(3, minmax(180px, 1fr)); margin-bottom: 16px; }
.watch-card { padding: 16px; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 12px; align-items: center; }
.watch-card h3 { margin: 0 0 4px; font-size: .92rem; color: var(--tc-muted); }
.watch-card strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.status { color: var(--tc-green); font-size: .75rem; font-weight: 800; text-transform: uppercase; }
.layout { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 16px; }
.panel { overflow: hidden; }
.toolbar {
  display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
  padding: 14px; border-bottom: 1px solid var(--tc-border); background: rgba(255,255,255,.025);
}
.tabs { display: flex; gap: 8px; padding: 14px 14px 0; border-bottom: 1px solid var(--tc-border); }
.tab { background: transparent; border: 0; color: var(--tc-muted); padding: 0 12px 12px; cursor: pointer; border-bottom: 2px solid transparent; }
.tab.active { color: var(--tc-text); border-color: var(--tc-purple); }
select, .filter-input, textarea {
  min-height: 36px; border: 1px solid var(--tc-border); border-radius: var(--tc-radius);
  background: rgba(10, 14, 28, .65); color: var(--tc-text); padding: 0 10px;
}
textarea { width: 100%; min-height: 220px; padding: 12px; resize: vertical; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; color: var(--tc-muted); font-size: .8rem; padding: 12px 14px; border-bottom: 1px solid var(--tc-border); cursor: pointer; }
.table td { padding: 9px 14px; border-bottom: 1px solid rgba(148, 163, 184, .10); vertical-align: middle; }
.row { cursor: pointer; }
.row:hover { background: rgba(139, 233, 253, .05); }
.row.selected { background: rgba(189, 147, 249, .13); }
.title-cell strong { display: block; max-width: 420px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.meta { color: var(--tc-muted); font-size: .8rem; margin-top: 3px; }
.source-pill, .kind-pill {
  display: inline-flex; align-items: center; min-height: 22px; padding: 0 8px; border-radius: 999px;
  background: rgba(98, 114, 164, .22); color: var(--tc-text); font-size: .78rem;
}
.kind-pill { color: var(--tc-cyan); }
.enum-current {
  display: inline-flex; align-items: center; gap: 8px; min-height: 28px;
  border-radius: 999px; border: 1px solid var(--tc-border);
  background: rgba(255,255,255,.04); padding: 0 10px; font-weight: 700;
}
.enum-pills { display: flex; gap: 6px; flex-wrap: wrap; }
.enum-pill {
  width: 32px; height: 32px; border-radius: 7px; border: 1px solid var(--tc-border);
  background: rgba(255,255,255,.035); color: var(--tc-muted); cursor: pointer; padding: 0;
}
.enum-pill.active { color: #fff; border-color: var(--pill); background: color-mix(in srgb, var(--pill) 45%, transparent); box-shadow: 0 0 0 1px color-mix(in srgb, var(--pill) 35%, transparent); }
.enum-apply {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  margin-top: 12px;
}
.drawer { padding: 16px; position: sticky; top: 22px; align-self: start; }
.drawer-head { display: flex; justify-content: space-between; gap: 12px; align-items: start; margin-bottom: 16px; }
.drawer h2 { margin: 0; font-size: 1.05rem; }
.cover {
  width: 96px; height: 96px; border-radius: var(--tc-radius); background:
    linear-gradient(135deg, rgba(139, 233, 253, .18), rgba(189, 147, 249, .24));
  border: 1px solid var(--tc-border); display: grid; place-items: center; color: var(--tc-purple); font-size: 2rem;
}
.details { display: grid; gap: 10px; margin: 14px 0; }
.detail-row { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px solid rgba(148, 163, 184, .10); padding-bottom: 8px; }
.detail-row span:first-child { color: var(--tc-muted); }
.empty { color: var(--tc-muted); text-align: center; padding: 44px 20px; }
.import-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px; }
.edit-block { margin-top: 14px; display: grid; gap: 6px; }
.edit-label { color: var(--tc-muted); font-size: .8rem; }
.edit-row { display: flex; gap: 8px; align-items: center; }
.edit-input { flex: 1; min-width: 0; }
.merge-bar { gap: 8px; align-items: center; border-top: 1px solid var(--tc-border); }
.merge-bar .btn { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sel-col { width: 36px; text-align: center; }
.settings { padding: 16px; color: var(--tc-muted); line-height: 1.6; }
.toast {
  position: fixed; right: 26px; bottom: 26px; z-index: 10; border-radius: var(--tc-radius);
  background: #2563eb; color: #fff; padding: 12px 16px; box-shadow: var(--tc-shadow);
}
.toast.error { background: #dc2626; }
.toast.success { background: #16a34a; }
@media (max-width: 1180px) {
  .shell { grid-template-columns: 1fr; }
  .side { position: relative; height: auto; display: block; }
  .side-foot { position: static; margin: 22px 10px 0; }
  .nav { grid-template-columns: repeat(3, 1fr); }
  .summary { grid-template-columns: repeat(2, 1fr); }
  .watchers { grid-template-columns: 1fr; }
  .layout { grid-template-columns: 1fr; }
  .drawer { position: static; }
}
@media (max-width: 720px) {
  .main { padding: 18px 14px; }
  .top { display: grid; }
  .actions { justify-content: stretch; }
  .search { width: 100%; }
  .summary, .import-grid { grid-template-columns: 1fr; }
  .nav { grid-template-columns: 1fr; }
  .table th:nth-child(2), .table td:nth-child(2), .table th:nth-child(4), .table td:nth-child(4) { display: none; }
}
</style>
<div class="shell">
  <aside class="side">
    <div class="brand"><div class="brand-mark">${this._icon("cube")}</div><span>Title Classifier</span></div>
    <nav class="nav">${this._navHtml()}</nav>
    <div class="side-foot"><span>Dunkles Design: Dracula</span><span>v${this._manifestVersion()}</span></div>
  </aside>
  <main class="main">
    <div class="top">
      <div><h1>${this._viewTitle()}</h1><div class="sub">${this._viewSubtitle()}</div></div>
      <div class="actions">
        <input class="search" id="global-search" placeholder="Titel suchen..." value="${this._esc(this._filterSearch)}">
        <button class="btn" id="refresh" title="Aktualisieren">${this._icon("refresh")}</button>
        <button class="btn primary" id="add-watcher">+ Watcher hinzufuegen</button>
      </div>
    </div>
    ${this._loading ? `<div class="empty">Lade Title Classifier...</div>` : this._contentHtml()}
  </main>
</div>`;
    this._wire();
  }

  _navHtml() {
    const s = this._stats();
    const counts = {
      inbox: s.unclassified,
      catalog: s.total,
      archive: s.hidden,
      watchers: this._sources.length,
    };
    return VIEWS.map(([id, label]) => `
      <button class="nav-btn ${this._view === id ? "active" : ""}" data-view="${id}">
        <span>${this._navIcon(id)} ${label}</span>
        ${counts[id] ? `<span class="badge-count">${counts[id]}</span>` : ""}
      </button>
    `).join("");
  }

  _contentHtml() {
    if (this._view === "import") return this._importHtml();
    if (this._view === "settings") return this._settingsHtml();
    if (this._view === "watchers") return `${this._summaryHtml()}${this._watchersHtml(true)}`;
    return `
      ${this._summaryHtml()}
      ${this._watchersHtml(false)}
      <div class="layout">
        <section class="card panel">
          ${this._tabsHtml()}
          ${this._toolbarHtml()}
          ${this._entriesHtml()}
        </section>
        ${this._drawerHtml()}
      </div>
    `;
  }

  _summaryHtml() {
    const s = this._stats();
    return `<section class="grid summary">
      ${this._metric("db", s.total, "Bekannte Titel", `${s.hidden} ausgeblendet`)}
      ${this._metric("inbox", s.unclassified, "Unklassifiziert", "Enum 0")}
      ${this._metric("watch", s.activeWatchers, "Watcher aktiv", "Alle online")}
      ${this._metric("bell", s.current ? 1 : 0, "Aktiv gerade", s.current?.key || "Kein aktueller Titel")}
      ${this._metric("time", s.last ? this._rel(s.last.last_seen) : "-", "Letzter Wechsel", s.last ? s.last.key : "Noch keine Sichtung")}
    </section>`;
  }

  _watchersHtml(full) {
    const cards = this._sources.map(source => {
      const current = this._allEntries.find(e => e.entry_id === source.entry_id && e.is_current)
        || [...this._allEntries].filter(e => e.entry_id === source.entry_id)
          .sort((a, b) => new Date(b.last_seen || 0) - new Date(a.last_seen || 0))[0];
      // Live-Titel bevorzugen: current_key kommt direkt aus der Runtime. Der
      // Katalog-Eintrag kann fehlen/ausgeblendet sein → sonst stuende die rohe
      // Source-Entity-ID (z.B. "sensor.stash_currently_playing") in der Karte.
      const title = source.current_key || current?.key || source.source_entity || "Kein aktueller Wert";
      const active = source.online !== false && !!source.current_key;
      const seen = current?.last_seen;
      return `<article class="card watch-card">
        <div class="watch-ico">${this._kindIconFor(source.category, source.watcher_type)}</div>
        <div>
          <h3>${this._esc(source.name)}</h3>
          <strong>${this._esc(title)}</strong>
          <div class="meta">${this._sourceEnum(source, current)} · ${this._kindLabel(source.category, source.watcher_type)}</div>
        </div>
        <div><div class="status">${source.online === false ? "Offline" : (active ? "Aktiv" : "Online")}</div><div class="meta">${seen ? this._rel(seen) : "-"}</div></div>
      </article>`;
    }).join("");
    return `<section class="grid watchers${full ? " full" : ""}">${cards || `<div class="card empty">Noch keine Watcher geladen.</div>`}</section>`;
  }

  _tabsHtml() {
    const tabs = [["inbox", "Inbox"], ["catalog", "Katalog"], ["overview", "Verlauf"]];
    return `<div class="tabs">${tabs.map(([id, label]) => `
      <button class="tab ${this._view === id ? "active" : ""}" data-view="${id}">${label}</button>
    `).join("")}</div>`;
  }

  _toolbarHtml() {
    const srcOptions = this._sources.map(s => `<option value="${this._esc(s.entry_id)}"${this._filterSource === s.entry_id ? " selected" : ""}>${this._esc(s.name)}</option>`).join("");
    return `<div class="toolbar">
      <select id="filter-source"><option value="">Quelle: Alle</option>${srcOptions}</select>
      <select id="filter-class">
        <option value="all"${this._filterClass === "all" ? " selected" : ""}>Kategorie: Alle</option>
        <option value="unclassified"${this._filterClass === "unclassified" ? " selected" : ""}>Unklassifiziert</option>
        <option value="classified"${this._filterClass === "classified" ? " selected" : ""}>Klassifiziert</option>
      </select>
      <select id="filter-type">
        <option value="all"${this._filterType === "all" ? " selected" : ""}>Typ: Alle</option>
        <option value="media"${this._filterType === "media" ? " selected" : ""}>Musik / Medien</option>
        <option value="game"${this._filterType === "game" ? " selected" : ""}>Spiel / App</option>
        <option value="activity"${this._filterType === "activity" ? " selected" : ""}>Aktivitaet</option>
      </select>
      <label><input type="checkbox" id="include-hidden"${this._includeHidden ? " checked" : ""}> Versteckte zeigen</label>
      <label><input type="checkbox" id="group-artist"${this._groupByArtist ? " checked" : ""}> Nach Kuenstler</label>
      <label><input type="checkbox" id="merge-mode"${this._mergeMode ? " checked" : ""}> Merge-Modus</label>
      ${this._filterSource ? `<button class="btn" id="hide-unmapped">Unklassifizierte ausblenden</button>` : ""}
      ${this._filterSource ? `<button class="btn" id="dedupe">Dubletten zusammenfuehren</button>` : ""}
    </div>${this._mergeBarHtml()}`;
  }

  _mergeBarHtml() {
    if (!this._mergeMode) return "";
    const tokens = [...this._selection];
    const picked = tokens
      .map(t => this._entryByToken(t))
      .filter(Boolean);
    if (picked.length === 0) {
      return `<div class="toolbar merge-bar"><span class="meta">Merge-Modus: Eintraege ankreuzen, dann einen als Ziel waehlen.</span></div>`;
    }
    const options = picked.map(e => {
      const token = this._entryToken(e);
      const isTarget = this._mergeCanonical === token;
      return `<button class="btn ${isTarget ? "primary" : ""}" data-merge-target="${this._esc(token)}" title="Als Ziel waehlen">${isTarget ? "★ " : ""}${this._esc(e.key)}</button>`;
    }).join("");
    const ready = this._mergeCanonical && picked.length >= 2;
    return `<div class="toolbar merge-bar">
      <span class="meta">Ziel (bleibt erhalten):</span>
      ${options}
      <button class="btn primary" id="run-merge"${ready ? "" : " disabled"}>Zusammenfuehren (${picked.length})</button>
      <button class="btn" id="clear-merge">Auswahl leeren</button>
    </div>`;
  }

  _entriesHtml() {
    if (this._entries.length === 0) return `<div class="empty">Keine Eintraege gefunden.</div>`;
    if (this._groupByArtist) return this._groupedEntriesHtml();
    return this._tableHtml(this._entries);
  }

  _groupedEntriesHtml() {
    const groups = new Map();
    for (const entry of this._entries) {
      const group = this._artistFrom(entry.key) || "Ohne Kuenstler";
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(entry);
    }
    return [...groups.entries()].map(([group, rows]) => `
      <div>
        <div class="toolbar"><strong>${this._esc(group)}</strong><span class="meta">${rows.length} Titel</span></div>
        ${this._tableHtml(rows)}
      </div>
    `).join("");
  }

  _tableHtml(rows) {
    const sel = this._mergeMode
      ? `<th class="sel-col">${this._icon("merge")}</th>` : "";
    return `<table class="table">
      <thead><tr>
        ${sel}
        <th data-sort="key">Titel</th>
        <th data-sort="source">Typ / Plattform</th>
        <th data-sort="enum">Enum</th>
        <th data-sort="seen_count">Sichtungen</th>
        <th data-sort="last_seen">Zuletzt</th>
      </tr></thead>
      <tbody>${rows.map(entry => this._entryRow(entry)).join("")}</tbody>
    </table>`;
  }

  _entryRow(entry) {
    const selected = this._selected && this._sameEntry(entry, this._selected);
    const token = this._entryToken(entry);
    const checked = this._selection.has(token);
    const sel = this._mergeMode
      ? `<td class="sel-col"><input type="checkbox" class="merge-pick" data-token="${this._esc(token)}"${checked ? " checked" : ""}></td>`
      : "";
    return `<tr class="row ${selected ? "selected" : ""}" data-eid="${this._esc(entry.entry_id)}" data-key="${this._esc(entry.key)}" data-token="${this._esc(token)}">
      ${sel}
      <td class="title-cell">
        <strong>${this._esc(entry.key)} ${entry.is_current ? `<span class="source-pill">aktiv</span>` : ""}</strong>
        <div class="meta">${this._kindLabel(entry.category, entry.watcher_type)}${entry.hidden ? " · ausgeblendet" : ""}</div>
      </td>
      <td>${this._platformCell(entry)}</td>
      <td class="enum-slot">${this._enumSummary(entry)}</td>
      <td>${entry.seen_count ?? 0}</td>
      <td>${this._rel(entry.last_seen)}</td>
    </tr>`;
  }

  _platformCell(entry) {
    const kind = this._kindLabel(entry.category, entry.watcher_type);
    const platform = entry.platform
      ? `<span class="kind-pill">${this._esc(this._platformLabel(entry.platform))}</span>` : "";
    return `<span class="source-pill">${this._esc(kind)}</span> ${platform}`;
  }

  _platformLabel(platform) {
    // Normalise display so historical "PS5" and config "ps5" look uniform.
    return platform ? String(platform).toUpperCase() : "—";
  }

  _enumSummary(entry) {
    return this._enumSummaryHtml(entry.enum);
  }

  _enumSummaryHtml(value) {
    return `<span class="enum-current" title="Zum Aendern Zeile oeffnen">
      <span class="enum-pill active" style="--pill: var(--enum-${value})">${value}</span>
      Enum ${value}
    </span>`;
  }

  _enumPills(entry) {
    const token = this._entryToken(entry);
    const draft = this._draftEnum(entry);
    return `<div class="enum-pills">${ENUMS.map(value => `
      <button type="button" class="enum-pill ${draft === value ? "active" : ""}"
              style="--pill: var(--enum-${value})"
              data-enum="${value}" data-token="${this._esc(token)}"
              title="${value === 0 ? "Enum 0: Unklassifiziert" : `Enum ${value} auswaehlen`}">${value}</button>
    `).join("")}</div>`;
  }

  _drawerHtml() {
    const entry = this._selected || this._currentEntry();
    if (!entry) return `<aside class="card drawer"><div class="empty">Eintrag auswaehlen, um Details zu sehen.</div></aside>`;
    const token = this._entryToken(entry);
    const draft = this._draftEnum(entry);
    const changed = draft !== entry.enum;
    return `<aside class="card drawer">
      <div class="drawer-head">
        <div><h2>${this._esc(entry.key)}</h2><div class="meta">${this._kindLabel(entry.category, entry.watcher_type)}${entry.platform ? " · " + this._esc(this._platformLabel(entry.platform)) : ""}</div></div>
        <button class="btn" id="close-detail">x</button>
      </div>
      <div class="cover">${this._kindIconFor(entry.category, entry.watcher_type)}</div>
      <div class="details">
        ${this._detail("Enum", entry.enum)}
        ${this._detail("Typ", this._kindLabel(entry.category, entry.watcher_type))}
        ${this._detail("Plattform", this._platformLabel(entry.platform))}
        ${this._detail("Ersterkannt", this._date(entry.first_seen))}
        ${this._detail("Zuletzt gesehen", this._date(entry.last_seen))}
        ${this._detail("Sichtungen", entry.seen_count ?? 0)}
        ${this._detail("Status", entry.hidden ? "Ausgeblendet" : (entry.is_current ? "Aktuell" : "Normal"))}
      </div>
      <div>${this._enumPills(entry)}</div>
      <div class="enum-apply">
        <span class="meta">${changed ? `Apply setzt Enum ${draft}` : "Enum auswaehlen und Apply klicken"}</span>
        <button class="btn primary" id="apply-enum" data-token="${this._esc(token)}" ${!changed ? "disabled" : ""}>
          Apply
        </button>
      </div>
      <div class="edit-block">
        <label class="edit-label">Titel umbenennen</label>
        <div class="edit-row">
          <input class="filter-input edit-input" id="rename-input" value="${this._esc(entry.key)}" data-eid="${this._esc(entry.entry_id)}" data-key="${this._esc(entry.key)}">
          <button class="btn" id="rename-apply">Umbenennen</button>
        </div>
        <span class="meta">Gleicht der neue Titel einem vorhandenen, werden beide zusammengefuehrt.</span>
      </div>
      <div class="edit-block">
        <label class="edit-label">Plattform</label>
        <div class="edit-row">
          <select class="edit-input" id="platform-select" data-eid="${this._esc(entry.entry_id)}" data-key="${this._esc(entry.key)}">
            ${PLATFORMS.map(p => `<option value="${p}"${(entry.platform || "").toLowerCase() === p ? " selected" : ""}>${p ? p.toUpperCase() : "— keine —"}</option>`).join("")}
          </select>
          <button class="btn" id="platform-apply">Setzen</button>
        </div>
      </div>
      <div class="toolbar" style="padding-left:0;padding-right:0;border-bottom:0">
        ${entry.hidden ? `<button class="btn" id="unhide-entry" data-eid="${this._esc(entry.entry_id)}" data-key="${this._esc(entry.key)}">Wiederherstellen</button>` : ""}
        <button class="btn danger" id="delete-entry" data-eid="${this._esc(entry.entry_id)}" data-key="${this._esc(entry.key)}">Loeschen</button>
      </div>
    </aside>`;
  }

  _importHtml() {
    return `<section class="card import-grid">
      <div>
        <h2>Export</h2>
        <p class="meta">Lesbarer JSON-Export aller bekannten Entries mit Quelle, Enum und Sichtungsdaten.</p>
        <button class="btn primary" id="make-export">JSON erzeugen</button>
        <textarea readonly>${this._esc(this._exportText)}</textarea>
      </div>
      <div>
        <h2>Import</h2>
        <p class="meta">JSON mit entries-Array einfuegen. Vorhandene Keys werden aktualisiert.</p>
        <textarea id="import-text" placeholder='{"entries":[{"entry_id":"...","key":"Overwatch","enum":1}]}'>${this._esc(this._importText)}</textarea>
        <button class="btn primary" id="run-import">Import starten</button>
      </div>
    </section>`;
  }

  _settingsHtml() {
    return `<section class="card settings">
      <h2>Einstellungen</h2>
      <p>Der Title Classifier speichert pro Watcher erkannte Keys in Home Assistants Storage und gibt stabile Enum-Werte an Automationen weiter.</p>
      <p>Cover-Caching ist in diesem Rework bewusst nicht produktiv aktiviert. Das UI verwendet Platzhalter und zeigt keine aktuellen Media-Player-Cover fuer historische Eintraege, damit keine falschen Cover entstehen.</p>
      <p>Neue Watcher werden ueber den Home-Assistant-Integrationsdialog angelegt. Das Panel nutzt weiterhin die bestehenden Services und WebSocket-Kommandos.</p>
    </section>`;
  }

  _wire() {
    const root = this.shadowRoot;
    root.querySelectorAll("[data-view]").forEach(btn => btn.addEventListener("click", () => this._setView(btn.dataset.view)));
    root.querySelector("#global-search")?.addEventListener("input", ev => this._setFilter("_filterSearch", ev.target.value));
    root.querySelector("#refresh")?.addEventListener("click", () => this._load());
    root.querySelector("#add-watcher")?.addEventListener("click", () => {
      window.history.pushState(null, "", "/config/integrations/integration/title_classifier");
      window.dispatchEvent(new CustomEvent("location-changed"));
    });
    root.querySelector("#filter-source")?.addEventListener("change", ev => this._setFilter("_filterSource", ev.target.value));
    root.querySelector("#filter-class")?.addEventListener("change", ev => this._setFilter("_filterClass", ev.target.value));
    root.querySelector("#filter-type")?.addEventListener("change", ev => this._setFilter("_filterType", ev.target.value));
    root.querySelector("#include-hidden")?.addEventListener("change", ev => this._setFilter("_includeHidden", ev.target.checked));
    root.querySelector("#group-artist")?.addEventListener("change", ev => this._setFilter("_groupByArtist", ev.target.checked));
    root.querySelector("#hide-unmapped")?.addEventListener("click", () => this._hideUnmapped(this._filterSource));
    root.querySelector("#dedupe")?.addEventListener("click", () => this._runDedupe());
    root.querySelector("#merge-mode")?.addEventListener("change", ev => {
      this._mergeMode = ev.target.checked;
      if (!this._mergeMode) { this._selection.clear(); this._mergeCanonical = null; }
      this._render();
    });
    root.querySelectorAll(".merge-pick").forEach(box => box.addEventListener("change", ev => {
      ev.stopPropagation();
      this._toggleSelect(ev.target.dataset.token, ev.target.checked);
    }));
    root.querySelectorAll("[data-merge-target]").forEach(btn => btn.addEventListener("click", () => {
      this._mergeCanonical = btn.dataset.mergeTarget;
      this._render();
    }));
    root.querySelector("#run-merge")?.addEventListener("click", () => this._runMerge());
    root.querySelector("#clear-merge")?.addEventListener("click", () => this._clearMerge());
    root.querySelectorAll("[data-sort]").forEach(th => th.addEventListener("click", () => this._toggleSort(th.dataset.sort)));
    root.querySelectorAll(".row").forEach(row => row.addEventListener("click", ev => {
      if (ev.target.closest(".enum-pill")) return;
      if (ev.target.closest(".merge-pick")) return;
      const found = this._allEntries.find(e => e.entry_id === row.dataset.eid && e.key === row.dataset.key) || null;
      this._selectEntry(found);
    }));
    this._wireDrawer();
    root.querySelector("#make-export")?.addEventListener("click", () => this._exportJson());
    root.querySelector("#import-text")?.addEventListener("input", ev => { this._importText = ev.target.value; });
    root.querySelector("#run-import")?.addEventListener("click", () => this._importJson());
  }

  _metric(icon, value, label, hint) {
    return `<article class="card metric"><div class="ico">${this._icon(icon)}</div><div><strong>${this._esc(value)}</strong><span>${this._esc(label)}</span><div class="meta">${this._esc(hint)}</div></div></article>`;
  }

  _detail(label, value) {
    return `<div class="detail-row"><span>${this._esc(label)}</span><strong>${this._esc(value)}</strong></div>`;
  }

  _viewTitle() {
    return VIEWS.find(([id]) => id === this._view)?.[1] || "Uebersicht";
  }

  _viewSubtitle() {
    return {
      overview: "Stabile Kategorien fuer Titel, Spiele und Aktivitaeten",
      inbox: "Unklassifizierte Eintraege schnell einordnen",
      catalog: "Alle bekannten Entries durchsuchen und pflegen",
      archive: "Ausgeblendete Eintraege ansehen und wiederherstellen",
      watchers: "Quellen und aktuelle Erkennungen im Blick behalten",
      import: "Kataloge als JSON sichern oder einspielen",
      settings: "Verhalten und Design der Workbench",
    }[this._view] || "";
  }

  _manifestVersion() {
    return "2.5.1";
  }

  _typeLabel(type) {
    return { media: "Musik / Medien", game: "Spiel / App", activity: "Aktivitaet" }[type] || type || "-";
  }

  // Kategorie schlaegt Watcher-Typ: Stash ist zwar ein media-Watcher, aber
  // inhaltlich Video/Streaming — nicht Musik.
  _kindLabel(category, type) {
    if (category === "stash") return "Video / Medien";
    return this._typeLabel(type);
  }

  _kindIconFor(category, type) {
    if (category === "stash") return this._icon("video");
    return this._kindIcon(type);
  }

  // Effektiver Enum fuer die aktive Quelle: der zur Laufzeit gefloorte Wert
  // (current_enum), nicht der Rohkatalog-Wert. Bei Stash 0→1 mit "(auto)"-Hinweis.
  _sourceEnum(source, current) {
    const active = source.online !== false && source.current_key;
    if (active && source.current_enum != null) {
      const floored = source.category === "stash" && (current?.enum ?? 0) < source.current_enum;
      return `Enum ${source.current_enum}${floored ? " (auto)" : ""}`;
    }
    return `Enum ${current?.enum ?? 0}`;
  }

  _kindIcon(type) {
    return { media: this._icon("music"), game: this._icon("game"), activity: this._icon("activity") }[type] || this._icon("cube");
  }

  _navIcon(id) {
    return {
      overview: this._icon("wave"),
      inbox: this._icon("inbox"),
      catalog: this._icon("db"),
      archive: this._icon("archive"),
      watchers: this._icon("watch"),
      import: this._icon("import"),
      settings: this._icon("settings"),
    }[id] || "";
  }

  _icon(name) {
    const icons = {
      cube: "◇",
      wave: "≋",
      inbox: "▤",
      db: "▦",
      archive: "🗄",
      merge: "⛙",
      watch: "⌾",
      import: "↕",
      settings: "⚙",
      refresh: "↻",
      music: "♪",
      video: "▶",
      game: "☍",
      activity: "↯",
      bell: "◒",
      time: "◴",
    };
    return icons[name] || "•";
  }

  _artistFrom(key) {
    const idx = String(key || "").indexOf(" - ");
    return idx >= 0 ? key.slice(0, idx) : "";
  }

  _date(iso) {
    if (!iso) return "-";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleString();
  }

  _rel(iso) {
    if (!iso) return "-";
    const seconds = Math.floor(Math.abs(Date.now() - new Date(iso)) / 1000);
    if (Number.isNaN(seconds)) return "-";
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  }

  _esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}

customElements.define("title-classifier-panel", TitleClassifierPanel);
})();
