#!/usr/bin/env sh

set -e

# Make sure there are no stale files
rm -rf docker-build

# Put all relevant files in the docker-build directory
cp -a docker docker-build
cp -a _site docker-build/www
