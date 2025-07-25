#!/bin/bash
set -e
# Load environment variables
if [[ -f ../config.env ]]; then
  source ../config.env
else
  echo "❌ config.env file not found!"
  exit 1
fi

for ORG in "${ORG_LIST[@]}"; do
  CLI_POD=$(kubectl get pods -o name | grep "cli-peer0-afrinic" | head -n1)

  if [ -z "$CLI_POD" ]; then
    echo "❌ Could not find CLI pod for $ORG"
    continue
  fi
echo "🔑 Loading environment variables for $ORG..."
  echo "🔍 Fetching Chaincode ID from $CLI_POD..."

  CHAINCODE_ID=$(kubectl exec "$CLI_POD" -- sh -c "grep '^$ORG:' $FILE_PATH | cut -d':' -f2-" | xargs)

  if [ -z "$CHAINCODE_ID" ]; then
    echo "❌ Chaincode ID not found for $ORG"
    continue
  fi

  echo "🚀 Deploying chaincode for $ORG with ID: $CHAINCODE_ID"

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
