#!/bin/bash

# --- Add loopback IP aliases inside the container ---
ip addr add 127.0.0.11/8 dev lo
ip addr add 127.0.0.12/8 dev lo
ip addr add 127.0.0.13/8 dev lo
ip addr add 127.0.0.14/8 dev lo
ip addr add 127.0.0.15/8 dev lo
ip addr add 127.0.0.16/8 dev lo
ip addr add 127.0.0.17/8 dev lo
ip addr add 127.0.0.18/8 dev lo
ip addr add 127.0.0.19/8 dev lo
ip addr add 127.0.0.20/8 dev lo
ip addr add 127.0.0.21/8 dev lo
ip addr add 127.0.0.22/8 dev lo
ip addr add 127.0.0.23/8 dev lo
ip addr add 127.0.0.24/8 dev lo
ip addr add 127.0.0.25/8 dev lo
ip addr add 127.0.0.26/8 dev lo
ip addr add 127.0.0.27/8 dev lo


echo "Starting router1..."
gobgpd -f /gobgp/router1.conf \
  --api-hosts 0.0.0.0:50051 \
  --log-level debug > /dev/stdout 2>&1 &

echo "Starting router2..."
gobgpd -f /gobgp/router2.conf \
  --api-hosts 0.0.0.0:50052 \
  --log-level debug > /dev/stdout 2>&1 &

echo "Starting router3..."
gobgpd -f /gobgp/router3.conf \
  --api-hosts 0.0.0.0:50053 \
  --log-level debug > /dev/stdout 2>&1 &

echo "Starting router4..."
gobgpd -f /gobgp/router4.conf \
  --api-hosts 0.0.0.0:50054 \
  --log-level debug > /dev/stdout 2>&1 &  

echo "Starting router5..."
gobgpd -f /gobgp/router5.conf \
  --api-hosts 0.0.0.0:50055 \
  --log-level debug > /dev/stdout 2>&1 & 

echo "Starting router6..."
gobgpd -f /gobgp/router6.conf \
  --api-hosts 0.0.0.0:50056 \
  --log-level debug > /dev/stdout 2>&1 & 

echo "Starting router7..."
gobgpd -f /gobgp/router7.conf \
  --api-hosts 0.0.0.0:50057 \
  --log-level debug > /dev/stdout 2>&1 & 

echo "Starting router8..."
gobgpd -f /gobgp/router8.conf \
  --api-hosts 0.0.0.0:50058 \
  --log-level debug > /dev/stdout 2>&1 &  

echo "Starting router9..."
gobgpd -f /gobgp/router9.conf \
  --api-hosts 0.0.0.0:50059 \
  --log-level debug > /dev/stdout 2>&1 & 

echo "Starting router10..."
gobgpd -f /gobgp/router10.conf \
  --api-hosts 0.0.0.0:50060 \
  --log-level debug > /dev/stdout 2>&1 & 

echo "Starting router11..."
gobgpd -f /gobgp/router11.conf \
  --api-hosts 0.0.0.0:50061 \
  --log-level debug > /dev/stdout 2>&1 & 

echo "Starting router12..."
gobgpd -f /gobgp/router12.conf \
  --api-hosts 0.0.0.0:50062 \
  --log-level debug > /dev/stdout 2>&1 & 

echo "Starting router13..."
gobgpd -f /gobgp/router13.conf \
  --api-hosts 0.0.0.0:50063 \
  --log-level debug > /dev/stdout 2>&1 & 

echo "Starting router14..."
gobgpd -f /gobgp/router14.conf \
  --api-hosts 0.0.0.0:50064 \
  --log-level debug > /dev/stdout 2>&1 & 

echo "Starting router15..."
gobgpd -f /gobgp/router15.conf \
  --api-hosts 0.0.0.0:50065 \
  --log-level debug > /dev/stdout 2>&1 & 

echo "Starting router16..."
gobgpd -f /gobgp/router16.conf \
  --api-hosts 0.0.0.0:50066 \
  --log-level debug > /dev/stdout 2>&1 & 

echo "Starting router17..."
gobgpd -f /gobgp/router17.conf \
  --api-hosts 0.0.0.0:50067 \
  --log-level debug > /dev/stdout 2>&1 & 

echo "Waiting for all routers to start..."

sleep 2
echo "Routers are running with debug logs:"
echo "-----------------------------------------"

# Continuously show logs
tail -f /dev/stdout
