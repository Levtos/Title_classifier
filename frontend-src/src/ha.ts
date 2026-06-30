// Minimal Home Assistant surface the panel relies on. We only use callWS (a
// stable API) so we never couple to internal HA frontend components.

export interface Hass {
  callWS<T = unknown>(msg: Record<string, unknown>): Promise<T>;
  language?: string;
  themes?: unknown;
  user?: { name?: string; is_admin?: boolean };
}

/** Open the HA sidebar (used by the < 870px menu button). */
export function toggleHaMenu(el: HTMLElement): void {
  el.dispatchEvent(
    new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true })
  );
}
