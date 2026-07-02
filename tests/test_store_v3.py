"""Store-level tests for the v3 catalog (FLEET-193).

A small in-memory FakePool simulates tc_v3_catalog / tc_v3_entry_context just
enough to exercise the real CatalogStoreV3 SQL flows: identity dedupe, the
Python-generated uuid, context observation upserts, and the one-level
master/variant guard end to end. No real Postgres / asyncpg.
"""

from __future__ import annotations

import asyncio
import uuid
from datetime import datetime, timezone
from functools import wraps

import pytest

import tc_catalog_v3 as C
import tc_store_v3 as S


def _run(coro_fn):
    @wraps(coro_fn)
    def _wrapper(*args, **kwargs):
        return asyncio.run(coro_fn(*args, **kwargs))
    return _wrapper


def _now():
    return datetime.now(timezone.utc)


_CAT_KEYS = (
    "id", "scope", "media_type", "signal_type", "normalized_key", "key",
    "parent_id", "enum", "artist", "title", "album", "app_name",
    "first_seen", "last_seen", "seen_count", "hidden_at", "updated_by", "updated_at",
)


class FakePool:
    """Minimal in-memory stand-in for an asyncpg pool used by CatalogStoreV3."""

    def __init__(self):
        self.catalog: dict[str, dict] = {}       # id -> row
        self.identity: dict[tuple, str] = {}     # identity -> id
        self.contexts: dict[tuple, dict] = {}    # (entry_id, ctx, app) -> row

    # -- helpers -----------------------------------------------------------
    def _new_catalog_row(self, args) -> dict:
        (rid, scope, mt, st, nkey, key, enum, artist, title, album, app_name, by) = args
        identity = (scope, mt, st, nkey)
        existing_id = self.identity.get(identity)
        if existing_id is not None:
            row = self.catalog[existing_id]
            row["seen_count"] += 1
            row["last_seen"] = _now()
            row["key"] = key
            # Mirror the ON CONFLICT enum CASE: lift only while unclassified (0),
            # never overwrite a manual enum > 0.
            if row["enum"] == 0:
                row["enum"] = enum
            for col, val in (
                ("artist", artist), ("title", title),
                ("album", album), ("app_name", app_name),
            ):
                if val is not None:
                    row[col] = val
            row["updated_by"] = by
            return row
        row = {k: None for k in _CAT_KEYS}
        row.update(
            id=rid, scope=scope, media_type=mt, signal_type=st,
            normalized_key=nkey, key=key, enum=enum, parent_id=None,
            first_seen=_now(), last_seen=_now(), seen_count=1,
            hidden_at=None, updated_by=by, updated_at=_now(),
        )
        self.catalog[rid] = row
        self.identity[identity] = rid
        return row

    # -- asyncpg surface ---------------------------------------------------
    def _import_upsert(self, args):
        (rid, scope, mt, st, nkey, key, enum, hidden_bool, seen, by) = args
        identity = (scope, mt, st, nkey)
        existing_id = self.identity.get(identity)
        if existing_id is not None:
            row = self.catalog[existing_id]
            row["enum"] = enum
            row["key"] = key
            row["hidden_at"] = _now() if hidden_bool else None
            row["seen_count"] = max(row["seen_count"], seen)
            row["updated_by"] = by
            return {"id": existing_id}
        row = {k: None for k in _CAT_KEYS}
        row.update(
            id=rid, scope=scope, media_type=mt, signal_type=st, normalized_key=nkey,
            key=key, enum=enum, parent_id=None,
            hidden_at=_now() if hidden_bool else None,
            first_seen=_now(), last_seen=_now(), seen_count=seen,
            updated_by=by, updated_at=_now(),
        )
        self.catalog[rid] = row
        self.identity[identity] = rid
        return {"id": rid}

    def _find_identity(self, args):
        scope, mt, st, nkey = args
        eid = self.identity.get((scope, mt, st, nkey))
        return self.catalog.get(eid) if eid else None

    def _reindex(self, row, new_identity):
        old = (row["scope"], row["media_type"], row["signal_type"], row["normalized_key"])
        self.identity.pop(old, None)
        self.identity[new_identity] = row["id"]

    async def fetchrow(self, query, *args):
        q = query
        if "INSERT INTO tc_v3_catalog" in q and "GREATEST(tc_v3_catalog.seen_count" in q:
            return self._import_upsert(args)
        if "INSERT INTO tc_v3_catalog" in q:
            return self._new_catalog_row(args)
        if "AND media_type = $2 AND signal_type = $3 AND normalized_key = $4" in q:
            return self._find_identity(args)
        if "FROM tc_v3_entry_context WHERE entry_id = $1 AND context = $2 AND source_app = $3" in q:
            return self.contexts.get((args[0], args[1], args[2]))
        if "UPDATE tc_v3_catalog" in q and "normalized_key = $3" in q:
            row = self.catalog.get(args[0])
            if row is None:
                return None
            self._reindex(row, (row["scope"], row["media_type"], row["signal_type"], args[2]))
            row["key"] = args[1]
            row["normalized_key"] = args[2]
            row["updated_by"] = args[3]
            return row
        if "UPDATE tc_v3_catalog" in q and "SET key = $2, updated_by = $3" in q:
            row = self.catalog.get(args[0])
            if row is None:
                return None
            row["key"] = args[1]
            row["updated_by"] = args[2]
            return row
        if "UPDATE tc_v3_catalog" in q and "SET media_type = $2" in q:
            row = self.catalog.get(args[0])
            if row is None:
                return None
            self._reindex(row, (row["scope"], args[1], row["signal_type"], row["normalized_key"]))
            row["media_type"] = args[1]
            row["updated_by"] = args[2]
            return row
        if "INSERT INTO tc_v3_entry_context" in q:  # set_context_override (RETURNING)
            entry_id, ctx, app, override, watcher = args
            key = (entry_id, ctx, app)
            row = self.contexts.get(key) or {
                "entry_id": entry_id, "context": ctx, "source_app": app,
                "enum_override": None, "first_seen": _now(), "last_seen": _now(),
                "seen_count": 0, "last_watcher_id": None,
            }
            row["enum_override"] = override
            row["last_watcher_id"] = watcher
            self.contexts[key] = row
            return row
        if "FROM tc_v3_catalog WHERE id = $1" in q:
            return self.catalog.get(args[0])
        if "WHERE parent_id = $1 LIMIT 1" in q:
            for row in self.catalog.values():
                if row["parent_id"] == args[0]:
                    return {"?column?": 1}
            return None
        if "UPDATE tc_v3_catalog" in q and "parent_id = NULL" in q:
            row = self.catalog.get(args[0])
            if row is None:
                return None
            row["parent_id"] = None
            row["updated_by"] = args[1]
            return row
        if "UPDATE tc_v3_catalog" in q and "parent_id = $2" in q:
            row = self.catalog.get(args[0])
            if row is None:
                return None
            row["parent_id"] = args[1]
            row["updated_by"] = args[2]
            return row
        if "UPDATE tc_v3_catalog" in q and "SET enum" in q:
            row = self.catalog.get(args[0])
            if row is None:
                return None
            row["enum"] = args[1]
            if args[1] != 0:
                row["hidden_at"] = None
            row["updated_by"] = args[2]
            return row
        if "DELETE FROM tc_v3_catalog" in q:
            row = self.catalog.pop(args[0], None)
            if row is None:
                return None
            self.identity.pop(
                (row["scope"], row["media_type"], row["signal_type"],
                 row["normalized_key"]), None,
            )
            return {"id": args[0]}
        raise AssertionError(f"unexpected fetchrow query: {q[:60]}")

    async def fetch(self, query, *args):
        if "FROM tc_v3_catalog WHERE parent_id = $1" in query:
            return [r for r in self.catalog.values() if r["parent_id"] == args[0]]
        if "FROM tc_v3_catalog" in query and "scope = $1" in query:
            rows = [r for r in self.catalog.values() if r["scope"] == args[0]]
            if "media_type = ANY" in query:
                allowed = set(args[1])
                rows = [r for r in rows if r["media_type"] in allowed]
            return rows
        if "FROM tc_v3_entry_context" in query and "entry_id = ANY" in query:
            ids = set(args[0])
            return [r for r in self.contexts.values() if r["entry_id"] in ids]
        if "FROM tc_v3_entry_context WHERE entry_id" in query:
            return [r for r in self.contexts.values() if r["entry_id"] == args[0]]
        raise AssertionError(f"unexpected fetch query: {query[:60]}")

    async def execute(self, query, *args):
        q = query
        if "INSERT INTO tc_v3_entry_context" in q and "GREATEST(tc_v3_entry_context.seen_count" in q:
            entry_id, ctx, app, override, seen, by = args
            key = (entry_id, ctx, app)
            row = self.contexts.get(key)
            if row is None:
                self.contexts[key] = {
                    "entry_id": entry_id, "context": ctx, "source_app": app,
                    "enum_override": override, "first_seen": _now(),
                    "last_seen": _now(), "seen_count": seen, "last_watcher_id": by,
                }
            else:
                row["enum_override"] = override
                row["seen_count"] = max(row["seen_count"], seen)
            return
        if "INSERT INTO tc_v3_entry_context" in q:  # async_seen observation
            entry_id, ctx, app, watcher = args
            key = (entry_id, ctx, app)
            row = self.contexts.get(key)
            if row is None:
                self.contexts[key] = {
                    "entry_id": entry_id, "context": ctx, "source_app": app,
                    "enum_override": None, "first_seen": _now(),
                    "last_seen": _now(), "seen_count": 1, "last_watcher_id": watcher,
                }
            else:
                row["seen_count"] += 1
                row["last_seen"] = _now()
                row["last_watcher_id"] = watcher
            return
        if "DELETE FROM tc_v3_entry_context" in q:
            self.contexts.pop((args[0], args[1], args[2]), None)
            return
        if "UPDATE tc_v3_entry_context SET context = $4" in q:
            entry_id, context, app, new_context, new_app = args
            row = self.contexts.pop((entry_id, context, app), None)
            if row is not None:
                row["context"] = new_context
                row["source_app"] = new_app
                self.contexts[(entry_id, new_context, new_app)] = row
            return
        if "UPDATE tc_v3_entry_context" in q and "SET seen_count = $4" in q:
            entry_id, new_context, new_app, seen, first, last, override = args
            row = self.contexts.get((entry_id, new_context, new_app))
            if row is not None:
                row["seen_count"] = seen
                row["first_seen"] = first
                row["last_seen"] = last
                row["enum_override"] = override
            return
        raise AssertionError(f"unexpected execute query: {q[:60]}")


