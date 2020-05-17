#!/usr/bin/env sh

set -e

# Prepare the files.
$(dirname "$0")/docker-prepare.sh

docker build -t convergencelabs/javasript-examples docker-build
