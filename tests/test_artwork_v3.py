"""Tests for the pure v3 artwork resolver (FLEET-199)."""

from __future__ import annotations

import tc_artwork_v3 as A


def test_dedicated_artwork_entity_attribute_wins():
    url = A.resolve_artwork_url(
        {"entity_picture": "/api/source.png"},
        artwork_attribute="entity_picture",
        artwork_attrs={"entity_picture": "https://cdn/cover.jpg"},
    )
    assert url == "https://cdn/cover.jpg"


def test_falls_back_to_source_entity_picture():
    url = A.resolve_artwork_url(
        {"entity_picture": "/api/media_player_proxy/abc.png"},
        artwork_attribute="entity_picture",
    )
    assert url == "/api/media_player_proxy/abc.png"


def test_source_priority_entity_picture_over_media_image():
    url = A.resolve_artwork_url(
        {
            "media_image_url": "https://cdn/img.jpg",
            "entity_picture": "/api/pic.png",
        },
        artwork_attribute="entity_picture",
    )
    assert url == "/api/pic.png"


def test_media_image_url_used_when_no_entity_picture():
    url = A.resolve_artwork_url(
        {"media_image_url": "https://cdn/img.jpg"},
        artwork_attribute="entity_picture",
    )
    assert url == "https://cdn/img.jpg"


def test_custom_attribute_on_source_is_honoured():
    url = A.resolve_artwork_url(
        {"cover": "https://cdn/custom.png"},
        artwork_attribute="cover",
    )
    assert url == "https://cdn/custom.png"


def test_rejects_non_url_and_empty():
    assert A.resolve_artwork_url({"entity_picture": "not a url"}, artwork_attribute="entity_picture") is None
    assert A.resolve_artwork_url({"entity_picture": "   "}, artwork_attribute="entity_picture") is None
    assert A.resolve_artwork_url({"entity_picture": 123}, artwork_attribute="entity_picture") is None
    assert A.resolve_artwork_url({}, artwork_attribute="entity_picture") is None


def test_dedicated_entity_without_attr_falls_back_to_source():
    url = A.resolve_artwork_url(
        {"entity_picture": "/api/source.png"},
        artwork_attribute="entity_picture",
        artwork_attrs={},  # dedicated entity has no picture → fall back
    )
    assert url == "/api/source.png"
