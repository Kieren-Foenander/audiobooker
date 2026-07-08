from __future__ import annotations

from worker.db import JobRow


def synthesize_segment(job: JobRow) -> dict:
    """Generate audio for a single segment via Chatterbox.

    Expected payload: { "segmentId": string }
    """
    raise NotImplementedError(
        "synthesize_segment is not implemented yet — wire up Chatterbox here"
    )
