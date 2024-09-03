class TrieNode<T, A> {
  children: Map<T, TrieNode<T, A>>
  isEndOfSequence: boolean
  value: A | null

  constructor() {
    this.children = new Map()
    this.isEndOfSequence = false
    this.value = null
  }
}

/**
 * A generic trie data structure.
 *  T is the type of the items in the sequence.
 *  A is the type of the value associated with the sequence.
 *
 * ex.
 * type KeySequence = (string | string[])[]
 * type Value = () => void
 * const keySequences = new GenericTrie<string | string[], Value>()
 * keySequences.addSequence(['Ctrl', 'C'], () => console.log('Copy'))
 */
export class GenericTrie<T, A> {
  private root: TrieNode<T, A>

  constructor() {
    this.root = new TrieNode<T, A>()
  }

  addSequence(sequence: T[], value: A): void {
    let node = this.root
    for (const item of sequence) {
      if (!node.children.has(item)) {
        node.children.set(item, new TrieNode<T, A>())
      }
      node = node.children.get(item)!
    }
    node.isEndOfSequence = true
    node.value = value
  }

  findSequence(sequence: T[]): A | null {
    let node = this.root
    for (const item of sequence) {
      if (!node.children.has(item)) {
        return null
      }
      node = node.children.get(item)!
    }
    return node.isEndOfSequence ? node.value : null
  }

  /**
   * Find the longest prefix of the given sequence that has an associated value.
   */
  findLongestPrefix(sequence: T[]): A | null {
    let node = this.root
    let lastValueNode: TrieNode<T, A> | null = null
    for (const item of sequence) {
      if (!node.children.has(item)) {
        break
      }
      node = node.children.get(item)!
      if (node.isEndOfSequence) {
        lastValueNode = node
      }
    }
    return lastValueNode ? lastValueNode.value : null
  }
}
