from __future__ import annotations

from worker.db import JobRow


def export_chapter(job: JobRow) -> dict:
    """Concatenate segment audio into a single exported chapter file.

    Expected payload: { "chapterId": string }
    """
    raise NotImplementedError(
        "export_chapter is not implemented yet — wire up ffmpeg concat here"
    )
