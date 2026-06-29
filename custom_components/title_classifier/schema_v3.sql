-- Title Classifier — v3 media catalog schema (FLEET-177 / FLEET-193).
--
-- Target: the SAME dedicated Postgres database on LXC 108 used by v2, but a
-- distinct, clearly prefixed table set (`tc_v3_*`). The legacy `catalog_entry`
-- table is NEVER touched or dropped by this script — v3 is a hard cut that
-- lives side by side with the old generic table.
--
-- Applied idempotently by the integration on setup (db.py:async_apply_schema),
-- after the v2 schema.sql. The database itself must already exist.
--
-- Identity model (v3)
-- -------------------
--   The catalog is MEDIA-centric. A song / game / video is ONE row regardless
--   of where it is observed.
--     UNIQUE (scope, media_type, signal_type, normalized_key)
--       scope          — sharing namespace (Benni / Eltern).
--       media_type     — 'music' | 'game' | 'video'.
--       signal_type    — 'title' | 'app' (how the watcher derived the key).
--       normalized_key — canonical identity (catalog_v3.normalize_key).
--   `id` is a surrogate uuid, GENERATED IN PYTHON (uuid4) — there is NO
--   gen_random_uuid() default here, so no pgcrypto/uuid-ossp extension is
--   required on the target DB.
--   `context` (homepod/pc/ps5/switch/stash/apple_tv) is NOT part of identity —
--   it is an observation/override dimension in tc_v3_entry_context.
--
-- Master / variant (Kind)
-- -----------------------
--   parent_id NULL  -> standalone entry OR a master (a master is just an entry
--                      that other rows point at).
--   parent_id set   -> child variant. Exactly ONE level is allowed; the store
--                      (catalog_v3.assert_can_set_parent) enforces that a child
--                      cannot itself be a master and a master-with-children
--                      cannot become a child. Parent shares scope, media_type
--                      and signal_type.

CREATE TABLE IF NOT EXISTS tc_v3_catalog (
    id             uuid        NOT NULL,
    scope          text        NOT NULL DEFAULT 'default',
    media_type     text        NOT NULL,
    signal_type    text        NOT NULL,
    normalized_key text        NOT NULL,
    key            text        NOT NULL,

    -- Master/variant self-reference. ON DELETE SET NULL so deleting a master
    -- promotes its children to standalone entries instead of cascading.
    parent_id      uuid        REFERENCES tc_v3_catalog (id) ON DELETE SET NULL,

    -- The only signal downstream logic reacts to (raw; effective enum is
    -- computed by the resolver, FLEET-194).
    enum           smallint    NOT NULL DEFAULT 0,

    -- Display attributes (no image bytes — artwork is live-only, FLEET-199).
    artist         text,
    title          text,
    album          text,
    app_name       text,

    -- Telemetry.
    first_seen     timestamptz NOT NULL DEFAULT now(),
    last_seen      timestamptz NOT NULL DEFAULT now(),
    seen_count     integer     NOT NULL DEFAULT 0,
    hidden_at      timestamptz,

    -- Instance id of the last writer — used to suppress self-NOTIFY echoes.
    updated_by     text,
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT tc_v3_catalog_pkey PRIMARY KEY (id),
    CONSTRAINT tc_v3_catalog_identity_uniq
        UNIQUE (scope, media_type, signal_type, normalized_key)
);

-- Fast per-watcher load (WHERE scope = ? AND media_type = ?).
CREATE INDEX IF NOT EXISTS tc_v3_catalog_scope_type_idx
    ON tc_v3_catalog (scope, media_type);

-- Variant lookups (children of a master) + master-detection.
CREATE INDEX IF NOT EXISTS tc_v3_catalog_parent_idx
    ON tc_v3_catalog (parent_id);

-- Retention sweeps order by last_seen.
CREATE INDEX IF NOT EXISTS tc_v3_catalog_last_seen_idx
    ON tc_v3_catalog (last_seen);


-- Per-context observation + optional override. A catalog entry is observed in
-- one or more contexts; `source_app` distinguishes e.g. Netflix vs Jellyfin vs
-- Plex on apple_tv. `enum_override` carries the game-context override.
CREATE TABLE IF NOT EXISTS tc_v3_entry_context (
    entry_id        uuid        NOT NULL
        REFERENCES tc_v3_catalog (id) ON DELETE CASCADE,
    context         text        NOT NULL,
    source_app      text        NOT NULL DEFAULT '',

    enum_override   smallint,

    first_seen      timestamptz NOT NULL DEFAULT now(),
    last_seen       timestamptz NOT NULL DEFAULT now(),
    seen_count      integer     NOT NULL DEFAULT 0,

    -- Telemetry only — a watcher is an observer, never an owner.
    last_watcher_id text,

    CONSTRAINT tc_v3_entry_context_pkey PRIMARY KEY (entry_id, context, source_app)
);


-- Real-time sync: both tables emit a NOTIFY on 'tc_v3_change'. Listeners ignore
-- their own writes (echo suppression via `by`) and reload just the affected
-- entry. `kind` tells whether a catalog row or a context row changed.
CREATE OR REPLACE FUNCTION tc_v3_catalog_notify() RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify(
        'tc_v3_change',
        json_build_object(
            'kind',        'catalog',
            'id',          NEW.id,
            'scope',       NEW.scope,
            'media_type',  NEW.media_type,
            'signal_type', NEW.signal_type,
            'by',          NEW.updated_by
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tc_v3_catalog_notify_trg ON tc_v3_catalog;
CREATE TRIGGER tc_v3_catalog_notify_trg
    AFTER INSERT OR UPDATE ON tc_v3_catalog
    FOR EACH ROW EXECUTE FUNCTION tc_v3_catalog_notify();


CREATE OR REPLACE FUNCTION tc_v3_entry_context_notify() RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify(
        'tc_v3_change',
        json_build_object(
            'kind',     'context',
            'id',       NEW.entry_id,
            'context',  NEW.context,
            'by',       NEW.last_watcher_id
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tc_v3_entry_context_notify_trg ON tc_v3_entry_context;
CREATE TRIGGER tc_v3_entry_context_notify_trg
    AFTER INSERT OR UPDATE ON tc_v3_entry_context
    FOR EACH ROW EXECUTE FUNCTION tc_v3_entry_context_notify();
