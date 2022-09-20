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
    sha256 = "c6966ec828da198c5d9adbaa94c05e3a1c7f21bd012a0b29ba8ddbccb2c93b0d",
    urls = [
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.1.1/bazel-skylib-1.1.1.tar.gz",
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.1.1/bazel-skylib-1.1.1.tar.gz",
    ],
)

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

# ----------------------------------------------------------------
# http_archive
# ----------------------------------------------------------------

load("//bazel:workspace.bzl", "setup_http_archives")

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

# load("//bazel/js:workspace.bzl", "setup_js_workspace")
#
# setup_js_workspace()
#
load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")

build_bazel_rules_nodejs_dependencies()

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories")

node_repositories()

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Copied from https://github.com/aspect-build/rules_swc/releases
http_archive(
    name = "aspect_rules_swc",
    sha256 = "206a89aae3a04831123b43962a3864e8ab1652b703c4af58d84b04174360137d",
    strip_prefix = "rules_swc-0.4.0",
    url = "https://github.com/aspect-build/rules_swc/archive/refs/tags/v0.4.0.tar.gz",
)

# Fetches the rules_swc dependencies.
# If you want to have a different version of some dependency,
# you should fetch it *before* calling this.
# Alternatively, you can skip calling this function, so long as you've
# already fetched all the dependencies.
load("@aspect_rules_swc//swc:dependencies.bzl", "rules_swc_dependencies")

rules_swc_dependencies()

# Fetches a pre-built Rust-node binding from
# https://github.com/swc-project/swc/releases.
# If you'd rather compile it from source, you can use rules_rust, fetch the project,
# then register the toolchain yourself. (Note, this is not yet documented)
load("@aspect_rules_swc//swc:repositories.bzl", "swc_register_toolchains")

swc_register_toolchains(
    name = "swc",
    swc_version = "v1.2.141",
)

# Fetches a NodeJS interpreter, needed to run the swc CLI.
# You can skip this if you already register a nodejs toolchain.
load("@rules_nodejs//nodejs:repositories.bzl", "nodejs_register_toolchains")

nodejs_register_toolchains(
    name = "node16",
    node_version = "16.9.0",
)

load("@build_bazel_rules_nodejs//:index.bzl", "npm_install")

npm_install(
    name = "npm",
    package_json = "//:package.json",
    package_lock_json = "//:package-lock.json",
    # Have bazel symlink the managed node_modules directory to the local
    # workspace.
    symlink_node_modules = True,
)

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

load("//bazel/container:workspace.bzl", "setup_container_workspace")

setup_container_workspace()
