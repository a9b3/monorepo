# Facade for all go related exports. All code in the monorepo should only import
# through here.
load(
  "@io_bazel_rules_go//go:deps.bzl",
  _go_binary = "go_binary",
  _go_test = "go_test"
)

go_binary = _go_binary
go_test = _go_test
