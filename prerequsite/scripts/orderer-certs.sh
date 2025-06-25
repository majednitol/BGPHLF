
  sleep 2
  mkdir -p organizations/ordererOrganizations/rono.com

  export FABRIC_CA_CLIENT_HOME=/organizations/ordererOrganizations/rono.com
echo $FABRIC_CA_CLIENT_HOME

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@ca-orderer:10054 --caname ca-orderer --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-orderer-10054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-orderer-10054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-orderer-10054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-orderer-10054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' >/organizations/ordererOrganizations/rono.com/msp/config.yaml

  echo "Register orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null


  echo "Register orderer2"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer2 --id.secret ordererpw --id.type orderer --tls.certfiles  /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  echo "Register orderer3"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer3 --id.secret ordererpw --id.type orderer --tls.certfiles  /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null


  echo "Register orderer4"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer4 --id.secret ordererpw --id.type orderer --tls.certfiles  /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  echo "Register orderer5"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer5 --id.secret ordererpw --id.type orderer --tls.certfiles  /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null




  echo "Register the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/ordererOrganizations/rono.com/orderers

  mkdir -p organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com

  echo "Generate the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@ca-orderer:10054 --caname ca-orderer -M /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/msp --csr.hosts orderer.rono.com --csr.hosts localhost --csr.hosts ca-orderer --csr.hosts orderer --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp /organizations/ordererOrganizations/rono.com/msp/config.yaml /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/msp/config.yaml

  echo "Generate the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@ca-orderer:10054 --caname ca-orderer -M /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/tls --enrollment.profile tls --csr.hosts orderer.rono.com --csr.hosts localhost --csr.hosts ca-orderer --csr.hosts orderer --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/tls/ca.crt
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/tls/signcerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/tls/server.crt
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/tls/keystore/* /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/tls/server.key

  mkdir -p /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/msp/tlscacerts
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/msp/tlscacerts/tlsca.rono.com-cert.pem

  mkdir -p /organizations/ordererOrganizations/rono.com/msp/tlscacerts
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/msp/tlscacerts/tlsca.rono.com-cert.pem

  mkdir -p organizations/ordererOrganizations/rono.com/users
  mkdir -p organizations/ordererOrganizations/rono.com/users/Admin@rono.com


  # -----------------------------------------------------------------------
  #  Orderer 2

  mkdir -p organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com

  echo "Generate the orderer2 msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@ca-orderer:10054 --caname ca-orderer -M /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/msp --csr.hosts orderer2.rono.com --csr.hosts localhost --csr.hosts ca-orderer --csr.hosts orderer2 --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp /organizations/ordererOrganizations/rono.com/msp/config.yaml /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/msp/config.yaml

  echo "Generate the orderer2-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@ca-orderer:10054 --caname ca-orderer -M /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/tls --enrollment.profile tls --csr.hosts orderer2.rono.com --csr.hosts localhost --csr.hosts ca-orderer2 --csr.hosts orderer2 --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/tls/ca.crt
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/tls/signcerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/tls/server.crt
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/tls/keystore/* /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/tls/server.key

  mkdir -p /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/msp/tlscacerts
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/msp/tlscacerts/tlsca.rono.com-cert.pem

  mkdir -p /organizations/ordererOrganizations/rono.com/msp/tlscacerts
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer2.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/msp/tlscacerts/tlsca.rono.com-cert.pem



  # -----------------------------------------------------------------------
  #  Orderer 3

  mkdir -p organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com

  echo "Generate the orderer3 msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@ca-orderer:10054 --caname ca-orderer -M /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/msp --csr.hosts orderer3.rono.com --csr.hosts localhost --csr.hosts ca-orderer --csr.hosts orderer3 --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp /organizations/ordererOrganizations/rono.com/msp/config.yaml /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/msp/config.yaml

  echo "Generate the orderer3-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@ca-orderer:10054 --caname ca-orderer -M /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/tls --enrollment.profile tls --csr.hosts orderer3.rono.com --csr.hosts localhost --csr.hosts ca-orderer --csr.hosts orderer3 --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/tls/ca.crt
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/tls/signcerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/tls/server.crt
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/tls/keystore/* /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/tls/server.key

  mkdir -p /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/msp/tlscacerts
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/msp/tlscacerts/tlsca.rono.com-cert.pem

  mkdir -p /organizations/ordererOrganizations/rono.com/msp/tlscacerts
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer3.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/msp/tlscacerts/tlsca.rono.com-cert.pem




  # -----------------------------------------------------------------------
  #  Orderer 4

  mkdir -p organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com

  echo "Generate the orderer4 msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@ca-orderer:10054 --caname ca-orderer -M /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/msp --csr.hosts orderer4.rono.com --csr.hosts localhost --csr.hosts ca-orderer --csr.hosts orderer4 --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp /organizations/ordererOrganizations/rono.com/msp/config.yaml /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/msp/config.yaml

  echo "Generate the orderer4-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@ca-orderer:10054 --caname ca-orderer -M /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/tls --enrollment.profile tls --csr.hosts orderer4.rono.com --csr.hosts localhost --csr.hosts ca-orderer4 --csr.hosts orderer4 --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/tls/ca.crt
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/tls/signcerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/tls/server.crt
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/tls/keystore/* /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/tls/server.key

  mkdir -p /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/msp/tlscacerts
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/msp/tlscacerts/tlsca.rono.com-cert.pem

  mkdir -p /organizations/ordererOrganizations/rono.com/msp/tlscacerts
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer4.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/msp/tlscacerts/tlsca.rono.com-cert.pem




  # -----------------------------------------------------------------------
  #  Orderer 5

  mkdir -p organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com

  echo "Generate the orderer5 msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@ca-orderer:10054 --caname ca-orderer -M /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/msp --csr.hosts orderer5.rono.com --csr.hosts localhost --csr.hosts ca-orderer --csr.hosts orderer5 --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp /organizations/ordererOrganizations/rono.com/msp/config.yaml /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/msp/config.yaml

  echo "Generate the orderer5-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@ca-orderer:10054 --caname ca-orderer -M /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/tls --enrollment.profile tls --csr.hosts orderer5.rono.com --csr.hosts localhost --csr.hosts ca-orderer5 --csr.hosts orderer5 --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/tls/ca.crt
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/tls/signcerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/tls/server.crt
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/tls/keystore/* /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/tls/server.key

  mkdir -p /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/msp/tlscacerts
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/msp/tlscacerts/tlsca.rono.com-cert.pem

  mkdir -p /organizations/ordererOrganizations/rono.com/msp/tlscacerts
  cp /organizations/ordererOrganizations/rono.com/orderers/orderer5.rono.com/tls/tlscacerts/* /organizations/ordererOrganizations/rono.com/msp/tlscacerts/tlsca.rono.com-cert.pem



  echo "Generate the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@ca-orderer:10054 --caname ca-orderer -M /organizations/ordererOrganizations/rono.com/users/Admin@rono.com/msp --tls.certfiles /organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp /organizations/ordererOrganizations/rono.com/msp/config.yaml /organizations/ordererOrganizations/rono.com/users/Admin@rono.com/msp/config.yaml
