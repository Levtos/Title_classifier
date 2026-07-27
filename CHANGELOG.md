# Changelog

## 3.5.1 - 2026-07-28 — Apple-TV-Videoidentität aus echten Metadaten

Behebt, dass der Apple-TV-Video-Watcher bei Plex-/Jellyfin-Ereignissen die
App- oder Quellenkennung (`music_assistant`, `com.plexapp.plex`, `Plex` usw.)
als Katalogtitel persistiert. Bei vorhandener Videometadatenlage wird jetzt
`media_artist` als Serienidentität und ansonsten `media_title` als Film- bzw.
Inhaltstitel verwendet; `media_album_name` bleibt ergänzende Anzeigeinformation.

- Echte Video-Metadaten haben Vorrang vor `app_name`, `app_id` und `source`.
- Ein App-/Source-only-Fallback wird erst nach einer kurzen Stabilitätsfrist
  persistiert, damit verzögert eintreffende Plex-/Jellyfin-Metadaten keinen
  dauerhaften technischen Phantomtitel erzeugen.
- Native Apple-TV-Quellen und Music-Assistant-Spiegel bleiben unverändert
  getrennte Beobachtungspfade. Musik-, Stash- und andere bestehende Watcher,
  Entity-IDs, Sensor-Slugs, Enum-/Sichtungsverträge und die Sichtungszählung
  bleiben unverändert.
- Bereits vorhandene Katalogzeilen werden nicht automatisch gelöscht oder
  umklassifiziert; sie bleiben für eine kontrollierte fachliche Bereinigung
  sichtbar.

## 3.5.0 - 2026-07-22 — Quell-Entität sichtbar + im Reconfigure änderbar

Behebt, dass die beim Anlegen gewählte Quell-Entität eines Watchers danach
weder sichtbar noch änderbar war (GitLab `ha-platform/control#52`). Rein
additiv — keine Änderung am Watcher-/Stash-Slot-Modell und keine
Klassifizierungslogik.

- **Reconfigure zeigt und ändert `source_entity`:** Der bestehende
  Reconfigure-Flow (Top-Level-Watcher **und** Stash-Slot-Subentries) enthält
  jetzt die beobachtete Quell-Entität, vorbelegt mit dem aktuellen Wert und
  editierbar. Der **Name bleibt fest** — er definiert den `entity_id`-Slug
  (`sensor.title_classifier_<slug>_enum/raw/catalog`) und damit den
  Automationsvertrag.
- **Verlustfrei:** Eine geänderte Quelle bindet beim automatischen Reload nur
  den Runtime-Beobachter neu. Katalogdaten (Postgres, gekeyt über
  scope/media_type/signal_type/Titel), Entity-IDs, `unique_id` und die Trennung
  der vier Stash-Slots bleiben unverändert.
- **Sichtbar ohne Reconfigure:** Die Enum-/Raw-/Katalog-Sensoren jedes Watchers
  tragen jetzt `source_entity`, `online_entity` und `artwork_entity_id` als
  Attribute — die Verdrahtung je Slot ist damit direkt in den Entwicklerwerkzeugen
  prüfbar.

## 3.4.0 - 2026-07-12 — Inbox-Status „erledigt", 5-Watcher-Übersicht, Variantenmodus

Zusammenhängender UX-/Logik-Umbau (GitLab `ha-platform/control#27`). Drei
unabhängige Zustände pro Katalogeintrag: `enum` (0 ist gültig), **neu**
`reviewed_at` (NULL = offen, gesetzt = erledigt) und `hidden_at` (Ignorieren,
unverändert inkl. Auto-Unhide-Grace).

- **Datenmodell/Migration:** additive Spalte `tc_v3_catalog.reviewed_at`;
  einmaliger, idempotenter Backfill im Schema-Apply (guarded DO-Block):
  ALLE Bestandseinträge gelten als erledigt (`COALESCE(hidden_at, updated_at)`),
  die Inbox startet nach dem Upgrade leer. Nur neue Titel beginnen offen.
- **Inbox = Arbeitswarteschlange:** Filter jetzt `reviewed IS NULL` statt
  „Enum 0"; Aktionen „Erledigt" einzeln + als Stapel; Enum-Speichern schließt
  NICHT stillschweigend ab; Enum-0-Titel können bewusst erledigt werden.
  Wording: „Neue Titel prüfen", „versteckt" → **„ignoriert"**.
