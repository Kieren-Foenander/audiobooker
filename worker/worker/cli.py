from __future__ import annotations

import argparse
import sys

from worker.runner import run_job


def main() -> None:
    parser = argparse.ArgumentParser(description="Audiobooker background worker")
    subparsers = parser.add_subparsers(dest="command", required=True)

    run_parser = subparsers.add_parser("run", help="Execute a queued job")
    run_parser.add_argument("--job-id", required=True, help="Job ID from app.db")

    args = parser.parse_args()

    if args.command == "run":
        try:
            run_job(args.job_id)
        except Exception as exc:  # noqa: BLE001 - top-level worker entrypoint
            print(f"Job failed: {exc}", file=sys.stderr)
            raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
