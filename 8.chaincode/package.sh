#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGING_DIR="$SCRIPT_DIR/../../nfs_clientshare/chaincode/basic/packaging"
cd "$PACKAGING_DIR" || { echo "❌ Packaging dir not found!"; exit 1; }


for ORG in afrinic apnic arin ripencc lacnic rono; do
  echo " Packaging for $ORG..."
  cp -X ${ORG}-connection.json connection.json

  tar cfz code.tar.gz connection.json
  tar cfz basic-${ORG}.tgz code.tar.gz metadata.json

  rm -f connection.json code.tar.gz

  echo "basic-${ORG}.tgz created"
done

echo " All chaincode packages created successfully."
