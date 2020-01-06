#!/usr/bin/env sh

docker run --rm \
  -e CONVERGENCE_URL="ws:localhost:8080/convergence/default" \
  -p 8000:80 \
  convergencelabs/javasript-examples