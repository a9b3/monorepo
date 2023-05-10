## General

Only use pnpm for all package management needs.

## Adding a js workspace

1. Check to see if the workspace is included in the pnpm-workspace.yaml file
   in the project root directory.

2. Run npx pnpm import

3. Add to the BUILD.bazel file of the created package.

   ```
   load("@npm//:defs.bzl", "npm_link_all_packages")

   npm_link_all_packages(name = "node_modules")
   ```

4. Now it should work you can use :node_modules target from the BUILD.bazel
   file.

## Adding a local dependency

1. Add this to the package's BUILD.bazel

```
load("@npm//:defs.bzl", "npm_link_all_packages")

npm_link_all_packages(name = "node_modules")

```

2. Run npx pnpm import

3. Import in consuming code with the package.json name

4. In the consuming BUILD.bazel use

```
:node_modules/{package name}
```
