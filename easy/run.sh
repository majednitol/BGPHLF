#!/bin/bash
set -e

SCRIPT_DIR=$(cd "$(dirname "$0")"; pwd)

# echo "🔧 Applying pv.yaml from 1.nfs"
# kubectl apply -f "$SCRIPT_DIR/../1.nfs/pv.yaml"

# echo "🔧 Applying pvc.yaml from 1.nfs"
# kubectl apply -f "$SCRIPT_DIR/../1.nfs/pvc.yaml"

# echo "🔧 Applying pod.yaml from 1.nfs"
# kubectl apply -f "$SCRIPT_DIR/../1.nfs/pod.yaml"

# echo "🚀 Applying CA from 2.ca"
# bash "$SCRIPT_DIR/../2.ca/deploy_ca.sh"

# echo "applying certificates from 3.certificates"
#  kubectl apply -f "$SCRIPT_DIR/../3.certifcates/job.yaml"
# echo "applying artifacts from 4.artifacts"
#  kubectl apply -f "$SCRIPT_DIR/../4.artifacts/job.yaml"
# echo "applying orderer from 5.orderer"
# bash "$SCRIPT_DIR/../5.orderer/deploy_orderers.sh"
# echo "applying configMap from 6.configMap"
#  kubectl apply -f "$SCRIPT_DIR/../6.configMap/builder-config.yaml"
# echo "applying peer from 7.peer"
# bash "$SCRIPT_DIR/../7.peers/deploy_peers_org.sh"
# bash "$SCRIPT_DIR/../7.peers/deploy_cli_peers.sh"
# bash "$SCRIPT_DIR/../7.peers/peer.sh"
echo "applying chaincode from 8.chaincode"
# bash "$SCRIPT_DIR/../8.chaincode/package.sh"
# bash "$SCRIPT_DIR/../8.chaincode/p.sh"
echo "applying cc-deply from 9.cc-deploy"
# bash "$SCRIPT_DIR/../9.cc-deploy/basic/deploy_chaincodes.sh"
bash "$SCRIPT_DIR/../9.cc-deploy/basic/lifecycle_chaincode.sh"
echo "applying api from 10.api"
kubectl apply -f "$SCRIPT_DIR/../10.api/src/k8/configmap.yaml"
kubectl apply -f "$SCRIPT_DIR/../10.api/src/k8/couchdb.yaml"
kubectl apply -f "$SCRIPT_DIR/../10.api/src/k8/api.yaml"
echo "applying bgp route from 10.api"
kubectl apply -f "$SCRIPT_DIR/../10.api/src/bgp-k8s/gobgp-k8s.yaml"






