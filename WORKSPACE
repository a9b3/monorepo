workspace(
    name = "monorepo",
    managed_directories = {
        "@npm": ["node_modules"],
    },
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

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
# protobuf
# ----------------------------------------------------------------

load("@com_google_protobuf//:protobuf_deps.bzl", "protobuf_deps")

protobuf_deps()

load("@rules_proto//proto:repositories.bzl", "rules_proto_dependencies", "rules_proto_toolchains")

rules_proto_dependencies()
rules_proto_toolchains()

register_toolchains("@build_stack_rules_proto//toolchain:standard")

# ----------------------------------------------------------------
# golang
# ----------------------------------------------------------------

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()
go_register_toolchains(version = "1.18")

load("@build_stack_rules_proto//:go_deps.bzl", "gazelle_protobuf_extension_go_deps")

# brings in @com_github_emicklei_proto used by build_stack_rules_proto to parse
# proto files.
gazelle_protobuf_extension_go_deps()

load("@build_stack_rules_proto//deps:go_core_deps.bzl", "go_core_deps")

# Brings in the following go_repository:
#
#   com_github_golang_protobuf
#   org_golang_google_grpc
#   org_golang_google_grpc_cmd_protoc_gen_go_grpc
go_core_deps()

load("//:deps.bzl", "go_dependencies")

# gazelle:repository_macro deps.bzl%go_dependencies
go_dependencies()

# IMPORTANT: Order matters. go_dependencies has to be before
# gazelle_dependencies it will try to bring the correct version of
# google.golang.org/grpc if it doesn't already exists but the version it
# brings in isn't compatible with build_stack_rules_proto or else error will
# occur.
#
#   undefined: grpc.SupportPackageIsVersion7
load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies")

gazelle_dependencies()

# ----------------------------------------------------------------
# js
# ----------------------------------------------------------------

load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")

build_bazel_rules_nodejs_dependencies()

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories")

node_repositories()

# ----------------------------------------------------------------
# docker
# ----------------------------------------------------------------

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)
container_repositories()

load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

load("//devx/container:workspace.bzl", "setup_container_workspace")

setup_container_workspace()
