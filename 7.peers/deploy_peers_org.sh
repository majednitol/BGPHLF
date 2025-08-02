#!/bin/bash
set -e
# Load environment variables
if [[ -f ../config.env ]]; then
  source ../config.env
else
  echo "❌ config.env file not found!"
  exit 1
fi

ORG_NAMES=( "${ORG_NAMES[@]:1}" )
for i in "${!ORG_NAMES[@]}"; do
  ORG=${ORG_NAMES[$i]}
  PEER_PORT=${PEER_PORTS[$i]}
  MSP_ID=${MSPS[$i]}
  PEER_NAME="peer0-${ORG}"
echo "Deploying ${PEER_NAME} in ${ORG}..."
  cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${PEER_NAME}
spec:
  selector:
    matchLabels:
      name: ${PEER_NAME}
  replicas: 1
  template:
    metadata:
      labels:
        name: ${PEER_NAME}
    spec:
      volumes:
        - name: fabricfiles
          persistentVolumeClaim:
            claimName: mypvc
        - name: builders-config
          configMap:
            name: builders-config
            items:
              - key: core.yaml
                path: core.yaml
        - name: external-builder-detect
          configMap:
            name: builders-config
            items:
              - key: detect
                path: detect
                mode: 0544
        - name: external-builder-build
          configMap:
            name: builders-config
            items:
              - key: build
                path: build
                mode: 0544
        - name: external-builder-release
          configMap:
            name: builders-config
            items:
              - key: release
                path: release
                mode: 0544
      containers:
        - name: peer
          image: hyperledger/fabric-peer:2.4.9
          command: ["sh", "-c", "peer node start"]
          env:
            - name: CORE_PEER_ADDRESSAUTODETECT
              value: "true"
            - name: CORE_PEER_ID
              value: ${PEER_NAME}
            - name: CORE_PEER_ADDRESS
              value: ${PEER_NAME}:${PEER_PORT}
            - name: CORE_PEER_LISTENADDRESS
              value: 0.0.0.0:${PEER_PORT}
            - name: CORE_PEER_GATEWAY_ENABLED
              value: "true"
            - name: CORE_PEER_EVENTS_ADDRESS
              value: 0.0.0.0:7061
            - name: CORE_PEER_GOSSIP_BOOTSTRAP
              value: ${PEER_NAME}:${PEER_PORT}
            - name: CORE_PEER_GOSSIP_ENDPOINT
              value: ${PEER_NAME}:${PEER_PORT}
            - name: CORE_PEER_GOSSIP_EXTERNALENDPOINT
              value: ${PEER_NAME}:${PEER_PORT}
            - name: CORE_PEER_GOSSIP_ORGLEADER
              value: "false"
            - name: CORE_PEER_GOSSIP_USELEADERELECTION
              value: "true"
            - name: CORE_PEER_PROFILE_ENABLED
              value: "true"
            - name: CORE_PEER_LOCALMSPID
              value: ${MSP_ID}
            - name: CORE_PEER_MSPCONFIGPATH
              value: /organizations/peerOrganizations/${ORG}.$MAIN_DOMAIN/peers/peer0.${ORG}.$MAIN_DOMAIN/msp
            - name: FABRIC_LOGGING_SPEC
              value: debug
            - name: CORE_PEER_TLS_ENABLED
              value: "true"
            - name: CORE_PEER_TLS_CERT_FILE
              value: /organizations/peerOrganizations/${ORG}.$MAIN_DOMAIN/peers/peer0.${ORG}.$MAIN_DOMAIN/tls/server.crt
            - name: CORE_PEER_TLS_KEY_FILE
              value: /organizations/peerOrganizations/${ORG}.$MAIN_DOMAIN/peers/peer0.${ORG}.$MAIN_DOMAIN/tls/server.key
            - name: CORE_PEER_TLS_ROOTCERT_FILE
              value: /organizations/peerOrganizations/${ORG}.$MAIN_DOMAIN/peers/peer0.${ORG}.$MAIN_DOMAIN/tls/ca.crt
            - name: CORE_LEDGER_STATE_STATEDATABASE
              value: "goleveldb"
            - name: FABRIC_CFG_PATH
              value: /etc/hyperledger/fabric
            - name: CORE_OPERATIONS_LISTENADDRESS
              value: 0.0.0.0:9443
            - name: CORE_METRICS_PROVIDER
              value: prometheus
          ports:
            - containerPort: ${PEER_PORT}
            - containerPort: 7052
            - containerPort: 7053
            - containerPort: 9443
          resources:
            limits:
              memory: "600Mi"
              cpu: "600m"
            requests:
              memory: "400Mi"
              cpu: "400m"
          volumeMounts:
            - mountPath: /opt/gopath/src/github.com/chaincode/
              name: fabricfiles
              subPath: chaincode/
            - mountPath: /organizations
              name: fabricfiles
              subPath: organizations
            - mountPath: /var/hyperledger/production
              name: fabricfiles
              subPath: state/${ORG}/peer0
            - mountPath: /etc/hyperledger/fabric/core.yaml
              name: builders-config
              subPath: core.yaml
            - mountPath: /builders/external/bin/detect
              name: external-builder-detect
              subPath: detect
            - mountPath: /builders/external/bin/build
              name: external-builder-build
              subPath: build
            - mountPath: /builders/external/bin/release
              name: external-builder-release
              subPath: release
---
apiVersion: v1
kind: Service
metadata:
  name: ${PEER_NAME}
  labels:
    app: ${PEER_NAME}
spec:
  selector:
    name: ${PEER_NAME}
  type: ClusterIP
  ports:
    - name: grpc
      port: ${PEER_PORT}
      targetPort: ${PEER_PORT}
      protocol: TCP
    - name: event
      port: 7061
      targetPort: 7061
      protocol: TCP
    - name: couchdb
      port: 5984
      targetPort: 5984
      protocol: TCP
---
apiVersion: v1
kind: Service
metadata:
  name: ${PEER_NAME}-metrics
  labels:
    app: ${PEER_NAME}
    metrics-service: "true"
spec:
  type: ClusterIP
  selector:
    name: ${PEER_NAME}
  ports:
    - name: peer-metrics
      port: 9443
      targetPort: 9443
EOF

done
