# Note, Bazel 6 starlark has lambda so this is no longer needed after upgrade
load("@bazel_skylib//lib:partial.bzl", "partial")
load("@aspect_rules_swc//swc:defs.bzl", "swc_transpiler")
load(
    "@aspect_rules_ts//ts:defs.bzl",
    _ts_project = "ts_project",
)
load(
    "@aspect_rules_js//js:defs.bzl",
    _js_library = "js_library",
    _nodejs_binary = "js_binary",
)
load(
    "@npm//:jest-cli/package_json.bzl",
    _jest_test = "bin",
)

def _jest_test_override(data = [], args = [
    "--no-cache",
    "--no-watchman",
    "--ci",
    "--colors",
    "--config",
    "jest.config.ts",
], **kwargs):
    _jest_test.jest_test(
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
        extends = "//:tsconfig.json",
        tsconfig = {},
        declaration = True,
        **kwargs
    )

nodejs_binary = _nodejs_binary
ts_project = _ts_project_override
jest_test = _jest_test_override
js_library = _js_library
js_binary = _nodejs_binary
