# #!/bin/bash
# set -euo pipefail

# DATA_DIR="${DATA_DIR:-/app/data}"
# INPUT_FILE="$DATA_DIR/roas.json"
# OUTPUT_FILE="$DATA_DIR/rpki.json"

# log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# if [[ ! -f "$INPUT_FILE" || "$(jq '.roas | length' "$INPUT_FILE")" -eq 0 ]]; then
#   log "[WARN] ROA file missing or empty. Skipping export."
#   exit 0
# fi

# cp "$INPUT_FILE" "$OUTPUT_FILE"
# chmod 644 "$OUTPUT_FILE"
# log "[Signer] Exported ROA to $OUTPUT_FILE"


#!/bin/bash
set -euo pipefail

DATA_DIR="${DATA_DIR:-/app/data}"
KEY_DIR="$DATA_DIR/keys"
INPUT_FILE="$DATA_DIR/roas.json"
OUTPUT_FILE="$DATA_DIR/rpki.json"
KEY_FILE="$KEY_DIR/private.pem"
CERT_FILE="$KEY_DIR/server.pem"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}
mkdir -p "$DATA_DIR"
mkdir -p "$KEY_DIR"
chmod 700 "$KEY_DIR"
# --- Step 1: Generate TLS key/cert if missing ---
if [[ ! -f "$KEY_FILE" || ! -f "$CERT_FILE" ]]; then
  log "[TLS] Generating new private key and self-signed certificate..."
  openssl ecparam -genkey -name prime256v1 -noout -out "$KEY_FILE"
  openssl req -new -x509 -key "$KEY_FILE" -out "$CERT_FILE" -days 365 -subj "/CN=stayrtr"
  chmod 600 "$KEY_FILE"
  chmod 644 "$CERT_FILE"
  log "[TLS] TLS key and certificate generated successfully."
else
  log "[TLS] TLS key and certificate already exist. Skipping generation."
fi

# --- Step 2: Wait for roas.json to appear (max 30s) ---
for i in {1..30}; do
  if [[ -f "$INPUT_FILE" ]]; then
    break
  fi
  log "[Signer] Waiting for $INPUT_FILE to be available..."
  sleep 1
done

# --- Step 3: Validate and copy ROA ---
if [[ ! -f "$INPUT_FILE" || "$(jq '.roas | length' "$INPUT_FILE")" -eq 0 ]]; then
  log "[WARN] ROA file missing or empty. Skipping export."
  exit 0
fi

cp "$INPUT_FILE" "$OUTPUT_FILE"
chmod 644 "$OUTPUT_FILE"
log "[Signer] Exported ROA to $OUTPUT_FILE"

