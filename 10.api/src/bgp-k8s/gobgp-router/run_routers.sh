#!/bin/bash

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

sleep 2
echo "Routers are running with debug logs:"
echo "-----------------------------------------"

# Continuously show logs
tail -f /dev/stdout
