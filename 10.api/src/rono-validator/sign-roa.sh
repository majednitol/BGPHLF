#!/bin/bash
set -euo pipefail

KEY_DIR="${KEY_DIR:-/app/data/keys}"
DATA_DIR="${DATA_DIR:-/app/data}"

PRIVATE_KEY="$KEY_DIR/private.pem"
CERTIFICATE="$KEY_DIR/cert.pem"
CERT_DER="$KEY_DIR/cert.der"
INPUT_FILE="$DATA_DIR/roas.json"
SIGNATURE_FILE="$DATA_DIR/roas.json.sig"

mkdir -p "$KEY_DIR"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# Generate cert/key if not exist
if [[ ! -f "$PRIVATE_KEY" || ! -f "$CERTIFICATE" ]]; then
  log "[Signer] Keys not found. Generating new self-signed keypair..."
  openssl req -x509 -newkey rsa:4096 \
    -keyout "$PRIVATE_KEY" \
    -out "$CERTIFICATE" \
    -days 365 -nodes \
    -subj "/CN=RPKI Validator"
  log "[Signer] Keypair generated."
fi

# Always convert PEM to DER
log "[Signer] Converting PEM cert to DER format for GoRTR..."
openssl x509 -in "$CERTIFICATE" -outform DER -out "$CERT_DER"
log "[Signer] cert.der generated at $CERT_DER"

# Skip signing if empty or not found
if [[ ! -f "$INPUT_FILE" ]]; then
  log "[WARN] Input ROA file not found at $INPUT_FILE. Skipping signature."
  exit 0
fi

if [[ ! -s "$INPUT_FILE" || "$(jq '.roas | length' "$INPUT_FILE")" -eq 0 ]]; then
  log "[WARN] ROA file is empty (0 entries). Skipping signature."
  exit 0
fi

# Sign ROA
log "[Signer] Signing $INPUT_FILE..."
openssl cms -sign \
  -in "$INPUT_FILE" \
  -signer "$CERTIFICATE" \
  -inkey "$PRIVATE_KEY" \
  -outform DER \
  -out "$SIGNATURE_FILE" \
  -nosmimecap \
  -binary \
  -nodetach \
  -nocerts

log "[Signer] Signature saved to $SIGNATURE_FILE"
