#!/bin/bash
# This should only be used by pre-commit
set -eu

bazel run //:gazelle
bazel run @go_sdk//:bin/go mod tidy
bazel run //:gazelle-update-repos
