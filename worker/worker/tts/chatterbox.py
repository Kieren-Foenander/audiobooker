from __future__ import annotations

from worker.db import JobRow


def synthesize(text: str, reference_audio_path: str) -> str:
    """Generate speech with Chatterbox and return the output audio path."""
    raise NotImplementedError(
        "Chatterbox synthesis is not implemented yet — install chatterbox and wire up here"
    )


def synthesize_for_segment(job: JobRow) -> dict:
    _ = job
    raise NotImplementedError
