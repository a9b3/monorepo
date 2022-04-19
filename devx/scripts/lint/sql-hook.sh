#!/bin/bash
set -eu

sqlfluff fix "$@"
sqlc generate

if ! git diff --quiet HEAD; then
  (
    echo "Run \`sqlc generate\` and commit changes"
  ) | tee /dev/stderr
  exit 1
fi
