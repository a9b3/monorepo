#!/bin/bash
set -eu

yamllint "$@"

exit $?
