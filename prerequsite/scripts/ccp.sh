#!/bin/bash

# Converts PEM file to one-line string
function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

# Generates JSON CCP
function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORG_CAP}/$6/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        connection-profile/ccp-template.json
}

# Generates YAML CCP
function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORG_CAP}/$6/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        connection-profile/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=afrinic
ORG_CAP=Afrinic
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/afrinic.rono.com/tlsca/tlsca.afrinic.rono.com-cert.pem
CAPEM=organizations/peerOrganizations/afrinic.rono.com/ca/ca.afrinic.rono.com-cert.pem
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_CAP)" > connection-profile/connection-afrinic.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_CAP)" > connection-profile/connection-afrinic.yaml

ORG=apnic
ORG_CAP=Apnic
P0PORT=9051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/apnic.rono.com/tlsca/tlsca.apnic.rono.com-cert.pem
CAPEM=organizations/peerOrganizations/apnic.rono.com/ca/ca.apnic.rono.com-cert.pem
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_CAP)" > connection-profile/connection-apnic.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_CAP)" > connection-profile/connection-apnic.yaml

ORG=arin
ORG_CAP=Arin
P0PORT=11051
CAPORT=9054
PEERPEM=organizations/peerOrganizations/arin.rono.com/tlsca/tlsca.arin.rono.com-cert.pem
CAPEM=organizations/peerOrganizations/arin.rono.com/ca/ca.arin.rono.com-cert.pem
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_CAP)" > connection-profile/connection-arin.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_CAP)" > connection-profile/connection-arin.yaml

ORG=ripencc
ORG_CAP=Ripencc
P0PORT=12051
CAPORT=11054
PEERPEM=organizations/peerOrganizations/ripencc.rono.com/tlsca/tlsca.ripencc.rono.com-cert.pem
CAPEM=organizations/peerOrganizations/ripencc.rono.com/ca/ca.ripencc.rono.com-cert.pem
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_CAP)" > connection-profile/connection-ripencc.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_CAP)" > connection-profile/connection-ripencc.yaml

ORG=lacnic
ORG_CAP=Lacnic
P0PORT=13051
CAPORT=12054
PEERPEM=organizations/peerOrganizations/lacnic.rono.com/tlsca/tlsca.lacnic.rono.com-cert.pem
CAPEM=organizations/peerOrganizations/lacnic.rono.com/ca/ca.lacnic.rono.com-cert.pem
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_CAP)" > connection-profile/connection-lacnic.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_CAP)" > connection-profile/connection-lacnic.yaml

ORG=rono
ORG_CAP=Rono
P0PORT=14051
CAPORT=13054
PEERPEM=organizations/peerOrganizations/rono.rono.com/tlsca/tlsca.rono.rono.com-cert.pem
CAPEM=organizations/peerOrganizations/rono.rono.com/ca/ca.rono.rono.com-cert.pem
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_CAP)" > connection-profile/connection-rono.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_CAP)" > connection-profile/connection-rono.yaml



