load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")
load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories")

def setup_js_workspace():
    """Only used in WORKSPACE to setup js environment"""

    build_bazel_rules_nodejs_dependencies()

    node_repositories()
