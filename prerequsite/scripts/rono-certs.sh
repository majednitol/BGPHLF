set -x

mkdir -p /organizations/peerOrganizations/rono.rono.com/
export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/rono.rono.com/

fabric-ca-client enroll -u https://admin:adminpw@ca-rono:13054 --caname ca-rono --tls.certfiles "/organizations/fabric-ca/rono/tls-cert.pem"

echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-rono-13054-ca-rono.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-rono-13054-ca-rono.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-rono-13054-ca-rono.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-rono-13054-ca-rono.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/rono.rono.com/msp/config.yaml"



fabric-ca-client register --caname ca-rono --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/rono/tls-cert.pem"

fabric-ca-client register --caname ca-rono --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/rono/tls-cert.pem"

fabric-ca-client register --caname ca-rono --id.name ronoadmin --id.secret ronoadminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/rono/tls-cert.pem"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-rono:13054 --caname ca-rono -M "/organizations/peerOrganizations/rono.rono.com/peers/peer0.rono.rono.com/msp" --csr.hosts peer0.rono.rono.com --csr.hosts  peer0-rono --tls.certfiles "/organizations/fabric-ca/rono/tls-cert.pem"

cp "/organizations/peerOrganizations/rono.rono.com/msp/config.yaml" "/organizations/peerOrganizations/rono.rono.com/peers/peer0.rono.rono.com/msp/config.yaml"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-rono:13054 --caname ca-rono -M "/organizations/peerOrganizations/rono.rono.com/peers/peer0.rono.rono.com/tls" --enrollment.profile tls --csr.hosts peer0.rono.rono.com --csr.hosts  peer0-rono --csr.hosts ca-rono --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/rono/tls-cert.pem"


cp "/organizations/peerOrganizations/rono.rono.com/peers/peer0.rono.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/rono.rono.com/peers/peer0.rono.rono.com/tls/ca.crt"
cp "/organizations/peerOrganizations/rono.rono.com/peers/peer0.rono.rono.com/tls/signcerts/"* "/organizations/peerOrganizations/rono.rono.com/peers/peer0.rono.rono.com/tls/server.crt"
cp "/organizations/peerOrganizations/rono.rono.com/peers/peer0.rono.rono.com/tls/keystore/"* "/organizations/peerOrganizations/rono.rono.com/peers/peer0.rono.rono.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/rono.rono.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/rono.rono.com/peers/peer0.rono.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/rono.rono.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/rono.rono.com/tlsca"
cp "/organizations/peerOrganizations/rono.rono.com/peers/peer0.rono.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/rono.rono.com/tlsca/tlsca.rono.rono.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/rono.rono.com/ca"
cp "/organizations/peerOrganizations/rono.rono.com/peers/peer0.rono.rono.com/msp/cacerts/"* "/organizations/peerOrganizations/rono.rono.com/ca/ca.rono.rono.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-rono:13054 --caname ca-rono -M "/organizations/peerOrganizations/rono.rono.com/users/User1@rono.rono.com/msp" --tls.certfiles "/organizations/fabric-ca/rono/tls-cert.pem"

cp "/organizations/peerOrganizations/rono.rono.com/msp/config.yaml" "/organizations/peerOrganizations/rono.rono.com/users/User1@rono.rono.com/msp/config.yaml"

fabric-ca-client enroll -u https://ronoadmin:ronoadminpw@ca-rono:13054 --caname ca-rono -M "/organizations/peerOrganizations/rono.rono.com/users/Admin@rono.rono.com/msp" --tls.certfiles "/organizations/fabric-ca/rono/tls-cert.pem"

cp "/organizations/peerOrganizations/rono.rono.com/msp/config.yaml" "/organizations/peerOrganizations/rono.rono.com/users/Admin@rono.rono.com/msp/config.yaml"

{ set +x; } 2>/dev/null