# FAHRPLAN — Title Classifier v3 Rewrite (FLEET-177)

> Fachlicher + technischer Neuschnitt der Title-Classifier-Integration
> (Repo `Entity-Title-Mapper`, Domain `title_classifier`, Owner: Claude, L1-Context).
> SoT für Status/WIP bleibt das FLEET-Board. Architektur hier ist **von Benni
> bestätigt** (2026-06-29). Code erst nach Phasen-Go.

## Ziel

Sauberes v3-Modell mit **zentralem, medien-zentriertem Katalog**: klare Trennung
von Watcher (nur Beobachter), Medienart, Kontext und Signaltyp; neue
Postgres-Struktur; korrekte Effective-Enum-Logik; Master/Kind-Varianten;
Game-Kontext-Overrides; später neu strukturierte Lit/TS-UX.

Migration alter Katalogdaten ist **nicht zwingend**. Alte generische Tabellen
(`catalog_entry`) bleiben **unangetastet**, neue Tabellen sind eindeutig mit
`tc_v3_`-Präfix versehen.

---

## Architektur-Entscheidungen (bestätigt 2026-06-29)

### Katalog-Identität — medien-zentriert

- Identität = **`scope + media_type + signal_type + normalized_key`**.
- `context` ist **nicht** Teil der Identität, sondern Beobachtungs-/Override-Dimension.
- Ein Spiel/Track/Video = **eine** Katalogzeile über alle Kontexte hinweg.
  Beispiel: `Overwatch` ist **ein** Game-Eintrag; PC/PS5/Switch sind Kontexte
  dazu (Zeilen in `tc_v3_entry_context`). Plattformen duplizieren keine Stammdaten.
- Watcher **besitzen keine Einträge**.

### Medienarten (`media_type`)

`music` · `game` · `video`  (alt `tv` → `video`; alt `stash` ist **kein**
media_type mehr, sondern ein Kontext).

### Kontexte (`context`)

`homepod` · `pc` · `ps5` · `switch` · `stash` · `apple_tv`.

### Signaltypen (`signal_type`)

