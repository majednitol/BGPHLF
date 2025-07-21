set -x

mkdir -p /organizations/peerOrganizations/afrinic.rono.com/

export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/afrinic.rono.com/

fabric-ca-client enroll -u https://admin:adminpw@ca-afrinic:7054 --caname ca-afrinic --tls.certfiles "/organizations/fabric-ca/afrinic/tls-cert.pem"

echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-afrinic-7054-ca-afrinic.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-afrinic-7054-ca-afrinic.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-afrinic-7054-ca-afrinic.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-afrinic-7054-ca-afrinic.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/afrinic.rono.com/msp/config.yaml"



fabric-ca-client register --caname ca-afrinic --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/afrinic/tls-cert.pem"



fabric-ca-client register --caname ca-afrinic --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/afrinic/tls-cert.pem"




fabric-ca-client register --caname ca-afrinic --id.name afrinicadmin --id.secret afrinicadminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/afrinic/tls-cert.pem"



fabric-ca-client enroll -u https://peer0:peer0pw@ca-afrinic:7054 --caname ca-afrinic -M "/organizations/peerOrganizations/afrinic.rono.com/peers/peer0.afrinic.rono.com/msp" --csr.hosts peer0.afrinic.rono.com --csr.hosts  peer0-afrinic --tls.certfiles "/organizations/fabric-ca/afrinic/tls-cert.pem"



cp "/organizations/peerOrganizations/afrinic.rono.com/msp/config.yaml" "/organizations/peerOrganizations/afrinic.rono.com/peers/peer0.afrinic.rono.com/msp/config.yaml"



fabric-ca-client enroll -u https://peer0:peer0pw@ca-afrinic:7054 --caname ca-afrinic -M "/organizations/peerOrganizations/afrinic.rono.com/peers/peer0.afrinic.rono.com/tls" --enrollment.profile tls --csr.hosts peer0.afrinic.rono.com --csr.hosts  peer0-afrinic --csr.hosts ca-afrinic --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/afrinic/tls-cert.pem"




cp "/organizations/peerOrganizations/afrinic.rono.com/peers/peer0.afrinic.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/afrinic.rono.com/peers/peer0.afrinic.rono.com/tls/ca.crt"
cp "/organizations/peerOrganizations/afrinic.rono.com/peers/peer0.afrinic.rono.com/tls/signcerts/"* "/organizations/peerOrganizations/afrinic.rono.com/peers/peer0.afrinic.rono.com/tls/server.crt"
cp "/organizations/peerOrganizations/afrinic.rono.com/peers/peer0.afrinic.rono.com/tls/keystore/"* "/organizations/peerOrganizations/afrinic.rono.com/peers/peer0.afrinic.rono.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/afrinic.rono.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/afrinic.rono.com/peers/peer0.afrinic.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/afrinic.rono.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/afrinic.rono.com/tlsca"
cp "/organizations/peerOrganizations/afrinic.rono.com/peers/peer0.afrinic.rono.com/tls/tlscacerts/"* "/organizations/peerOrganizations/afrinic.rono.com/tlsca/tlsca.afrinic.rono.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/afrinic.rono.com/ca"
cp "/organizations/peerOrganizations/afrinic.rono.com/peers/peer0.afrinic.rono.com/msp/cacerts/"* "/organizations/peerOrganizations/afrinic.rono.com/ca/ca.afrinic.rono.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-afrinic:7054 --caname ca-afrinic -M "/organizations/peerOrganizations/afrinic.rono.com/users/User1@afrinic.rono.com/msp" --tls.certfiles "/organizations/fabric-ca/afrinic/tls-cert.pem"

cp "/organizations/peerOrganizations/afrinic.rono.com/msp/config.yaml" "/organizations/peerOrganizations/afrinic.rono.com/users/User1@afrinic.rono.com/msp/config.yaml"

fabric-ca-client enroll -u https://afrinicadmin:afrinicadminpw@ca-afrinic:7054 --caname ca-afrinic -M "/organizations/peerOrganizations/afrinic.rono.com/users/Admin@afrinic.rono.com/msp" --tls.certfiles "/organizations/fabric-ca/afrinic/tls-cert.pem"

cp "/organizations/peerOrganizations/afrinic.rono.com/msp/config.yaml" "/organizations/peerOrganizations/afrinic.rono.com/users/Admin@afrinic.rono.com/msp/config.yaml"

{ set +x; } 2>/dev/null
