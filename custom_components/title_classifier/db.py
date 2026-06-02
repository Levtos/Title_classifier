"""Postgres connection management for the shared media catalog.

One asyncpg pool per Home Assistant instance (shared by every watcher), the
idempotent schema bootstrap, and helpers to build the DSN from config-entry
data. The target is a DEDICATED database on LXC 108 — never the recorder DB.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Final

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    CONF_ENTRY_TYPE,
    CONF_HUB_ENTRY_ID,
    DOMAIN,
    ENTRY_TYPE_HUB,
)

_LOGGER = logging.getLogger(__name__)

# Config keys for the connection (set by the config flow in step 3).
CONF_DB_HOST: Final = "db_host"
CONF_DB_PORT: Final = "db_port"
CONF_DB_NAME: Final = "db_name"
CONF_DB_USER: Final = "db_user"
CONF_DB_PASSWORD: Final = "db_password"

DEFAULT_DB_PORT: Final = 5432
DEFAULT_DB_NAME: Final = "media_catalog"

# hass.data slot holding shared pools keyed by DSN: {dsn: {"pool", "refs"}}.
DATA_POOLS: Final = "db_pools"

NOTIFY_CHANNEL: Final = "catalog_change"

_SCHEMA_PATH: Final = Path(__file__).parent / "schema.sql"


def hub_entries(hass: HomeAssistant) -> list[ConfigEntry]:
    """All DB-hub config entries of this integration."""
    return [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.data.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_HUB
    ]


def resolve_db_data(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, Any] | None:
    """Return the DB connection dict for *entry*.

    - hub entry → its own data
    - watcher with ``hub_entry_id`` → the referenced hub's data
    - legacy v2.0.x watcher → its own embedded DB data
    - otherwise None (not configured)
    """
    if entry.data.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_HUB:
        return dict(entry.data)
    hub_id = entry.data.get(CONF_HUB_ENTRY_ID)
    if hub_id:
        hub = hass.config_entries.async_get_entry(hub_id)
        if hub is not None and hub.data.get(CONF_DB_HOST):
            return dict(hub.data)
        return None
    if entry.data.get(CONF_DB_HOST):
        return dict(entry.data)
    # No explicit reference and no embedded DB: fall back to the single hub
    # (a watcher attaches to it explicitly once the hub finishes setting up).
    hubs = hub_entries(hass)
    if len(hubs) == 1:
        return dict(hubs[0].data)
    return None


def build_dsn(config: dict[str, Any]) -> str:
    """Build a libpq DSN from config-entry data.

    Password is passed via the DSN; asyncpg keeps it in memory only.
    """
    host = config[CONF_DB_HOST]
    port = int(config.get(CONF_DB_PORT, DEFAULT_DB_PORT))
    name = config.get(CONF_DB_NAME, DEFAULT_DB_NAME)
    user = config[CONF_DB_USER]
    password = config.get(CONF_DB_PASSWORD, "")
    return f"postgresql://{user}:{password}@{host}:{port}/{name}"


async def async_get_pool(hass: HomeAssistant, dsn: str) -> Any:
    """Return the shared asyncpg pool for *dsn*, creating it on first use.

    One pool per DSN is reused across all watcher config entries of this
    instance. Callers must pair this with :func:`async_release_pool` on unload.
    """
    import asyncpg  # deferred: declared in manifest requirements

    pools: dict[str, dict[str, Any]] = hass.data.setdefault(DOMAIN, {}).setdefault(
        DATA_POOLS, {}
    )
    slot = pools.get(dsn)
    if slot is None:
        _LOGGER.debug("Creating asyncpg pool for media catalog")
        pool = await asyncpg.create_pool(dsn=dsn, min_size=1, max_size=5)
        slot = {"pool": pool, "refs": 0}
        pools[dsn] = slot
        await async_apply_schema(hass, pool)
    slot["refs"] += 1
    return slot["pool"]


async def async_release_pool(hass: HomeAssistant, dsn: str) -> None:
    """Drop one reference to the pool for *dsn*; close it when the last goes."""
    pools: dict[str, dict[str, Any]] = hass.data.get(DOMAIN, {}).get(DATA_POOLS, {})
    slot = pools.get(dsn)
    if slot is None:
        return
    slot["refs"] -= 1
    if slot["refs"] <= 0:
        _LOGGER.debug("Closing asyncpg pool (last watcher unloaded)")
        pools.pop(dsn, None)
        await slot["pool"].close()


async def async_apply_schema(hass: HomeAssistant, pool: Any) -> None:
    """Apply schema.sql idempotently (CREATE ... IF NOT EXISTS).

    The database must already exist; this only creates the table, the NOTIFY
    function and its trigger. Reading the file is offloaded to the executor.
    """
    sql = await hass.async_add_executor_job(_SCHEMA_PATH.read_text, "utf-8")
    async with pool.acquire() as conn:
        await conn.execute(sql)
    _LOGGER.debug("Media catalog schema applied")