def _store():
    return S.CatalogStoreV3(FakePool(), scope="default", instance_id="inst-A")


# --------------------------------------------------------------------- seen


@_run
async def test_seen_creates_entry_with_python_uuid_and_context():
    store = _store()
    entry = await store.async_seen(
        media_type="game", signal_type="title", key="Astro Bot",
        context="ps5", watcher_id="w-ps5",
    )
    # id is a real uuid4 generated in Python.
    assert uuid.UUID(entry.id).version == 4
    assert entry.identity == ("default", "game", "title", "astro bot")
    assert entry.seen_count == 1
    # Context observation was written.
    ctxs = await store.async_contexts_for(entry.id)
    assert [(c.context, c.seen_count) for c in ctxs] == [("ps5", 1)]


@_run
async def test_seen_dedupes_by_identity_across_contexts():
    store = _store()
    first = await store.async_seen(
        media_type="game", signal_type="title", key="Overwatch", context="pc",
    )
    second = await store.async_seen(
        media_type="game", signal_type="title", key="Overwatch", context="ps5",
    )
    # Same catalog row (one game across contexts), seen_count incremented.
    assert first.id == second.id
    assert second.seen_count == 2
    ctxs = await store.async_contexts_for(first.id)
    assert {c.context for c in ctxs} == {"pc", "ps5"}


