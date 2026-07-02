# Changelog

## 2.10.4 - 2026-07-02

Fokussierter Inbox-/QOL-Bugfix aus 2.10.3 (sechs Punkte):

- **Status-Spalte fluchtet wieder:** Die Status-Zelle war ein `display:flex`-`<td>`
  und brach dadurch Zeilenhöhe + Border-Ausrichtung. Badges liegen jetzt in einem
  inneren Flex-Wrapper (`.tc-status-badges`); die `<td>` bleibt normale
  Tabellenzelle — eine einzige, saubere Row-Border pro Zeile.
- **Größere Checkboxen:** 20×20 px, `accent-color`, Cursor; die ganze Zelle über
  volle Zeilenhöhe klickbar. Klicks auf Enum-Dropdown/Buttons/Links toggeln die
  Auswahl weiterhin nicht.
- **Gruppierung stabil bei laufendem Betrieb:** Auswahl ist konsequent ID-basiert
  und aus dem **vollen** Katalog abgeleitet (nicht aus der gefilterten Liste), der
  Gruppieren-Dialog hält beim Öffnen einen **Snapshot** der gewählten Einträge.
  Ein neuer `current_key`/Poll re-sortiert nur noch, invalidiert aber weder
  Auswahl noch Dialog. Auswahl wird nur gegen wirklich verschwundene (gelöschte)
  Entry-IDs geprunt, nie pauschal geleert.
- **„Alle sichtbaren auswählen":** Neuer Toggle-Button, der exakt die aktuell
  gefilterte/sortierte Arbeitsliste auswählt (bzw. abwählt) und Auswahl außerhalb
  der Sicht unangetastet lässt; bei leerer Liste deaktiviert.
- **Stash bekommt sinnvolles Enum > 0:** Neue Stash-Sichtungen werden im v3-Store
  auf `STASH_DEFAULT_ACTIVE_ENUM` (1) gesetzt, unklassifizierte (Enum 0) Einträge
  bei Stash-Sichtung angehoben — manuell gesetzte Enums > 0 bleiben unangetastet.
  Kein Migration/Cleanup, rein per Upsert. Neue Store-Tests sichern das ab.
- **Kein 5-Sekunden-Flackern:** Der manuelle „Aktualisieren"-Button hängt jetzt an
  einem eigenen `refreshing`-State, den nur der explizite Klick setzt; passive
  Polls bleiben optisch still (Signatur-Dedupe aus 2.10.3 bleibt erhalten).

## 2.5.0 - 2026-06-29

- **Quellen ehrlich (Architektur-Fix):** Der Katalog ist nach `(scope, category)`
  geteilt — mehrere Watcher derselben Kategorie (z.B. PC + ps5 = `game`) luden
  dieselben Zeilen, und das Panel hängte ihnen einen erfundenen Watcher-Namen als
  „Quelle" an. `list_entries`/Statistiken deduplizieren jetzt nach
  `(scope, category, key)`; die Spalte zeigt **Typ + Plattform** statt Quelle.
- **1000-Zeilen-Cap entfernt:** Musikkatalog (>1300 Titel) wurde still gekappt,
  Archiv-Einträge fielen komplett raus. `list_entries` liefert jetzt alles
  (Limit nur noch optional, max 20000) und ohne Runtime-übergreifende Starvation.
- **Archiv-Ansicht:** Neuer „Archiv"-Tab für ausgeblendete Einträge inkl.
  **Wiederherstellen** (`unhide_entry` / `async_unhide`) — Ausblenden war bisher
  eine Einbahnstraße.
- **Manuelles Editieren:** Titel umbenennen (`rename_entry`; Ziel existiert ⇒
  Merge) und Plattform setzen (`set_platform`, pc↔ps5↔switch…) direkt im Drawer.
- **Merge:** Manueller Merge-Modus (mehrere Einträge ankreuzen, Ziel wählen,
  zusammenführen) plus Retro-Sweep über den Bestand — Panel-Button „Dubletten
  zusammenführen" und Service `title_classifier.dedupe_catalog` (mit `dry_run`).
  Kanonisch überlebt die meistgespielte Variante; enum/Sichtungen aggregieren.

## 2.3.0 - 2026-06-10

- FLEET-43: Stash-Auto-Enum — Kategorie `stash` bekommt inverse Enum-Semantik:
  Titel vorhanden ⇒ Enum automatisch ≥ 1 (keine Katalogpflege nötig); Enum 0
  bleibt allein dem „nichts läuft"-Zustand vorbehalten (kein Titel / offline
  via `online_entity`, z.B. `sensor.stash_active_streams` mit `0` Streams).
  Manuell gemappte Katalog-Enums > 1 gewinnen weiterhin. Katalog (Raw-Titel,
  Sichtungszähler, Verlauf) läuft unverändert mit — bewusst keine
  Sonder-Privacy-Logik.

## 1.1.1 - 2026-06-01

- Fixed enum pill assignment in the Workbench UI so clicking `0` to `9`
  reliably assigns that enum to the exact title row.
- Added a visible saving state for enum pills and switched row lookup from
  fragile title attributes to stable encoded entry tokens.

## 1.1.0 - 2026-06-01

- Reworked the sidebar panel into a Dracula-inspired Classification Workbench
  with overview metrics, watcher cards, Inbox, Catalog, Watcher, Import/Export,
  and Settings views.
- Replaced row number steppers with enum pill buttons from `0` to `9` and
  auto-save on click.
- Added a detail drawer for selected entries with source, enum, first/last
  seen, seen count, and delete action.
- Added JSON export/import UI using the existing WebSocket commands.
- Improved config-flow labels and watcher-type choices for normal Home
  Assistant users without changing stored config-entry fields.
- Kept cover handling conservative: no dynamic media-player cover reuse for
  historical entries; cover caching remains a future optional backend feature.

## 1.0.2 - 2026-06-01

- Fixed the Title Classifier panel showing `0` entries while entity sensors
  already reported catalog entries. WebSocket source/list commands now see
  standalone runtime buckets even when older in-memory buckets do not carry a
  `module_id` field.
- Stamped new runtime buckets with `module_id` during setup.

## 1.0.1 - 2026-06-01

- Fixed media watchers backed by `sensor.*` entities so the sensor state is
  persisted as the title when no title attributes are available.
- Added regression coverage for sensor-state media titles while preserving
  `media_player.*` behavior.
- Expanded the README with functional integration docs and troubleshooting for
  empty Title Classifier storage.

## 1.0.0 - 2026-05-27

- Extracted `title_classifier` from `bennis_toolbox` into standalone HACS
  integration `title_classifier`.
- Changed public service domain to `title_classifier`.
- Changed WebSocket namespace to `title_classifier/...`.
- Added standalone Home Assistant setup, config flow, service registration,
  WebSocket registration, storage helper, and platform forwarding.
