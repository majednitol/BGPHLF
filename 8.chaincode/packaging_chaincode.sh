#!/bin/bash
set -e

# Load environment variables
if [[ -f ../config.env ]]; then
  source ../config.env
else
  echo "❌ config.env file not found!"
  exit 1
fi

echo "📦 Starting remote packaging inside CLI pods..."
ORG_NAMES=( "${ORG_NAMES[@]:1}" )
for ORG in "${ORG_NAMES[@]}"; do
  echo "👉 Packaging for $ORG..."

  CLI_POD=$(kubectl get pods -o name | grep "cli-peer0-$ORG" | head -n1)

  if [ -z "$CLI_POD" ]; then
    echo "❌ Could not find CLI pod for $ORG"
    continue
  fi

  kubectl exec "$CLI_POD" -- sh -c "
    set -e
    cd /opt/gopath/src/github.com/chaincode/basic/packaging && \
    rm -f basic-${ORG}.tgz code.tar.gz connection.json && \
    cp ${ORG}-connection.json connection.json && \
    tar cfz code.tar.gz connection.json && \
    tar cfz basic-${ORG}.tgz code.tar.gz metadata.json && \
    rm -f code.tar.gz connection.json && \
    echo '✅ Packaged basic-${ORG}.tgz inside packaging folder of $CLI_POD'
  "
done

echo "✅ All chaincode packages created directly in packaging folders of respective CLI pods."

OUT_FILE="package_identifiers.txt"
> "$OUT_FILE"

echo "📦 Starting chaincode installation from individual peer CLIs..."

for i in "${!ORG_NAMES[@]}"; do
  ORG="${ORG_NAMES[$i]}"
  PACKAGE="${PACKAGES[$i]}"
  POD_NAME=$(kubectl get pods -o name | grep "cli-peer0-$ORG" | head -n1)

  echo "👉 Installing $PACKAGE from $POD_NAME..."

  CMD="cd /opt/gopath/src/github.com/chaincode/basic/packaging && \
       peer lifecycle chaincode install $PACKAGE 2>&1"

  set +e
  OUTPUT=$(kubectl exec "${POD_NAME}" -- sh -c "$CMD")
  EXIT_CODE=$?

  echo "$OUTPUT"

  PACKAGE_ID=$(echo "$OUTPUT" | grep -oE "Chaincode code package identifier: .*" | cut -d ':' -f2- | xargs)

  if [ -n "$PACKAGE_ID" ]; then
    echo "$ORG: $PACKAGE_ID" | tee -a "$OUT_FILE"

    # Save to peer CLI pod as well
    kubectl exec "$POD_NAME" -- sh -c "echo '$ORG: $PACKAGE_ID' >> /opt/gopath/src/github.com/chaincode/basic/packaging/package_identifiers.txt"
  else
    echo "❌ Failed to extract package ID for $ORG"
    exit 1
  fi
done

echo "✅ All package identifiers saved to $OUT_FILE and inside respective CLI pod packaging folders"