load(
    "@rules_pkg//:pkg.bzl",
    "pkg_tar",
)
load(
    "@rules_oci//oci:defs.bzl",
    "oci_image",
    "oci_tarball",
)
load(
    "//bazel/image/server_image_test:server_image_test.bzl",
    "server_image_test",
)

def run_image(name, cmd, tars, tar_path_root):
    oci_image(
        name = "{}_image".format(name),
        base = "@debian_linux_amd64",
        # This is going to be /{root of js_image_layer}/{package_name()}/{name of js_binary}
        cmd = cmd,
        entrypoint = ["bash"],
        tars = tars,
        visibility = ["//visibility:public"],
    )

    oci_tarball(
        name = "{}_tarball".format(name),
        image = ":{}_image".format(name),
        repo_tags = ["%s:latest" % name],
    )

    native.sh_binary(
        name = "{}_run".format(name),
        srcs = ["//bazel/image:run_image.sh"],
        args = [
            "\"%s\"" % "{}_tarball".format(name),
            "\"%s\"" % "%s:latest" % name,
            "\"%s\"" % "{}/{}_tarball/tarball.tar".format(tar_path_root, name),
        ],
        data = [
            ":{}_tarball".format(name),
        ],
    )
