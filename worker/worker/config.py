from __future__ import annotations

import os
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def data_dir() -> Path:
    return Path(os.environ.get("AUDIOBOOKER_DATA_DIR", repo_root() / "data"))


def database_path() -> Path:
    if path := os.environ.get("DATABASE_PATH"):
        return Path(path)
    return data_dir() / "app.db"


def voices_dir() -> Path:
    return data_dir() / "voices"


def audio_dir() -> Path:
    return data_dir() / "audio"


def exports_dir() -> Path:
    return data_dir() / "exports"
