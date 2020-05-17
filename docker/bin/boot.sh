#!/bin/sh

require_env_var() {
  if [ "$1" == "" ]; then
    echo "Error: '$2' was not set."
    echo "Aborting."
    exit 1
  else
    echo "   $2: $1"
  fi
}

echo "Convergence JavaScript Examples"
echo "Checking required environment variables..."
echo ""

require_env_var "$CONVERGENCE_URL" "CONVERGENCE_URL"

echo ""
echo "All required environment variables are set.  Processing config file."
echo ""

/usr/local/bin/confd -backend env --onetime

echo ""
echo "Starting the Convergence JavaScript Examples"

exec nginx -g "daemon off;"