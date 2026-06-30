"""Load HA-free helpers of title_classifier for unit-test purposes.

We exercise the pure key-extraction / duplicate-resolution helpers in
runtime.py and the MapperEntry dataclass / is_hidden logic in storage.py.
Both files import HA at module level, so we monkey-patch the minimum
attributes we need before importing them.
"""

from __future__ import annotations

import importlib.util
import os
import sys
import types
from datetime import datetime, timezone


# Stub `homeassistant.util.dt` with the pieces runtime/storage use.
def _make_stub_homeassistant() -> None:
    ha = types.ModuleType("homeassistant")
    ha.__path__ = []  # mark as package so submodule imports work

    ha_util = types.ModuleType("homeassistant.util")
    ha_util.__path__ = []
    ha_dt = types.ModuleType("homeassistant.util.dt")
    ha_dt.UTC = timezone.utc

    def utcnow():
        return datetime.now(timezone.utc)

    ha_dt.utcnow = utcnow

    ha_core = types.ModuleType("homeassistant.core")
    ha_core.HomeAssistant = object
    ha_core.Event = object
    ha_core.State = object

    def _cb(fn):
        return fn

    ha_core.callback = _cb

    ha_helpers = types.ModuleType("homeassistant.helpers")
    ha_helpers.__path__ = []
    ha_helpers_storage = types.ModuleType("homeassistant.helpers.storage")

    class _Store:
        def __init__(self, *_a, **_kw):
            pass

        async def async_load(self):
            return None

        async def async_save(self, _data):
            pass

    ha_helpers_storage.Store = _Store

    sys.modules.setdefault("homeassistant", ha)
    sys.modules.setdefault("homeassistant.util", ha_util)
    sys.modules.setdefault("homeassistant.util.dt", ha_dt)
    sys.modules.setdefault("homeassistant.core", ha_core)
    sys.modules.setdefault("homeassistant.helpers", ha_helpers)
    sys.modules.setdefault("homeassistant.helpers.storage", ha_helpers_storage)


_make_stub_homeassistant()


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PKG_DIR = os.path.join(ROOT, "custom_components", "title_classifier")

pkg_name = "tc_pure_pkg"
pkg = types.ModuleType(pkg_name)
pkg.__path__ = [PKG_DIR]
sys.modules[pkg_name] = pkg


def _load(modname: str, filename: str):
    spec = importlib.util.spec_from_file_location(
        f"{pkg_name}.{modname}", os.path.join(PKG_DIR, filename)
    )
    mod = importlib.util.module_from_spec(spec)
    sys.modules[f"{pkg_name}.{modname}"] = mod
    spec.loader.exec_module(mod)
    return mod


const = _load("const", "const.py")

# storage.py imports `make_store` from the standalone storage helper; we don't
# exercise the actual disk store in these tests, so stub the import target.
_storage_helper = types.ModuleType("tc_pure_pkg.storage_helper")
_storage_helper.make_store = lambda *a, **kw: None
sys.modules["tc_pure_pkg.storage_helper"] = _storage_helper

storage = _load("storage", "storage.py")
sys.modules["tc_const"] = const
sys.modules["tc_storage"] = storage

# Hand-craft a pure-Python copy of runtime helpers so HA bindings are not
# needed. We only use the pure helpers exported at module level: clean_value,
# split_media_key, normalise_artist, normalise_title, media_keys_match,
# media_title_score, media_artist_score, media_key_score, normalise_user_key.

# Easiest route: load runtime.py with HA stubbed too. The class WatcherRuntime
# itself can't run without HA, but its module body imports HA. We stub.

_fake_exceptions = types.ModuleType("homeassistant.exceptions")


class _SVE(Exception):
    pass


_fake_exceptions.ServiceValidationError = _SVE
sys.modules.setdefault("homeassistant.exceptions", _fake_exceptions)


def _load_runtime_with_stubs():
    path = os.path.join(PKG_DIR, "runtime.py")
    src = open(path, encoding="utf-8").read()
    # Drop HA imports that have no easy stub.
    src = src.replace(
        "from homeassistant.config_entries import ConfigEntry", ""
    )
    src = src.replace(
        "from homeassistant.const import CONF_NAME", "CONF_NAME = 'name'"
    )
    src = src.replace(
        "from homeassistant.core import Event, HomeAssistant, State, callback",
        "Event = HomeAssistant = State = object\n"
        "def callback(fn): return fn",
    )
    src = src.replace(
        "from homeassistant.helpers.event import async_track_state_change_event",
        "async_track_state_change_event = lambda *a, **kw: lambda: None",
    )
    src = src.replace(
        "from .storage import MapperStore", "MapperStore = object"
    )
    mod = types.ModuleType(f"{pkg_name}.runtime")
    sys.modules[f"{pkg_name}.runtime"] = mod
    exec(compile(src, path, "exec"), mod.__dict__)
    return mod


runtime = _load_runtime_with_stubs()
sys.modules["tc_runtime"] = runtime

# v3 catalog core (FLEET-193): catalog_v3 is HA-free; store_v3 only imports it
# plus stdlib, so both load directly via the same package loader.
catalog_v3 = _load("catalog_v3", "catalog_v3.py")
sys.modules["tc_catalog_v3"] = catalog_v3
store_v3 = _load("store_v3", "store_v3.py")
sys.modules["tc_store_v3"] = store_v3
effective_v3 = _load("effective", "effective.py")
sys.modules["tc_effective_v3"] = effective_v3
feeder_v3 = _load("feeder_v3", "feeder_v3.py")
sys.modules["tc_feeder_v3"] = feeder_v3
api_v3 = _load("api_v3", "api_v3.py")
sys.modules["tc_api_v3"] = api_v3
