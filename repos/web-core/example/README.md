# How to use

1. Add workspace dependency to consuming `package.json`

   ```
   "dependencies": {
       "@monorepo/web-core/example": "workspace:*"
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
