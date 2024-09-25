export function walk<N extends { children: N[] }, T>(node: N, callback: (node: N) => T): T[] {
  const result: T[] = []
  const stack: N[] = [node]

  while (stack.length > 0) {
    const currentNode = stack.pop()!
    result.push(callback(currentNode))

    for (let i = currentNode.children.length - 1; i >= 0; i--) {
      stack.push(currentNode.children[i])
    }
  }

  return result
}
