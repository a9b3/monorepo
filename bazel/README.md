# Bazel

Contain all bazel related code. Re-export rules and macros from the language specific directories for use in repos. This is so there is one place to add modifications if needed.

## Structure

```
bazel/{lang}
├── BUILD.bazel
├── examples
└── exports.bzl
```

### BUILD.bazel (bins)

Workspace level tooling. For example `javascript` would contain aliases for `node`, `pnpm` etc.

### examples/

Examples of common build patterns. (e.g. server, image etc.)

### exports.bzl

Common rules and macros for the language.
