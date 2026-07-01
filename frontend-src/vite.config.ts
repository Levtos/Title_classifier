import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Library build -> one self-contained classic-script bundle that defines the
// custom element <title-classifier-v3-app>. Home Assistant's custom-panel loader
// injects this URL as a script, so the bundle must be scoped; an ES bundle with
// top-level const/class declarations can throw redeclaration errors when HA
// injects the panel again. React/ReactDOM are bundled in (HACS ships the repo
// as-is; there is no npm build on the user's side). Output lands in the
// integration's served frontend dir and is committed.
export default defineConfig({
  plugins: [react()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: resolve(
      __dirname,
      "../custom_components/title_classifier/frontend/v3-app"
    ),
    emptyOutDir: true,
    target: "es2021",
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "src/main.tsx"),
      formats: ["iife"],
      name: "TitleClassifierV3PanelBundle",
      fileName: () => "title-classifier-v3-app.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
