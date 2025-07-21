#!/bin/bash

set -e

ORDERER_DOMAIN="rono.com"
ORDERER_NAMES=("orderer" "orderer2" "orderer3" "orderer4" "orderer5")

CA_NAME="ca-orderer"
CA_PORT="10054"
CA_HOST="ca-orderer"
CA_URL="https://admin:adminpw@$CA_HOST:$CA_PORT"
TLS_CERT_PATH="/organizations/fabric-ca/ordererOrg/tls-cert.pem"

export FABRIC_CA_CLIENT_HOME=/organizations/ordererOrganizations/$ORDERER_DOMAIN
mkdir -p $FABRIC_CA_CLIENT_HOME

# Enroll CA admin
echo "Enrolling CA admin..."
fabric-ca-client enroll -u $CA_URL --caname $CA_NAME --tls.certfiles $TLS_CERT_PATH

# Create NodeOUs config
cat > $FABRIC_CA_CLIENT_HOME/msp/config.yaml <<EOF
NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/${CA_HOST}-${CA_PORT}-${CA_NAME}.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/${CA_HOST}-${CA_PORT}-${CA_NAME}.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/${CA_HOST}-${CA_PORT}-${CA_NAME}.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/${CA_HOST}-${CA_PORT}-${CA_NAME}.pem
    OrganizationalUnitIdentifier: orderer
EOF

echo "Registering orderers..."
for ORDERER in "${ORDERER_NAMES[@]}"; do
  fabric-ca-client register --caname $CA_NAME \
    --id.name $ORDERER --id.secret ordererpw --id.type orderer \
    --tls.certfiles $TLS_CERT_PATH
done

# Register orderer admin
fabric-ca-client register --caname $CA_NAME \
  --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin \
  --tls.certfiles $TLS_CERT_PATH

# Generate certificates for each orderer
for ORDERER in "${ORDERER_NAMES[@]}"; do
  echo "Generating MSP and TLS certs for $ORDERER..."

  ORG_PATH=/organizations/ordererOrganizations/$ORDERER_DOMAIN/orderers/$ORDERER.$ORDERER_DOMAIN
  mkdir -p $ORG_PATH

  # Enroll MSP
  fabric-ca-client enroll -u https://$ORDERER:ordererpw@$CA_HOST:$CA_PORT \
    --caname $CA_NAME \
    -M $ORG_PATH/msp \
    --csr.hosts $ORDERER.$ORDERER_DOMAIN \
    --csr.hosts localhost \
    --csr.hosts $CA_HOST \
    --csr.hosts $ORDERER \
    --tls.certfiles $TLS_CERT_PATH

  cp $FABRIC_CA_CLIENT_HOME/msp/config.yaml $ORG_PATH/msp/config.yaml

  # Enroll TLS
  fabric-ca-client enroll -u https://$ORDERER:ordererpw@$CA_HOST:$CA_PORT \
    --caname $CA_NAME \
    -M $ORG_PATH/tls \
    --enrollment.profile tls \
    --csr.hosts $ORDERER.$ORDERER_DOMAIN \
    --csr.hosts localhost \
    --csr.hosts $CA_HOST \
    --csr.hosts $ORDERER \
    --tls.certfiles $TLS_CERT_PATH

  cp $ORG_PATH/tls/tlscacerts/* $ORG_PATH/tls/ca.crt
  cp $ORG_PATH/tls/signcerts/* $ORG_PATH/tls/server.crt
  cp $ORG_PATH/tls/keystore/* $ORG_PATH/tls/server.key

  mkdir -p $ORG_PATH/msp/tlscacerts
  cp $ORG_PATH/tls/tlscacerts/* $ORG_PATH/msp/tlscacerts/tlsca.$ORDERER_DOMAIN-cert.pem

  mkdir -p /organizations/ordererOrganizations/$ORDERER_DOMAIN/msp/tlscacerts
  cp $ORG_PATH/tls/tlscacerts/* /organizations/ordererOrganizations/$ORDERER_DOMAIN/msp/tlscacerts/tlsca.$ORDERER_DOMAIN-cert.pem
done

# Generate Admin MSP
echo "Generating orderer admin MSP..."
ADMIN_PATH=/organizations/ordererOrganizations/$ORDERER_DOMAIN/users/Admin@$ORDERER_DOMAIN
mkdir -p $ADMIN_PATH

fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@$CA_HOST:$CA_PORT \
  --caname $CA_NAME \
  -M $ADMIN_PATH/msp \
  --tls.certfiles $TLS_CERT_PATH

cp $FABRIC_CA_CLIENT_HOME/msp/config.yaml $ADMIN_PATH/msp/config.yaml

echo "✅ All orderer MSPs and TLS certificates generated successfully."
