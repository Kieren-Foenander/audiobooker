from __future__ import annotations

from worker.db import JobRow


def extract_reference_clip(job: JobRow) -> dict:
    """Trim downloaded source audio into a Chatterbox reference clip.

    Expected payload: {
      "voiceId": string,
      "trimStartMs": number,
      "trimEndMs": number
    }
    """
    raise NotImplementedError(
        "extract_reference_clip is not implemented yet — wire up ffmpeg here"
    )