- **Stash:** das Enum-1-Seeding (FLEET-43) setzt im selben Vorgang
  `reviewed_at` — Stash-Titel erscheinen weiterhin nie in der Inbox.
- **Erneute Sichtung** setzt `reviewed_at` nie zurück (kein Auto-Reopen); die
  Auto-Unhide-Grace betrifft ausschließlich `hidden_at`.
- **Übersicht: genau 5 Watcher.** Ein Watcher pro Context; HomePod/PC/PS5/
  Apple TV als Einzelkarten ohne Gruppenrahmen, Stash als EINE Karte mit vier
  kompakten Slot-Zeilen (x/4 Slots online). Statistiken dedupliziert:
  „Einträge" aus dem Union-Store, „Offen" (statt „Unklassifiziert") über die
  geteilte reviewed-Definition — vorher zählten die 4 Stash-Slots + Apple TV
  denselben video-Katalog fünffach. Statusleiste nutzt dieselben Definitionen.
- **Katalog:** Struktur-Filter (Master/Varianten/eigenständig), Status-Filter
  (offen/erledigt), Kandidaten-Badge (⛓) und 🪄 Variantenmodus jetzt auch im
  Katalog; Tab „Ausgeblendet" → „Ignoriert"; Badge „Enum 0" ersetzt durch
  „offen"; Detailpanel mit „Erledigt"/„Wieder öffnen".
- **Fortlaufender Variantenmodus:** Queue über alle Kandidaten-Cluster
  (`pickAllClusters` + purer Zustandsautomat), Aktionen „Als Variante
  speichern & weiter", „Kein Master — eigenständig erledigen", „Überspringen",
  „Zurück", „Beenden"; erfolgreiche Zuordnung erledigt die offenen Mitglieder;
  Snapshot-Technik gegen Poll-Umsortierung; keine neue Stapel-Backend-API.
- **WS/API additiv:** `list_entries`/`entry_detail` liefern `reviewed` +
  `reviewed_at`; neuer Command `title_classifier/v3/set_reviewed`;
  Export/Import transportiert `reviewed_at`. Sensor-Entity-IDs/-Slugs,
  Effective-Enum-Resolver und alle HA-Contracts unverändert; die vier
  Stash-Slots bleiben im Backend getrennte Subentries.
- Tests: +24 pytest (reviewed-Modell, Stash-Seeding, Schema-Invarianten,
  API/IO), +34 Vitest (Inbox-Filter, Queue, Struktur-/Status-Filter,
  5-Watcher-Statistik); Suiten 213/127 grün.

## 3.3.3 - 2026-07-07 — Übersicht: Master-Gruppe pro Typ

Reine UX-Änderung: Die **Übersicht** gruppiert die Watcher jetzt nach `context`.
Pro Typ gibt es einen einklappbaren **Master-Kopf** mit Aggregat, darunter die
einzelnen Watcher-Cards. So sitzen z. B. `Stash Slot 1..4` sichtbar unter einem
„Stash"-Master statt als lose Einzelkarten.

- **Master-Kopf je context:** Label (z. B. „Stash"), Anzahl-Badge und Aggregat
  `Master · X/N aktiv · Enum <max>` (höchster Effective-Enum der aktiven Slots;
  ohne aktiven Slot entfällt der Enum-Teil). Klick klappt die Gruppe auf/zu.
- **Karten unverändert:** Die bestehenden Watcher-Cards (inkl. Inline-Enum/Apply)
  bleiben identisch, nur pro Master-Gruppe zusammengefasst.
- **Reines Frontend:** keine neue Entität, kein Aggregat-Sensor, kein Downstream-
  Effekt, keine WS-/Contract-Änderung. Gruppierung nur visuell im Panel.
- Umsetzung: neue reine Helper `groupSourcesByContext` (unit-getestet), Overview
  rendert Master-Gruppen; Bundle neu gebaut.

## 3.3.2 - 2026-07-07 — Multi-Watcher/Slot: verschachtelte Watcher sichtbar

Fix, damit **mehrere Watcher-Subentries** (z. B. `Stash Slot 1..4` unter einem
Parent) getrennt verwaltet **und in der Übersicht angezeigt** werden. Zuvor lief
ein Subentry-Watcher zwar (Sensoren + Katalog-Sichtungen), war aber in der v3-
Übersicht/`list_sources` und im geteilten Katalog-Gather unsichtbar, weil die
Runtime-Sammlung nur Top-Level-Einträge kannte.

- **Root Cause:** `all_v3_runtimes` / `select_v3_runtimes` lasen nur
  `bucket["runtime"]` (Top-Level). Subentry-Runtimes liegen in
  `bucket["subentry_runtimes"]` und wurden übersprungen — nur ein einzelner
  Stash-Watcher war sichtbar, obwohl weitere nested Watcher konfiguriert waren.
- **Fix:** Die v3-Runtime-Auswahl bezieht jetzt sowohl Top-Level-v3-Watcher als
  auch alle Watcher-Subentries ein. Damit erscheinen mehrere Watcher mit
  gleichem `context` (z. B. `stash`) getrennt in der Übersicht, teilen den
  Katalog und werden von Mutationen/`_after_mutation` erreicht.
- **Namens-Kollisionsschutz:** Der Watcher-Subentry-Flow lehnt einen Namen ab,
  dessen Entity-ID-Slug (`sensor.title_classifier_<slug>_*`) bereits von einem
  Watcher (Top-Level **oder** Subentry) belegt ist (`name_taken`). Top-Level
  hatte diesen Schutz bereits; Subentries jetzt auch. Jeder Slot braucht einen
  eindeutigen Namen (z. B. `Stash Slot 1`).
- **Kein String-Splitting:** Kombititel wie `A | B` werden nicht in TC gesplittet;
  jeder Slot/Watcher liefert einen eigenen Titel-Key/Sichtung.
- **Modell:** Ein Watcher pro Slot-Entität (Option A). Bestehende `stash`-Slot-
  Entitäten werden genutzt; kein neues Attribut-Feld nötig.
- Keine Änderungen an Stash/Jellyfin/anderen Integrationen. Keine Migration,
  keine DB-Bereinigung, kein Überschreiben bestehender Enums.

## 3.3.1 - 2026-07-06 — Hotfix Subentry-Handler

Adhoc-Fix für den HA-Fehler `Invalid handler specified`, wenn „Watcher
hinzufügen" versehentlich von einem flachen Watcher-Eintrag wie `Stash` statt
vom `Title Classifier DB`-Hub gestartet wird.

- `watcher`-Subentry-Flow ist als Kompatibilitätspfad auch auf bestehenden
  Top-Level-Watcher-Einträgen registriert; der DB-Hub bleibt der kanonische
  Parent.
- Subentry-Runtimes und Sensoren werden auch unter einem solchen Legacy-Parent
  korrekt geladen.
- Hub-Setup bindet den DB-Pool nun korrekt, bevor Subentry-Runtimes gestartet
  werden.
- Claude-Hinweis: Der kanonische Weg bleibt `Title Classifier DB` -> `Watcher
  hinzufügen`; der Legacy-Parent-Pfad ist nur ein Adhoc-Kompatibilitätsnetz für
  HA-UI-Starts von flachen Watcher-Einträgen.
- Keine Migration, keine DB-Bereinigung, keine Downstream-Contract-Änderung.

## 3.3.0 - 2026-07-06 — Watcher als Config-Subentries unter dem Hub

Watcher können jetzt als **HA-Config-Subentries direkt unter dem „Title
Classifier DB"-Hub** angelegt werden — sie erscheinen als **verschachtelte
Geräte** unter einem Eintrag statt als separate Top-Level-Einträge. Das ist das
„Hub → darunter Watcher hinzufügen"-Modell.

- **Neuer Watcher-Subentry-Flow:** Unter dem DB-Hub gibt es einen „Watcher
  hinzufügen"-Button (gleiches v3-Achsenformular: Quelle, context, media_type,
  inactive_values, artwork …). Jeder Subentry wird ein eigenes Gerät mit den
  3 Sensoren (`raw`/`enum`/`catalog`).
- **Additiv & ohne Migration:** Bestehende Top-Level-Watcher-Einträge
  (HP/PC/PS5/TV, flache Stash-Slots) laufen unverändert weiter. Beide Wege
  koexistieren.
- **Entity-IDs stabil:** Der sichtbare `sensor.title_classifier_<name>_*`-Slug
  kommt aus dem Watcher-Namen — ein als Subentry neu angelegter „Stash Slot 1"
  bekommt dieselbe Entity-ID wie zuvor (alten flachen Eintrag vorher entfernen).
- **Umsetzung:** `WatcherRuntimeV3`/Sensoren sind über einen kleinen Adapter von
  `ConfigEntry` entkoppelt; der Hub startet pro Subentry eine Runtime + Sensoren
  (`config_subentry_id`), Reload/Unload pro Subentry. Reine Formular-Daten-Logik
  in ein HA-freies `flow_data.py` ausgelagert und unit-getestet.
- Kein Katalog-/DB-Umbau, keine Downstream-Contract-Änderung.

## 3.2.3 - 2026-07-05 — Diagnose-Zugang vereinheitlicht

Kleiner UX/QOL-Patch: Diagnose ist jetzt aus **Inbox und Katalog** gleich
erreichbar. **Rein Frontend** — keine neue API, kein Backend-Refactor, keine
Migration (pytest unverändert 189).

- **Diagnose-Modal auch aus der Inbox:** das Inbox-Detailpanel öffnet dieselbe
  `DiagnosisModal`-Komponente für den gewählten Eintrag — read-only, ohne Drafts,
  Auswahl oder den Gruppieren-Dialog zu berühren; passive Polls schließen es
  nicht, die Auswahl bleibt nach dem Schließen erhalten.
- **Einheitlicher Zugang als Info-Symbol:** der Textbutton „Diagnose öffnen" im
  Mini-Trace ist weg; stattdessen ein kompaktes **ⓘ** im Detailpanel-Header
  neben dem Titel — in Inbox und Katalog identisch, mit `title`/`aria-label`
  „Diagnose öffnen". Kein Verwechseln mit Apply/Reset/Hidden/Gruppenaktionen.
- **Konsistente Detailpanels:** Inbox und Katalog nutzen jetzt dieselbe
  DetailPanel-Struktur inkl. kompaktem Mini-Trace (Stored→Effective, kurzer
  Grund, Sichtungen kurz). Seitenspezifisches bleibt getrennt: Katalog-Gruppen-
  verwaltung nur im Katalog, Inbox-Draft/Apply/Reset nur in der Inbox.
- **Kein Duplikat-Code:** beide Seiten teilen `DiagnosisModal`, `buildTraceView`,
  `resolveTraceState`, `explainEffectiveEnum` und `sortSightings`; das
  Diagnose-View-Model ist quellenunabhängig (Inbox = Katalog).
- **Kein Trace-Menüpunkt**, keine eigene Trace-Seite; **keine globale
  Audit-Historie**; **keine neue Backend-API**; **keine Artwork-Daten**
  gespeichert.

## 3.2.2 - 2026-07-05 — Diagnose als Modal statt Menüseite

UX-Korrektur zu v3.2.1: Trace ist keine eigene Hauptseite mehr, sondern eine
Diagnoseansicht direkt aus dem Katalog. **Rein Frontend** — keine neue API, kein
Backend-Refactor, keine Migration (pytest unverändert 189).

- **Trace-Menüpunkt aus der Sidebar entfernt.** Navigation ist wieder klar:
  Übersicht · Inbox · Katalog · Import/Export · Einstellungen.
- **Trace-Seite/Route entfernt** (inkl. Hash-Deep-Link-Helper aus v3.2.1) — kein
  toter Menüeintrag, keine leere Seite ohne Entry-ID. Eine spätere echte
  Systemdiagnose gehört in die Settings-Seite (Folge-PR).
- **Diagnose als Modal:** Der Button im Katalog-Detailpanel heißt jetzt
  **„Diagnose öffnen"** und öffnet ein großes React-Overlay (kein Browser-Popup)
  für den gewählten Eintrag. Schließbar per Button, Escape und Klick außerhalb.
- **Breite Diagnoseansicht:** 2-Spalten-Karten (Aktuelle Entscheidung,
  Beteiligte Faktoren, Vererbung/Varianten) plus breite Sichtungstabelle
  (Kontext, App, Sicht., Override, Eff., erstmals, zuletzt) — nutzt die Breite
  besser als das rechte Detailpanel.
- **Titel prominent:** der Eintragstitel steht als Überschrift oben, darunter
  Medienart, Quelle/Context-Badges, source_app und Status-Badges.
- **Mini-Trace im Katalog bleibt** kompakt (Stored→Effective, kurzer Grund,
  Master-Hinweis, Sichtungen kurz); Katalog-Aktionen (Gruppe/Hidden) und das
  Inbox-Detailpanel unverändert.
- **Kein Duplikat-Code:** Modal und Mini-Trace teilen dasselbe View-Model
  (`buildTraceView`, `resolveTraceState`, `explainEffectiveEnum`,
  `sortSightings`) aus v3.2.1.
- **Keine globale Audit-Historie**, solange keine Einzel-Events gespeichert
  werden; **keine neue Backend-API**; **keine Artwork-Daten** gespeichert.

## 3.2.1 - 2026-07-05 — Trace Full View

Hybrid-Trace: kompakt im Katalog, groß auf der eigenen Seite. **Rein Frontend** —
keine neue API, kein Backend-Refactor, keine Migration (pytest unverändert 189).

- **Katalog-Detailpanel-Trace kompakter:** statt drei langer Blöcke jetzt nur
  eine Mini-Zusammenfassung (Stored → Effective, Quelle/Grund kurz,
  Master-Hinweis bei Variante, Sichtungen kurz) — der Detailpanel bleibt
  Arbeitsfläche.
- **Neuer Button „Trace groß öffnen":** öffnet die Trace-Seite für genau den
  gewählten Eintrag, Übergabe über die stabile Entry-ID (keine UUID-Eingabe).
- **Trace-Seite ist jetzt die große Diagnoseansicht:** breite, mehrspaltige
  Karten für den gewählten Eintrag — Titel/Badges, „Aktuelle Entscheidung"
  (Stored/Effective-Katalog/Effective-live, Quelle, Grundtext aus
  `explainEffectiveEnum`), „Beteiligte Faktoren", „Vererbung/Varianten" und eine
  breite Sichtungstabelle (Kontext, App, Sicht., Override, Eff., erstmals,
  zuletzt).
- **Deep-Link + Reload-Persistenz:** die Auswahl spiegelt sich im URL-Hash
  (`#trace/<entry_id>`) und wird nach einem Reload wieder geöffnet. Passive Polls
  zerstören die geöffnete Seite nicht; „Aktualisieren" lädt neu ohne Flackern.
- **Saubere Zustände statt weißer Seite:** kein Eintrag ⇒ Empty-State mit
  „Katalog öffnen"; unbekannte/ungültige ID ⇒ verständliche Fehlermeldung mit
  „Katalog öffnen"; noch nicht verbunden ⇒ Ladezustand.
- **Kein Duplikat-Code:** Panel-Mini und Trace-Seite teilen dieselbe Logik über
  `buildTraceView` (wiederverwendet `explainEffectiveEnum` + `sortSightings` aus
  v3.2.0). Bestehende Katalog-Aktionen (Gruppe/Hidden) und das Inbox-Detailpanel
  bleiben unverändert.
- **Keine globale Audit-Historie**, solange keine Einzel-Events gespeichert
  werden; **keine Auto-Gruppierung**; **keine Artwork-Daten** gespeichert.

## 3.2.0 - 2026-07-05 — Catalog Trace / Diagnose

Statt einer eigenständigen Tagebuch-Seite bekommt der Katalog eine **read-only
Trace-/Diagnose-Ansicht pro Eintrag**. Der Katalog bleibt die Hauptarbeitsfläche.
**Rein Frontend** — keine neue API, kein Backend-Refactor, keine Migration; alles
aus vorhandenen `list_entries`/`entry_detail`-Feldern.

- **Trace / Diagnose im Katalog-Detailpanel:** neuer Abschnitt erklärt pro
  Eintrag, warum ein `effective_enum` entsteht — „Aktuelle Entscheidung"
  (Stored Enum, katalog-abgeleiteter Enum, Live-Effective wenn laufend, Quelle
  des Werts, Grundtext), „Beteiligte Faktoren" (Medienart, Signal, Kontexte,
  Source App, Master + Master-Enum, Hidden, Läuft) und aggregierte „Sichtungen".
