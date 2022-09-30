#!/bin/bash
set -eu

npx eslint --ext .js,.ts,.svelte --fix "$@"

if ! git diff --exit-code
then
  echo ""
  echo "######################################################################"
  echo "[ACTION REQUIRED]"
  echo ""
  echo "Run \`npx eslint --ext .js,.ts,.svelte --fix\` to see issues"
  echo "######################################################################"
  echo ""
  exit 1
fi
