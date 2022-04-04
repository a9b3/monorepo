load(
    "@bazel_tools//tools/build_defs/repo:http.bzl",
    "http_archive",
)

def setup_http_archives():
    """All external workspaces need to be loaded before their usage via
    http_archive.
    """

    # ------------------------------------------------------------------------
    # Golang
    # ------------------------------------------------------------------------
    http_archive(
        name = "io_bazel_rules_go",
        sha256 = "f2dcd210c7095febe54b804bb1cd3a58fe8435a909db2ec04e31542631cf715c",
        urls = [
            "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.31.0/rules_go-v0.31.0.zip",
            "https://github.com/bazelbuild/rules_go/releases/download/v0.31.0/rules_go-v0.31.0.zip",
        ],
    )
