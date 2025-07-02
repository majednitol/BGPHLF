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

# Generate keys if not exist
if [[ ! -f "$PRIVATE_KEY" || ! -f "$CERTIFICATE" ]]; then
  log "[Signer] Keys not found. Generating ECDSA keypair..."
  openssl ecparam -name prime256v1 -genkey -noout -out "$PRIVATE_KEY"
  openssl req -x509 -new -key "$PRIVATE_KEY" \
    -out "$CERTIFICATE" -days 365 \
    -subj "/CN=RPKI Validator" \
    -addext "keyUsage=digitalSignature,keyCertSign"
  log "[Signer] Keypair generated."
fi

# Extract public key and DER
log "[Signer] Extracting public key..."
openssl x509 -in "$CERTIFICATE" -pubkey -noout > "$PUBLIC_KEY"
chmod 644 "$PUBLIC_KEY"

log "[Signer] Converting to DER..."
openssl x509 -in "$CERTIFICATE" -outform DER -out "$CERT_DER"
chmod 644 "$CERT_DER"

# Skip if no valid ROA
if [[ ! -f "$INPUT_FILE" ]]; then
  log "[WARN] ROA file not found. Skipping signing."
  exit 0
fi

if [[ ! -s "$INPUT_FILE" || "$(jq '.roas | length' "$INPUT_FILE")" -eq 0 ]]; then
  log "[WARN] ROA file is empty. Skipping signing."
  exit 0
fi

log "[Signer] Signing ROA file..."
openssl cms -sign \
  -in "$INPUT_FILE" \
  -signer "$CERTIFICATE" \
  -inkey "$PRIVATE_KEY" \
  -outform DER \
  -out "$SIGNATURE_FILE" \
  -nosmimecap -binary -nodetach -nocerts

chmod 644 "$SIGNATURE_FILE"
log "[Signer] Signature saved."
