
#!/bin/bash
set -e
if [[ -f /scripts/config.env ]]; then
  source /scripts/config.env
  echo "✅ config.env file found at /scripts/config.env"
else
  echo "❌ config.env file not found at /scripts/config.env(createChannel)"
  exit 1
fi
CHANNEL_NAME="$1"
DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"

: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="true"}

FABRIC_CFG_PATH=${PWD}/configtx


createChannelTx() {
  echo "🔧 Generating channel creation transaction for '${CHANNEL_NAME}'..."
  set -x
  configtxgen -profile TwoOrgsChannel \
    -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx \
    -channelID $CHANNEL_NAME
  res=$?
  { set +x; } 2>/dev/null
  if [ $res -ne 0 ]; then
    fatalln "❌ Failed to generate channel configuration transaction."
  fi
}


createAnchorPeerTx() {

  for ORG_MSP in "${MSPS[@]}"; do
    echo "🔧 Generating anchor peer update transaction for ${ORG_MSP}..."
    set -x
    configtxgen -profile TwoOrgsChannel \
      -outputAnchorPeersUpdate ./channel-artifacts/${ORG_MSP}anchors.tx \
      -channelID $CHANNEL_NAME \
      -asOrg $ORG_MSP
    res=$?
    { set +x; } 2>/dev/null
    if [ $res -ne 0 ]; then
      fatalln "❌ Failed to generate anchor peer update transaction for ${ORG_MSP}."
    fi
  done
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    fatalln "$2"
  fi
}


echo "🚀 Generating channel create transaction '${CHANNEL_NAME}.tx'"
createChannelTx

echo "🚀 Generating anchor peer update transactions"
createAnchorPeerTx

exit 0


# CHANNEL_NAME="$1"
# DELAY="$2"
# MAX_RETRY="$3"
# VERBOSE="$4"
# : ${CHANNEL_NAME:="mychannel"}
# : ${DELAY:="3"}
# : ${MAX_RETRY:="5"}
# : ${VERBOSE:="true"}
# FABRIC_CFG_PATH=${PWD}configtx


# createChannelTx() {

# 	set -x
# 	configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
# 	res=$?
# 	{ set +x; } 2>/dev/null
# 	if [ $res -ne 0 ]; then
# 		fatalln "Failed to generate channel configuration transaction..."
# 	fi

# }

# createAncorPeerTx() {

# 	for orgmsp in Org1MSP Org2MSP Org3MSP Org4MSP Org5MSP Org6MSP; do

# 	echo "Generating anchor peer update transaction for ${orgmsp}"
# 	set -x
# 	configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/${orgmsp}anchors.tx -channelID $CHANNEL_NAME -asOrg ${orgmsp}
# 	res=$?
# 	{ set +x; } 2>/dev/null
# 	if [ $res -ne 0 ]; then
# 		fatalln "Failed to generate anchor peer update transaction for ${orgmsp}..."
# 	fi
# 	done
# }



# verifyResult() {
#   if [ $1 -ne 0 ]; then
#     fatalln "$2"
#   fi
# }



# ## Create channeltx
# echo "Generating channel create transaction '${CHANNEL_NAME}.tx'"
# createChannelTx

# ## Create anchorpeertx
# echo "Generating anchor peer update transactions"
# createAncorPeerTx



# exit 0