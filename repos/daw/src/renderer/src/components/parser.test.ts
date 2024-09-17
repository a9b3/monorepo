import { parse } from './parser'

describe('parser', () => {
  it('parses a string into an array', () => {
    const result = parse('hello\nworld')
    expect(result).toEqual(['hello', 'world'])
  })
})
