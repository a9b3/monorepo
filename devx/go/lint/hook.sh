#!/bin/bash
set -eu

# pre-commit invokes this script with a list of changed go files.
# go fmt expects a directory, loop through files and get the directory and run
# go fmt on the directory.
FILES="$@"
for file in $FILES; do
  directory=${file%/*}

  bazel run @go_sdk//:bin/go fmt "./$directory"
  bazel run @go_sdk//:bin/go vet "./$directory"
done

exit 0
