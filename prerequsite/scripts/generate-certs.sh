#!/bin/bash
set -x

ORG_LIST=("afrinic" "apnic" "arin")
PORT_MAP=(7054 8054 9054)

for index in "${!ORG_LIST[@]}"; do
  ORG="${ORG_LIST[$index]}"
  PORT="${PORT_MAP[$index]}"
  ORG_CAP="$(echo "$ORG" | tr '[:lower:]' '[:upper:]')"

  ORG_DOMAIN="${ORG}.rono.com"
  PEER_HOST="peer0.${ORG_DOMAIN}"
  PEER_SHORT="peer0-${ORG}"

  export FABRIC_CA_CLIENT_HOME="/organizations/peerOrganizations/${ORG_DOMAIN}/"

  mkdir -p "/organizations/peerOrganizations/${ORG_DOMAIN}/"

  fabric-ca-client enroll -u https://admin:adminpw@ca-${ORG}:${PORT} --caname ca-${ORG} --tls.certfiles "/organizations/fabric-ca/${ORG}/tls-cert.pem"

  cat > "/organizations/peerOrganizations/${ORG_DOMAIN}/msp/config.yaml" <<EOF
NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-${ORG}-${PORT}-ca-${ORG}.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-${ORG}-${PORT}-ca-${ORG}.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-${ORG}-${PORT}-ca-${ORG}.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-${ORG}-${PORT}-ca-${ORG}.pem
    OrganizationalUnitIdentifier: orderer
EOF

  fabric-ca-client register --caname ca-${ORG} --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/${ORG}/tls-cert.pem"
  fabric-ca-client register --caname ca-${ORG} --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/${ORG}/tls-cert.pem"
  fabric-ca-client register --caname ca-${ORG} --id.name ${ORG}admin --id.secret ${ORG}adminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/${ORG}/tls-cert.pem"

  fabric-ca-client enroll -u https://peer0:peer0pw@ca-${ORG}:${PORT} --caname ca-${ORG} -M "/organizations/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/msp" --csr.hosts ${PEER_HOST} --csr.hosts ${PEER_SHORT} --tls.certfiles "/organizations/fabric-ca/${ORG}/tls-cert.pem"

  cp "/organizations/peerOrganizations/${ORG_DOMAIN}/msp/config.yaml" "/organizations/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/msp/config.yaml"

  fabric-ca-client enroll -u https://peer0:peer0pw@ca-${ORG}:${PORT} --caname ca-${ORG} -M "/organizations/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/tls" --enrollment.profile tls --csr.hosts ${PEER_HOST} --csr.hosts ${PEER_SHORT} --csr.hosts ca-${ORG} --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/${ORG}/tls-cert.pem"

  cp "/organizations/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/tls/tlscacerts/"* "/organizations/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/tls/ca.crt"
  cp "/organizations/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/tls/signcerts/"* "/organizations/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/tls/server.crt"
  cp "/organizations/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/tls/keystore/"* "/organizations/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/tls/server.key"

  mkdir -p "/organizations/peerOrganizations/${ORG_DOMAIN}/msp/tlscacerts"
  cp "/organizations/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/tls/tlscacerts/"* "/organizations/peerOrganizations/${ORG_DOMAIN}/msp/tlscacerts/ca.crt"

  mkdir -p "/organizations/peerOrganizations/${ORG_DOMAIN}/tlsca"
  cp "/organizations/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/tls/tlscacerts/"* "/organizations/peerOrganizations/${ORG_DOMAIN}/tlsca/tlsca.${ORG_DOMAIN}-cert.pem"

  mkdir -p "/organizations/peerOrganizations/${ORG_DOMAIN}/ca"
  cp "/organizations/peerOrganizations/${ORG_DOMAIN}/peers/${PEER_HOST}/msp/cacerts/"* "/organizations/peerOrganizations/${ORG_DOMAIN}/ca/ca.${ORG_DOMAIN}-cert.pem"

  fabric-ca-client enroll -u https://user1:user1pw@ca-${ORG}:${PORT} --caname ca-${ORG} -M "/organizations/peerOrganizations/${ORG_DOMAIN}/users/User1@${ORG_DOMAIN}/msp" --tls.certfiles "/organizations/fabric-ca/${ORG}/tls-cert.pem"

  cp "/organizations/peerOrganizations/${ORG_DOMAIN}/msp/config.yaml" "/organizations/peerOrganizations/${ORG_DOMAIN}/users/User1@${ORG_DOMAIN}/msp/config.yaml"

  fabric-ca-client enroll -u https://${ORG}admin:${ORG}adminpw@ca-${ORG}:${PORT} --caname ca-${ORG} -M "/organizations/peerOrganizations/${ORG_DOMAIN}/users/Admin@${ORG_DOMAIN}/msp" --tls.certfiles "/organizations/fabric-ca/${ORG}/tls-cert.pem"

  cp "/organizations/peerOrganizations/${ORG_DOMAIN}/msp/config.yaml" "/organizations/peerOrganizations/${ORG_DOMAIN}/users/Admin@${ORG_DOMAIN}/msp/config.yaml"

done

{ set +x; } 2>/dev/null
