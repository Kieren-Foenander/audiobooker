# Audiobooker

Local multi-voice audiobook studio. Paste a chapter, analyze characters and speaking segments with a local LLM, clone voices from YouTube clips, generate audio with Chatterbox TTS, and play or tweak the timeline.

## Architecture

- **frontend/** — TanStack Start + Drizzle (SQLite via server functions)
- **worker/** — Python subprocess jobs (Ollama, Chatterbox, yt-dlp, ffmpeg)
- **data/** — runtime storage (`app.db`, voices, audio) — gitignored

See [CONTEXT.md](./CONTEXT.md) for domain language.

## Prerequisites

- Node.js 20+ and [pnpm](https://pnpm.io/)
- [uv](https://docs.astral.sh/uv/) for Python
- [Ollama](https://ollama.com/) (for chapter analysis — later)
- `ffmpeg`, `yt-dlp` on PATH (for voice creation — later)

## Getting started

```bash
# Install frontend dependencies
pnpm install

# Generate and apply database migrations
pnpm db:generate
pnpm db:migrate

# Start the app
pnpm dev
```

Open http://localhost:3000

## Useful commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start TanStack Start dev server |
| `pnpm db:generate` | Generate Drizzle migrations from schema |
| `pnpm db:migrate` | Apply migrations to `data/app.db` |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm worker -- --job-id <id>` | Run a worker job manually |

## Project layout

```
audiobooker/
├── CONTEXT.md
├── frontend/          # TanStack Start UI + Drizzle schema
├── worker/            # Python job runner
└── data/              # SQLite + media (created at runtime)
```

## Status

Scaffold only — job handlers are stubbed. Next steps: voice creation flow, chapter analysis, TTS synthesis, timeline playback.
