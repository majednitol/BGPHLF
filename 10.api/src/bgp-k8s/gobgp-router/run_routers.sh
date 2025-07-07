#!/bin/bash

set -e

# Load dummy module (only works if running as root and module is available)
modprobe dummy || echo "Skipping modprobe dummy (may already be loaded or not allowed)"

# Create dummy0 only if it doesn't exist
if ! ip link show dummy0 &>/dev/null; then
  echo "Creating dummy0 interface"
  ip link add dummy0 type dummy
else
  echo "dummy0 already exists, skipping creation"
fi

# List of IPs to assign
ips=(
  "209.55.246.1/32"
  "34.190.208.1/32"
  "138.0.40.1/32"
  "107.202.0.1/32"
  "190.151.64.1/32"
  "189.0.32.1/32"
  "153.112.201.1/32"
  "83.234.128.1/32"
  "82.27.105.1/32"
  "41.182.0.1/32"
  "102.135.189.1/32"
  "41.228.48.1/32"
  "41.173.214.1/32"
  "123.49.32.1/32"
  "115.112.0.1/32"
  "82.21.134.1/32"
  "110.33.21.1/32"
)

for ip in "${ips[@]}"; do
  if ! ip addr show dummy0 | grep -qw "${ip%/*}"; then
    echo "Adding IP $ip to dummy0"
    ip addr add "$ip" dev dummy0
  else
    echo "IP $ip already assigned to dummy0"
  fi
done

# Bring dummy0 up
ip link set dummy0 up

# Start routers
for i in {1..17}; do
  echo "Starting router$i..."
  port=$((50050 + i))
  gobgpd -f "/gobgp/router$i.conf" \
    --api-hosts 0.0.0.0:$port \
    --log-level debug > "/dev/stdout" 2>&1 &
done

echo "Waiting for all routers to start..."
sleep 3  # Ensure gobgpd instances are up before injecting routes

# ✅ Inject Static Routes
echo "Injecting static routes..."

# --- Router1 (AS 13335) ---
echo "→ Router1 (AS 13335)"
gobgp -p 50051 global rib add 45.192.224.0/24 origin igp
gobgp -p 50051 global rib add 156.243.83.0/24 origin igp

# --- Router2 (AS 15169) ---
echo "→ Router2 (AS 15169)"
gobgp -p 50052 global rib add 45.192.224.0/24/15 origin igp


echo "Static route injection complete."

# Live logs
echo "-----------------------------------------"
echo "Routers are running with debug logs:"
echo "-----------------------------------------"
tail -f /dev/stdout
