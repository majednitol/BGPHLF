set -x

mkdir -p /organizations/peerOrganizations/lacnic.rono.com/
export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/lacnic.rono.com/

fabric-ca-client enroll -u https://admin:adminpw@ca-lacnic:12054 --caname ca-lacnic --tls.certfiles "/organizations/fabric-ca/lacnic/tls-cert.pem"

echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-lacnic-12054-ca-lacnic.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-lacnic-12054-ca-lacnic.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-lacnic-12054-ca-lacnic.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-lacnic-12054-ca-lacnic.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/lacnic.rono.com/msp/config.yaml"



fabric-ca-client register --caname ca-lacnic --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/lacnic/tls-cert.pem"

fabric-ca-client register --caname ca-lacnic --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/lacnic/tls-cert.pem"

fabric-ca-client register --caname ca-lacnic --id.name lacnicadmin --id.secret lacnicadminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/lacnic/tls-cert.pem"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-lacnic:12054 --caname ca-lacnic -M "/organizations/peerOrganizations/lacnic.rono.com/peers/peer0.lacnic.rono.com/msp" --csr.hosts peer0.lacnic.rono.com --csr.hosts  peer0-lacnic --tls.certfiles "/organizations/fabric-ca/lacnic/tls-cert.pem"

cp "/organizations/peerOrganizations/lacnic.rono.com/msp/config.yaml" "/organizations/peerOrganizations/lacnic.rono.com/peers/peer0.lacnic.rono.com/msp/config.yaml"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-lacnic:12054 --caname ca-lacnic -M "/organizations/peerOrganizations/lacnic.rono.com/peers/peer0.lacnic.rono.com/tls" --enrollment.profile tls --csr.hosts peer0.lacnic.rono.com --csr.hosts  peer0-lacnic --csr.hosts ca-lacnic --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/lacnic/tls-cert.pem"


cp "/organizations/peerOrganizations/lacnic.rono.com/peers/peer0.lacnic.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/lacnic.rono.com/peers/peer0.lacnic.rono.com/tls/ca.crt"
cp "/organizations/peerOrganizations/lacnic.rono.com/peers/peer0.lacnic.rono.com/tls/signcerts/"* "/organizations/peerOrganizations/lacnic.rono.com/peers/peer0.lacnic.rono.com/tls/server.crt"
cp "/organizations/peerOrganizations/lacnic.rono.com/peers/peer0.lacnic.rono.com/tls/keystore/"* "/organizations/peerOrganizations/lacnic.rono.com/peers/peer0.lacnic.rono.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/lacnic.rono.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/lacnic.rono.com/peers/peer0.lacnic.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/lacnic.rono.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/lacnic.rono.com/tlsca"
cp "/organizations/peerOrganizations/lacnic.rono.com/peers/peer0.lacnic.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/lacnic.rono.com/tlsca/tlsca.lacnic.rono.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/lacnic.rono.com/ca"
cp "/organizations/peerOrganizations/lacnic.rono.com/peers/peer0.lacnic.rono.com/msp/cacerts/"* "/organizations/peerOrganizations/lacnic.rono.com/ca/ca.lacnic.rono.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-lacnic:12054 --caname ca-lacnic -M "/organizations/peerOrganizations/lacnic.rono.com/users/User1@lacnic.rono.com/msp" --tls.certfiles "/organizations/fabric-ca/lacnic/tls-cert.pem"

cp "/organizations/peerOrganizations/lacnic.rono.com/msp/config.yaml" "/organizations/peerOrganizations/lacnic.rono.com/users/User1@lacnic.rono.com/msp/config.yaml"

fabric-ca-client enroll -u https://lacnicadmin:lacnicadminpw@ca-lacnic:12054 --caname ca-lacnic -M "/organizations/peerOrganizations/lacnic.rono.com/users/Admin@lacnic.rono.com/msp" --tls.certfiles "/organizations/fabric-ca/lacnic/tls-cert.pem"

cp "/organizations/peerOrganizations/lacnic.rono.com/msp/config.yaml" "/organizations/peerOrganizations/lacnic.rono.com/users/Admin@lacnic.rono.com/msp/config.yaml"

{ set +x; } 2>/dev/null