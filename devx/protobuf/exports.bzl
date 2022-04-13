# Facade for all protobuf related exports. All code in the monorepo should only import
# through here.
load(
    "@rules_proto//proto:defs.bzl",
    _proto_library = "proto_library",
)

proto_library = _proto_library
