def sh_binary_cwd(name, binary_target, **kwargs):
    """Helper macro

    Sets the CWD of given binary to the users CWD instead of bazel's runtime directory.
    """
    data = kwargs.pop("data", [])

    if binary_target == "":
        fail("binary_target must be provided")

    native.sh_binary(
        name = name,
        srcs = ["//devx/scripts:sh_binary_cwd.sh"],
        args = ["$(location " + binary_target + ")"],
        data = [
            binary_target,
        ] + data,
        **kwargs
    )