@_run
async def test_seen_validates_vocabulary():
    store = _store()
    with pytest.raises(ValueError):
        await store.async_seen(
            media_type="tv", signal_type="title", key="X", context="apple_tv",
        )


# ------------------------------------------------------ stash default enum (#5)


@_run
async def test_seen_stash_new_entry_seeded_active():
    """A brand-new stash sighting is stored at the stash floor (>0), never 0 —
    stash titles must not clutter the Inbox as unclassified."""
    store = _store()
    entry = await store.async_seen(
        media_type="video", signal_type="title", key="Some Scene", context="stash",
    )
    assert entry.enum == C.STASH_DEFAULT_ACTIVE_ENUM
    assert entry.enum > 0


@_run
async def test_seen_non_stash_new_entry_stays_zero():
    """Non-stash sightings keep the classic semantics: new entry = enum 0."""
    store = _store()
    entry = await store.async_seen(
        media_type="music", signal_type="title", key="Track", context="homepod",
    )
    assert entry.enum == 0


@_run
async def test_seen_stash_does_not_overwrite_manual_enum():
    """A manually classified enum > 0 is never overwritten by a later stash
    sighting."""
    store = _store()
    entry = await store.async_seen(
        media_type="video", signal_type="title", key="Scene", context="stash",
    )
    await store.async_set_enum(entry.id, 3)
    reseen = await store.async_seen(
        media_type="video", signal_type="title", key="Scene", context="stash",
    )
    assert reseen.enum == 3  # manual value preserved


