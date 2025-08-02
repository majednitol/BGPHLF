#!/bin/bash
set -e
# Load environment variables
if [[ -f ../config.env ]]; then
  source ../config.env
else
  echo "❌ config.env file not found!"
  exit 1
fi
for ENTRY in "${ORDERERS[@]}"; do
  NAME="${ENTRY%%:*}"
  FQDN="${ENTRY##*:}"

  echo "Deploying $NAME ($FQDN)..."

  kubectl apply -f - <<EOF
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $NAME
spec:
  replicas: 1
  selector:
    matchLabels:
      name: $NAME
  template:
    metadata:
      labels:
        name: $NAME
    spec:
      volumes:
        - name: fabricfiles
          persistentVolumeClaim:
            claimName: "mypvc"
      containers:
        - name: $NAME
          image: $ORDERER_IMAGE
          imagePullPolicy: IfNotPresent
          env:
            - name: CONFIGTX_ORDERER_ADDRESSES
              value: "$NAME:$GRPC_PORT"
            - name: ORDERER_GENERAL_LISTENADDRESS
              value: "0.0.0.0"
            - name: ORDERER_GENERAL_LISTENPORT
              value: "$GRPC_PORT"
            - name: ORDERER_GENERAL_LOGLEVEL
              value: debug
            - name: ORDERER_GENERAL_LOCALMSPDIR
              value: /organizations/ordererOrganizations/$MAIN_DOMAIN/orderers/$FQDN/msp
            - name: ORDERER_GENERAL_LOCALMSPID
              value: OrdererMSP
            - name: ORDERER_GENERAL_GENESISMETHOD
              value: file
            - name: ORDERER_GENERAL_GENESISFILE
              value: /system-genesis-block/genesis.block
            - name: ORDERER_GENERAL_TLS_ENABLED
              value: "true"
            - name: ORDERER_GENERAL_TLS_PRIVATEKEY
              value: /organizations/ordererOrganizations/$MAIN_DOMAIN/orderers/$FQDN/tls/server.key
            - name: ORDERER_GENERAL_TLS_CERTIFICATE
              value: /organizations/ordererOrganizations/$MAIN_DOMAIN/orderers/$FQDN/tls/server.crt
            - name: ORDERER_GENERAL_TLS_ROOTCAS
              value: /organizations/ordererOrganizations/$MAIN_DOMAIN/orderers/$FQDN/tls/ca.crt
            - name: ORDERER_GENERAL_CLUSTER_CLIENTPRIVATEKEY
              value: /organizations/ordererOrganizations/$MAIN_DOMAIN/orderers/$FQDN/tls/server.key
            - name: ORDERER_GENERAL_CLUSTER_CLIENTCERTIFICATE
              value: /organizations/ordererOrganizations/$MAIN_DOMAIN/orderers/$FQDN/tls/server.crt
          resources:
            limits:
              memory: "400Mi"
              cpu: "400m"
            requests:
              memory: "350Mi"
              cpu: "300m"
          volumeMounts:
            - name: fabricfiles
              mountPath: /organizations
              subPath: organizations
            - name: fabricfiles
              mountPath: /system-genesis-block
              subPath: system-genesis-block
---
apiVersion: v1
kind: Service
metadata:
  name: $NAME
  labels:
    run: $NAME
spec:
  selector:
    name: $NAME
  type: ClusterIP
  ports:
    - name: grpc
      protocol: TCP
      port: $GRPC_PORT
    - name: metrics
      protocol: TCP
      port: $METRICS_PORT
EOF

done

echo "✅ All orderers deployed successfully."
