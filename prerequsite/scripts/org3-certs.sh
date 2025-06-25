set -x

mkdir -p /organizations/peerOrganizations/arin.rono.com/
export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/arin.rono.com/

fabric-ca-client enroll -u https://admin:adminpw@ca-arin:9054 --caname ca-arin --tls.certfiles "/organizations/fabric-ca/arin/tls-cert.pem"

echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-arin-9054-ca-arin.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-arin-9054-ca-arin.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-arin-9054-ca-arin.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-arin-9054-ca-arin.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/arin.rono.com/msp/config.yaml"



fabric-ca-client register --caname ca-arin --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/arin/tls-cert.pem"

fabric-ca-client register --caname ca-arin --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/arin/tls-cert.pem"

fabric-ca-client register --caname ca-arin --id.name arinadmin --id.secret arinadminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/arin/tls-cert.pem"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-arin:9054 --caname ca-arin -M "/organizations/peerOrganizations/arin.rono.com/peers/peer0.arin.rono.com/msp" --csr.hosts peer0.arin.rono.com --csr.hosts  peer0-arin --tls.certfiles "/organizations/fabric-ca/arin/tls-cert.pem"

cp "/organizations/peerOrganizations/arin.rono.com/msp/config.yaml" "/organizations/peerOrganizations/arin.rono.com/peers/peer0.arin.rono.com/msp/config.yaml"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-arin:9054 --caname ca-arin -M "/organizations/peerOrganizations/arin.rono.com/peers/peer0.arin.rono.com/tls" --enrollment.profile tls --csr.hosts peer0.arin.rono.com --csr.hosts  peer0-arin --csr.hosts ca-arin --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/arin/tls-cert.pem"


cp "/organizations/peerOrganizations/arin.rono.com/peers/peer0.arin.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/arin.rono.com/peers/peer0.arin.rono.com/tls/ca.crt"
cp "/organizations/peerOrganizations/arin.rono.com/peers/peer0.arin.rono.com/tls/signcerts/"* "/organizations/peerOrganizations/arin.rono.com/peers/peer0.arin.rono.com/tls/server.crt"
cp "/organizations/peerOrganizations/arin.rono.com/peers/peer0.arin.rono.com/tls/keystore/"* "/organizations/peerOrganizations/arin.rono.com/peers/peer0.arin.rono.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/arin.rono.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/arin.rono.com/peers/peer0.arin.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/arin.rono.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/arin.rono.com/tlsca"
cp "/organizations/peerOrganizations/arin.rono.com/peers/peer0.arin.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/arin.rono.com/tlsca/tlsca.arin.rono.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/arin.rono.com/ca"
cp "/organizations/peerOrganizations/arin.rono.com/peers/peer0.arin.rono.com/msp/cacerts/"* "/organizations/peerOrganizations/arin.rono.com/ca/ca.arin.rono.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-arin:9054 --caname ca-arin -M "/organizations/peerOrganizations/arin.rono.com/users/User1@arin.rono.com/msp" --tls.certfiles "/organizations/fabric-ca/arin/tls-cert.pem"

cp "/organizations/peerOrganizations/arin.rono.com/msp/config.yaml" "/organizations/peerOrganizations/arin.rono.com/users/User1@arin.rono.com/msp/config.yaml"

fabric-ca-client enroll -u https://arinadmin:arinadminpw@ca-arin:9054 --caname ca-arin -M "/organizations/peerOrganizations/arin.rono.com/users/Admin@arin.rono.com/msp" --tls.certfiles "/organizations/fabric-ca/arin/tls-cert.pem"

cp "/organizations/peerOrganizations/arin.rono.com/msp/config.yaml" "/organizations/peerOrganizations/arin.rono.com/users/Admin@arin.rono.com/msp/config.yaml"

{ set +x; } 2>/dev/null