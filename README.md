# Title Classifier

Standalone HACS integration for Home Assistant.

Title Classifier watches configured source entities (media players, sensors),
derives a canonical **catalog entry** from each currently-playing title or app,
and lets you assign it a stable **enum** from `0` to `9`. Other integrations and
automations then react to that stable number instead of parsing volatile title
strings.

A light policy never needs to know whether `Astro Bot`, `Spider-Man 2` or some
track is playing — it just reads `sensor.title_classifier_<name>_enum` and acts
on the category you mapped.

> **v3 (current):** the catalog lives in a dedicated **Postgres** database (the
> shared media catalog on LXC 108). The legacy per-watcher `.storage` JSON of v2
> is **deprecated** — see [Legacy](#legacy-v1v2).

---

## v3 model

### Concepts

| Term | Meaning |
|---|---|
| **Watcher** | An observer of one source entity. **Owns no catalog entry** — it only feeds sightings. |
| **Media type** | `music` · `game` · `video` |
| **Context** | Where it was observed: `homepod` · `pc` · `ps5` · `switch` · `stash` · `apple_tv` |
| **Signal type** | How the key is derived: `title` (a real title) or `app` (only the app name) |
| **Catalog entry** | The canonical title/game/video. |
| **Variant (Kind)** | A child entry grouped under a **master** (one level). |
| **Effective enum** | The value actually emitted to automations. |

### Identity

A catalog entry is identified by:

```
scope + media_type + signal_type + normalized_key
```

`context` is **not** part of the identity — it is an observation/override
dimension. So `Overwatch` is **one** game entry; PC, PS5 and Switch are contexts
attached to it (rows in `tc_v3_entry_context`), each with optional telemetry and
a game-specific `enum_override`.

### Master / variant

Music and video variants are grouped under a master via `parent_id` (one level
only): a child cannot itself be a master, and a master with children cannot
become a child. **Music/video variants inherit the master's enum.** Games do not
inherit — they express per-context intent via overrides instead.

### Effective-enum resolution (fixed order)

1. **Online gate** — offline / no active title ⇒ `0` ("nothing is playing").
2. **Variant inheritance** — a child inherits its master's enum (music & video).
3. **Game context override** — `media_type=game` + an `enum_override` for the
   active context replaces the value.
4. **Active default floor** — when active and still `0`, the watcher's
   configured `default_active_enum` applies (e.g. **stash = 1**); a non-zero
   entry enum always wins.

---

## Configuring a watcher

New watchers are **v3** and choose their axes explicitly in the config flow
(nothing is guessed from entity names):

- `name`, `source_entity`
- `media_type`, `context`, `signal_type`
- optional `source_app` (e.g. Netflix / Plex / Jellyfin)
- optional `default_active_enum` (stash ⇒ `1`)
- optional `online_entity` (availability gate)
- optional `artist_attribute` (music)
- optional `inactive_values` (extra raw values treated as "nothing playing", e.g. `No Game`)
- optional `artwork_entity_id` / `artwork_attribute` (live cover, default `entity_picture`)
- `scope` (same value on two HA instances = shared catalog)

### Examples

| Source | media_type | context | signal_type | extra |
|---|---|---|---|---|
| HomePod | `music` | `homepod` | `title` | |
| PC (Discord) game | `game` | `pc` | `title` | |
| PS5 | `game` | `ps5` | `title` | |
| Switch | `game` | `switch` | `title` | |
| Stash | `video` | `stash` | `title` | `default_active_enum=1` |
| Apple TV — Netflix (app only) | `video` | `apple_tv` | `app` | `source_app=Netflix` |
| Apple TV — Jellyfin/Plex (real title) | `video` | `apple_tv` | `title` | `source_app=Jellyfin`/`Plex` |

A music watcher with a resolvable artist forms the key `"Artist - Title"`.

---

## Entities (per v3 watcher)

- `sensor.title_classifier_<name>_enum` — the **effective enum** (`0`–`9`).
  Offline ⇒ `0` (never `unavailable`). This is the stable automation contract.
- `sensor.title_classifier_<name>_raw` — the current key.
- `sensor.title_classifier_<name>_catalog` — diagnostic counts.

Each sensor exposes `media_type` / `context` / `signal_type` / `source_app` /
`artwork` as attributes.

---

## Database

A **dedicated** Postgres database (never the recorder DB). The integration
creates its tables idempotently on setup; the database itself must already
exist. The legacy generic `catalog_entry` table is **never** dropped.

- `tc_v3_catalog` — one row per entry; identity `UNIQUE(scope, media_type,
  signal_type, normalized_key)`; surrogate `id uuid` generated in Python (no
  `gen_random_uuid()` dependency); `parent_id` self-reference.
- `tc_v3_entry_context` — observation + override per `(entry_id, context,
  source_app)`; `enum_override`, per-context telemetry.
- Real-time sync via `NOTIFY tc_v3_change`.

A single **DB hub** config entry holds the shared connection (host/port/db/user/
password); every watcher reuses it.

> Artwork is **live-only** — resolved from the source/dedicated entity and never
> stored in Postgres. No image bytes, no blob columns, no cover archive.

---

## WebSocket / API

Namespace `title_classifier/v3/*` (a minimal sidebar panel at
`/title_classifier_v3` uses it):

- **read:** `list_sources`, `list_entries` (filters: `media_type`, `search`,
  `unclassified`, `include_hidden`, `limit`).
- **classify:** `set_enum`, `set_context_override` (null clears).
- **organise:** `group` / `ungroup` (one-level guard), `rename_entry`,
  `set_media_type` (identity reclassify — blocks on variants), `set_context`
  (move/merge), `set_hidden`, `delete_entry`.
- **io:** `export_entries` / `import_entries` — image-free v3 JSON.

Entries carry `media_type`, `context`, `signal_type`, `effective_enum`,
`is_current`, `variants[]`, `hidden`. Hidden entries are normally invisible but
shown while currently playing (`is_current` override).

---

## Legacy (v1/v2)

Earlier versions persisted each watcher in `.storage/title_classifier_entries_<entry_id>`
(JSON) and used a `category`/`platform`/`watcher_type` model. **That is the
legacy path.** v3 is a hard cut to Postgres with the media-centric model above;
v2 watchers keep working alongside v3 until you retire them, but new work should
use v3 watchers. No data migration is required.

---

## Versioning / breaking changes

- **v3 is additive on release** — v2 watchers continue to run; v3 watchers write
  only `tc_v3_*`. There are no double writes and `catalog_entry` is untouched.
- **Breaking direction:** the canonical persistence and model changed
  (`.storage`/category → Postgres/media_type+context+signal_type). Downstream
  consumers should read the v3 enum sensors (slug-stable). The final cutover
  (removing v2 watchers and re-pointing consumers) is a deliberate, separate
  step.

## Integration metadata

- Domain: `title_classifier`
- Repository: `https://github.com/Levtos/Title_classifier`
- Sidebar (v3): `/title_classifier_v3` · WebSocket namespace: `title_classifier/v3/...`
- Requirement: `asyncpg`
