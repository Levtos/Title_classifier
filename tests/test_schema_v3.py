"""Schema invariants for the reviewed_at migration (control#27).

The schema file is applied verbatim and idempotently on every setup
(db.py:async_apply_schema), so these string-level invariants are the contract:
the column exists for fresh installs, and the backfill for pre-existing
installations runs EXACTLY ONCE (guarded by the column-existence check inside
one DO block) — a later apply must never close entries that are open.
"""

from __future__ import annotations

import os
import re

_SCHEMA = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "custom_components", "title_classifier", "schema_v3.sql",
)


def _schema() -> str:
    with open(_SCHEMA, encoding="utf-8") as fh:
        return fh.read()


def test_create_table_includes_reviewed_at():
    sql = _schema()
    create = sql.split("CREATE TABLE IF NOT EXISTS tc_v3_catalog", 1)[1]
    # A trailing comma anchors the column definition inside CREATE TABLE
    # (the migration's ADD COLUMN line ends with ";" instead).
    assert re.search(r"^\s*reviewed_at\s+timestamptz,", create, re.M), (
        "fresh installs must get the reviewed_at column via CREATE TABLE"
    )


def test_backfill_is_guarded_by_column_existence():
    sql = _schema()
    do_block = re.search(r"DO \$\$(.*?)\$\$;", sql, re.S)
    assert do_block, "expected a DO block for the one-time migration"
    body = do_block.group(1)
    # Guard: only when the column does not exist yet …
    assert "IF NOT EXISTS" in body and "information_schema.columns" in body
    assert "column_name = 'reviewed_at'" in body
    # … add the column and backfill in the SAME conditional block.
    assert "ADD COLUMN reviewed_at timestamptz" in body
    assert "COALESCE(hidden_at, updated_at, now())" in body


def test_backfill_never_runs_unconditionally():
    """No top-level UPDATE of reviewed_at outside the guarded DO block —
    otherwise every schema apply would close legitimately open entries."""
    sql = _schema()
    without_do = re.sub(r"DO \$\$.*?\$\$;", "", sql, flags=re.S)
    assert not re.search(r"UPDATE\s+tc_v3_catalog", without_do, re.I)
