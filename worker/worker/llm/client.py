from __future__ import annotations

import json
from typing import Any

import urllib.error
import urllib.request

from worker.config import repo_root


OLLAMA_URL = "http://127.0.0.1:11434"
DEFAULT_MODEL = "qwen2.5:7b-instruct"


def chat(prompt: str, model: str = DEFAULT_MODEL) -> str:
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": False,
        "format": "json",
    }

    request = urllib.request.Request(
        f"{OLLAMA_URL}/api/chat",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=600) as response:
            body: dict[str, Any] = json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as exc:
        raise RuntimeError(
            "Ollama is not reachable. Start it with `ollama serve` and pull "
            f"`{DEFAULT_MODEL}`."
        ) from exc

    message = body.get("message", {})
    content = message.get("content")
    if not isinstance(content, str):
        raise RuntimeError("Ollama returned an unexpected response shape")

    return content


def load_prompt(name: str) -> str:
    prompt_path = repo_root() / "worker" / "worker" / "llm" / "prompts" / f"{name}.txt"
    return prompt_path.read_text(encoding="utf-8")
