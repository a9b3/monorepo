"""JS exports

Re-export js rules for internal use.
"""

load(
    "@aspect_rules_jest//jest:defs.bzl",
    _jest_test = "jest_test",
)
load(
    "@aspect_rules_js//js:defs.bzl",
    _js_image_layer = "js_image_layer",
    _js_library = "js_library",
    _nodejs_binary = "js_binary",
)
load(
    "@aspect_rules_ts//ts:defs.bzl",
    _ts_project = "ts_project",
)
load(
    "@npm//:defs.bzl",
    _npm_link_all_packages = "npm_link_all_packages",
)

def _jest_test_override(name, **kwargs):
    _jest_test(
        name = name,
        node_options = [
            "--experimental-vm-modules",
        ],
        **kwargs
    )

# Copied using swc from this example
# https://github.com/aspect-build/bazel-examples/tree/main/ts_project_transpiler
def _ts_project_override(name, **kwargs):
    _ts_project(
        name = name,
        tsconfig = "//:tsconfig_root",
        declaration = True,
        allow_js = True,
        source_map = True,
        **kwargs
    )

ts_project = _ts_project_override
jest_test = _jest_test_override
js_library = _js_library
js_binary = _nodejs_binary
js_image_layer = _js_image_layer
npm_link_all_packages = _npm_link_all_packages
