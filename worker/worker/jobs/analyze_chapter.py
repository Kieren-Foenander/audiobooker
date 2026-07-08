from __future__ import annotations

from worker.db import JobRow


def analyze_chapter(job: JobRow) -> dict:
    """Analyze chapter prose via Ollama and write characters + segments.

    Expected payload: { "chapterId": string }
    """
    raise NotImplementedError(
        "analyze_chapter is not implemented yet — wire up Ollama + Qwen2.5 here"
    )