- **Decision Trace (ehrlich, nicht geraten):** neuer reiner Helper
  `explainEffectiveEnum` spiegelt den Backend-Resolver (`effective.py`):
  eigener Enum · Enum 0 = unklassifiziert · music/video-Variante übernimmt
  Master-Enum · Game-Varianten erben **nicht**. Verwaiste Variante / noch
  ladender Master ⇒ ehrlich „nicht vollständig erklärbar mit aktuellen Daten"
  statt Falschaussage. Weicht der Live-Wert ab, weist der Trace auf
  Online-Gate / Watcher-Floor (z.B. Stash ⇒ 1) / aktiven Kontext-Override hin —
  diese liegen außerhalb der Katalogdaten.
- **Sichtungsverlauf pro Eintrag:** aggregierte Sichtungen pro Kontext
  (Quelle · Nx · zuletzt …, source_app falls vorhanden), zuletzt-gesehen zuerst
  mit stabilem Tie-Breaker. Ehrlicher Empty-State, wenn nichts erfasst ist —
  **keine Fake-Historie** (Einzel-Events werden nicht gespeichert).
- **Vererbung erklärt:** Master zeigt „Master · N Varianten" + Variantenliste;
  Kind zeigt Master-Titel + Master-Enum und ob der Wert vom Master kommt;
  verwaiste Variante wird klar als solche ausgewiesen. Nur anzeigen — **keine
  automatische Reparatur**, keine mehrstufige Struktur.
