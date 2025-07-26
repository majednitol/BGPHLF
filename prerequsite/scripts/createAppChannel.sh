#!/bin/bash
set -e
if [[ -f /scripts/config.env ]]; then
  source /scripts/config.env
  echo "✅ config.env file found at /scripts/config.env"
else
  echo "❌ config.env file not found at /scripts/config.env(appChannel)"
  exit 1
fi

peer channel create -o orderer:7050 -c mychannel -f ./channel-artifacts/mychannel.tx --outputBlock ./channel-artifacts/mychannel.block --tls --cafile /organizations/ordererOrganizations/${MAIN_DOMAIN}/orderers/orderer.${MAIN_DOMAIN}/msp/tlscacerts/tlsca.${MAIN_DOMAIN}-cert.pem