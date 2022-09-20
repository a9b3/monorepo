load(
    "@io_bazel_rules_docker//go:image.bzl",
    _go_image_repos = "repositories",
)

def setup_container_workspace():
    """Only used in WORKSPACE to setup container environment"""

    _go_image_repos()
