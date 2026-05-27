# Title Classifier

This repository is the standalone HACS extraction of the former
`bennis_toolbox` `title_classifier` module.

## Runtime Surface

- Domain: `title_classifier`
- Config entries: one watcher per source entity
- Platforms: `sensor`, `number`
- Sidebar panel: `/title_classifier`
- Frontend bundle: `custom_components/title_classifier/frontend/title-classifier-panel.js`

## Watcher Types

- `media`: uses media title plus artist/station fallback when available
- `game`: classifies game/app title attributes
- `activity`: classifies activity-like state attributes

## Automations

Use `sensor.title_classifier_<name>_enum` as the automation-facing value. The
number entity can be used to set the enum for the currently active title from
Home Assistant.

## Extraction Notes

Extracted from `bennis_toolbox` on 2026-05-27.

Lessons for later extractions:

- Toolbox-relative imports were limited to constants, services, storage,
  WebSocket type helpers, panel URL helpers, and unique ID helpers.
- Standalone integrations need their own `__init__.py` dispatcher to register
  services/WebSockets and forward platforms.
- Tests needed only a package path update and storage-helper stub adjustment.
- Frontend WebSocket command strings must be rewritten together with backend
  `websocket_type()`.
- Unique IDs and storage keys are migration-sensitive and must be documented
  before cut-over.
