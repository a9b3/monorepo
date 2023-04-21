workspace(
    name = "monorepo",
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

###############################################################################
# Bazel
###############################################################################

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

###############################################################################
# http_archive
###############################################################################

load("//bazel:workspace.bzl", "setup_http_archives")

setup_http_archives()

###############################################################################
# protobuf
###############################################################################

load("@com_google_protobuf//:protobuf_deps.bzl", "protobuf_deps")

protobuf_deps()

load("@rules_proto//proto:repositories.bzl", "rules_proto_dependencies", "rules_proto_toolchains")

rules_proto_dependencies()

rules_proto_toolchains()

register_toolchains("@build_stack_rules_proto//toolchain:standard")

###############################################################################
# golang
###############################################################################

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

###############################################################################
# js
###############################################################################

##################################
# rules_swc
##################################

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "aspect_rules_swc",
    sha256 = "313307136cb6369f3c9d2992209c1e354b3e2c9989877ee67c688917320fba1f",
    strip_prefix = "rules_swc-0.17.1",
    url = "https://github.com/aspect-build/rules_swc/archive/refs/tags/v0.17.1.tar.gz",
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
load("@aspect_rules_swc//swc:repositories.bzl", "LATEST_VERSION", "swc_register_toolchains")

swc_register_toolchains(
    name = "swc",
    swc_version = LATEST_VERSION,
)

##################################
# rules_ts
##################################

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "aspect_rules_ts",
    sha256 = "3eb3171c26eb5d0951d51ae594695397218fb829e3798eea5557814723a1b3da",
    strip_prefix = "rules_ts-1.0.0-rc3",
    url = "https://github.com/aspect-build/rules_ts/archive/refs/tags/v1.0.0-rc3.tar.gz",
)

# Fetches the rules_ts dependencies.
# If you want to have a different version of some dependency,
# you should fetch it *before* calling this.
# Alternatively, you can skip calling this function, so long as you've
# already fetched all the dependencies.
load("@aspect_rules_ts//ts:repositories.bzl", "LATEST_VERSION", "rules_ts_dependencies")

rules_ts_dependencies(ts_version = LATEST_VERSION)

# ##################################
# # rules_js
# ##################################
#
# load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
#
# http_archive(
#     name = "aspect_rules_js",
#     sha256 = "0707a425093704fab05fb91c3a4b62cf22dca18ea334d8a72f156d4c18e8db90",
#     strip_prefix = "rules_js-1.3.1",
#     url = "https://github.com/aspect-build/rules_js/archive/refs/tags/v1.3.1.tar.gz",
# )

load("@aspect_rules_js//js:repositories.bzl", "rules_js_dependencies")

# https://github.com/aspect-build/rules_js/blob/86b7aaa3d4bcafaf30bbaf04fba2b7c1d770c078/js/repositories.bzl#L1
# This should bring in rules_nodejs
rules_js_dependencies()

load("@rules_nodejs//nodejs:repositories.bzl", "DEFAULT_NODE_VERSION", "nodejs_register_toolchains")

nodejs_register_toolchains(
    name = "nodejs",
    node_version = DEFAULT_NODE_VERSION,
)

load("@aspect_rules_js//npm:npm_import.bzl", "npm_translate_lock")

npm_translate_lock(
    name = "npm",
    pnpm_lock = "//:pnpm-lock.yaml",
    verify_node_modules_ignored = "//:.bazelignore",
)

load("@npm//:repositories.bzl", "npm_repositories")

npm_repositories()

###############################################################################
# docker
###############################################################################

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

load("//bazel/container:workspace.bzl", "setup_container_workspace")

setup_container_workspace()
