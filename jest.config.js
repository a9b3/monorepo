const { defaults } = require('jest-config')

const config = {
  testEnvironment: 'node',
  haste: {
    enableSymlinks: false,
  },
  verbose: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  testMatch: ['**/*.test.js'],
}

module.exports = config
