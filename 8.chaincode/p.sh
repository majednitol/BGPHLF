
# #!/bin/bash
# set -e

# # Step 1: Package all chaincodes
# CHAINCODE_DIR="../../nfs_clientshare/chaincode/basic/packaging"
# cd "$CHAINCODE_DIR"

# for ORG in afrinic apnic arin ripencc lacnic rono; do
#   echo "Packaging for $ORG..."
#   cp -X ${ORG}-connection.json connection.json
#   tar cfz code.tar.gz connection.json
#   tar cfz basic-${ORG}.tgz code.tar.gz metadata.json
#   rm -f connection.json code.tar.gz
#   echo "basic-${ORG}.tgz created"
# done

# echo "All chaincode packages created successfully."

# # Step 2: Install chaincodes via each peer CLI
# OUT_FILE="package_identifiers.txt"
# > "$OUT_FILE"

# ORG_NAMES=(afrinic apnic arin lacnic ripencc rono)
# PACKAGES=(basic-afrinic.tgz basic-apnic.tgz basic-arin.tgz basic-lacnic.tgz basic-ripencc.tgz basic-rono.tgz)

# echo "🚀 Starting chaincode installation..."

# for i in "${!ORG_NAMES[@]}"; do
#   ORG="${ORG_NAMES[$i]}"
#   PACKAGE="${PACKAGES[$i]}"
#   POD_NAME=$(kubectl get pods -o name | grep "cli-peer0-$ORG" | head -n1)

#   echo "👉 Installing $PACKAGE from $POD_NAME..."

#   CMD="cd /opt/gopath/src/github.com/chaincode/basic/packaging && \
#        peer lifecycle chaincode install $PACKAGE 2>&1"

#   set +e
#   OUTPUT=$(kubectl exec "${POD_NAME}" -- sh -c "$CMD")
#   EXIT_CODE=$?
#   echo "$OUTPUT"

#   PACKAGE_ID=$(echo "$OUTPUT" | grep -oE "Chaincode code package identifier: .*" | cut -d ':' -f2- | xargs)

#   if [ -n "$PACKAGE_ID" ]; then
#     echo "$ORG: $PACKAGE_ID" | tee -a "$OUT_FILE"
#   else
#     echo "❌ Failed to extract package ID for $ORG"
#     exit 1
#   fi
# done

# echo "✅ All package identifiers saved to $OUT_FILE"


#!/bin/bash
set -e

OUT_FILE="package_identifiers.txt"
> "$OUT_FILE"

ORG_NAMES=(afrinic apnic arin lacnic ripencc rono)
PACKAGES=(basic-afrinic.tgz basic-apnic.tgz basic-arin.tgz basic-lacnic.tgz basic-ripencc.tgz basic-rono.tgz)

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
  else
    echo "❌ Failed to extract package ID for $ORG"
    exit 1
  fi
done

echo "✅ All package identifiers saved to $OUT_FILE"
