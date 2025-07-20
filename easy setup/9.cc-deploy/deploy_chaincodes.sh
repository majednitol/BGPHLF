#!/bin/bash

CHAINCODE_IMAGE="majedur708/hlf-api:18.100.59"
CHAINCODE_PORT=7052
PACKAGE_FILE="package_identifiers.txt"

if [ ! -f "$PACKAGE_FILE" ]; then
  echo "$PACKAGE_FILE not found!"
  exit 1
fi

for ORG in afrinic apnic arin lacnic ripencc rono; do
  CHAINCODE_ID=$(grep "^$ORG:" "$PACKAGE_FILE" | cut -d':' -f2- | xargs)

  if [ -z "$CHAINCODE_ID" ]; then
    echo "Chaincode ID not found for $ORG"
    continue
  fi

#   echo "Deploying chaincode for $ORG with ID: $CHAINCODE_ID"

  kubectl apply -f - <<EOF
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chaincode-basic-$ORG
  labels:
    app: chaincode-basic-$ORG
spec:
  selector:
    matchLabels:
      app: chaincode-basic-$ORG
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: chaincode-basic-$ORG
    spec:
      containers:
        - image: $CHAINCODE_IMAGE
          imagePullPolicy: Always
          name: chaincode-basic-$ORG
          env:
            - name: CHAINCODE_ID
              value: "$CHAINCODE_ID"
            - name: CHAINCODE_SERVER_ADDRESS
              value: "0.0.0.0:$CHAINCODE_PORT"
          ports:
            - containerPort: $CHAINCODE_PORT
---
apiVersion: v1
kind: Service
metadata:
  name: basic-$ORG
  labels:
    app: basic-$ORG
spec:
  ports:
    - name: grpc
      port: $CHAINCODE_PORT
      targetPort: $CHAINCODE_PORT
  selector:
    app: chaincode-basic-$ORG
EOF

done

echo "All deployments applied!"