@_run
async def test_seen_stash_lifts_existing_unclassified_zero():
    """An entry first seen elsewhere at enum 0 gets lifted to the stash floor
    once it is observed in the stash context."""
    store = _store()
    first = await store.async_seen(
        media_type="video", signal_type="title", key="Doc", context="apple_tv",
    )
    assert first.enum == 0
    lifted = await store.async_seen(
        media_type="video", signal_type="title", key="Doc", context="stash",
    )
    assert lifted.id == first.id
    assert lifted.enum == C.STASH_DEFAULT_ACTIVE_ENUM


@_run
async def test_seen_non_stash_reseen_keeps_zero():
    """A non-stash re-sighting must not touch enum (still 0), proving the CASE
    is a no-op outside stash."""
    store = _store()
    first = await store.async_seen(
        media_type="music", signal_type="title", key="Song", context="homepod",
    )
    reseen = await store.async_seen(
        media_type="music", signal_type="title", key="Song", context="homepod",
    )
    assert first.id == reseen.id
    assert reseen.enum == 0


# ----------------------------------------------------------------- set_enum


@_run
async def test_set_enum_clamps_and_updates():
    store = _store()
    entry = await store.async_seen(
        media_type="music", signal_type="title", key="Some Track", context="homepod",
    )
    updated = await store.async_set_enum(entry.id, 42)
    assert updated.enum == 9  # clamped


# ----------------------------------------------------- master / variant guard


@_run
async def test_set_parent_groups_valid_variant():
    store = _store()
    master = await store.async_seen(
        media_type="music", signal_type="title", key="One More Time", context="homepod",
    )
    variant = await store.async_seen(
        media_type="music", signal_type="title",
        key="One More Time (Radio Edit)", context="homepod",
    )
    child = await store.async_set_parent(variant.id, master.id)
    assert child.parent_id == master.id
    assert child.is_variant


@_run
async def test_set_parent_rejects_media_type_mismatch():
    store = _store()
    master = await store.async_seen(
        media_type="music", signal_type="title", key="Track", context="homepod",
    )
    other = await store.async_seen(
        media_type="video", signal_type="title", key="Movie", context="stash",
    )
    with pytest.raises(C.ParentGuardError):
        await store.async_set_parent(other.id, master.id)


