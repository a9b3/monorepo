#!/bin/bash
set -eu

npx prettier --write "$@"

if ! git diff --exit-code
then
  echo ""
  echo "######################################################################"
  echo "[ACTION REQUIRED]"
  echo ""
  echo "Run \`npx prettier --write\` for the above changes and commit changes"
  echo "######################################################################"
  echo ""
  exit 1
fi
