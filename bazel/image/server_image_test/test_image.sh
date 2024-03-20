#!/bin/bash

set -e

BAZEL_TARGET=$1
DOCKER_TAG=$2
EXPECTED_RESPONSE=$3
ENDPOINT=$4
TAR_PATH=$5
PORT=$6

# Replace slashes in the Bazel target with underscores for the folder name
FOLDER_NAME=$(echo ${BAZEL_TARGET} | tr '/' '_' | tr ':' '_')

# Create the base directory if it doesn't exist
mkdir -p /tmp/bazeltars

# If the directory exists, delete it
if [ -d "/tmp/bazeltars/${FOLDER_NAME}" ]; then
    rm -rf /tmp/bazeltars/${FOLDER_NAME}
fi

# Create the directory
mkdir /tmp/bazeltars/${FOLDER_NAME}

ls bazel > /tmp/bazeltars/debug

# Extract the tarball
tar -xvf ${TAR_PATH} -C /tmp/bazeltars/${FOLDER_NAME}

# Create a new tarball with the files at the root
(cd /tmp/bazeltars/${FOLDER_NAME} && tar --no-xattr -cvf /tmp/bazeltars/${FOLDER_NAME}.tar .)

# Load the image into Docker
docker load --input "/tmp/bazeltars/${FOLDER_NAME}.tar"

# Run the image and check its output
CONTAINER_ID=$(docker run -d -p ${PORT}:${PORT} ${DOCKER_TAG})

# Give the server time to start
sleep 2

# Send a request to the server
RESPONSE=$(curl -s http://localhost:${PORT}/${ENDPOINT})

# Stop the Docker container
docker stop $CONTAINER_ID

# Remove the Docker image
docker rmi -f ${DOCKER_TAG}

# Check the response
if [[ "$RESPONSE" != "${EXPECTED_RESPONSE}" ]]; then
    echo "Unexpected response from server: $RESPONSE"
    exit 1
fi

echo "Test passed"