@_run
async def test_set_parent_rejects_second_level():
    store = _store()
    grandparent = await store.async_seen(
        media_type="music", signal_type="title", key="A", context="homepod",
    )
    parent = await store.async_seen(
        media_type="music", signal_type="title", key="B", context="homepod",
    )
    child = await store.async_seen(
        media_type="music", signal_type="title", key="Cc", context="homepod",
    )
    await store.async_set_parent(parent.id, grandparent.id)
    # parent is now itself a variant → linking child under it is rejected.
    with pytest.raises(C.ParentGuardError):
        await store.async_set_parent(child.id, parent.id)


@_run
async def test_set_parent_rejects_master_with_children_becoming_child():
    store = _store()
    master = await store.async_seen(
        media_type="music", signal_type="title", key="Master", context="homepod",
    )
    variant = await store.async_seen(
        media_type="music", signal_type="title", key="Variant", context="homepod",
    )
    other = await store.async_seen(
        media_type="music", signal_type="title", key="Other", context="homepod",
    )
    await store.async_set_parent(variant.id, master.id)
    # master now has a child → it cannot become someone else's child.
    with pytest.raises(C.ParentGuardError):
        await store.async_set_parent(master.id, other.id)


@_run
async def test_clear_parent_splits_variant():
    store = _store()
    master = await store.async_seen(
        media_type="music", signal_type="title", key="M", context="homepod",
    )
    variant = await store.async_seen(
        media_type="music", signal_type="title", key="V", context="homepod",
    )
    await store.async_set_parent(variant.id, master.id)
    split = await store.async_clear_parent(variant.id)
    assert split.parent_id is None
    assert not split.is_variant


# ---------------------------------------------------- context override + load


@_run
async def test_set_context_override_roundtrip():
    store = _store()
    entry = await store.async_seen(
        media_type="game", signal_type="title", key="Multi", context="pc",
    )
    ctx = await store.async_set_context_override(entry.id, "ps5", 7)
    assert ctx.enum_override == 7
    assert ctx.context == "ps5"


@_run
async def test_async_load_populates_cache():
    store = _store()
    await store.async_seen(
        media_type="game", signal_type="title", key="G1", context="pc",
    )
    await store.async_seen(
        media_type="music", signal_type="title", key="M1", context="homepod",
    )
    fresh = S.CatalogStoreV3(store._pool, scope="default", instance_id="inst-B")
    await fresh.async_load()
    assert len(fresh.entries) == 2
    await fresh.async_load(media_types=("game",))
    assert {e.media_type for e in fresh.entries.values()} == {"game"}


# ---------------------------------------------------------------- rename


@_run
async def test_rename_changes_key_and_normalized():
    store = _store()
    e = await store.async_seen(
        media_type="game", signal_type="title", key="Astro Bot", context="ps5"
    )
    status, entry = await store.async_rename(e.id, "Astro Bot 2")
    assert status == "ok"
    assert entry.key == "Astro Bot 2"
    assert entry.normalized_key == "astro bot 2"


@_run
async def test_rename_conflict_with_existing_identity():
    store = _store()
    a = await store.async_seen(
        media_type="game", signal_type="title", key="Game A", context="pc"
    )
    b = await store.async_seen(
        media_type="game", signal_type="title", key="Game B", context="pc"
    )
    status, info = await store.async_rename(b.id, "Game A")
    assert status == "conflict"
    assert info == a.id


# ------------------------------------------------- reclassify (set_media_type)


@_run
async def test_reclassify_media_type_ok():
    store = _store()
    e = await store.async_seen(
        media_type="game", signal_type="title", key="X", context="pc"
    )
    status, entry = await store.async_reclassify_media_type(e.id, "video")
    assert status == "ok"
    assert entry.media_type == "video"
    # pc is allowed for video → context kept.
    assert {c.context for c in await store.async_contexts_for(e.id)} == {"pc"}


@_run
async def test_reclassify_prunes_disallowed_context():
    store = _store()
    e = await store.async_seen(
        media_type="game", signal_type="title", key="Y", context="ps5"
    )
    status, _ = await store.async_reclassify_media_type(e.id, "video")
    assert status == "ok"
    # ps5 cannot carry video → context dropped.
    assert await store.async_contexts_for(e.id) == []


