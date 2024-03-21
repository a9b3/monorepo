#!/bin/bash

set -e

BAZEL_TARGET=$1
DOCKER_TAG=$2
TAR_PATH=$3

# Replace slashes in the Bazel target with underscores for the folder name
FOLDER_NAME=$(echo ${BAZEL_TARGET} | tr '/' '_' | tr ':' '_')

# Create the base directory if it doesn't exist
mkdir -p /tmp/bazeltars >/dev/null 2>&1

# If the directory exists, delete it
if [ -d "/tmp/bazeltars/${FOLDER_NAME}" ]; then
    rm -rf /tmp/bazeltars/${FOLDER_NAME} >/dev/null 2>&1
fi

# Create the directory
mkdir /tmp/bazeltars/${FOLDER_NAME} >/dev/null 2>&1

ls bazel > /tmp/bazeltars/debug >/dev/null 2>&1

# Extract the tarball
tar -xvf ${TAR_PATH} -C /tmp/bazeltars/${FOLDER_NAME} >/dev/null 2>&1

# Create a new tarball with the files at the root
(cd /tmp/bazeltars/${FOLDER_NAME} && tar --no-xattr -cvf /tmp/bazeltars/${FOLDER_NAME}.tar .) >/dev/null 2>&1

# Load the image into Docker
docker load --input "/tmp/bazeltars/${FOLDER_NAME}.tar" >/dev/null 2>&1

# Run the image and check its output
docker run ${DOCKER_TAG}
