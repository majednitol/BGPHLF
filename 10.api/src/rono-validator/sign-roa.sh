#!/bin/bash
set -euo pipefail

DATA_DIR="${DATA_DIR:-/app/data}"
INPUT_FILE="$DATA_DIR/roas.json"
OUTPUT_FILE="$DATA_DIR/rpki.json"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

if [[ ! -f "$INPUT_FILE" || "$(jq '.roas | length' "$INPUT_FILE")" -eq 0 ]]; then
  log "[WARN] ROA file missing or empty. Skipping export."
  exit 0
fi

cp "$INPUT_FILE" "$OUTPUT_FILE"
chmod 644 "$OUTPUT_FILE"
log "[Signer] Exported ROA to $OUTPUT_FILE"
