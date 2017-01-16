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

echo "Convergence Examples.  Checking required environment variables."

require_env_var $convergence_domain_url "convergence_domain_url"

echo "All required variables are set.  Booting."
echo ""

exec supervisord --configuration /etc/supervisord.conf