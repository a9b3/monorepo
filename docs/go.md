## Modules

All external dependencies should reside in go.mod in the root of the project.
Just add modules as an import statement in your code and run `go mod tidy`.

## Internal Dependencies

All package names are prefixed with the module value in the root go.mod. Which
is currently set to `github.com/publiclabel/monorepo`. The path should be
relative path from project root.
