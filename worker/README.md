# Python worker

Headless job runner for Audiobooker. Invoked by TanStack Start server functions as a subprocess — not an HTTP server.

## Job types

| Type | Purpose |
| --- | --- |
| `fetch_voice_source` | Download audio from YouTube (yt-dlp) |
| `extract_reference_clip` | Trim source audio to a reference clip (ffmpeg) |
| `analyze_chapter` | Single-pass chapter analysis (Ollama + Qwen2.5) |
| `synthesize_segment` | Generate segment audio (Chatterbox) |
| `export_chapter` | Concatenate chapter audio (ffmpeg) |

## Run manually

```bash
cd worker
uv run python -m worker run --job-id <uuid>
```

## Environment

- `DATABASE_PATH` — defaults to `../data/app.db`
- `AUDIOBOOKER_DATA_DIR` — defaults to `../data`

## External dependencies (install when implementing jobs)

- [Ollama](https://ollama.com/) with `qwen2.5:7b-instruct`
- [Chatterbox](https://github.com/resemble-ai/chatterbox)
- `yt-dlp`, `ffmpeg` on PATH
