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
    http_archive(
        name = "build_bazel_rules_nodejs",
        sha256 = "2b2004784358655f334925e7eadc7ba80f701144363df949b3293e1ae7a2fb7b",
        urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.4.0/rules_nodejs-5.4.0.tar.gz"],
    )

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

    # Branch: master
    # Commit: 7c95feba87ae269d09690fcebb18c77d8b8bcf6a
    # Date: 2021-11-16 02:17:58 +0000 UTC
    # URL: https://github.com/stackb/rules_proto/commit/7c95feba87ae269d09690fcebb18c77d8b8bcf6a
    #
    # V2 (#193)
    # Size: 885598 (886 kB)
    http_archive(
        name = "build_stack_rules_proto",
        sha256 = "1190c296a9f931343f70e58e5f6f9ee2331709be4e17001bb570e41237a6c497",
        strip_prefix = "rules_proto-7c95feba87ae269d09690fcebb18c77d8b8bcf6a",
        urls = ["https://github.com/stackb/rules_proto/archive/7c95feba87ae269d09690fcebb18c77d8b8bcf6a.tar.gz"],
    )
