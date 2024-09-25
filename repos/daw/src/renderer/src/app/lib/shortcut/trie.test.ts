import { GenericTrie } from './trie'

describe('trie', () => {
  test('constructor', () => {
    const trie = new GenericTrie<string, () => void>()
    expect(trie).toBeInstanceOf(GenericTrie)
  })

  test('addSequence', () => {
    const trie = new GenericTrie<string, string>()
    trie.addSequence(['Ctrl', 'C'], 'foo')
    expect(trie.findSequence(['Ctrl', 'C'])).toBeTruthy()
    expect(trie.findSequence(['Ctrl', 'D'])).toBeNull()
  })

  test('findLongestPrefix', () => {
    const trie = new GenericTrie<string, string>()
    trie.addSequence(['Ctrl', 'C'], 'foo')
    trie.addSequence(['Ctrl', 'C', 'D'], 'bar')
    expect(trie.findLongestPrefix(['Ctrl', 'C', 'D', 'E'])).toBe('bar')
    expect(trie.findLongestPrefix(['a'])).toBeNull()
  })
})
