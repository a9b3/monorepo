module.exports = {
  parserOptions: {
    extraFileExtensions: ['.svelte']
  },
  extends: [
    'eslint:recommended',
    'plugin:svelte/recommended',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ],
  rules: {
    'svelte/no-unused-svelte-ignore': 'off'
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@ipc', './src/ipc'],
          ['@main', './src/main'],
          ['@preload', './src/preload'],
          ['@renderer', './src/renderer']
        ],
        extensions: ['.ts', '.js', '.jsx', '.json', '.svelte']
      }
    }
  }
}
