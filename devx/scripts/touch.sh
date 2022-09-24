#!/bin/bash
set -eu
echo "--------------------------"
echo $BUILD_WORKING_DIRECTORY
echo "--------------------------"
cd $BUILD_WORKING_DIRECTORY && touch "$@"
