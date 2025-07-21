#!/bin/bash
set -e

SCRIPT_DIR=$(cd "$(dirname "$0")"; pwd)

# echo "Applying Persistent Volume (pv.yaml) from 1.nfs"
# kubectl apply -f "$SCRIPT_DIR/../1.nfs/pv.yaml"

# echo "Applying Persistent Volume Claim (pvc.yaml) from 1.nfs"
# kubectl apply -f "$SCRIPT_DIR/../1.nfs/pvc.yaml"

# echo "Deploying NFS client pod from 1.nfs"
# kubectl apply -f "$SCRIPT_DIR/../1.nfs/pod.yaml"
# sleep 10
# echo "Deploying Certificate Authority from 2.ca"
# bash "$SCRIPT_DIR/../2.ca/deploy_ca.sh"

# echo "Running certificate creation job from 3.certificates"
# kubectl apply -f "$SCRIPT_DIR/../3.certifcates/job.yaml"
# sleep 10
# kubectl logs job/create-certs -f

# echo "Running artifact generation job from 4.artifacts"
# kubectl apply -f "$SCRIPT_DIR/../4.artifacts/job.yaml"
# sleep 10
# kubectl logs job/artifacts -f

# echo "Deploying Orderer components from 5.orderer"
# bash "$SCRIPT_DIR/../5.orderer/deploy_orderers.sh"

# echo "Creating configMap for builders from 6.configMap"
# kubectl apply -f "$SCRIPT_DIR/../6.configMap/builder-config.yaml"

# echo "Deploying Peer nodes from 7.peer"
# bash "$SCRIPT_DIR/../7.peers/deploy_peers_org.sh"
# bash "$SCRIPT_DIR/../7.peers/deploy_cli_peers.sh"
# bash "$SCRIPT_DIR/../7.peers/peer.sh"
# sleep 10
# echo "Packaging and preparing chaincode from 8.chaincode"
# bash "$SCRIPT_DIR/../8.chaincode/package.sh"
# bash "$SCRIPT_DIR/../8.chaincode/p.sh"
# sleep 10
# echo "Deploying chaincode lifecycle from 9.cc-deploy"
# bash "$SCRIPT_DIR/../9.cc-deploy/basic/deploy_chaincodes.sh"
# bash "$SCRIPT_DIR/../9.cc-deploy/basic/lifecycle_chaincode.sh"

echo "creating connection profile"
echo "📁 Switching to nfs_clientshare directory to generate connection profile..."
cd ../../nfs_clientshare || { echo "❌ Failed to switch to nfs_clientshare"; exit 1; }

echo "▶ Running ccp.sh..."
./scripts/ccp.sh || { echo "❌ ccp.sh failed to run"; exit 1; }

# Optional: check result
echo "📁 Checking generated connection profiles:"
ls -l ./connection-profile || echo "❌ No connection profiles found."

echo "Deploying API services from 10.api"
kubectl apply -f "$SCRIPT_DIR/../10.api/src/k8/configmap.yaml"
kubectl apply -f "$SCRIPT_DIR/../10.api/src/k8/couchdb.yaml"
kubectl apply -f "$SCRIPT_DIR/../10.api/src/k8/api.yaml"

echo "Deploying BGP route configuration from 10.api"
kubectl apply -f "$SCRIPT_DIR/../10.api/src/bgp-k8s/gobgp-k8s.yaml"
