#!/bin/bash
set -eu

npx tsc --noEmit --incremental
exitCode="$?"

if [ "$exitCode" != "0" ]; then
  echo ""
  echo "######################################################################"
  echo "[ACTION REQUIRED]"
  echo ""
  echo "Run \`npx tsc --noEmit --incremental\` for the above changes and commit changes"
  echo "######################################################################"
  echo ""
  exit 1
fi
