#!/bin/bash
set -e
if [[ -f ../config.env ]]; then
  source ../config.env
else
  echo "❌ config.env file not found!"
  exit 1
fi
run_in_container() {
  local POD=$1
  local CMD=$2
  kubectl exec "$POD" -- sh -c "$CMD"
}

# Step 1: Create application channel
echo "⏳ Creating application channel..."
kubectl exec "deploy/cli-peer0-${ORG_NAMES[1]}" -- sh -c './scripts/createAppChannel.sh'

# Step 2: Join all peers to the channel
echo "✅ Joining peers to the channel..."
PEER_CLI_PODS=$(kubectl get pods -o name | grep cli-peer0)

for pod in $PEER_CLI_PODS; do
  echo "🔗 Joining channel on $pod..."
  run_in_container "$pod" "peer channel join -b ./channel-artifacts/mychannel.block || echo 'Already joined, skipping...'"
done

# Step 3: Update anchor peers using arrays
echo "🔄 Updating anchor peers..."

ORG_NAMES=( "${ORG_NAMES[@]:1}" )
for i in "${!MSPS[@]}"; do
  MSP="${MSPS[$i]}"
  ORG="${ORG_NAMES[$i]}"
  POD_MATCH="cli-peer0-$ORG"
  POD_NAME=$(kubectl get pods -o name | grep "$POD_MATCH" | head -n1)

  if [[ -n "$POD_NAME" ]]; then
    echo "🚩 Updating anchor peer for $MSP in $POD_NAME..."
    run_in_container "$POD_NAME" "./scripts/updateAnchorPeer.sh $MSP"
  else
    echo "⚠️ Could not find pod for $MSP ($POD_MATCH), skipping..."
  fi
done

echo "✅ Done!"


