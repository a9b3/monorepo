# Usage

Adding/Updating a proto file.

1. Run `bazelisk run //:gazelle -- ./orgs/examples/proto` to generate BUILD rules for new proto file. Only run in this directory.
2. Manually update proto_compile_assets in BUILD.bazel to include the new proto_compile target.
3. Run `bazelisk run //orgs/examples/proto:assets` to copy generated pb files
   into source.
4. Run `bazelisk run //:gazelle -- ./orgs/examples/proto` again to generate
   library rules for the generated assets.
5. Check generated files into source.
6. Now you can depend on the generated pb files from your application.
