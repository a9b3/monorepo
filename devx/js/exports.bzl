# Note, Bazel 6 starlark has lambda so this is no longer needed after upgrade
load("@bazel_skylib//lib:partial.bzl", "partial")
load("@aspect_rules_swc//swc:swc.bzl", "swc_transpiler")
load(
    "@npm//@bazel/typescript:index.bzl",
    _ts_project = "ts_project",
)
load(
    "@build_bazel_rules_nodejs//:index.bzl",
    _nodejs_binary = "nodejs_binary",
)
load(
    "@npm//jest-cli:index.bzl",
    _jest_test = "jest_test",
)

def _jest_test_override(data = [], args = [
    "--no-cache",
    "--no-watchman",
    "--ci",
    "--colors",
    "--config",
    "jest.config.ts",
], **kwargs):
    _jest_test(
        args = args,
        data = data + ["//:jest.config.ts", "//:package.json", "@npm//jest-config"],
        **kwargs
    )

# Copied using swc from this example
# https://github.com/aspect-build/bazel-examples/tree/main/ts_project_transpiler
def _ts_project_override(name, **kwargs):
    _ts_project(
        name = name,
        transpiler = partial.make(
            swc_transpiler,
            # Attributes to the swc rule can appear here
            args = ["--env-name=test"],
            swcrc = "//:.swcrc",
        ),
        tsconfig = "//:tsconfig.json",
        **kwargs
    )

nodejs_binary = _nodejs_binary
ts_project = _ts_project_override
jest_test = _jest_test_override
