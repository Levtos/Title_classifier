# Title Classifier v3 — React/TypeScript UX (source)

React + TypeScript + Vite source for the v3 Home Assistant custom panel
(`TC v3.1`). The **built bundle is committed** to the integration (HACS ships the
repo as-is — there is no build step on the user's side).

## Build

```bash
cd frontend-src
npm ci          # or: npm install
npm run build   # tsc --noEmit && vite build
```

Output (committed): `../custom_components/title_classifier/frontend/v3-app/title-classifier-v3-app.js`
— a single ES module that defines the custom element `<title-classifier-v3-app>`
(React/ReactDOM bundled in). `panel.py` registers it at `/title_classifier_v3`.

After a build, bump the integration `manifest.json` version on release so the
`?v=` cache-bust forces browsers to reload the panel module.

## Layout

- `src/main.tsx` — custom-element wrapper, mounts React into a shadow root.
- `src/App.tsx` — sidebar + command bar + page + status bar shell.
- `src/api/v3.ts` — typed `title_classifier/v3/*` WebSocket client.
- `src/state/types.ts` — payload types.
- `src/pages/*` — the six pages (Übersicht, Inbox, Tagebuch, Katalog, Import/Export, Einstellungen).
- `src/styles.css` — Dracula CSS tokens + shell layout (injected into the shadow root).