@_run
async def test_reclassify_conflict():
    store = _store()
    g = await store.async_seen(
        media_type="game", signal_type="title", key="Dup", context="pc"
    )
    v = await store.async_seen(
        media_type="video", signal_type="title", key="Dup", context="pc"
    )
    status, info = await store.async_reclassify_media_type(g.id, "video")
    assert status == "conflict"
    assert info == v.id


@_run
async def test_reclassify_blocked_for_parent_and_child():
    store = _store()
    master = await store.async_seen(
        media_type="music", signal_type="title", key="M", context="homepod"
    )
    variant = await store.async_seen(
        media_type="music", signal_type="title", key="V", context="homepod"
    )
    await store.async_set_parent(variant.id, master.id)
    assert (await store.async_reclassify_media_type(master.id, "video"))[0] == "has_children"
    assert (await store.async_reclassify_media_type(variant.id, "video"))[0] == "has_parent"


# ----------------------------------------------------- move context (set_context)


@_run
async def test_set_context_move_simple():
    store = _store()
    e = await store.async_seen(
        media_type="game", signal_type="title", key="G", context="pc"
    )
    status, _ = await store.async_move_context(e.id, "pc", "ps5")
    assert status == "ok"
    assert {c.context for c in await store.async_contexts_for(e.id)} == {"ps5"}


@_run
async def test_set_context_not_allowed():
    store = _store()
    e = await store.async_seen(
        media_type="music", signal_type="title", key="Track", context="homepod"
    )
    status, _ = await store.async_move_context(e.id, "homepod", "ps5")
    assert status == "context_not_allowed"


@_run
async def test_set_context_merge_existing_target():
    store = _store()
    e = await store.async_seen(
        media_type="game", signal_type="title", key="G2", context="pc"
    )
    await store.async_set_context_override(e.id, "ps5", 5)
    await store.async_seen(
        media_type="game", signal_type="title", key="G2", context="ps5"
    )
    status, info = await store.async_move_context(e.id, "pc", "ps5")
    assert status == "merged"
    ctxs = {c.context: c for c in await store.async_contexts_for(e.id)}
    assert set(ctxs) == {"ps5"}  # pc merged away
    assert ctxs["ps5"].enum_override == 5  # target override kept (source had none)


# ------------------------------------------------------------ export / import


@_run
async def test_export_is_image_free_with_parent_key():
    store = _store()
    master = await store.async_seen(
        media_type="music", signal_type="title", key="Master", context="homepod"
    )
    variant = await store.async_seen(
        media_type="music", signal_type="title", key="Var", context="homepod"
    )
    await store.async_set_parent(variant.id, master.id)
    payload = await store.async_export()
    blob = repr(payload)
    for bad in ("cover_url", "cover_source", "artwork", "image", "entity_picture"):
        assert bad not in blob
    recs = {r["key"]: r for r in payload["entries"]}
    assert recs["Var"]["parent_key"] == "master"
    assert recs["Master"]["parent_key"] is None


@_run
async def test_import_roundtrip_preserves_enum_and_parent():
    store = _store()
    master = await store.async_seen(
        media_type="music", signal_type="title", key="Mm", context="homepod"
    )
    await store.async_set_enum(master.id, 4)
    variant = await store.async_seen(
        media_type="music", signal_type="title", key="Vv", context="homepod"
    )
    await store.async_set_parent(variant.id, master.id)
    payload = await store.async_export()

    fresh = S.CatalogStoreV3(FakePool(), scope="default", instance_id="imp")
    report = await fresh.async_import(payload["entries"])
    assert report["imported"] == 2
    assert report["rejected"] == 0
    assert report["parent_errors"] == []
    await fresh.async_load()
    by_key = {e.key: e for e in fresh.entries.values()}
    assert by_key["Mm"].enum == 4
    assert by_key["Vv"].parent_id == by_key["Mm"].id


