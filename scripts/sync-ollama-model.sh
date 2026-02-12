#!/usr/bin/env bash
set -euo pipefail

MODEL_NAME="${1:-${OLLAMA_APP_BUILDER_MODEL:-qwen2.5-coder:32b}}"
EXPORT_PATH="${2:-./artifacts/${MODEL_NAME//[:\/]/_}.tar.gz}"
OLLAMA_MODELS_DIR="${OLLAMA_MODELS_DIR:-$HOME/.ollama/models}"

if ! command -v ollama >/dev/null 2>&1; then
  echo "ollama CLI not found. Install ollama first." >&2
  exit 1
fi

mkdir -p "$(dirname "$EXPORT_PATH")"

echo "Pulling model: $MODEL_NAME"
ollama pull "$MODEL_NAME"

if [[ ! -d "$OLLAMA_MODELS_DIR" ]]; then
  echo "Ollama models directory not found: $OLLAMA_MODELS_DIR" >&2
  exit 1
fi

echo "Packing local ollama model store from: $OLLAMA_MODELS_DIR"
tar -czf "$EXPORT_PATH" -C "$OLLAMA_MODELS_DIR" .

echo "Model store artifact ready: $EXPORT_PATH"
if [[ -n "${STORAGE_UPLOAD_COMMAND:-}" ]]; then
  echo "Uploading with STORAGE_UPLOAD_COMMAND..."
  # Example: STORAGE_UPLOAD_COMMAND='aws s3 cp "{file}" s3://my-bucket/ollama/'
  eval "${STORAGE_UPLOAD_COMMAND//\{file\}/$EXPORT_PATH}"
  echo "Upload completed."
else
  echo "No STORAGE_UPLOAD_COMMAND set. Skipping upload."
fi
