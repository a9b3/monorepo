load(
    "@bazel_tools//tools/build_defs/repo:http.bzl",
    "http_archive",
)

# Put all http_archive rules here. To try to keep WORKSPACE a bit cleaner.
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

    http_archive(
        name = "bazel_gazelle",
        sha256 = "de69a09dc70417580aabf20a28619bb3ef60d038470c7cf8442fafcf627c21cb",
        urls = [
            "https://mirror.bazel.build/github.com/bazelbuild/bazel-gazelle/releases/download/v0.24.0/bazel-gazelle-v0.24.0.tar.gz",
            "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.24.0/bazel-gazelle-v0.24.0.tar.gz",
        ],
    )

    # ------------------------------------------------------------------------
    # js
    # ------------------------------------------------------------------------

    # http_archive(
    #     name = "aspect_rules_js",
    #     sha256 = "0707a425093704fab05fb91c3a4b62cf22dca18ea334d8a72f156d4c18e8db90",
    #     strip_prefix = "rules_js-1.3.1",
    #     url = "https://github.com/aspect-build/rules_js/archive/refs/tags/v1.3.1.tar.gz",
    # )
    #
    # http_archive(
    #     name = "aspect_rules_ts",
    #     sha256 = "3eb3171c26eb5d0951d51ae594695397218fb829e3798eea5557814723a1b3da",
    #     strip_prefix = "rules_ts-1.0.0-rc3",
    #     url = "https://github.com/aspect-build/rules_ts/archive/refs/tags/v1.0.0-rc3.tar.gz",
    # )
    #
    # http_archive(
    #     name = "build_bazel_rules_nodejs",
    #     sha256 = "2b2004784358655f334925e7eadc7ba80f701144363df949b3293e1ae7a2fb7b",
    #     urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.4.0/rules_nodejs-5.4.0.tar.gz"],
    # )

    # ------------------------------------------------------------------------
    # protobuf
    # ------------------------------------------------------------------------

    http_archive(
        name = "com_google_protobuf",
        sha256 = "d0f5f605d0d656007ce6c8b5a82df3037e1d8fe8b121ed42e536f569dec16113",
        strip_prefix = "protobuf-3.14.0",
        urls = [
            "https://mirror.bazel.build/github.com/protocolbuffers/protobuf/archive/v3.14.0.tar.gz",
            "https://github.com/protocolbuffers/protobuf/archive/v3.14.0.tar.gz",
        ],
    )

    http_archive(
        name = "rules_proto",
        sha256 = "66bfdf8782796239d3875d37e7de19b1d94301e8972b3cbd2446b332429b4df1",
        strip_prefix = "rules_proto-4.0.0",
        urls = [
            "https://mirror.bazel.build/github.com/bazelbuild/rules_proto/archive/refs/tags/4.0.0.tar.gz",
            "https://github.com/bazelbuild/rules_proto/archive/refs/tags/4.0.0.tar.gz",
        ],
    )

    http_archive(
        name = "build_stack_rules_proto",
        sha256 = "8ce4f6630c8a277a78c05c2193da4b4687c208f0ce5a88e9cbf10150508c6fa0",
        strip_prefix = "rules_proto-0160632ba19048c87c84a46f788cf89738f223cf",
        urls = ["https://github.com/stackb/rules_proto/archive/0160632ba19048c87c84a46f788cf89738f223cf.tar.gz"],
    )

    # ------------------------------------------------------------------------
    # docker
    # ------------------------------------------------------------------------

    http_archive(
        name = "io_bazel_rules_docker",
        sha256 = "85ffff62a4c22a74dbd98d05da6cf40f497344b3dbf1e1ab0a37ab2a1a6ca014",
        strip_prefix = "rules_docker-0.23.0",
        urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.23.0/rules_docker-v0.23.0.tar.gz"],
    )

    # ------------------------------------------------------------------------
    # bazel buildtools
    # ------------------------------------------------------------------------
    # Order matters has to be after go, gazelle, and protobuf

    http_archive(
        name = "com_github_bazelbuild_buildtools",
        sha256 = "ae34c344514e08c23e90da0e2d6cb700fcd28e80c02e23e4d5715dddcb42f7b3",
        strip_prefix = "buildtools-4.2.2",
        urls = [
            "https://github.com/bazelbuild/buildtools/archive/refs/tags/4.2.2.tar.gz",
        ],
    )
