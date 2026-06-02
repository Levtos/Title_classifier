-- Title Classifier — shared media catalog schema (v2).
--
-- Target: a DEDICATED Postgres database on LXC 108 (NOT the recorder DB).
-- The database itself must already exist; this script is applied idempotently
-- by the integration on setup (see db.py:async_apply_schema) and creates only
-- the table, the NOTIFY function and its trigger.
--
-- Identity model
-- --------------
--   PK (scope, category, key)
--     scope    — sharing namespace. Same scope on two HA instances => shared
--                brain; a distinct scope => divergent classification.
--     category — content type: 'music' | 'game' | 'tv' | 'stash'.
--     key      — canonical identity ("Artist - Title" for media, game title
--                for games). NOT the config entry_id (that is instance-local).
--   platform   — 'pc' | 'ps5' | 'switch' | ... — an ATTRIBUTE, not identity.
--                A game is one row regardless of platform (one enum, one cover).
--
-- Column ownership (so two integrations never clobber each other)
-- ---------------------------------------------------------------
--   Title Classifier  -> enum, seen_count, first/last_seen, hidden_at, attrs
--   Media Art Wrapper -> cover_url, cover_source   (column-scoped UPDATE only)

CREATE TABLE IF NOT EXISTS catalog_entry (
    scope        text        NOT NULL DEFAULT 'default',
    category     text        NOT NULL,
    key          text        NOT NULL,
    platform     text,

    -- The only signal downstream logic reacts to.
    enum         smallint    NOT NULL DEFAULT 0,

    -- Attributes used by the MAW resolver query and for display.
    artist       text,
    title        text,
    album        text,
    app_name     text,

    -- Cover reference only — never image bytes (keeps this DB lean).
    cover_url    text,
    cover_source text,

    -- Telemetry.
    first_seen   timestamptz NOT NULL DEFAULT now(),
    last_seen    timestamptz NOT NULL DEFAULT now(),
    seen_count   integer     NOT NULL DEFAULT 0,
    hidden_at    timestamptz,

    -- Instance id of the last writer — used to suppress self-NOTIFY echoes.
    updated_by   text,
    updated_at   timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT catalog_entry_pkey PRIMARY KEY (scope, category, key)
);

-- Fast per-watcher load (WHERE scope = ? AND category = ?).
CREATE INDEX IF NOT EXISTS catalog_entry_scope_cat_idx
    ON catalog_entry (scope, category);

-- Retention sweeps (async_clear_old) order by last_seen.
CREATE INDEX IF NOT EXISTS catalog_entry_last_seen_idx
    ON catalog_entry (last_seen);

-- Resolver work queue: rows still missing a cover.
CREATE INDEX IF NOT EXISTS catalog_entry_missing_cover_idx
    ON catalog_entry (scope, category)
    WHERE cover_url IS NULL;

-- Real-time sync: every row change emits a NOTIFY on 'catalog_change'.
-- Payload carries the row identity plus the writer id; listeners ignore
-- their own writes (echo suppression) and reload just the affected row.
CREATE OR REPLACE FUNCTION catalog_notify() RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify(
        'catalog_change',
        json_build_object(
            'scope',    NEW.scope,
            'category', NEW.category,
            'key',      NEW.key,
            'by',       NEW.updated_by
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS catalog_notify_trg ON catalog_entry;
CREATE TRIGGER catalog_notify_trg
    AFTER INSERT OR UPDATE ON catalog_entry
    FOR EACH ROW EXECUTE FUNCTION catalog_notify();
