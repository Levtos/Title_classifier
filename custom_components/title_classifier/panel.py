"""Frontend-Panel-Registrierung für Title Classifier.

Sidebar-URL-Path / Static-Path / Custom-Element folgen dem Toolbox-Schema:
- Sidebar:        /title_classifier
- Static path:    /title_classifier/frontend
- Panel JS-URL:   /title_classifier/frontend/title-classifier-panel.js
- Custom-Element: title-classifier-panel
"""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .const import panel_url_path
from .const import DOMAIN, MODULE_ID, PANEL_ICON, PANEL_TITLE

_LOGGER = logging.getLogger(__name__)

_URL_PATH = panel_url_path(MODULE_ID)  # title_classifier
_STATIC_PREFIX = f"/{_URL_PATH}/frontend"

# v3 UX (TC v3.1, FLEET-185): the React/TS app is the primary panel; the old
# minimal panel stays only as a URL-only debug fallback (no sidebar entry).
_URL_PATH_V3 = f"{_URL_PATH}_v3"  # title_classifier_v3
_URL_PATH_V3_DEBUG = f"{_URL_PATH}_v3_debug"  # title_classifier_v3_debug
_PANEL_V3_TITLE = "Title Classifier v3"
_PANEL_V3_ICON = "mdi:tag-multiple-outline"
_V3_APP_JS = "v3-app/title-classifier-v3-app.js"
_V3_DEBUG_JS = "title-classifier-v3-panel.js"


async def _async_register_static(hass: HomeAssistant) -> None:
    """Register the shared frontend static dir once (idempotent on reloads)."""
    frontend_dir = Path(__file__).parent / "frontend"
    if not frontend_dir.exists():
        return
    try:
        await hass.http.async_register_static_paths([
            StaticPathConfig(_STATIC_PREFIX, str(frontend_dir), cache_headers=False)
        ])
    except (RuntimeError, ValueError) as err:
        _LOGGER.debug(
            "title_classifier static path already registered, skipping: %s", err
        )


async def _version_tag(hass: HomeAssistant) -> str:
    try:
        integration = await async_get_integration(hass, DOMAIN)
        return str(integration.version or "dev")
    except Exception:  # noqa: BLE001 — fall back to a static tag
        return "dev"


def _remove_panel_if_present(hass: HomeAssistant, url_path: str) -> None:
    panels = hass.data.get("frontend_panels") or {}
    if url_path in panels:
        try:
            frontend.async_remove_panel(hass, url_path)
        except Exception:  # noqa: BLE001 — frontend has no narrow error class.
            _LOGGER.debug("panel %s already absent during cleanup", url_path)


async def async_register_v3_panel(hass: HomeAssistant) -> None:
    """Register the v3 React/TS UX panel (primary) idempotently.

    The minimal vanilla panel is also registered, but URL-only (no sidebar entry)
    as a debug fallback under /title_classifier_v3_debug.
    """
    frontend_dir = Path(__file__).parent / "frontend"
    if not (frontend_dir / _V3_APP_JS).exists():
        return
    await _async_register_static(hass)
    version = await _version_tag(hass)

    # Primary: React app → sidebar "Title Classifier v3".
    _remove_panel_if_present(hass, _URL_PATH_V3)
    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=_PANEL_V3_TITLE,
        sidebar_icon=_PANEL_V3_ICON,
        frontend_url_path=_URL_PATH_V3,
        require_admin=True,
        config={
            "_panel_custom": {
                "name": "title-classifier-v3-app",
                "embed_iframe": False,
                "trust_external": False,
                "js_url": f"{_STATIC_PREFIX}/{_V3_APP_JS}?v={version}",
            }
        },
    )

    # Debug fallback: minimal panel, URL-only (sidebar_title=None → no sidebar spam).
    if (frontend_dir / _V3_DEBUG_JS).exists():
        _remove_panel_if_present(hass, _URL_PATH_V3_DEBUG)
        frontend.async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title=None,
            sidebar_icon=None,
            frontend_url_path=_URL_PATH_V3_DEBUG,
            require_admin=True,
            config={
                "_panel_custom": {
                    "name": "title-classifier-v3-panel",
                    "embed_iframe": False,
                    "trust_external": False,
                    "js_url": f"{_STATIC_PREFIX}/{_V3_DEBUG_JS}?v={version}",
                }
            },
        )


async def async_register_panel(hass: HomeAssistant) -> None:
    """Register the title-classifier sidebar panel idempotently.

    Reloads of the integration leave the panel + static path registered
    on the running HA instance. Re-registering the static path raises,
    and `async_register_built_in_panel` logs a "Overwriting panel"
    warning. We guard both calls so reloads stay clean:

    - static path: try once, swallow the duplicate-registration error
      (the existing registration is still serving the correct dir).
    - panel: if a panel with our `frontend_url_path` already exists,
      remove it first and re-register so the metadata (title/icon)
      stays in sync with the current code.
    """
    frontend_dir = Path(__file__).parent / "frontend"
    if not frontend_dir.exists():
        return

    try:
        await hass.http.async_register_static_paths([
            StaticPathConfig(_STATIC_PREFIX, str(frontend_dir), cache_headers=False)
        ])
    except (RuntimeError, ValueError) as err:
        # HA raises `RuntimeError` on duplicate static path. The
        # previous registration is still good — nothing to do.
        _LOGGER.debug(
            "title_classifier static path already registered, skipping: %s", err
        )

    panels = hass.data.get("frontend_panels") or {}
    if _URL_PATH in panels:
        # Remove the stale registration first so the re-register
        # below doesn't emit the "Overwriting panel" warning.
        try:
            frontend.async_remove_panel(hass, _URL_PATH)
        except Exception:  # noqa: BLE001 — frontend has no narrow error class.
            _LOGGER.debug(
                "title_classifier panel already absent during cleanup"
            )

    # Cache-bust the panel JS with the integration version. Custom-panel ES
    # modules are cached aggressively by the browser under their URL; without a
    # changing query param an update keeps running the old frontend (e.g. a perf
    # fix never takes effect even after a hard refresh).
    try:
        integration = await async_get_integration(hass, DOMAIN)
        version = str(integration.version or "dev")
    except Exception:  # noqa: BLE001 — fall back to a static tag
        version = "dev"

    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        frontend_url_path=_URL_PATH,
        require_admin=True,
        config={
            "_panel_custom": {
                "name": "title-classifier-panel",
                "embed_iframe": False,
                "trust_external": False,
                "js_url": f"{_STATIC_PREFIX}/title-classifier-panel.js?v={version}",
            }
        },
    )
