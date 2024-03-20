#!/bin/bash

bazel build //bazel/go/examples/go-image:tarball --platforms=@io_bazel_rules_go//go/toolchain:linux_amd64

# Extract the tarball
mkdir /tmp/foo
tar -xvf $(bazel cquery --output=files //bazel/go/examples/go-image:tarball) -C /tmp/foo

# Create a new tarball with the files at the root
(cd /tmp/foo && tar --no-xattr -cvf /tmp/footar.tar .)

# Load the image into Docker
docker load --input /tmp/footar.tar

# Run the image and check its output
output=$(docker run --rm example-go-image:latest)
expected_output="hello"

if [[ "$output" != "$expected_output" ]]; then
  echo "Unexpected output from Docker image"
  exit 1
fi

