# Title Classifier

Standalone HACS custom integration for Home Assistant.

Extracted from `bennis_toolbox` on 2026-05-27. The productive source was
`bennis_toolbox/custom_components/bennis_toolbox/modules/title_classifier/`
at version `0.5.0`. This standalone integration starts at version `1.0.0`.

## What it does

Title Classifier watches media/game/activity entities and maps volatile titles
to stable numeric enum values from `0` to `9`.

Typical consumers use the enum sensor as a compact mode signal for automations,
for example gaming mode, music mode, or activity context.

## Integration metadata

- Domain: `title_classifier`
- Repository: `https://github.com/Levtos/Title_classifier`
- Custom component path: `custom_components/title_classifier/`
- Panel path: `/title_classifier`
- WebSocket namespace: `title_classifier/...`
- Storage keys: `.storage/title_classifier_entries_<entry_id>`

## Entities

For every configured watcher, the integration creates:

- `sensor.title_classifier_<name>_enum`
- `sensor.title_classifier_<name>_raw`
- `sensor.title_classifier_<name>_catalog`
- `number.title_classifier_<name>_current_title_enum`

Entity IDs are intentionally readable and based on the watcher name. Unique IDs
changed during extraction from the umbrella integration and now use the
`title_classifier_*` prefix.

## Services

Services are registered directly under the standalone domain:

- `title_classifier.set_enum`
- `title_classifier.delete_entry`
- `title_classifier.clear_old`
- `title_classifier.import_entries`

Example:

```yaml
service: title_classifier.set_enum
data:
  entry_id: "01J..."
  key: "Artist - Title"
  enum: 4
```

## Migration Notes

Breaking changes from the old umbrella deployment:

- Services changed from `bennis_toolbox.title_classifier_*` to
  `title_classifier.*`.
- WebSocket commands changed from `bennis_toolbox/title_classifier/...` to
  `title_classifier/...`.
- Unique IDs changed from `bennis_toolbox_title_classifier_*` to
  `title_classifier_*`, so Home Assistant entity registry migration is needed
  if existing entities must keep their registry identity.
- Storage keys changed to `.storage/title_classifier_entries_<entry_id>`.

No cross-repo imports to `bennis_toolbox` are used.
