## Javascript

Documentation for working with javascript language in this repo.

### Package Manager

1. Init a project by running `pnpm init` in the sub directory.
2. Add packages by running pnpm commands e.g. `pnpm add randomocolor --save`

The root `pnpm-workspace.yaml` will source all available packages in the
monorepo. They can be used by other modules via their package.json name.
Include the local module in the consuming module's package.json (ex.
`"@monorepo/daw-core": "workspace:*"`).
