load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")
load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies")

def setup_go_workspace():
    """Only used in WORKSPACE to setup golang environment"""
    go_rules_dependencies()

    go_register_toolchains(version = "1.18")

    gazelle_dependencies()