- **Navigation „Tagebuch" → „Trace":** die linke Route heißt jetzt „Trace" und
  verweist ehrlich in den Katalog („Trace befindet sich im Katalog-Detailpanel …")
  inklusive „Katalog öffnen"-Button. **Keine globale Timeline, keine
  Audit-Historie**, solange keine Einzel-Events gespeichert werden.
- Bestehende v3.1.0-Funktionen (Zu Gruppe hinzufügen / Master wechseln / Aus
  Gruppe lösen / Ausblenden / Wiederherstellen) bleiben unverändert erhalten.
- **Keine Artwork-/Bilddaten** gespeichert; Trace ist read-only und beeinflusst
  keine HA-Automationen.

## 3.1.0 - 2026-07-05 — Katalog als Verwaltungsseite

Fokussierter Catalog-Management-Release. Der Katalog wird nach der Inbox die
zweite echte Arbeitsfläche: Bestand verwalten, Gruppen pflegen, versteckte
Einträge bearbeiten, Quellen/Status/Sichtungen nachvollziehen. **Rein Frontend —
kein Backend-Refactor, keine neue API, keine Migration.** Alle Aktionen laufen
über die bestehenden `v3/*`-Endpunkte (`group`, `ungroup`, `set_hidden`); alle
Zeilenfelder kommen aus dem vorhandenen `list_entries` (keine Detail-Abfrage pro
Zeile).

- **Katalog-Tabelle als Bestandsverwaltung:** Zeilen zeigen jetzt Titel,
  Medienart (Icon + Text), Quelle/Context-Badge inkl. `source_app` (z.B.
  „Apple TV · Netflix"), Enum (mit `→effective`-Hinweis während ein Titel läuft),
  Mehrfach-Status-Badges und Sichtungen (`seen_count_total` + zuletzt gesehen).
- **Status-Badges (deterministisch, mit sauberem Fallback):** „läuft",
  „Master · N Varianten", „Variante", „verwaiste Variante", „Versteckt",
  „Enum 0". Kein `undefined`/`null` — leere Statusspalte fällt auf „—" zurück.
- **Sortierung:** Titel A–Z / Z–A, zuletzt gesehen neueste/älteste,
  Gruppen/Varianten zuerst, Master zuerst, Versteckte zuerst, Enum auf-/
  absteigend. **Immer stabiler Tie-Breaker** (Titel, dann `id`) — keine zufällige
  Reihenfolge bei gleichen Werten, kein Auswahl-/Reihenfolge-Verlust durch
  passive Polls.
- **Filter erweitert:** neuer Quelle/Context-Filter (PS5/PC/Switch/HomePod/
  Apple TV/Stash) neben Suche, Medienart, Signal und den bestehenden Tabs
  (Alle/Unsortiert/Gruppen/Ausgeblendet).
- **Gruppenverwaltung im Detailpanel:** „Zu Gruppe hinzufügen" (Master aus einer
  Titelliste wählen — keine UUID-Eingabe), „Master wechseln" und „Aus Gruppe
  lösen". Die Master-Auswahl spiegelt den Backend-Guard (gleiche
  scope/media_type/signal_type, nur Top-Level-Ziele); **eine Ebene** bleibt hart:
  ein Master kann nicht selbst Variante werden, Kinder werden nicht zu
  Master-Kind-Kind-Strukturen. **Keine automatische Gruppierung** — jede
  Zuordnung ist eine bewusste User-Aktion.
