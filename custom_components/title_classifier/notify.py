"""Real-time cross-instance sync via Postgres LISTEN/NOTIFY.

One dedicated listener connection per DSN (shared by all watchers on this
instance). The DB trigger emits ``catalog_change`` on every row change; we
ignore our own writes (echo suppression via ``updated_by`` == instance id) and
fan a remote change out to the matching ``(scope, category)`` runtimes, which
reload just the affected row.
"""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Final

from homeassistant.core import HomeAssistant

from ._lookup import all_runtimes
from .const import DOMAIN
from .db import NOTIFY_CHANNEL

_LOGGER = logging.getLogger(__name__)

DATA_LISTENERS: Final = "catalog_listeners"

_RECONNECT_BACKOFF = (1, 2, 5, 10, 30, 60)  # seconds, last value repeats


class CatalogListener:
    """Holds the dedicated LISTEN connection and dispatches remote changes.

    Survives the LXC dropping the connection: a termination listener triggers
    a backoff reconnect, and on every successful (re)connect every runtime is
    fully reloaded once so we never miss changes made while we were offline.
    """

    def __init__(self, hass: HomeAssistant, dsn: str, instance_id: str) -> None:
        self._hass = hass
        self._dsn = dsn
        self._instance_id = instance_id
        self._conn: Any | None = None
        self._closing = False
        self._reconnect_task: asyncio.Task | None = None

    async def async_start(self) -> None:
        await self._connect()

    async def _connect(self) -> None:
        import asyncpg  # deferred: declared in manifest requirements

        self._conn = await asyncpg.connect(dsn=self._dsn)
        self._conn.add_termination_listener(self._on_terminate)
        await self._conn.add_listener(NOTIFY_CHANNEL, self._on_notify)
        _LOGGER.debug("Listening on '%s'", NOTIFY_CHANNEL)
        # Catch up on anything changed while we were (re)connecting.
        await self._resync()

    async def async_stop(self) -> None:
        self._closing = True
        if self._reconnect_task is not None:
            self._reconnect_task.cancel()
            self._reconnect_task = None
        if self._conn is None:
            return
        try:
            await self._conn.remove_listener(NOTIFY_CHANNEL, self._on_notify)
        except Exception:  # noqa: BLE001 — connection may already be dead
            pass
        finally:
            await self._conn.close()
            self._conn = None

    def _on_terminate(self, _conn: Any) -> None:
        if self._closing or (self._reconnect_task and not self._reconnect_task.done()):
            return
        _LOGGER.warning("Catalog LISTEN connection lost — scheduling reconnect")
        self._conn = None
        self._reconnect_task = self._hass.async_create_background_task(
            self._reconnect_loop(), name="title_classifier_listen_reconnect"
        )

    async def _reconnect_loop(self) -> None:
        attempt = 0
        while not self._closing:
            delay = _RECONNECT_BACKOFF[min(attempt, len(_RECONNECT_BACKOFF) - 1)]
            await asyncio.sleep(delay)
            try:
                await self._connect()
            except Exception as err:  # noqa: BLE001 — keep retrying
                attempt += 1
                _LOGGER.debug("Catalog reconnect attempt %s failed: %s", attempt, err)
                continue
            _LOGGER.info("Catalog LISTEN connection re-established")
            return

    async def _resync(self) -> None:
        for runtime in all_runtimes(self._hass):
            try:
                await runtime.store.async_load()
            except Exception as err:  # noqa: BLE001
                _LOGGER.debug("Resync reload failed for %s: %s", runtime.name, err)
                continue
            runtime.refresh_current_enum()
            runtime.notify_listeners()

    def _on_notify(self, _conn: Any, _pid: int, _channel: str, payload: str) -> None:
        # asyncpg invokes this synchronously in the event loop; hop to a task.
        try:
            data = json.loads(payload)
        except (ValueError, TypeError):
            _LOGGER.debug("Ignoring malformed catalog_change payload: %r", payload)
            return
        if data.get("by") == self._instance_id:
            return  # our own write — already applied locally
        self._hass.async_create_task(self._dispatch(data))

    async def _dispatch(self, data: dict[str, Any]) -> None:
        scope = data.get("scope")
        category = data.get("category")
        key = data.get("key")
        if not key:
            return
        for runtime in all_runtimes(self._hass):
            if runtime.scope == scope and runtime.category == category:
                await runtime.async_handle_remote_change(key)


async def async_ensure_listener(
    hass: HomeAssistant, dsn: str, instance_id: str
) -> None:
    """Start (or refcount) the shared listener for *dsn*."""
    listeners: dict[str, dict[str, Any]] = hass.data.setdefault(DOMAIN, {}).setdefault(
        DATA_LISTENERS, {}
    )
    slot = listeners.get(dsn)
    if slot is None:
        listener = CatalogListener(hass, dsn, instance_id)
        await listener.async_start()
        slot = {"listener": listener, "refs": 0}
        listeners[dsn] = slot
    slot["refs"] += 1


async def async_release_listener(hass: HomeAssistant, dsn: str) -> None:
    """Drop one reference to the listener for *dsn*; stop it when the last goes."""
    listeners: dict[str, dict[str, Any]] = hass.data.get(DOMAIN, {}).get(
        DATA_LISTENERS, {}
    )
    slot = listeners.get(dsn)
    if slot is None:
        return
    slot["refs"] -= 1
    if slot["refs"] <= 0:
        listeners.pop(dsn, None)
        await slot["listener"].async_stop()
