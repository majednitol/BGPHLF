#!/bin/bash
set -euo pipefail

KEY_DIR="${KEY_DIR:-/app/keys}"
DATA_DIR="${DATA_DIR:-/data}"

PRIVATE_KEY="$KEY_DIR/private.pem"
CERTIFICATE="$KEY_DIR/cert.pem"
INPUT_FILE="$DATA_DIR/roas.json"
SIGNATURE_FILE="$DATA_DIR/roas.json.sig"

mkdir -p "$KEY_DIR"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

if [[ ! -f "$PRIVATE_KEY" || ! -f "$CERTIFICATE" ]]; then
  log "[Signer] Keys not found. Generating new self-signed keypair..."
  openssl req -x509 -newkey rsa:4096 \
    -keyout "$PRIVATE_KEY" \
    -out "$CERTIFICATE" \
    -days 365 -nodes \
    -subj "/CN=RPKI Validator"
  log "[Signer] Keypair generated."
fi

if [[ ! -f "$INPUT_FILE" ]]; then
  log "[ERROR] Input ROA file not found at $INPUT_FILE"
  exit 1
fi

log "[Signer] Signing $INPUT_FILE..."

openssl cms -sign \
  -in "$INPUT_FILE" \
  -signer "$CERTIFICATE" \
  -inkey "$PRIVATE_KEY" \
  -outform DER \
  -out "$SIGNATURE_FILE" \
  -nosmimecap \
  -detached \
  -nocerts

log "[Signer] Signature saved to $SIGNATURE_FILE"
