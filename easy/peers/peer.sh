#!/bin/bash
set -e
run_in_container() {
  local POD=$1
  local CMD=$2
  kubectl exec "$POD" -- sh -c "$CMD"
}

echo "⏳ Creating application channel..."
kubectl exec deploy/cli-peer0-afrinic -- sh -c './scripts/createAppChannel.sh'

# Step 2: Join all peers to the channel
echo "✅ Joining peers to the channel..."
PEER_CLI_PODS=$(kubectl get pods -o name | grep cli-peer0)

for pod in $PEER_CLI_PODS; do
  echo "🔗 Joining channel on $pod..."
  run_in_container "$pod" "peer channel join -b ./channel-artifacts/mychannel.block || echo 'Already joined, skipping...'"
done

# Step 3: Update anchor peers 
echo " Updating anchor peers..."

for MSP in AfrinicMSP ApnicMSP ArinMSP LacnicMSP RipenccMSP RonoMSP; do
  case $MSP in
    AfrinicMSP) POD_MATCH="cli-peer0-afrinic" ;;
    ApnicMSP) POD_MATCH="cli-peer0-apnic" ;;
    ArinMSP) POD_MATCH="cli-peer0-arin" ;;
    LacnicMSP) POD_MATCH="cli-peer0-lacnic" ;;
    RipenccMSP) POD_MATCH="cli-peer0-ripencc" ;;
    RonoMSP) POD_MATCH="cli-peer0-rono" ;;
  esac

  POD_NAME=$(kubectl get pods -o name | grep "$POD_MATCH" | head -n1)
  echo "🚩 Updating anchor peer for $MSP in $POD_NAME..."
  run_in_container "$POD_NAME" "./scripts/updateAnchorPeer.sh $MSP"
done

echo " Done!"
