workspace(
    name = "monorepo",
    managed_directories = {
        "@npm": ["node_modules"],
    },
)

load(
    "@bazel_tools//tools/build_defs/repo:http.bzl",
    "http_archive",
)

# ----------------------------------------------------------------
# Bazel
# ----------------------------------------------------------------
http_archive(
    name = "bazel_skylib",
    sha256 = "1c531376ac7e5a180e0237938a2536de0c54d93f5c278634818e0efc952dd56c",
    urls = [
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.0.3/bazel-skylib-1.0.3.tar.gz",
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.0.3/bazel-skylib-1.0.3.tar.gz",
    ],
)

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

# ----------------------------------------------------------------
# http_archive
# ----------------------------------------------------------------

load("//devx:workspace.bzl", "setup_http_archives")

setup_http_archives()

# ----------------------------------------------------------------
# golang
# ----------------------------------------------------------------

load("//devx/go:workspace.bzl", "setup_go_workspace")

setup_go_workspace()

load("//:deps.bzl", "go_dependencies")

# gazelle:repository_macro deps.bzl%go_dependencies
go_dependencies()
