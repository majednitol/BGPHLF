#!/bin/bash
set -euxo pipefail

echo "=== Starting Caliper Benchmark ==="
echo "[INFO] CALIPER_BENCHCONFIG=$CALIPER_BENCHCONFIG"
echo "[INFO] CALIPER_NETWORKCONFIG=$CALIPER_NETWORKCONFIG"

npx caliper launch manager

echo "[INFO] Caliper run finished."
