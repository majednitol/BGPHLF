#!/bin/bash

echo "Starting router1..."
gobgpd -f /gobgp/router1.conf \
  --api-hosts 0.0.0.0:50051 \
  --log-level debug > /dev/stdout 2>&1 &

echo "Starting router2..."
gobgpd -f /gobgp/router2.conf \
  --api-hosts 0.0.0.0:50052 \
  --log-level debug > /dev/stdout 2>&1 &

sleep 2
echo "Routers are running with debug logs:"
echo "-----------------------------------------"

# Continuously show logs
tail -f /dev/stdout
