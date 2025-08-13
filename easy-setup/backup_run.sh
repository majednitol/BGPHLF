#!/bin/bash
set -e

SCRIPT_DIR=$(cd "$(dirname "$0")"; pwd)

echo "Applying Persistent Volume (pv.yaml) from 1.nfs"
kubectl apply -f "$SCRIPT_DIR/../1.nfs/pv.yaml"

echo "Applying Persistent Volume Claim (pvc.yaml) from 1.nfs"
kubectl apply -f "$SCRIPT_DIR/../1.nfs/pvc.yaml"

echo "Deploying NFS client pod from 1.nfs"
kubectl apply -f "$SCRIPT_DIR/../1.nfs/pod.yaml"

echo "Deploying Certificate Authority from 2.ca"
bash "$SCRIPT_DIR/../2.ca/deploy_ca.sh"

echo "Deploying Orderer components from 5.orderer"
bash "$SCRIPT_DIR/../5.orderer/deploy_orderers.sh"

echo "Creating configMap for builders from 6.configMap"
kubectl apply -f "$SCRIPT_DIR/../6.configMap/builder-config.yaml"

echo "Deploying Peer nodes from 7.peer"
bash "$SCRIPT_DIR/../7.peers/deploy_peers_org.sh"
bash "$SCRIPT_DIR/../7.peers/deploy_cli_peers.sh"
bash "$SCRIPT_DIR/../7.peers/peer.sh"

echo "Packaging and preparing chaincode from 8.chaincode"
bash "$SCRIPT_DIR/../8.chaincode/package.sh"
bash "$SCRIPT_DIR/../8.chaincode/p.sh"

echo "Deploying chaincode lifecycle from 9.cc-deploy"
bash "$SCRIPT_DIR/../9.cc-deploy/basic/deploy_chaincodes.sh"
bash "$SCRIPT_DIR/../9.cc-deploy/basic/lifecycle_chaincode.sh"

echo "Deploying API services from 10.api"
kubectl apply -f "$SCRIPT_DIR/../10.api/src/k8/configmap.yaml"
kubectl apply -f "$SCRIPT_DIR/../10.api/src/k8/couchdb.yaml"
kubectl apply -f "$SCRIPT_DIR/../10.api/src/k8/api.yaml"

echo "Deploying BGP route configuration from 10.api"
kubectl apply -f "$SCRIPT_DIR/../10.api/src/bgp-k8s/gobgp-k8s.yaml"
