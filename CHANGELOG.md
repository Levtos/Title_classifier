# Changelog

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
