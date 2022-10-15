module.exports = {
  extends: '../../.eslintrc.cjs',
  rules: {
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
}
