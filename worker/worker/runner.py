from __future__ import annotations

from typing import Callable

from worker.db import JobRow, mark_job_completed, mark_job_failed, mark_job_running
from worker.jobs.analyze_chapter import analyze_chapter
from worker.jobs.export_chapter import export_chapter
from worker.jobs.extract_reference_clip import extract_reference_clip
from worker.jobs.fetch_voice_source import fetch_voice_source
from worker.jobs.synthesize_segment import synthesize_segment

JobHandler = Callable[[JobRow], dict]

JOB_HANDLERS: dict[str, JobHandler] = {
    "fetch_voice_source": fetch_voice_source,
    "extract_reference_clip": extract_reference_clip,
    "analyze_chapter": analyze_chapter,
    "synthesize_segment": synthesize_segment,
    "export_chapter": export_chapter,
}


def run_job(job_id: str) -> None:
    from worker.db import get_job

    job = get_job(job_id)
    if job is None:
        raise ValueError(f"Job not found: {job_id}")

    handler = JOB_HANDLERS.get(job.type)
    if handler is None:
        mark_job_failed(job_id, f"Unknown job type: {job.type}")
        raise ValueError(f"Unknown job type: {job.type}")

    mark_job_running(job_id)

    try:
        result = handler(job)
    except Exception as exc:  # noqa: BLE001 - persist worker failures to jobs table
        mark_job_failed(job_id, str(exc))
        raise

    mark_job_completed(job_id, result)
