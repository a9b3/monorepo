module.exports = {
  extends: '../../.eslintrc.cjs',
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          // un-ban a type that's banned by default
          Function: false,
        },
        extendDefaults: true,
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.svelte'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        project: ['./tsconfig.json'],
      },
    },
  },
}
