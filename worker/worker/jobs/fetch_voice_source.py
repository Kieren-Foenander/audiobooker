from __future__ import annotations

from worker.db import JobRow


def fetch_voice_source(job: JobRow) -> dict:
    """Download audio from a YouTube URL via yt-dlp.

    Expected payload: { "voiceId": string, "url": string }
    """
    raise NotImplementedError(
        "fetch_voice_source is not implemented yet — wire up yt-dlp here"
    )
