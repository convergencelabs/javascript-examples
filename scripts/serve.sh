#!/usr/bin/env sh

docker run --rm \
  --volume="$PWD:/srv/jekyll" \
  --volume="$PWD/builder/bundle:/usr/local/bundle" \
  -p 4000:4000 \
  -it jekyll/jekyll:4.2.0 \
  jekyll serve --incremental --profile
