set -x

mkdir -p /organizations/peerOrganizations/org4.example.com/
export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/org4.example.com/

fabric-ca-client enroll -u https://admin:adminpw@ca-org4:11054 --caname ca-org4 --tls.certfiles "/organizations/fabric-ca/org4/tls-cert.pem"

echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-org4-11054-ca-org4.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-org4-11054-ca-org4.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-org4-11054-ca-org4.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-org4-11054-ca-org4.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/org4.example.com/msp/config.yaml"



fabric-ca-client register --caname ca-org4 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/org4/tls-cert.pem"

fabric-ca-client register --caname ca-org4 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/org4/tls-cert.pem"

fabric-ca-client register --caname ca-org4 --id.name org4admin --id.secret org4adminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/org4/tls-cert.pem"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-org4:11054 --caname ca-org4 -M "/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/msp" --csr.hosts peer0.org4.example.com --csr.hosts  peer0-org4 --tls.certfiles "/organizations/fabric-ca/org4/tls-cert.pem"

cp "/organizations/peerOrganizations/org4.example.com/msp/config.yaml" "/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/msp/config.yaml"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-org4:11054 --caname ca-org4 -M "/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls" --enrollment.profile tls --csr.hosts peer0.org4.example.com --csr.hosts  peer0-org4 --csr.hosts ca-org4 --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/org4/tls-cert.pem"


cp "/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/ca.crt"
cp "/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/signcerts/"* "/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/server.crt"
cp "/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/keystore/"* "/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/org4.example.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org4.example.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/org4.example.com/tlsca"
cp "/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org4.example.com/tlsca/tlsca.org4.example.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/org4.example.com/ca"
cp "/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/msp/cacerts/"* "/organizations/peerOrganizations/org4.example.com/ca/ca.org4.example.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-org4:11054 --caname ca-org4 -M "/organizations/peerOrganizations/org4.example.com/users/User1@org4.example.com/msp" --tls.certfiles "/organizations/fabric-ca/org4/tls-cert.pem"

cp "/organizations/peerOrganizations/org4.example.com/msp/config.yaml" "/organizations/peerOrganizations/org4.example.com/users/User1@org4.example.com/msp/config.yaml"

fabric-ca-client enroll -u https://org4admin:org4adminpw@ca-org4:11054 --caname ca-org4 -M "/organizations/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp" --tls.certfiles "/organizations/fabric-ca/org4/tls-cert.pem"

cp "/organizations/peerOrganizations/org4.example.com/msp/config.yaml" "/organizations/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp/config.yaml"

{ set +x; } 2>/dev/null