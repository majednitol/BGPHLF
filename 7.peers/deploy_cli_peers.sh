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
  CLI_NAME="cli-${PEER_NAME}"
echo "Deploying $ORG.. $PEER_PORT..$PEER_NAME"
  cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${CLI_NAME}
spec:
  selector:
    matchLabels:
      name: ${CLI_NAME}
  template:
    metadata:
      labels:
        name: ${CLI_NAME}
    spec:
      volumes:
        - name: fabricfiles
          persistentVolumeClaim:
            claimName: mypvc
      containers:
        - name: ${CLI_NAME}
          stdin: true
          tty: true
          image: hyperledger/fabric-tools:2.4.9
          workingDir: /
          resources:
            limits:
              memory: "300Mi"
              cpu: "200m"
            requests:
              memory: "200Mi"
              cpu: "90m"
          env:
            - name: ORDERER_CA
              value: /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/msp/tlscacerts/tlsca.rono.com-cert.pem
            - name: CORE_PEER_ADDRESS
              value: ${PEER_NAME}:${PEER_PORT}
            - name: CORE_PEER_ID
              value: cli.peer0.${ORG}.rono.com
            - name: CORE_PEER_LOCALMSPID
              value: ${MSP_ID}
            - name: CORE_PEER_MSPCONFIGPATH
              value: /organizations/peerOrganizations/${ORG}.rono.com/users/Admin@${ORG}.rono.com/msp
            - name: CORE_PEER_TLS_ENABLED
              value: "true"
            - name: CORE_PEER_TLS_CERT_FILE
              value: /organizations/peerOrganizations/${ORG}.rono.com/peers/peer0.${ORG}.rono.com/tls/server.crt
            - name: CORE_PEER_TLS_KEY_FILE
              value: /organizations/peerOrganizations/${ORG}.rono.com/peers/peer0.${ORG}.rono.com/tls/server.key
            - name: CORE_PEER_TLS_ROOTCERT_FILE
              value: /organizations/peerOrganizations/${ORG}.rono.com/peers/peer0.${ORG}.rono.com/tls/ca.crt
            - name: FABRIC_LOGGING_SPEC
              value: ERROR
            - name: GOPATH
              value: /opt/gopath
            - name: SYS_CHANNEL
              value: system-channel
            - name: CORE_CHAINCODE_BUILDER
              value: hyperledger/fabric-ccenv:1.4.8
            - name: FABRIC_LOGGING_SPEC
              value: DEBUG
          volumeMounts:
            - mountPath: /organizations
              name: fabricfiles
              subPath: organizations
            - mountPath: /configtx
              name: fabricfiles
              subPath: configtx
            - mountPath: /channel-artifacts
              name: fabricfiles
              subPath: channel-artifacts
            - mountPath: /scripts
              name: fabricfiles
              subPath: scripts
            - mountPath: /opt/gopath/src/github.com/chaincode
              name: fabricfiles
              subPath: chaincode
EOF

done
