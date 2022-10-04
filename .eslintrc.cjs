module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', 'svelte3', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
    'svelte3/typescript': true, // load TypeScript as peer dependency
  },
  rules: {
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'lines-between-class-members': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'arrow-body-style': 'off',
    // 'no-unused-vars': ['error', { varsIgnorePattern: '[iI]gnored' }],
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      env: {
        jest: true,
      },
    },
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
}
