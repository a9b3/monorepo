"""
This file defines a rule for testing a server running in a Docker image.

Usage:

load("//path/to:your_rules.bzl", "server_image_test")

server_image_test(
    name = "go_server_test",
    bazel_target = "//bazel/go/examples/go-image:tarball",
    docker_tag = "example-go-image",
    expected_response = "Hello what, test!",
    endpoint = "test",
    tar_path = "bazel/go/examples/go-image/tarball/tarball.tar",
    port = "8080",
)

Arguments:
- name: A unique name for this test target.
- bazel_target: The Bazel target for the Docker image.
- docker_tag: The tag to use when loading the image into Docker.
- expected_response: The response expected from the server.
- endpoint: The endpoint to test on the server.
- tar_path: The path to the tarball during bazel runtime.
- port: The port the server is running on.

This rule assumes that a script named 'test_image.sh' exists in the same directory as this file.
"""

def server_image_test(name, bazel_target, docker_tag, expected_response, endpoint, tar_path, port, tags = []):
    native.sh_test(
        name = name,
        srcs = ["//bazel/image/server_image_test:test_image.sh"],
        args = [
            "\"%s\"" % bazel_target,
            "\"%s\"" % docker_tag,
            "\"%s\"" % expected_response,
            "\"%s\"" % endpoint,
            "\"%s\"" % tar_path,
            "\"%s\"" % port,
        ],
        data = [
            bazel_target,
        ],
        tags = tags,
    )

