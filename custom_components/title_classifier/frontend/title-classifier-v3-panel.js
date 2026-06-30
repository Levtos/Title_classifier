// Minimal v3 panel for Title Classifier (FLEET-200, hotfix v2.8.2).
//
// Lists v3 sources + catalog entries via title_classifier/v3/* and offers the
// core actions: classify (enum), group/ungroup (via selection — no manual UUID),
// hide, delete. The full Lit/TypeScript UX is a separate follow-up (TC v3.1).
//
// Robustness fixes (v2.8.2):
//  - enum set is optimistic + reconciled, so the value never visually reverts;
//  - reloads queue instead of being dropped while one is in flight;
//  - grouping uses checkboxes + a master-picker dialog (titles, not UUIDs).
//
// WebKit gotchas honoured: innerHTML on the shadow root (never outerHTML on a
// shadow child); a hass-toggle-menu button below 870px.

class TitleClassifierV3Panel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._built = false;
    this._sources = [];
    this._entries = [];
    this._selected = new Set();
    this._mediaFilter = "";
    this._search = "";
    this._includeHidden = false;
    this._loading = false;
    this._reloadPending = false;
  }

  set hass(hass) {
    const first = this._hass === null;
    this._hass = hass;
    if (!this._built) {
      this._build();
      this._built = true;
    }
    if (first) this._reload();
  }

  async _callWS(payload) {
    try {
      return await this._hass.callWS(payload);
    } catch (err) {
      this._setStatus("Fehler: " + (err && err.message ? err.message : err));
      return null;
    }
  }

  async _reload() {
    if (!this._hass) return;
    if (this._loading) {
      this._reloadPending = true;
      return;
    }
    this._loading = true;
    this._setStatus("Lade …");
    try {
      const sources = await this._callWS({
        type: "title_classifier/v3/list_sources",
      });
      const entries = await this._callWS({
        type: "title_classifier/v3/list_entries",
        ...(this._mediaFilter ? { media_type: this._mediaFilter } : {}),
        ...(this._search ? { search: this._search } : {}),
        include_hidden: this._includeHidden,
        limit: 2000,
      });
      this._sources = sources || [];
      this._entries = entries || [];
      // Drop selections that no longer exist.
      const ids = new Set(this._entries.map((e) => e.id));
      this._selected.forEach((id) => {
        if (!ids.has(id)) this._selected.delete(id);
      });
      this._renderData();
      this._setStatus(
        `${this._sources.length} Watcher · ${this._entries.length} Einträge`
      );
    } finally {
      this._loading = false;
    }
    if (this._reloadPending) {
      this._reloadPending = false;
      this._reload();
    }
  }

  _setStatus(text) {
    const el = this.shadowRoot.getElementById("status");
    if (el) el.textContent = text;
  }

  _build() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; font-family: var(--paper-font-body1_-_font-family, sans-serif);
                color: var(--primary-text-color, #e1e1e1);
                background: var(--primary-background-color, #111418); min-height:100%; }
        .bar { display:flex; align-items:center; gap:8px; flex-wrap:wrap;
               padding:12px 16px; border-bottom:1px solid var(--divider-color,#333);
               position:sticky; top:0; background:inherit; z-index:1; }
        .bar h1 { font-size:18px; margin:0 8px 0 0; }
        button, select, input { font: inherit; color:inherit;
               background: var(--card-background-color,#1c1f26);
               border:1px solid var(--divider-color,#333); border-radius:6px; padding:4px 8px; }
        button { cursor:pointer; }
        button:hover:not(:disabled) { border-color: var(--primary-color,#03a9f4); }
        button:disabled { opacity:.45; cursor:default; }
        #menuBtn { display:none; }
        #groupBtn { border-color: var(--primary-color,#03a9f4); }
        .wrap { padding:12px 16px; }
        .sources { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:16px; }
        .src { border:1px solid var(--divider-color,#333); border-radius:10px; padding:10px 12px;
               min-width:200px; background: var(--card-background-color,#1c1f26); }
        .src .name { font-weight:600; }
        .src .meta { opacity:.7; font-size:12px; margin-top:2px; }
        .src .cur { margin-top:6px; font-size:13px; }
        .src img { max-width:48px; max-height:48px; border-radius:4px; float:right; margin-left:8px; }
        .pill { display:inline-block; padding:1px 7px; border-radius:10px; font-size:11px;
                border:1px solid var(--divider-color,#444); margin-left:4px; }
        .pill.cur { border-color:#3fb950; color:#3fb950; }
        .pill.hid { border-color:#d29922; color:#d29922; }
        .pill.var { border-color:#a371f7; color:#a371f7; }
        table { width:100%; border-collapse:collapse; font-size:13px; }
        th, td { text-align:left; padding:6px 8px; border-bottom:1px solid var(--divider-color,#262a31); }
        th { position:sticky; top:57px; background:inherit; opacity:.8; font-weight:600; }
        .key { font-weight:500; }
        .key.child { padding-left:22px; opacity:.92; }
        .key.child::before { content:"↳ "; color:#a371f7; }
        .sub { opacity:.6; font-size:11px; }
        .row-actions { display:flex; gap:6px; flex-wrap:wrap; }
        #status { opacity:.7; font-size:12px; margin-left:auto; }
        .modal { position:fixed; inset:0; background:rgba(0,0,0,.55);
                 display:flex; align-items:center; justify-content:center; z-index:10; }
        .modal.hidden { display:none; }
        .dialog { background: var(--card-background-color,#1c1f26);
                  border:1px solid var(--divider-color,#333); border-radius:12px;
                  padding:18px 20px; min-width:320px; max-width:520px; max-height:80vh; overflow:auto; }
        .dialog h2 { margin:0 0 4px; font-size:16px; }
        .dialog .hint { opacity:.7; font-size:12px; margin-bottom:10px; }
        .dialog label { display:flex; align-items:center; gap:8px; padding:6px 4px;
                        border-bottom:1px solid var(--divider-color,#262a31); cursor:pointer; }
        .dialog .actions { display:flex; gap:8px; justify-content:flex-end; margin-top:14px; }
        @media (max-width:870px) { #menuBtn { display:inline-flex; } th { position:static; } }
      </style>
      <div class="bar">
        <button id="menuBtn" title="Menü">☰</button>
        <h1>Title Classifier v3</h1>
        <select id="mediaFilter" title="Medienart">
          <option value="">Alle</option>
          <option value="music">Musik</option>
          <option value="game">Spiel</option>
          <option value="video">Video</option>
        </select>
        <input id="search" type="search" placeholder="Suche …" />
        <label style="display:flex;align-items:center;gap:4px;font-size:12px;">
          <input id="includeHidden" type="checkbox" /> versteckte
        </label>
        <button id="groupBtn" disabled>Gruppieren</button>
        <button id="refresh">Aktualisieren</button>
        <span id="status"></span>
      </div>
      <div class="wrap">
        <div class="sources" id="sources"></div>
        <table>
          <thead><tr>
            <th></th><th>Key</th><th>Art</th><th>Enum</th><th>Status</th><th>Aktionen</th>
          </tr></thead>
          <tbody id="entries"></tbody>
        </table>
      </div>
      <div class="modal hidden" id="modal"><div class="dialog" id="dialog"></div></div>
    `;

    this.shadowRoot.getElementById("menuBtn").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true })
      );
    });
    this.shadowRoot
      .getElementById("refresh")
      .addEventListener("click", () => this._reload());
    this.shadowRoot
      .getElementById("groupBtn")
      .addEventListener("click", () => this._openGroupDialog());
    this.shadowRoot
      .getElementById("mediaFilter")
      .addEventListener("change", (e) => {
        this._mediaFilter = e.target.value;
        this._reload();
      });
    this.shadowRoot.getElementById("search").addEventListener("change", (e) => {
      this._search = e.target.value.trim();
      this._reload();
    });
    this.shadowRoot
      .getElementById("includeHidden")
      .addEventListener("change", (e) => {
        this._includeHidden = e.target.checked;
        this._reload();
      });
    this.shadowRoot.getElementById("modal").addEventListener("click", (e) => {
      if (e.target.id === "modal") this._closeDialog();
    });
  }

  _renderData() {
    this._renderSources();
    this._renderEntries();
    this._updateGroupButton();
  }

  _renderSources() {
    const host = this.shadowRoot.getElementById("sources");
    if (!this._sources.length) {
      host.innerHTML = `<div class="sub">Keine v3-Watcher konfiguriert.</div>`;
      return;
    }
    host.innerHTML = this._sources
      .map((s) => {
        const art = s.current_artwork
          ? `<img src="${esc(s.current_artwork)}" alt="" onerror="this.remove()"/>`
          : "";
        const cur = s.current_key
          ? `<div class="cur">▶ ${esc(s.current_key)} <b>= ${s.current_enum}</b></div>`
          : `<div class="cur sub">— inaktiv —</div>`;
        return `<div class="src">${art}
          <div class="name">${esc(s.name)}</div>
          <div class="meta">${esc(s.media_type)} · ${esc(s.context)} · ${esc(s.signal_type)}${
          s.source_app ? " · " + esc(s.source_app) : ""
        }${s.online ? "" : " · offline"}</div>
          ${cur}
          <div class="meta">${s.entry_count} Einträge · ${s.unmapped_count} offen</div>
        </div>`;
      })
      .join("");
  }

  _entryTitle(id) {
    const e = this._entries.find((x) => x.id === id);
    return e ? e.key : id;
  }

  _renderEntries() {
    const body = this.shadowRoot.getElementById("entries");
    if (!this._entries.length) {
      body.innerHTML = `<tr><td colspan="6" class="sub">Keine Einträge.</td></tr>`;
      return;
    }
    body.innerHTML = this._entries
      .map((e) => {
        const opts = Array.from({ length: 10 }, (_, i) =>
          `<option value="${i}" ${i === e.enum ? "selected" : ""}>${i}</option>`
        ).join("");
        const status =
          (e.is_current
            ? `<span class="pill cur">aktiv ${e.effective_enum ?? ""}</span>`
            : "") +
          (e.variants && e.variants.length
            ? `<span class="pill var">${e.variants.length} Varianten</span>`
            : "") +
          (e.is_variant ? `<span class="pill var">Variante</span>` : "") +
          (e.hidden ? `<span class="pill hid">versteckt</span>` : "");
        const checked = this._selected.has(e.id) ? "checked" : "";
        return `<tr data-id="${esc(e.id)}">
          <td><input type="checkbox" class="selBox" ${checked} title="für Gruppieren auswählen"></td>
          <td class="key ${e.is_variant ? "child" : ""}">${esc(e.key)}<div class="sub">${esc(
          e.media_type
        )}/${esc(e.signal_type)}</div></td>
          <td>${esc(e.media_type)}</td>
          <td><select class="enumSel">${opts}</select></td>
          <td>${status || '<span class="sub">—</span>'}</td>
          <td><div class="row-actions">
            <button class="hideBtn">${e.hidden ? "Einblenden" : "Verstecken"}</button>
            ${e.is_variant ? `<button class="ungroupBtn">Trennen</button>` : ""}
            <button class="delBtn">Löschen</button>
          </div></td>
        </tr>`;
      })
      .join("");

    body.querySelectorAll("tr[data-id]").forEach((tr) => {
      const id = tr.getAttribute("data-id");
      tr.querySelector(".enumSel").addEventListener("change", (ev) =>
        this._setEnum(id, parseInt(ev.target.value, 10))
      );
      tr.querySelector(".selBox").addEventListener("change", (ev) => {
        if (ev.target.checked) this._selected.add(id);
        else this._selected.delete(id);
        this._updateGroupButton();
      });
      tr.querySelector(".hideBtn").addEventListener("click", () => {
        const entry = this._entries.find((x) => x.id === id);
        this._setHidden(id, !(entry && entry.hidden));
      });
      tr.querySelector(".delBtn").addEventListener("click", () => this._delete(id));
      const ungrp = tr.querySelector(".ungroupBtn");
      if (ungrp) ungrp.addEventListener("click", () => this._ungroup(id));
    });
  }

  _updateGroupButton() {
    const btn = this.shadowRoot.getElementById("groupBtn");
    if (!btn) return;
    const n = this._selected.size;
    btn.disabled = n < 2;
    btn.textContent = n >= 2 ? `Gruppieren (${n})` : "Gruppieren";
  }

  // ----------------------------------------------------------------- actions

  async _setEnum(id, enumValue) {
    const res = await this._callWS({
      type: "title_classifier/v3/set_enum",
      entry_id: id,
      enum: enumValue,
    });
    if (res && res.ok) {
      // Optimistically reflect the persisted value so it never visually reverts.
      const e = this._entries.find((x) => x.id === id);
      if (e) {
        e.enum = res.enum;
        this._renderEntries();
      }
    }
    this._reload();
  }

  async _setHidden(id, hidden) {
    await this._callWS({
      type: "title_classifier/v3/set_hidden",
      entry_id: id,
      hidden,
    });
    this._reload();
  }

  async _delete(id) {
    if (!window.confirm("Eintrag wirklich löschen?")) return;
    await this._callWS({
      type: "title_classifier/v3/delete_entry",
      entry_id: id,
    });
    this._selected.delete(id);
    this._reload();
  }

  async _ungroup(id) {
    await this._callWS({ type: "title_classifier/v3/ungroup", child_id: id });
    this._reload();
  }

  // -------------------------------------------------------- group dialog

  _openGroupDialog() {
    const ids = [...this._selected];
    if (ids.length < 2) return;
    const dialog = this.shadowRoot.getElementById("dialog");
    const rows = ids
      .map(
        (id, i) =>
          `<label><input type="radio" name="master" value="${esc(id)}" ${
            i === 0 ? "checked" : ""
          }> ${esc(this._entryTitle(id))}</label>`
      )
      .join("");
    dialog.innerHTML = `
      <h2>Gruppieren</h2>
      <div class="hint">Wähle den <b>Master</b>. Die übrigen ${
        ids.length - 1
      } Einträge werden als Varianten darunter gruppiert (eine Ebene; gleiche Medienart/Signaltyp nötig).</div>
      ${rows}
      <div class="actions">
        <button id="dlgCancel">Abbrechen</button>
        <button id="dlgSave">Speichern</button>
      </div>`;
    dialog
      .querySelector("#dlgCancel")
      .addEventListener("click", () => this._closeDialog());
    dialog
      .querySelector("#dlgSave")
      .addEventListener("click", () => this._doGroup());
    this.shadowRoot.getElementById("modal").classList.remove("hidden");
  }

  _closeDialog() {
    this.shadowRoot.getElementById("modal").classList.add("hidden");
  }

  async _doGroup() {
    const dialog = this.shadowRoot.getElementById("dialog");
    const picked = dialog.querySelector('input[name="master"]:checked');
    if (!picked) return;
    const masterId = picked.value;
    const children = [...this._selected].filter((id) => id !== masterId);
    this._closeDialog();
    let ok = 0;
    const errors = [];
    for (const child of children) {
      const res = await this._callWS({
        type: "title_classifier/v3/group",
        child_id: child,
        parent_id: masterId,
      });
      if (res && res.ok) ok += 1;
      else errors.push(this._entryTitle(child));
    }
    this._selected.clear();
    await this._reload();
    this._setStatus(
      errors.length
        ? `Gruppiert: ${ok}, fehlgeschlagen: ${errors.join(", ")}`
        : `Gruppiert: ${ok} Variante(n) unter „${this._entryTitle(masterId)}".`
    );
  }
}

function esc(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

customElements.define("title-classifier-v3-panel", TitleClassifierV3Panel);