`title` · `app`. Teil der Identität — App-Signal („Netflix") und Titel-Signal
(„Daft Punk - One More Time") sind unterschiedliche Einträge.

### Master/Kind (Varianten)

- **Eine** Tabelle mit Self-Reference über **`parent_id uuid`** (kein
  `master_key`-FK auf Textbasis; `master_key` höchstens UI-/Export-Begriff).
- `parent_id = NULL` → eigenständiger Eintrag **oder** Master. Wird er von
  Kindern referenziert, ist er Master.
- `parent_id` gesetzt → Kindvariante.
- **Nur eine Ebene**: Kind darf kein Master sein; Master mit Kindern darf nicht
  selbst Kind werden (Guard im Store).
- Parent muss **gleiche `scope`, gleiche `media_type`** und **idealerweise
  gleichen `signal_type`** haben.
- UUIDs werden **im Python-Code** erzeugt (`uuid4`), DB speichert sie. **Kein**
  hartes `DEFAULT gen_random_uuid()` (keine Extension-Abhängigkeit).

### Effective-Enum (zentraler Resolver, feste Reihenfolge)

1. Basis = Roh-Enum des Eintrags. Ist der Eintrag ein **Kind**, erbe
   `parent.enum` (gilt für `music` & `video`).
2. **Game-Kontext-Override**: `media_type=game` + `enum_override` für den aktiven
   Kontext gesetzt → ersetzt.
3. **Stash-Floor**: `context=stash` + Titel aktiv + effektiver Enum `0` → `1`.
4. offline / kein Titel → `0`.

### Rollout — harter Cut

- Neue, geprefixte `tc_v3_*`-Tabellen; `catalog_entry` bleibt unangetastet.
- **Keine** Pflichtmigration, **keine** Shadow-Schreibpfade, **keine** parallele
  v2/v3-Koexistenz. Watcher dürfen neu angelegt werden. Altdaten optional vorher
  per Backup/Export sichern (kein Blocker). **Kein Drop** alter/fremder Tabellen.
- Version: **3.0.0** (Breaking Rewrite, bereits jenseits 1.0 → kein 1er-Sprung-Gate).

---

## Datenmodell v3

### `tc_v3_catalog` — zentraler Medienkatalog

| Spalte | Typ | Anmerkung |
|---|---|---|
| `id` | uuid PK | **in Python** erzeugt (uuid4), kein DB-Default |
| `scope` | text | Sharing-Namespace (Benni/Eltern) |
| `media_type` | text | `music` / `game` / `video` |
| `signal_type` | text | `title` / `app` |
| `normalized_key` | text | Identität (aus `normalise_*`-Logik) |
| `key` | text | Roh/Anzeige-Key |
| `parent_id` | uuid NULL → `tc_v3_catalog(id)` | Master/Kind, eine Ebene |
| `enum` | smallint | Roh-Enum 0–9 |
| `artist`/`title`/`album`/`app_name` | text | Anzeige-Attribute |
| `first_seen`/`last_seen`/`seen_count`/`hidden_at` | — | Telemetrie |
| `updated_by`/`updated_at` | — | Echo-Suppression |

- **UNIQUE** `(scope, media_type, signal_type, normalized_key)` = fachliche Identität.
- **Kein** persistentes Bild-Archiv hier (siehe Artwork-Karte): `cover_url`/
  `cover_source` höchstens als Referenz/Metadaten für Legacy/MAW-Kompat, **nie**
  Bilddaten/Base64/Blob.

### `tc_v3_entry_context` — Beobachtungs- & Override-Dimension

| Spalte | Typ | Anmerkung |
|---|---|---|
| `entry_id` | uuid → `tc_v3_catalog(id)` | |
| `context` | text | einer der 6 Kontexte |
| `source_app` | text NOT NULL DEFAULT `''` | für apple_tv/Plex/Jellyfin/Netflix |
| `first_seen`/`last_seen`/`seen_count` | — | per-Kontext-Telemetrie |
| `enum_override` | smallint NULL | Game-Kontext-Override |
| `last_watcher_id` | text NULL | Telemetrie — Watcher bleibt **kein** Owner |

- **PK** `(entry_id, context, source_app)`.

### NOTIFY

Eigener Channel `tc_v3_change` (Trigger auf beiden Tabellen), Echo-Suppression
über `updated_by` wie im Bestand. DB-Hub-Modell + Scope-Sharing + Pool/Listener
aus v2 bleiben unverändert (orthogonale Infra).

---

## Fachliche Festlegungen pro Kontext

### Stash
- Immer `media_type=video`, `context=stash`, `signal_type=title`,
  `default_active_enum = 1`.
- Stash leer/offline → effective `0`. Stash aktiv + Entry-Enum `0` → `1`. Stash
  aktiv + Entry-Enum `≠0` → Entry-Enum gewinnt.

### Apple TV (`media_type=video`, `context=apple_tv`)
- Echter Titel verfügbar → `signal_type=title`. Nur App sichtbar → `signal_type=app`.
- Netflix (nur App): `signal_type=app`, `key=Netflix`.
- Jellyfin mit echtem Titel: `signal_type=title`, `source_app=Jellyfin`.
- Plex mit echtem Titel: `signal_type=title`, `source_app=Plex`.

### Switch
- Erstmal `media_type=game`, `context=switch`, `signal_type=title`. Auch wenn
  später nur grober App-/Spielname erkannt wird, bleibt es `title`, solange es
  fachlich ein Spiel ist.

---

## Artwork / Cover (eigene Subkarte)

- Bilder werden **nur live** angezeigt, **keine** Bilddaten in Postgres
  (keine Base64/Blob), Export/Import enthält **keine** Bilddaten.
- Optional `artwork_entity_id`; optional `artwork_attribute` (Default
  `entity_picture`); Fallback `source_entity`.
- WebSocket liefert nur **Referenz/Live-URL**; UI zeigt Fallback-Icon, wenn kein
  Bild verfügbar.

---

## Phasen / Subkarten (Strangler, WIP-1, je eigener PR)

1. **Schema + Store (Postgres)** — `schema_v3.sql`, idempotentes Apply in `db.py`;
   `PostgresCatalogStoreV3` (uuid-Identität in Python, parent-aware Upsert mit
   Ein-Ebenen-Guard, `entry_context`-CRUD inkl. `source_app`, NOTIFY `tc_v3_change`).
2. **Effective-Enum-Resolver + Tests** — reine `effective.py` (Vererbung →
   Game-Override → Stash-Floor → offline). Pure-logic-Tests, keine HA-Abhängigkeit.
3. **Runtime / Feeder (Watcher = Beobachter)** — Watcher liest live
   `(context, signal_type, source_app)`, schreibt `seen` + Kontext-Beobachtung,
   klassifiziert **nichts** selbst.
4. **Config/Options-Flow** — Watcher wählt `context` (6) + `signal_type`
   (title/app) + `media_type` (music/game/video). Hub-Modell unverändert.
5. **WebSocket/API v3** — neue Felder (`id, media_type, context, signal_type,
   parent_id, effective_enum, variants[], source_app, hidden, is_current`),
   Gruppieren/Trennen-Commands.
6. **Entities** — `sensor.*_enum` = effective enum; Sensor-Slug-Contract
   **stabil** für Konsumenten (light_policy/media_context) → kein Churn.
7. **Artwork / Cover-Anzeige** — live-only, keine Bilddaten in PG (siehe oben).
8. **Frontend v3-Anpassung (minimal)** — nur an v3-Felder angepasst; echte
   Lit/TypeScript-UX + neue UX-Struktur = **Folge-Initiative** (Kriterium „später").

### Definition of Done (je Phase)
- `py_compile` + Pure-Logic-Tests grün (lokal kein HA/dulwich).
- PR angelegt **und** gemergt (nie direkt auf main), Integration+Version im
  PR-/Release-Text genannt.
- Slug-/WS-Contract-Stabilität für Konsumenten gewahrt; Deploy-Reihenfolge
  Feeder/Render vor Konsument.
- Karte mit Erkenntnis/Closure-Note gepflegt; Architektur-Relevantes hier + ggf.
  `codex.md` vermerkt.

### Akzeptanzkriterien (aus FLEET-177)
- [ ] v3-Postgres-Tabellen angelegt, alte generische Tabellen unangetastet, neu geprefixt.
- [ ] Watcher sind nur Beobachter, keine Besitzer von Katalogeinträgen.
- [ ] Medienarten = music, game, video.
- [ ] Kontexte = homepod, pc, ps5, switch, stash, apple_tv.
- [ ] Signaltypen = title, app.
- [ ] Stash: aktiver Titel + Entry-Enum 0 → effective 1.
- [ ] Games unterstützen optionale Kontext-Overrides.
- [ ] Musik-/Video-Varianten erben den Enum des Masters.
- [ ] Varianten gruppier-/trennbar (parent_id, eine Ebene).
- [ ] Ausgeblendete Einträge normal unsichtbar, temporär sichtbar wenn laufend.
- [ ] WebSocket/API liefert v3-Felder.
- [ ] Frontend für Lit/TS + neue UX vorbereitet (minimal in v3; echte UX als Folge).
- [ ] Tests grün.
