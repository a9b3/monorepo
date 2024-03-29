# Facade for all go related exports. All code in the monorepo should only import
# through here.
load(
    "@rules_go//go:def.bzl",
    _go_binary = "go_binary",
    _go_cross_binary = "go_cross_binary",
    _go_library = "go_library",
    _go_test = "go_test",
)
load(
    "@rules_go//proto:def.bzl",
    _go_proto_library = "go_proto_library",
)

go_binary = _go_binary
go_library = _go_library
go_proto_library = _go_proto_library
go_test = _go_test
go_cross_binary = _go_cross_binary
