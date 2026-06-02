# CLAUDE.md — Title Classifier

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
- `bennis_toolbox/CLAUDE.md` — Foundation + Pattern
- `einhornzentrale/CLAUDE.md` — YAML + Cut-Over-Status
- `einhornzentrale/docs/roadmap.md` — Phase 2 (Pivot) detailliert

## Aktueller Stand

- Code im Repo: alt
- Aktueller produktiver Code: `bennis_toolbox/modules/title_classifier/` — Status READY, 0.5.0
- Tests: `bennis_toolbox/tests/title_classifier/`
- HACS: aktuell über `bennis_toolbox`-Umbrella

## Migration im Hybrid-Pivot (Codex)

Siehe `codex.md`. Pilot-Status: alle Probleme/Lessons hier dokumentieren, damit nachfolgende Extractions sauberer laufen.
