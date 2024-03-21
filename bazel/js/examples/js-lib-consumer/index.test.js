import { jest } from '@jest/globals'

let { default: foo } = await import('@monorepo/examples-js-lib')

beforeEach(async () => {
  foo = jest.fn()
})

afterEach(() => {
  foo = foo.original
})

describe('Test index.js', () => {
  it('should call foo function', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    await import('./index.js')
    expect(foo).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(foo())
    consoleSpy.mockRestore()
  })
})
