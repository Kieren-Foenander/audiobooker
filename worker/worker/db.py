from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any

from worker.config import database_path


@dataclass(frozen=True)
class JobRow:
    id: str
    type: str
    status: str
    payload: dict[str, Any]


def _connect() -> sqlite3.Connection:
    connection = sqlite3.connect(database_path(), timeout=30)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA journal_mode = WAL")
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


@contextmanager
def db_connection():
    connection = _connect()
    try:
        yield connection
        connection.commit()
    finally:
        connection.close()


def get_job(job_id: str) -> JobRow | None:
    with db_connection() as connection:
        row = connection.execute(
            "SELECT id, type, status, payload_json FROM jobs WHERE id = ?",
            (job_id,),
        ).fetchone()

    if row is None:
        return None

    return JobRow(
        id=row["id"],
        type=row["type"],
        status=row["status"],
        payload=json.loads(row["payload_json"] or "{}"),
    )


def mark_job_running(job_id: str) -> None:
    now_ms = int(datetime.now(UTC).timestamp() * 1000)
    with db_connection() as connection:
        connection.execute(
            """
            UPDATE jobs
            SET status = 'running', started_at = ?, error = NULL
            WHERE id = ?
            """,
            (now_ms, job_id),
        )


def mark_job_completed(job_id: str, result: dict[str, Any] | None = None) -> None:
    now_ms = int(datetime.now(UTC).timestamp() * 1000)
    with db_connection() as connection:
        connection.execute(
            """
            UPDATE jobs
            SET status = 'completed', completed_at = ?, result_json = ?, error = NULL
            WHERE id = ?
            """,
            (now_ms, json.dumps(result or {}), job_id),
        )


def mark_job_failed(job_id: str, error: str) -> None:
    now_ms = int(datetime.now(UTC).timestamp() * 1000)
    with db_connection() as connection:
        connection.execute(
            """
            UPDATE jobs
            SET status = 'failed', completed_at = ?, error = ?
            WHERE id = ?
            """,
            (now_ms, error, job_id),
        )
