"""Live artwork resolution for v3 watchers (FLEET-199).

Pure, HA-free. Artwork is **live-only** — never stored in Postgres, never image
bytes. We only resolve a reference/URL the HA frontend can render for the
currently-playing source; the UI shows a fallback icon when there is none.

Resolution:
  1. a dedicated ``artwork_entity_id`` attribute (``artwork_attribute``,
     default ``entity_picture``), if configured;
  2. otherwise the source entity's own picture/image attributes.

Both absolute URLs (``http(s)://``) and HA proxy paths (``/api/...``) are
accepted — the frontend serves the latter.
"""

from __future__ import annotations

# Source-entity fallback attributes, in priority order.
SOURCE_ARTWORK_ATTRS: tuple[str, ...] = (
    "entity_picture",
    "media_image_url",
    "entity_picture_local",
)


def _clean_url(value: object) -> str | None:
    if not isinstance(value, str):
        return None
    value = value.strip()
    if not value:
        return None
    if value.startswith(("http://", "https://", "/")):
        return value
    return None


def resolve_artwork_url(
    source_attrs: dict,
    *,
    artwork_attribute: str = "entity_picture",
    artwork_attrs: dict | None = None,
) -> str | None:
    """Return a live artwork URL/reference for the current source, or None.

    ``artwork_attrs`` are the attributes of a dedicated artwork entity (when
    ``artwork_entity_id`` is configured); it wins. Otherwise we fall back to the
    source entity's own picture/image attributes.
    """
    if artwork_attrs is not None:
        url = _clean_url(artwork_attrs.get(artwork_attribute))
        if url is not None:
            return url
    # Fallback chain on the source entity. If a custom attribute name was given
    # and it lives on the source itself, honour it first.
    if artwork_attribute not in SOURCE_ARTWORK_ATTRS:
        url = _clean_url(source_attrs.get(artwork_attribute))
        if url is not None:
            return url
    for attr in SOURCE_ARTWORK_ATTRS:
        url = _clean_url(source_attrs.get(attr))
        if url is not None:
            return url
    return None
