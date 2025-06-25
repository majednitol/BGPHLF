set -x

mkdir -p /organizations/peerOrganizations/ripencc.rono.com/
export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/ripencc.rono.com/

fabric-ca-client enroll -u https://admin:adminpw@ca-ripencc:11054 --caname ca-ripencc --tls.certfiles "/organizations/fabric-ca/ripencc/tls-cert.pem"

echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-ripencc-11054-ca-ripencc.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-ripencc-11054-ca-ripencc.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-ripencc-11054-ca-ripencc.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-ripencc-11054-ca-ripencc.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/ripencc.rono.com/msp/config.yaml"



fabric-ca-client register --caname ca-ripencc --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/ripencc/tls-cert.pem"

fabric-ca-client register --caname ca-ripencc --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/ripencc/tls-cert.pem"

fabric-ca-client register --caname ca-ripencc --id.name ripenccadmin --id.secret ripenccadminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/ripencc/tls-cert.pem"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-ripencc:11054 --caname ca-ripencc -M "/organizations/peerOrganizations/ripencc.rono.com/peers/peer0.ripencc.rono.com/msp" --csr.hosts peer0.ripencc.rono.com --csr.hosts  peer0-ripencc --tls.certfiles "/organizations/fabric-ca/ripencc/tls-cert.pem"

cp "/organizations/peerOrganizations/ripencc.rono.com/msp/config.yaml" "/organizations/peerOrganizations/ripencc.rono.com/peers/peer0.ripencc.rono.com/msp/config.yaml"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-ripencc:11054 --caname ca-ripencc -M "/organizations/peerOrganizations/ripencc.rono.com/peers/peer0.ripencc.rono.com/tls" --enrollment.profile tls --csr.hosts peer0.ripencc.rono.com --csr.hosts  peer0-ripencc --csr.hosts ca-ripencc --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/ripencc/tls-cert.pem"


cp "/organizations/peerOrganizations/ripencc.rono.com/peers/peer0.ripencc.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/ripencc.rono.com/peers/peer0.ripencc.rono.com/tls/ca.crt"
cp "/organizations/peerOrganizations/ripencc.rono.com/peers/peer0.ripencc.rono.com/tls/signcerts/"* "/organizations/peerOrganizations/ripencc.rono.com/peers/peer0.ripencc.rono.com/tls/server.crt"
cp "/organizations/peerOrganizations/ripencc.rono.com/peers/peer0.ripencc.rono.com/tls/keystore/"* "/organizations/peerOrganizations/ripencc.rono.com/peers/peer0.ripencc.rono.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/ripencc.rono.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/ripencc.rono.com/peers/peer0.ripencc.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/ripencc.rono.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/ripencc.rono.com/tlsca"
cp "/organizations/peerOrganizations/ripencc.rono.com/peers/peer0.ripencc.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/ripencc.rono.com/tlsca/tlsca.ripencc.rono.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/ripencc.rono.com/ca"
cp "/organizations/peerOrganizations/ripencc.rono.com/peers/peer0.ripencc.rono.com/msp/cacerts/"* "/organizations/peerOrganizations/ripencc.rono.com/ca/ca.ripencc.rono.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-ripencc:11054 --caname ca-ripencc -M "/organizations/peerOrganizations/ripencc.rono.com/users/User1@ripencc.rono.com/msp" --tls.certfiles "/organizations/fabric-ca/ripencc/tls-cert.pem"

cp "/organizations/peerOrganizations/ripencc.rono.com/msp/config.yaml" "/organizations/peerOrganizations/ripencc.rono.com/users/User1@ripencc.rono.com/msp/config.yaml"

fabric-ca-client enroll -u https://ripenccadmin:ripenccadminpw@ca-ripencc:11054 --caname ca-ripencc -M "/organizations/peerOrganizations/ripencc.rono.com/users/Admin@ripencc.rono.com/msp" --tls.certfiles "/organizations/fabric-ca/ripencc/tls-cert.pem"

cp "/organizations/peerOrganizations/ripencc.rono.com/msp/config.yaml" "/organizations/peerOrganizations/ripencc.rono.com/users/Admin@ripencc.rono.com/msp/config.yaml"

{ set +x; } 2>/dev/null