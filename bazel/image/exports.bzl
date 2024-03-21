load(
    "@rules_oci//oci:defs.bzl",
    _oci_image = "oci_image",
    _oci_tarball = "oci_tarball",
)
load(
    "@rules_pkg//:pkg.bzl",
    _pkg_tar = "pkg_tar",
)
load("//bazel/image/server_image_test:server_image_test.bzl", _server_image_test = "server_image_test")
load("//bazel/image:server_image_package.bzl", _server_image_package = "server_image_package")
load("//bazel/image:run_image.bzl", _run_image = "run_image")

server_image_package = _server_image_package
server_image_test = _server_image_test
oci_image = _oci_image
oci_tarball = _oci_tarball
pkg_tar = _pkg_tar
run_image = _run_image
