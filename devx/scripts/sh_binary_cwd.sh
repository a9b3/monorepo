#!/bin/bash
set -eu

# Get first arg which is specified in sh_binary_cwd.bzl to be the location of
# the passed in binary target.
bin="$PWD/$1"
shift

cd $BUILD_WORKING_DIRECTORY && $bin "$@"
