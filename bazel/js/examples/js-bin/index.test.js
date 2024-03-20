const { log } = console

beforeEach(() => {
  console.log = jest.fn()
})

afterEach(() => {
  console.log = log
})

test('outputs hi to stdout', () => {
  require('./index.js')
  expect(console.log).toHaveBeenCalledWith('hi')
})
