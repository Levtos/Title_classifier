# AGENTS.md — Title Classifier

## GitLab Workflow

- GitLab project `ha-platform/control` is the central workflow truth.
- Relevant work requires a GitLab issue in `ha-platform/control`.
- Before work starts, read the issue description and all issue notes.
- Document current state, decisions, scope changes, tests, commits, merge requests, blockers, and completion in the issue.
- Code changes happen in the matching GitLab repository. `origin` must point to GitLab.
- GitHub is only the public distribution and HACS mirror. Do not develop directly on GitHub and do not push manually to GitHub.
- Release flow: create version bumps and tags in GitLab; GitLab CI triggers the configured GitLab push mirror and verifies mirror status plus GitHub tag arrival. GitHub Actions creates or detects the published GitHub Release and verifies the GitHub tag/release plus manifest version. Agents do not push to GitHub manually, create GitHub Releases manually, or run `gh release` for HACS repos.
- Plane is historical only and is not used for active work.
- Forgejo is out of service; do not use it and do not treat it as a blocker.
- Full rules live in `ha-platform/control/AGENTS.md`, `ha-platform/control/CLAUDE.md`, and `ha-platform/control/docs/workflow/`.

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
