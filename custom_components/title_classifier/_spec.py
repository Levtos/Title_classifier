"""Standalone integration metadata used by tests and documentation."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Final


class ModuleStatus(str, Enum):
    READY = "ready"


@dataclass(frozen=True)
class ModuleSpec:
    module_id: str
    name: str
    description: str
    status: ModuleStatus
    platforms: tuple[str, ...]
    has_panel: bool = False
    has_websocket: bool = False
    has_services: bool = False
    icon: str | None = None


SPEC: Final[ModuleSpec] = ModuleSpec(
    module_id="title_classifier",
    name="Title Classifier",
    description="Stabile Enums aus volatilen Titeln (media / game / activity)",
    status=ModuleStatus.READY,
    platforms=("sensor", "number"),
    has_panel=True,
    has_websocket=True,
    has_services=True,
    icon="mdi:tag-multiple",
)
