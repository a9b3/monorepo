import { jest } from '@jest/globals'

beforeEach(() => {
  jest.unstable_mockModule('@monorepo/examples-js-lib', () => ({
    default: jest.fn(),
  }))
})

describe('Test index.js', () => {
  it('should call foo function', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    const { default: foo } = await import('@monorepo/examples-js-lib')
    await import('./index.js')
    expect(foo).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(foo())
    consoleSpy.mockRestore()
  })
})
