#!/bin/bash
set -eu

for i in $(fd sqlc.yaml); do
  sqlc generate --file "$i"
done

if ! git diff --exit-code
then
  echo ""
  echo "######################################################################"
  echo "[ACTION REQUIRED]"
  echo ""
  echo "Run \`sqlc generate\` for the above changes and commit changes"
  echo "######################################################################"
  echo ""
  exit 1
fi
