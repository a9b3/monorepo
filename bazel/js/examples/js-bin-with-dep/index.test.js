import { jest } from '@jest/globals'
import cowsay from 'cowsay'

beforeEach(() => {
  cowsay.say = jest.fn()
})

afterEach(() => {
  cowsay.say = cowsay.say.original
})

test('outputs hi to stdout', async () => {
  await import('./index.js')
  expect(cowsay.say).toHaveBeenCalledWith({ text: 'Hello world!' })
})
