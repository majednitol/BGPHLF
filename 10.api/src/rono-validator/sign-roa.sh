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

# Generate ECDSA cert/key if not exist
if [[ ! -f "$PRIVATE_KEY" || ! -f "$CERTIFICATE" ]]; then
  log "[Signer] Keys not found. Generating new ECDSA keypair (secp256r1)..."
  openssl ecparam -name prime256v1 -genkey -noout -out "$PRIVATE_KEY"
  openssl req -x509 -new -key "$PRIVATE_KEY" \
    -out "$CERTIFICATE" \
    -days 365 \
    -subj "/CN=RPKI Validator" \
    -addext "keyUsage=digitalSignature,keyCertSign"
  log "[Signer] ECDSA Keypair generated."
fi

# Extract ECDSA public key
log "[Signer] Extracting public key..."
openssl x509 -in "$CERTIFICATE" -pubkey -noout > "$PUBLIC_KEY"

# Validate public key format
if ! openssl ec -pubin -in "$PUBLIC_KEY" -text &>/dev/null; then
  log "[ERROR] Invalid ECDSA public key format"
  exit 1
fi

chmod 644 "$PUBLIC_KEY"
log "[Signer] Public key saved to $PUBLIC_KEY"

# Convert PEM to DER for GoRTR
log "[Signer] Converting cert to DER format..."
openssl x509 -in "$CERTIFICATE" -outform DER -out "$CERT_DER"
chmod 644 "$CERT_DER"
log "[Signer] DER certificate saved to $CERT_DER"

# Skip signing if ROA file missing or empty
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
