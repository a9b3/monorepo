const { defaults } = require('jest-config')

const config = {
  testEnvironment: 'node',
  haste: {
    enableSymlinks: false,
  },
  verbose: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'mjs'],
  testMatch: ['**/*.test.js', '**/*.test.mjs'],
  transform: {},
}

module.exports = config
