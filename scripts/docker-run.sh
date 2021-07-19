#!/usr/bin/env sh

set -e

docker run --rm \
  -e CONVERGENCE_URL="ws://localhost:8000/convergence/default" \
  -p 4000:80 \
  convergencelabs/javascript-examples
