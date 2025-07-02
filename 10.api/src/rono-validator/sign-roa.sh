#!/bin/bash
set -euo pipefail

KEY_DIR="${KEY_DIR:-/app/data/keys}"
DATA_DIR="${DATA_DIR:-/app/data}"

PRIVATE_KEY="$KEY_DIR/private.pem"
CERTIFICATE="$KEY_DIR/cert.pem"
CERT_DER="$KEY_DIR/cert.der"
PUBLIC_KEY="$KEY_DIR/public.pem"
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
    -subj "/CN=RPKI Validator" \
    -addext "keyUsage=digitalSignature,keyCertSign"
  log "[Signer] Keypair generated."
fi

# Extract public key
log "[Signer] Extracting public key..."
openssl x509 -in "$CERTIFICATE" -pubkey -noout > "$PUBLIC_KEY"

# Validate public key file
if [[ ! -s "$PUBLIC_KEY" ]]; then
  log "[ERROR] Public key extraction failed"
  exit 1
fi
log "[Signer] Public key saved to $PUBLIC_KEY"

# Convert PEM to DER for GoRTR or Routinator
log "[Signer] Converting PEM cert to DER format..."
openssl x509 -in "$CERTIFICATE" -outform DER -out "$CERT_DER"
chmod 644 "$CERT_DER"
log "[Signer] DER certificate saved to $CERT_DER"

# Skip signing if ROA file not found or empty
if [[ ! -f "$INPUT_FILE" ]]; then
  log "[WARN] ROA file not found at $INPUT_FILE. Skipping signature."
  exit 0
fi

if [[ ! -s "$INPUT_FILE" || "$(jq '.roas | length' "$INPUT_FILE")" -eq 0 ]]; then
  log "[WARN] ROA file is empty. Skipping signature."
  exit 0
fi

# Sign the ROA file
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

chmod 644 "$SIGNATURE_FILE"
log "[Signer] Signature saved to $SIGNATURE_FILE"
