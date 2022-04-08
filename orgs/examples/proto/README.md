# Usage

Adding/Updating a proto file.

1. Run `bazelisk run //:gazelle` to generate BUILD rules for new proto file.
2. Manually update proto_compile_assets in BUILD.bazel to include the new proto_compile target.
3. Run `bazelisk run //orgs/examples/proto:assets` to copy generated pb files
   into source.
4. Check generated files into source.
