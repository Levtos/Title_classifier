import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { App } from "./App";
import type { Hass } from "./ha";
import styles from "./styles.css?inline";

// HA custom-panel wrapper: a custom element that mounts the React app in its
// shadow root and forwards the `hass` object (set by HA on every state update).
class TitleClassifierV3App extends HTMLElement {
  private _root: Root | null = null;
  private _hass: Hass | null = null;

  connectedCallback(): void {
    if (this._root) return;
    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = styles;
    shadow.appendChild(style);
    const mount = document.createElement("div");
    mount.style.height = "100%";
    shadow.appendChild(mount);
    this._root = createRoot(mount);
    this._render();
  }

  disconnectedCallback(): void {
    this._root?.unmount();
    this._root = null;
  }

  set hass(hass: Hass) {
    this._hass = hass;
    this._render();
  }

  get hass(): Hass | null {
    return this._hass;
  }

  private _render(): void {
    this._root?.render(createElement(App, { hass: this._hass }));
  }
}

if (!customElements.get("title-classifier-v3-app")) {
  customElements.define("title-classifier-v3-app", TitleClassifierV3App);
}
