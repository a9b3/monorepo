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

"""
server_image_package(name, app_target, expected_response, endpoint, tar_path_root, port, tags = [])

Macro that generates a set of rules to package a server application into an OCI image and test it.

Args:
    name (string): A base name for the generated rules. The names of the generated rules will be based on this name.
    app_target (label): The target that produces the application to be included in the OCI image.
    expected_response (string): The expected response from the server when it is tested.
    endpoint (string): The endpoint to test the server.
    tar_path_root (string): The root path for the tarball generated by the oci_tarball rule.
    port (int): The port to test the server.
    entrypoint (list of strings): This should be ["/{app_target.name}"].
    tags (list of strings, optional): Tags to be added to the generated rules. Default is an empty list.

Generated rules:
    {name}_tar: Packages the application into a tarball.
    {name}_image: Builds an OCI image that includes the application.
    {name}_tarball: Packages the OCI image into a tarball.
    {name}_test: Tests the server application.

Example:
    server_image_package(
        name = "my_server",
        app_target = ":my_app",
        expected_response = "Hello, world!",
        endpoint = "/",
        entrypoint = ["/app"],
        tar_path_root = "/path/to/tar",
        port = 8080,
        tags = ["linux_amd64"],
    )
In this example, the server_image_package macro generates a set of rules to package the :my_app target into an OCI image, and then test the server application. The generated rules have the linux_amd64 tag.
"""
def server_image_package(name, app_target, expected_response, endpoint, tar_path_root, port, entrypoint, tags = []):
    pkg_tar(
        name = "%s_tar" % name,
        srcs = [app_target],
        tags = tags,
    )

    oci_image(
        name = "%s_image" % name,
        base = "@distroless_base_linux_amd64",
        entrypoint = entrypoint,
        tars = [":%s_tar" % name],
        visibility = ["//visibility:public"],
        tags = tags,
    )

    oci_tarball(
        name = "%s_tarball" % name,
        image = ":%s_image" % name,
        repo_tags = ["%s:latest" % name],
        tags = tags,
    )

    server_image_test(
        name = "%s_test" % name,
        bazel_target = ":%s_tarball" % name,
        docker_tag = "%s:latest" % name,
        expected_response = expected_response,
        endpoint = endpoint,
        tar_path = "{}/{}_tarball/tarball.tar".format(tar_path_root, name),
        port = port,
        tags = tags,
    )
