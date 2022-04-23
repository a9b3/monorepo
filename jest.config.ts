import { defaults } from 'jest-config'

const config = {
  testEnvironment: 'node',
  haste: {
    enableSymlinks: true,
  },
  verbose: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  testMatch: ['**/*.test.js'],
}

export default config
