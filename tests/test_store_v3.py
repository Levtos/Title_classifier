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
        (rid, scope, mt, st, nkey, key, artist, title, album, app_name, by) = args
        identity = (scope, mt, st, nkey)
        existing_id = self.identity.get(identity)
        if existing_id is not None:
            row = self.catalog[existing_id]
            row["seen_count"] += 1
            row["last_seen"] = _now()
            row["key"] = key
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
            normalized_key=nkey, key=key, enum=0, parent_id=None,
            first_seen=_now(), last_seen=_now(), seen_count=1,
            hidden_at=None, updated_by=by, updated_at=_now(),
        )
        self.catalog[rid] = row
        self.identity[identity] = rid
        return row

    # -- asyncpg surface ---------------------------------------------------
    async def fetchrow(self, query, *args):
        q = query
        if "INSERT INTO tc_v3_catalog" in q:
            return self._new_catalog_row(args)
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
        if "FROM tc_v3_catalog" in query and "scope = $1" in query:
            rows = [r for r in self.catalog.values() if r["scope"] == args[0]]
            if "media_type = ANY" in query:
                allowed = set(args[1])
                rows = [r for r in rows if r["media_type"] in allowed]
            return rows
        if "FROM tc_v3_entry_context WHERE entry_id" in query:
            return [r for r in self.contexts.values() if r["entry_id"] == args[0]]
        raise AssertionError(f"unexpected fetch query: {query[:60]}")

    async def execute(self, query, *args):
        if "INSERT INTO tc_v3_entry_context" in query:  # async_seen observation
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
        raise AssertionError(f"unexpected execute query: {query[:60]}")


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
