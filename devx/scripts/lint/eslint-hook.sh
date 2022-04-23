#!/bin/bash
set -eu

npx eslint --ext .js,.ts --fix "$@"

if ! git diff --exit-code
then
  echo ""
  echo "######################################################################"
  echo "[ACTION REQUIRED]"
  echo ""
  echo "Run \`npx eslint --ext .js,.ts --fix\` for the above changes and commit changes"
  echo "######################################################################"
  echo ""
  exit 1
fi
