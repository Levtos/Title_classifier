# Title Classifier

Standalone-HACS-Integration fuer Home Assistant.

Der Title Classifier ueberwacht konfigurierte Quell-Entitaeten, erkennt daraus
wechselnde Titel oder Aktivitaeten und speichert jeden neu gesehenen Wert in
einer persistenten Home-Assistant-Datenbank. Anschliessend kann jeder Wert einer
stabilen Enum-Kategorie von `0` bis `9` zugeordnet werden. Andere Integrationen
oder Automationen koennen dann mit diesen stabilen Zahlen arbeiten, statt rohe,
wechselhafte Titelstrings auswerten zu muessen.

Typische Quellen sind:

- `media_player.*` mit `media_title`, `media_artist` oder aehnlichen Attributen
- `sensor.*`, deren State direkt den aktuellen Titel, das Spiel oder die
  Aktivitaet enthaelt
- Sensoren mit Titelattributen wie `title`, `game_name`, `activity` oder
  `media_title`

## Was die Integration macht

Fuer jeden angelegten Watcher wird genau eine Quell-Entitaet beobachtet. Wenn
sich der Wert dieser Quelle aendert, extrahiert die Integration einen
klassifizierbaren Key, zum Beispiel:

- `Astro Bot`
- `Hades`
- `Daft Punk - One More Time`
- `1LIVE - 1LIVE Fiehe`
- `Walking`

Dieser Key wird automatisch im Storage abgelegt. Neue Keys erhalten zuerst den
Default-Enum `0` und gelten damit als unklassifiziert. Ueber das Sidebar-Panel,
die Number-Entity, WebSocket-Befehle oder Services kann der Key danach einer
Kategorie von `1` bis `9` zugewiesen werden.

Der Enum ist die eigentliche Automations-Schnittstelle. Beispiel: Eine
Licht-Policy muss nicht wissen, ob gerade `Astro Bot`, `Spider-Man 2` oder ein
bestimmter Musiktitel laeuft. Sie liest nur
`sensor.title_classifier_<name>_enum` und reagiert auf die hinterlegte Kategorie.

## Funktionaler Ablauf

1. Ein Watcher wird im Config-Flow angelegt.
2. Der Watcher registriert einen Listener auf der Quell-Entitaet.
3. Bei Setup und bei jeder State-Aenderung wird aus State oder Attributen ein
   Key gebildet.
4. Der Key wird in `.storage/title_classifier_entries_<entry_id>` gespeichert.
5. `first_seen`, `last_seen` und `seen_count` werden aktualisiert.
6. Der aktuell gueltige Enum wird aus dem Storage gelesen.
7. Die Sensoren und das Sidebar-Panel werden aktualisiert.
8. Automationen lesen den Enum-Sensor als stabiles Signal.

## Watcher-Typen

- `media`: fuer Musik, Radio, Streams und andere Medien. Nutzt bevorzugt
  `media_title` oder `title`. Bei Media-Playern wird zusaetzlich ein Artist oder
  Sendername gesucht. Bei `sensor.*`-Quellen wird der Sensor-State als Titel
  verwendet, wenn keine Titelattribute vorhanden sind.
- `game`: fuer Spiele oder Apps. Nutzt Attribute wie `game_title`,
  `game_name`, `app_title`, `app_name`, `media_title` oder faellt auf den
  Sensor-State zurueck.
- `activity`: fuer Aktivitaeten. Nutzt `activity`, `activity_name`,
  `media_title`, `title`, `app_name` oder den Sensor-State.

## Entitaeten

Pro Watcher erzeugt die Integration:

- `sensor.title_classifier_<name>_enum`  
  Der aktuelle klassifizierte Wert als Zahl von `0` bis `9`.

- `sensor.title_classifier_<name>_raw`  
  Der aktuell erkannte rohe Key.

- `sensor.title_classifier_<name>_catalog`  
  Diagnose-Sensor mit Anzahl, bekannten Titeln, gemappten Titeln und
  unklassifizierten Titeln als Attribute.

- `number.title_classifier_<name>_current_title_enum`  
  Setzt den Enum fuer den gerade aktiven Titel direkt aus Home Assistant heraus.

## Persistenz

Die Daten werden pro Watcher in Home Assistants `.storage` gespeichert:

```text
.storage/title_classifier_entries_<entry_id>
```

Gespeichert werden:

- `key`: erkannter Titel oder Aktivitaetsname
- `enum`: Kategorie `0` bis `9`
- `first_seen`: erstes Auftreten
- `last_seen`: letztes Auftreten
- `seen_count`: Anzahl der Sichtungen
- `hidden_at`: optionaler Zeitpunkt, ab dem ein ungemappter Eintrag im Panel
  ausgeblendet wird

## Services

Alle Services liegen unter der Domain `title_classifier`:

- `title_classifier.set_enum`
- `title_classifier.delete_entry`
- `title_classifier.clear_old`
- `title_classifier.import_entries`
- `title_classifier.hide_unmapped`

Beispiel:

```yaml
service: title_classifier.set_enum
data:
  entry_id: "01J..."
  key: "Artist - Title"
  enum: 4
```

## Sidebar-Panel

Das Panel ist unter `/title_classifier` erreichbar. Es zeigt die Watcher,
aktuelle Keys, bekannte Eintraege, deren Enums und Filter fuer unklassifizierte
oder ausgeblendete Eintraege. Aenderungen im Panel schreiben direkt in denselben
Storage, den auch die Sensoren verwenden.

## Troubleshooting: Datenbank bleibt leer

Wenn sich die Quell-Sensoren sichtbar aendern, aber die
`title_classifier_entries_<entry_id>`-Dateien leer bleiben, pruefe zuerst:

- Ist die konfigurierte Quell-Entitaet wirklich die Entitaet, deren State oder
  Attribute sich aendern?
- Ist der Sensor-State nicht `unknown`, `unavailable`, `none`, `off`, `idle`
  oder `standby`? Diese Werte werden bewusst ignoriert.
- Bei `media_player.*`: liefert die Entitaet ein Titelattribut wie
  `media_title` oder `title`?
- Bei `sensor.*`: steht der Titel direkt im State oder in einem der bekannten
  Attribute?

Hotfix: `media`-Watcher akzeptieren fuer `sensor.*`-Quellen jetzt auch den
Sensor-State als Titel, wenn keine Titelattribute vorhanden sind. Damit werden
Sensoren wie `sensor.ps5_current_title` oder aehnliche Title-Sensoren wieder als
neue Storage-Eintraege erfasst.

## Integration-Metadaten

- Domain: `title_classifier`
- Repository: `https://github.com/Levtos/Title_classifier`
- Custom Component: `custom_components/title_classifier/`
- Panel-Pfad: `/title_classifier`
- WebSocket-Namespace: `title_classifier/...`
- Storage-Key: `.storage/title_classifier_entries_<entry_id>`

## Migration aus `bennis_toolbox`

Diese Integration wurde am 2026-05-27 aus
`bennis_toolbox/custom_components/bennis_toolbox/modules/title_classifier/`
extrahiert. Die produktive Ausgangsversion war `0.5.0`; die Standalone-
Integration startete bei `1.0.0`.

Wichtige Aenderungen:

- Services wechselten von `bennis_toolbox.title_classifier_*` zu
  `title_classifier.*`.
- WebSocket-Befehle wechselten von
  `bennis_toolbox/title_classifier/...` zu `title_classifier/...`.
- Unique IDs nutzen jetzt das Prefix `title_classifier_*`.
- Storage-Keys liegen unter `.storage/title_classifier_entries_<entry_id>`.