def test_set_enum_casts_enum_param_to_smallint():
    """Guard for the v2.9.1 live bug: async_set_enum reuses the enum param both
    as a smallint column value and in `<> 0` (integer literal). Without an
    explicit ::smallint cast, asyncpg raises AmbiguousParameterError against real
    Postgres. FakePool can't reproduce PG type inference, so we assert the cast
    is present in the source instead."""
    src = open(S.__file__, encoding="utf-8").read()
    assert "$2::smallint <> 0" in src
    assert "WHEN $2 <> 0" not in src


@_run
async def test_set_enum_persists_and_view_reflects_for_active_standalone_music():
    """Regression for the panel 'enum springs back' report: set_enum on a
    standalone music/title entry must persist (enum=1) and list_entries must
    show enum=1 / effective_enum=1 while active. Proves the backend is correct."""
    import tc_api_v3 as A
    import tc_effective_v3 as E

    store = _store()
    e = await store.async_seen(
        media_type="music", signal_type="title",
        key="Marten Lou & Luch - Hideaway", context="homepod",
    )
    updated = await store.async_set_enum(e.id, 1)
    assert updated.enum == 1
    assert updated.parent_id is None  # standalone — no inheritance

    effective = E.resolve_effective_enum(
        media_type="music", context="homepod", active=True,
        base_enum=updated.enum, is_variant=False, parent_enum=None,
        context_override=None, active_default_enum=0,  # homepod ⇒ no floor
    )
    assert effective == 1
    rows = A.select_and_view(store.entries, {e.id: (effective, "homepod", "")})
    row = next(r for r in rows if r["id"] == e.id)
    assert row["enum"] == 1
    assert row["effective_enum"] == 1


@_run
async def test_entry_detail_returns_entry_contexts_and_override():
    store = _store()
    game = await store.async_seen(
        media_type="game", signal_type="title", key="Overwatch", context="pc"
    )
    await store.async_seen(
        media_type="game", signal_type="title", key="Overwatch", context="ps5"
    )
    await store.async_set_context_override(game.id, "ps5", 4)

    detail = await store.async_entry_detail(game.id)
    assert detail is not None
    entry, contexts, parent, children = detail
    assert entry.id == game.id
    assert {c.context for c in contexts} == {"pc", "ps5"}
    overrides = {c.context: c.enum_override for c in contexts}
    assert overrides["ps5"] == 4
    assert overrides["pc"] is None
    assert parent is None
    assert children == []


@_run
async def test_context_rows_for_multiple_entries_one_query():
    store = _store()
    g1 = await store.async_seen(
        media_type="game", signal_type="title", key="G1", context="pc"
    )
    await store.async_seen(
        media_type="game", signal_type="title", key="G1", context="ps5"
    )
    g2 = await store.async_seen(
        media_type="game", signal_type="title", key="G2", context="switch"
    )
    rows = await store.async_context_rows([g1.id, g2.id])
    got = {(r.entry_id, r.context) for r in rows}
    assert got == {(g1.id, "pc"), (g1.id, "ps5"), (g2.id, "switch")}
    assert await store.async_context_rows([]) == []


@_run
async def test_entry_detail_unknown_returns_none():
    store = _store()
    assert await store.async_entry_detail("does-not-exist") is None


@_run
async def test_entry_detail_parent_and_children():
    store = _store()
    master = await store.async_seen(
        media_type="music", signal_type="title", key="Numb", context="homepod"
    )
    variant = await store.async_seen(
        media_type="music", signal_type="title", key="Numb (Live)", context="homepod"
    )
    await store.async_set_parent(variant.id, master.id)

    _, _, m_parent, m_children = await store.async_entry_detail(master.id)
    assert m_parent is None
    assert variant.id in {c.id for c in m_children}

    _, _, v_parent, v_children = await store.async_entry_detail(variant.id)
    assert v_parent is not None and v_parent.id == master.id
    assert v_children == []


@_run
async def test_import_rejects_invalid_records():
    store = _store()
    report = await store.async_import([
        {"key": "Bad", "media_type": "tv", "signal_type": "title"},
        {"key": "Img", "media_type": "music", "signal_type": "title", "cover_url": "http://x"},
    ])
    assert report["imported"] == 0
    assert report["rejected"] == 2
