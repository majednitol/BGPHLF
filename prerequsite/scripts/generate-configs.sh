#!/bin/bash
set -e

# Load environment variables
if [[ -f ../../config.env ]]; then
  source ../../config.env
else
  echo "❌ config.env file not found!"
  exit 1
fi

TEMPLATE_FILE="config-template.yaml"
OUTPUT_DIR="../organizations"

mkdir -p "$OUTPUT_DIR"

# Check for equal array lengths
if [ ${#CA_NAMES[@]} -ne ${#ORG_NAMES[@]} ] || [ ${#CA_NAMES[@]} -ne ${#CA_PORTS[@]} ]; then
  echo "❌ ERROR: Mismatched array lengths in config.env!"
  exit 1
fi

for i in "${!CA_NAMES[@]}"; do
  CA_NAME="${CA_NAMES[$i]}"
  ORG="${ORG_NAMES[$i]}"
  PORT="${CA_PORTS[$i]}"
  CA_SERVER_NAME="${ORG}CA"

  echo "🔧 Generating config for $CA_NAME ($ORG)..."

  ORG_DIR="$OUTPUT_DIR/$ORG"
  mkdir -p "$ORG_DIR"

  sed -e "s/{{CA_NAME}}/$CA_NAME/g" \
      -e "s/{{PORT}}/$PORT/g" \
      -e "s/{{ORG}}/$ORG/g" \
      -e "s/{{CA_SERVER_NAME}}/$CA_SERVER_NAME/g" \
      "$TEMPLATE_FILE" > "$ORG_DIR/fabric-ca-server-config.yaml"

  echo "✅ Generated: $ORG_DIR/fabric-ca-server-config.yaml"
done
