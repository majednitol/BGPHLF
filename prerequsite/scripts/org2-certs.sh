  set -x
mkdir -p /organizations/peerOrganizations/apnic.rono.com/
export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/apnic.rono.com/

fabric-ca-client enroll -u https://admin:adminpw@ca-apnic:8054 --caname ca-apnic --tls.certfiles "/organizations/fabric-ca/apnic/tls-cert.pem"

echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-apnic-8054-ca-apnic.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-apnic-8054-ca-apnic.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-apnic-8054-ca-apnic.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-apnic-8054-ca-apnic.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/apnic.rono.com/msp/config.yaml"



fabric-ca-client register --caname ca-apnic --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/apnic/tls-cert.pem"

fabric-ca-client register --caname ca-apnic --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/apnic/tls-cert.pem"

fabric-ca-client register --caname ca-apnic --id.name apnicadmin --id.secret apnicadminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/apnic/tls-cert.pem"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-apnic:8054 --caname ca-apnic -M "/organizations/peerOrganizations/apnic.rono.com/peers/peer0.apnic.rono.com/msp" --csr.hosts peer0.apnic.rono.com --csr.hosts  peer0-apnic --tls.certfiles "/organizations/fabric-ca/apnic/tls-cert.pem"

cp "/organizations/peerOrganizations/apnic.rono.com/msp/config.yaml" "/organizations/peerOrganizations/apnic.rono.com/peers/peer0.apnic.rono.com/msp/config.yaml"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-apnic:8054 --caname ca-apnic -M "/organizations/peerOrganizations/apnic.rono.com/peers/peer0.apnic.rono.com/tls" --enrollment.profile tls --csr.hosts peer0.apnic.rono.com --csr.hosts  peer0-apnic --csr.hosts ca-apnic --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/apnic/tls-cert.pem"


cp "/organizations/peerOrganizations/apnic.rono.com/peers/peer0.apnic.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/apnic.rono.com/peers/peer0.apnic.rono.com/tls/ca.crt"
cp "/organizations/peerOrganizations/apnic.rono.com/peers/peer0.apnic.rono.com/tls/signcerts/"* "/organizations/peerOrganizations/apnic.rono.com/peers/peer0.apnic.rono.com/tls/server.crt"
cp "/organizations/peerOrganizations/apnic.rono.com/peers/peer0.apnic.rono.com/tls/keystore/"* "/organizations/peerOrganizations/apnic.rono.com/peers/peer0.apnic.rono.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/apnic.rono.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/apnic.rono.com/peers/peer0.apnic.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/apnic.rono.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/apnic.rono.com/tlsca"
cp "/organizations/peerOrganizations/apnic.rono.com/peers/peer0.apnic.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/apnic.rono.com/tlsca/tlsca.apnic.rono.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/apnic.rono.com/ca"
cp "/organizations/peerOrganizations/apnic.rono.com/peers/peer0.apnic.rono.com/msp/cacerts/"* "/organizations/peerOrganizations/apnic.rono.com/ca/ca.apnic.rono.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-apnic:8054 --caname ca-apnic -M "/organizations/peerOrganizations/apnic.rono.com/users/User1@apnic.rono.com/msp" --tls.certfiles "/organizations/fabric-ca/apnic/tls-cert.pem"

cp "/organizations/peerOrganizations/apnic.rono.com/msp/config.yaml" "/organizations/peerOrganizations/apnic.rono.com/users/User1@apnic.rono.com/msp/config.yaml"

fabric-ca-client enroll -u https://apnicadmin:apnicadminpw@ca-apnic:8054 --caname ca-apnic -M "/organizations/peerOrganizations/apnic.rono.com/users/Admin@apnic.rono.com/msp" --tls.certfiles "/organizations/fabric-ca/apnic/tls-cert.pem"

cp "/organizations/peerOrganizations/apnic.rono.com/msp/config.yaml" "/organizations/peerOrganizations/apnic.rono.com/users/Admin@apnic.rono.com/msp/config.yaml"

  { set +x; } 2>/dev/null