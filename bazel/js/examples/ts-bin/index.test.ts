const { log } = console

beforeEach(() => {
  console.log = jest.fn()
})

afterEach(() => {
  console.log = log
})

test('outputs hi to stdout', () => {
  require('./index.ts')
  expect(console.log).toHaveBeenCalled()
})