- **Hidden/Restore sauber:** Hidden-Status als Zeilen-Badge; Detailpanel bietet
  je nach Zustand „Ausblenden" bzw. „Wiederherstellen"; versteckte Einträge
  bleiben im Hidden-Filter gruppier- und bearbeitbar; nach der Aktion forced
  reload und das Detailpanel schließt, wenn der Eintrag aus der aktuellen Sicht
  fällt.
- **Detailpanel für Katalogarbeit:** Quelle/Kontexte, `seen_count_total`,
  Master/Kind-Status, Variantenliste und Kontext-Overrides bleiben sichtbar;
  neue Gruppen-Aktionen mit Detail-Reload nach jeder Änderung.
- Es werden **keine Artwork-/Bilddaten** gespeichert (kein Base64/Blob).

## 3.0.0 - 2026-07-03 — Offizieller Title Classifier v3

Der Versionssprung macht die **React/TypeScript/Vite-Verwaltungsmaske („v3")**
zum offiziellen Hauptstand. Funktional baut v3.0.0 additiv auf v2.11.0 auf — kein
Backend-Refactor, keine Migration, keine Breaking-API-Änderung.

- **Quelle/Context sichtbar (Inbox + Katalog):** Neben der Medienart zeigt ein
  kompakter Source-Badge, woher ein Titel kommt — PS5 / PC / Switch / HomePod /
  Apple TV / Stash, inkl. `source_app` (z.B. „Apple TV · Netflix") und `+N` für
  weitere Quellen. Rein aus den `list_entries`-Feldern abgeleitet (contexts /
  last_context / context_count / current_source_app) — keine neue API, keine
  Detail-Abfrage pro Zeile. Fallback „—" wenn keine Quelle bekannt.
- **Varianten-Assistent:** Neuer Button „🪄 Varianten-Vorschlag" in der Inbox
  wählt den besten sichtbaren Varianten-Cluster automatisch aus, öffnet den
  Gruppieren-Dialog mit sinnvoll vorausgewähltem Master und zeigt an, warum. Er
  respektiert die aktuelle Filterung/Sortierung/Sichtbarkeit, nutzt keine
  versteckten Einträge, bleibt ID-basiert und nutzt die Snapshot-Logik. **Kein
  automatisches Gruppieren** — der User bestätigt final; ohne Kandidaten ist der
  Button deaktiviert.
- **Inbox** ist produktiv nutzbar (unklassifizierte Titel triagieren, Enum
  setzen, gruppieren, ausblenden); **Katalog/Detailpanel/Master-Kind-Struktur/
  Gruppierung/effective_enum-Workflow** sind Teil von v3.
- **Settings-Status geprüft:** Die Einstellungen zeigten keinen Live-Status
  (Placeholder), wodurch Postgres „inaktiv" wirkte. Neu: eine kleine, read-only
  Status-Karte (Backend/Katalog-DB erreichbar, Watcher-Anzahl, Einträge, letzter
  Sync) aus den bereits vorhandenen Store-Daten. Kein neuer Backend-Endpunkt,
  keine Zugangsdaten. Die vollständige Settings-/Diagnose-Seite bleibt ein
  separater Folge-PR.
- Es werden **keine Artwork-/Bilddaten** gespeichert; **keine automatische
  Gruppierung** ohne Bestätigung.

Folgepatches laufen ab hier als v3.0.1, v3.0.2, …

## 2.11.0 - 2026-07-02

- **Raw-Sensoren gehen im Leerlauf nicht mehr auf `unknown`/„unavailable":** Der
  Raw-/Titel-Sensor (`sensor.title_classifier_<slug>_raw`) gab bei „nichts läuft"
  `None` zurück → HA rendert das als `unknown` (in Binding-Diagnosen als
  „unavailable" gelistet). Er zeigt jetzt einen konfigurierbaren **Idle-Wert**
  (Default `"idle"`) und bleibt damit immer ein gültiger String. Der Enum-Sensor
  war schon sauber (Leerlauf = 0). Gilt für v3- **und** v2-Watcher.
- **Neues Watcher-Feld „Idle-Wert":** Pro Watcher im Formular (Anlegen +
  Reconfigure) einstellbar. Default `"idle"` steht bereits in der
  Feeder-Default-Inaktiv-Liste → jeder Title-Classifier-Konsument behandelt ihn
  automatisch als inaktiv (kein Phantom-Titel im Katalog). Wer ein sprechendes
  Label wie `"No Game"` setzt, trägt es bei den Konsumenten selbst als
  Inaktiv-Wert ein. Der `key`-Sensor-Attribut bleibt ehrlich (`None` im Leerlauf).

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
