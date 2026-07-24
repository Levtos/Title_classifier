# AGENTS.md — Title Classifier

## GitLab Workflow

- GitLab project `ha-platform/control` is the central workflow truth.
- Relevant work requires a GitLab issue in `ha-platform/control`.
- Before work starts, read the issue description and all issue notes.
- Document current state, decisions, scope changes, tests, commits, merge requests, blockers, and completion in the issue.
- Code changes happen in the matching GitLab repository. `origin` must point to GitLab.
- GitHub is only the public distribution and HACS mirror. Do not develop directly on GitHub and do not push manually to GitHub.
- Plane and Forgejo are historical sources only and are not used for active work.
- Full rules live in `ha-platform/control/AGENTS.md`, `ha-platform/control/CLAUDE.md`, and `ha-platform/control/docs/workflow/`.

## Project-Memory Bootstrap

- Before significant work, read the matching GitLab issue description and all notes, then `ha-platform/control/docs/workflow/README.md`, its linked workflow documents, and relevant `ha-platform/control` wiki pages.
- GitLab is the workflow truth. GitHub is only the distribution/HACS mirror; do not develop there directly. Plane is frozen historical context, and Forgejo is out of service.
- Stay inside the decided issue scope: no side quests and no overwriting foreign branches or dirty worktrees.
- Use the smallest sufficient verification for the risk tier. Stable changes to behavior, contracts, operations, or rules belong in the wiki; use live evidence when runtime behavior must be proved. Completion notes must document wiki impact, verification/tests, release state where applicable, and required live evidence.

## Safety

- Do not put secrets in issues, commits, logs, or reports.
- Do not touch production Home Assistant systems without explicit approval.
- No admin, delete, runner, or bulk actions without explicit approval.

**Status:** Eigenständige HACS-Repo, enthält alten Code. **Wird im Hybrid-Pivot mit aktuellem Stand aus `bennis_toolbox/modules/title_classifier/` überschrieben (Codex-Aufgabe — PILOT).**
**Toolbox-Modul-ID (alt):** `title_classifier`
**Letzte Aktualisierung:** 2026-05-27

---

## Was ist dieses Modul

Klassifiziert Titel von PS5, PC (Discord), HomePods etc. in numerische Enum-Werte (0–9), die Downstream-Module (z.B. `benni_media_context`) als Gaming-Modus / Musik-Modus konsumieren. Ersatz für die alte CSV-basierte Spiele-DB.

## Architektur-Kontext

Eigene HACS-Custom-Integration. Teil des Hybrid-Setups rund um die VM `einhornzentrale`. Foundation (3 Herzen) lebt in `bennis_toolbox`, dieses Modul wird eigenständig.

**Dieser Repo ist der Pilot für die Extraction.** Wenn das Pattern hier sauber durchläuft, werden die anderen Module (wake_planner, stash_ha, etc.) analog extrahiert.

**Pendant-Briefings:**
- `bennis_toolbox/AGENTS.md` — Foundation + Pattern
- `einhornzentrale/AGENTS.md` — YAML + Cut-Over-Status
- `einhornzentrale/docs/roadmap.md` — Phase 2 (Pivot) detailliert

## Aktueller Stand

- Code im Repo: alt
- Aktueller produktiver Code: `bennis_toolbox/modules/title_classifier/` — Status READY, 0.5.0
- Tests: `bennis_toolbox/tests/title_classifier/`
- HACS: aktuell über `bennis_toolbox`-Umbrella

## Migration im Hybrid-Pivot (Codex)

Siehe `codex.md`. Pilot-Status: alle Probleme/Lessons hier dokumentieren, damit nachfolgende Extractions sauberer laufen.

## UX-Frontend-Standard (verbindlich)

Für jede UX-/Frontend-Arbeit gilt der verbindliche, fleet-weite UX-, Technologie- und
Designstandard. Kanonische Quelle: ADR `ha-platform/control:docs/adr/0001-ux-frontend-standard.md`
(Issue `control#58`). Kurzform: Svelte 5 · Vite · TypeScript · Bits UI · shadcn-svelte ·
Tailwind · CSS Custom Properties · Lucide; Design "Graphite Dark – semantic accent system";
zentrale UX = statisches Bundle + dünnes UX-Gateway (primär HA-Ingress); versionierte/typisierte
Contracts. Details und Abweichungsprozess: `docs/ux-frontend-standard.md` und das ADR. Bestehende
Regeln werden dadurch ergänzt, nie überschrieben oder entfernt.
