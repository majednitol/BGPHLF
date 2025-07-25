#!/bin/bash
set -e

# Load environment variables
if [[ -f ../config.env ]]; then
  source ../config.env
else
  echo "❌ config.env file not found!"
  exit 1
fi

for i in "${!CA_NAMES[@]}"; do
  CA_NAME="${CA_NAMES[$i]}"
  PORT="${CA_PORTS[$i]}"
  ORG_NAME=$(echo $CA_NAME | cut -d'-' -f2)
if [ "$ORG_NAME" == "orderer" ]; then
  ORG_NAME="ordererOrg"
fi
echo "Deploying $CA_NAME on port $PORT with ORG_NAME=$ORG_NAME"
  cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "$CA_NAME"
spec:
  selector:
    matchLabels:
      app: "$CA_NAME"
  replicas: 1
  template:
    metadata:
      labels:
        app: "$CA_NAME"
    spec:
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: mypvc
      containers:
        - name: "$CA_NAME"
          image: hyperledger/fabric-ca:1.5.13
          imagePullPolicy: IfNotPresent
          command:
            - fabric-ca-server
            - start
            - -b
            - admin:adminpw
            - --port
            - "$PORT"
            - -d
          resources:
            requests:
              memory: "300Mi"
              cpu: "300m"
            limits:
              memory: "500Mi"
              cpu: "350m"
          env:
            - name: FABRIC_CA_SERVER_CA_NAME
              value: "$CA_NAME"
            - name: FABRIC_CA_SERVER_TLS_ENABLED
              value: "true"
            - name: FABRIC_CA_SERVER_CSR_CN
              value: "$CA_NAME"
            - name: FABRIC_CA_SERVER_CSR_HOSTS
              value: "$CA_NAME"
          volumeMounts:
            - name: data
              mountPath: /etc/hyperledger/fabric-ca-server
              subPath: organizations/fabric-ca/$ORG_NAME
---
apiVersion: v1
kind: Service
metadata:
  name: "$CA_NAME"
  labels:
    app: "$CA_NAME"
spec:
  type: ClusterIP
  selector:
    app: "$CA_NAME"
  ports:
    - protocol: TCP
      targetPort: $PORT
      port: $PORT
EOF

done
