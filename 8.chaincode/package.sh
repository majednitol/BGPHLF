#!/bin/bash
set -e

ORG_LIST=(afrinic apnic arin lacnic ripencc rono)

echo "📦 Starting remote packaging inside CLI pods..."

for ORG in "${ORG_LIST[@]}"; do
  echo "👉 Packaging for $ORG..."

  CLI_POD=$(kubectl get pods -o name | grep "cli-peer0-$ORG" | head -n1)

  if [ -z "$CLI_POD" ]; then
    echo "❌ Could not find CLI pod for $ORG"
    continue
  fi

  # Execute directly in packaging dir inside CLI pod
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




# #!/bin/bash
# set -e

# SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# PACKAGING_DIR="$SCRIPT_DIR/../../nfs_clientshare/chaincode/basic/packaging"
# cd "$PACKAGING_DIR" || { echo "❌ Packaging dir not found!"; exit 1; }


# for ORG in afrinic apnic arin ripencc lacnic rono; do
#   echo " Packaging for $ORG..."
#   cp -X ${ORG}-connection.json connection.json

#   tar cfz code.tar.gz connection.json
#   tar cfz basic-${ORG}.tgz code.tar.gz metadata.json

#   rm -f connection.json code.tar.gz

#   echo "basic-${ORG}.tgz created"
# done

# echo " All chaincode packages created successfully."
