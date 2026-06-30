// Minimal v3 panel for Title Classifier (FLEET-200).
//
// Intentionally small: lists v3 sources + catalog entries via the
// title_classifier/v3/* WebSocket API and offers basic classification (enum,
// hide, group/ungroup, delete). The full Lit/TypeScript UX is a follow-up
// initiative — this only ensures v3 data is visible (never a blank page).
//
// WebKit gotchas honoured: we assign innerHTML on the shadow root (never
// outerHTML on a shadow child), and provide a menu button below 870px so the
// custom panel is not trapped without a sidebar toggle on mobile.

class TitleClassifierV3Panel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._built = false;
    this._sources = [];
    this._entries = [];
    this._mediaFilter = "";
    this._search = "";
    this._includeHidden = false;
    this._loading = false;
  }

  set hass(hass) {
    const first = this._hass === null;
    this._hass = hass;
    if (!this._built) {
      this._build();
      this._built = true;
    }
    if (first) {
      this._reload();
    }
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
    if (!this._hass || this._loading) return;
    this._loading = true;
    this._setStatus("Lade …");
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
    this._loading = false;
    this._renderData();
    this._setStatus(
      `${this._sources.length} Watcher · ${this._entries.length} Einträge`
    );
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
        button:hover { border-color: var(--primary-color,#03a9f4); }
        #menuBtn { display:none; }
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
        table { width:100%; border-collapse:collapse; font-size:13px; }
        th, td { text-align:left; padding:6px 8px; border-bottom:1px solid var(--divider-color,#262a31); }
        th { position:sticky; top:57px; background:inherit; opacity:.8; font-weight:600; }
        .key { font-weight:500; }
        .sub { opacity:.6; font-size:11px; }
        .row-actions { display:flex; gap:6px; flex-wrap:wrap; }
        #status { opacity:.7; font-size:12px; margin-left:auto; }
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
        <button id="refresh">Aktualisieren</button>
        <span id="status"></span>
      </div>
      <div class="wrap">
        <div class="sources" id="sources"></div>
        <table>
          <thead><tr>
            <th>Key</th><th>Art</th><th>Enum</th><th>Varianten</th><th>Status</th><th>Aktionen</th>
          </tr></thead>
          <tbody id="entries"></tbody>
        </table>
      </div>
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
  }

  _renderData() {
    this._renderSources();
    this._renderEntries();
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
        const variants = e.variants && e.variants.length
          ? `${e.variants.length} ↳`
          : e.is_variant
          ? `<span class="sub">Variante</span>`
          : "";
        const status =
          (e.is_current
            ? `<span class="pill cur">aktiv ${e.effective_enum ?? ""}</span>`
            : "") + (e.hidden ? `<span class="pill hid">versteckt</span>` : "");
        return `<tr data-id="${esc(e.id)}">
          <td class="key">${esc(e.key)}<div class="sub">${esc(e.media_type)}/${esc(
          e.signal_type
        )}</div></td>
          <td>${esc(e.media_type)}</td>
          <td><select class="enumSel">${opts}</select></td>
          <td>${variants}</td>
          <td>${status || '<span class="sub">—</span>'}</td>
          <td><div class="row-actions">
            <button class="hideBtn">${e.hidden ? "Einblenden" : "Verstecken"}</button>
            ${e.is_variant ? `<button class="ungroupBtn">Trennen</button>` : `<button class="groupBtn">Gruppieren</button>`}
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
      const hideBtn = tr.querySelector(".hideBtn");
      const entry = this._entries.find((x) => x.id === id);
      hideBtn.addEventListener("click", () =>
        this._setHidden(id, !(entry && entry.hidden))
      );
      const del = tr.querySelector(".delBtn");
      del.addEventListener("click", () => this._delete(id));
      const grp = tr.querySelector(".groupBtn");
      if (grp) grp.addEventListener("click", () => this._group(id));
      const ungrp = tr.querySelector(".ungroupBtn");
      if (ungrp) ungrp.addEventListener("click", () => this._ungroup(id));
    });
  }

  async _setEnum(id, enumValue) {
    await this._callWS({
      type: "title_classifier/v3/set_enum",
      entry_id: id,
      enum: enumValue,
    });
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
    this._reload();
  }

  async _group(childId) {
    const parentId = window.prompt(
      "Parent-Eintrags-ID (Master) eingeben — gleiche Medienart/Signaltyp:"
    );
    if (!parentId) return;
    const res = await this._callWS({
      type: "title_classifier/v3/group",
      child_id: childId,
      parent_id: parentId.trim(),
    });
    if (res) this._reload();
  }

  async _ungroup(id) {
    await this._callWS({
      type: "title_classifier/v3/ungroup",
      child_id: id,
    });
    this._reload();
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
