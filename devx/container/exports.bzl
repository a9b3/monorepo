# Facade for all container related exports. All code in the monorepo should only import
# through here.
load(
    "@io_bazel_rules_docker//go:image.bzl",
    _go_image = "go_image",
)

# Provide amd64 and linux as the default so building on macos works without
# specifying a flag.
# --platforms=@io_bazel_rules_go//go/toolchain:linux_amd64
def go_image(goarch = "amd64", goos = "linux", **kwargs):
    _go_image(goarch = goarch, goos = goos, **kwargs)
