# Codex Instructions — Title Classifier (PILOT)

Lies zuerst `CLAUDE.md` in diesem Repo.

## MCP-Server

`einhornzentrale` für HA-MCP. Nicht `haos_benni`.

## Deine Aufgabe — PILOT-Extraction für Hybrid-Pivot

Dieses Modul ist der **erste Pilot** für die Modul-Extraction aus `bennis_toolbox`-Umbrella. Lessons aus dieser Extraction werden Pattern für alle weiteren (`wake_planner`, `stash_ha`, `notification_router`, `maw`, `plug_policy_engine`, `benni_media_context`).

### Schritte

1. **Code prüfen:** Was steht aktuell in `custom_components/` dieses Repos? Stammt vermutlich aus früherer Iteration. Vergleich mit aktuellem Stand in `bennis_toolbox/custom_components/bennis_toolbox/modules/title_classifier/`. Letzteres ist verbindlich.
2. **Hauptcode kopieren:** Dateien aus `bennis_toolbox/.../modules/title_classifier/` 1:1 in `custom_components/title_classifier/` dieses Repos. Imports anpassen:
   - `from ...const import DOMAIN` → `from .const import DOMAIN`
   - `from ...storage import make_store` → eigene `storage.py` schreiben (analog `bennis_toolbox/custom_components/bennis_toolbox/storage.py`)
   - `from ...services import ServiceDef` → eigene `services.py`
   - Domain ändern: `bennis_toolbox` → `title_classifier`
3. **manifest.json** mit eigener Domain `title_classifier`, Version (Reset auf 0.1.0 oder fortführen), Domain-Owner
4. **hacs.json** prüfen/anpassen
5. **Tests:** aus `bennis_toolbox/tests/title_classifier/` rüberkopieren nach `tests/`, conftest.py umbauen
6. **CHANGELOG.md / README.md** mit "Extrahiert aus bennis_toolbox am ..."
7. **Bei bennis_toolbox Folge-PR:** `modules/title_classifier/` löschen, `REGISTERED_MODULE_IDS` kürzen, `test_repo_structure.py` EXPECTED_MODULE_IDS anpassen

### Breaking Changes für einhornzentrale YAML

- Service-Calls (falls vorhanden): `bennis_toolbox.title_classifier_*` → `title_classifier.*`
- Entity-IDs: bleiben gleich wenn `suggested_object_id` beibehalten wird
- unique_ids: ändern sich → Entity-Registry-Migration nötig (manuell oder via Skript)

### Pattern für nachfolgende Extractions dokumentieren

Während dieser Pilot-Extraction:
- Bei Hürden: kurze Notiz in `bennis_toolbox/CLAUDE.md` oder `einhornzentrale/docs/roadmap.md` als "Lessons Learned"
- Beispielsweise: wie viele Stellen mussten umgeschrieben werden? Welche Imports waren tricky? Sauberer Migrations-Pfad für unique_ids?

### Anti-Patterns

- ❌ Cross-Repo-Imports zwischen bennis_toolbox und diesem Repo
- ❌ Lastenheft-Konsolidierung
- ❌ Auf alter VM Features bauen
- ❌ Apply-Switches aktivieren ohne Cut-Over-Kriterien
