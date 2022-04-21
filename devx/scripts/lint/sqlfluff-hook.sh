#!/bin/bash
set -eu

output=$(sqlfluff fix "$@")
if [ "$?" = "1" ]; then
  echo "$output"
fi
