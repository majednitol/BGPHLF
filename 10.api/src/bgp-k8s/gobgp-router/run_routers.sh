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
  "107.202.0.1/32"
  "138.0.40.1/32"
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
  gobgpd -f "/etc/router$i.conf" \
    --api-hosts 0.0.0.0:$port \
    --log-level debug > "/dev/stdout" 2>&1 &
done

echo "Waiting for all routers to start..."
sleep 3  # Ensure gobgpd instances are up before injecting routes

# ✅ Inject Static Routes
echo "Injecting static routes..."
# gobgp -p 50052 global rib add 199.36.154.0/23 nexthop 192.0.2.1 origin igp

# --- Router1 (AS 13335) ---
echo "→ Router1 (AS 13335)"
gobgp -p 50051 global rib add 45.192.224.0/24 origin igp
gobgp -p 50051 global rib add 156.243.83.0/24 origin igp

# --- Router2 (AS 15169) ---
echo "→ Router2 (AS 15169)"
gobgp -p 50052 global rib add 45.192.224.0/24 origin igp
gobgp -p 50052 global rib add 142.250.0.0/15 origin igp
gobgp -p 50052 global rib add 199.36.154.0/23 origin igp

# --- Router3 (AS 7018) ---
# echo "→ Router3 (AS 7018)"
gobgp -p 50053 global rib add 142.250.0.0/15 origin igp
gobgp -p 50053 global rib add 107.129.0.0/18 origin igp

# --- Router4 (AS 52320) ---
echo "→ Router4 (AS 52320)"
gobgp -p 50054 global rib add 200.16.68.0/22 origin igp
gobgp -p 50054 global rib add 156.243.83.0/24 origin igp


# --- Router5 (AS 6471) ---
echo "→ Router5 (AS 6471 )" 
gobgp -p 50055 global rib add 199.36.154.0/23 origin igp
gobgp -p 50055 global rib add 164.77.157.0/24 origin igp
gobgp -p 50055 global rib add 200.16.68.0/22 origin igp

# --- Router6 (AS 27699) ---
echo "→ Router6 (AS 27699)"
gobgp -p 50056 global rib add 107.129.0.0/18 origin igp
gobgp -p 50056 global rib add 164.77.157.0/24 origin igp
gobgp -p 50056 global rib add 177.9.0.0/16 origin igp
gobgp -p 50056 global rib add 201.95.0.0/16 origin igp

# --- Router7 (AS 1299) ---
echo "→ Router7 (AS 1299)"
gobgp -p 50057 global rib add 177.9.0.0/16 origin igp
gobgp -p 50057 global rib add 2.22.36.0/22 origin igp

# --- Router8 (AS 20485) ---
echo "→ Router8 (AS 20485)"
gobgp -p 50058 global rib add 201.95.0.0/16 origin igp
gobgp -p 50058 global rib add 197.188.0.0/16 origin igp


# --- Router9 (AS 3320) ---
echo "→ Router9 (AS 3320)"
gobgp -p 50059 global rib add 2.22.36.0/22 origin igp
gobgp -p 50059 global rib add 197.188.0.0/16 origin igp
gobgp -p 50059 global rib add 217.181.64.0/21 origin igp

# --- Router10 (AS 36996) ---
echo "→ Router10 (AS 36996)"
gobgp -p 50060 global rib add 217.181.64.0/21 origin igp
gobgp -p 50060 global rib add 196.44.128.0/19 origin igp
gobgp -p 50060 global rib add 197.188.0.0/16 origin igp

# --- Router11 (AS 328352) ---
echo "→ Router11 (AS 328352)"
gobgp -p 50061 global rib add 196.44.128.0/19 origin igp

# --- Router12 (AS 37693) ---
echo "→ Router12 (AS 37693)"
gobgp -p 50062 global rib add 196.203.76.0/24 origin igp

# --- Router13 (AS 37332) ---
echo "→ Router13 (AS 37332)"
gobgp -p 50063 global rib add 197.188.0.0/16 origin igp
gobgp -p 50063 global rib add 196.203.76.0/24 origin igp
gobgp -p 50063 global rib add 41.60.52.0/24 origin igp

# --- Router14 (AS 17494) ---
echo "→ Router14 (AS 17494)"
gobgp -p 50064 global rib add 41.60.52.0/24 origin igp
gobgp -p 50064 global rib add 180.211.206.0/24 origin igp
gobgp -p 50064 global rib add 209.58.24.0/24 origin igp

# --- Router15 (AS 4755) ---
echo "→ Router15 (AS 4755)"
gobgp -p 50065 global rib add 180.211.206.0/24 origin igp
gobgp -p 50065 global rib add 5.157.88.0/24 origin igp

# --- Router16 (AS 4637) ---
echo "→ Router16 (AS 4637)"
gobgp -p 50066 global rib add 209.58.24.0/24 origin igp
gobgp -p 50066 global rib add 82.29.26.0/24 origin igp

# --- Router17 (AS 4804) ---
echo "→ Router17 (AS 4804)"
gobgp -p 50067 global rib add 5.157.88.0/24 origin igp
gobgp -p 50067 global rib add 82.29.26.0/24 origin igp

echo "Static route injection complete."
# Live logs
echo "-----------------------------------------"
echo "Routers are running with debug logs:"
echo "-----------------------------------------"
tail -f /dev/stdout
