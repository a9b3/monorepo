# @monorepo/web-core/styles

Design system tokens and utility functions for working with tokens.

## Usage

```js
import { primatives } from '@monorepo/web-core/styles'

console.log(primatives.color.primary)
```

## Install

1. Add workspace dependency to consuming `package.json`

   ```
   "dependencies": {
       "@monorepo/web-core/styles": "workspace:*"
   }
   ```

2. Run `pnpm install` to symlink to node_modules

3. [vite] Add alias for workspace

   ```
     resolve: {
       alias: {
         '@monorepo': path.resolve(__dirname, './node_modules/@monorepo'),
       },
     },
   ```

You should be able to import from consuming code after these steps.
