export default class Stack<T> {
  private stack: T[] = []

  push(elem: T) {
    this.stack.push(elem)
  }

  pop() {
    return this.stack.pop()
  }

  peek() {
    return this.stack[this.stack.length - 1]
  }

  isEmpty() {
    return this.stack.length === 0
  }

  moveToFront(elem: T) {
    const index = this.stack.indexOf(elem)
    if (index !== -1) {
      this.stack.splice(index, 1)
      this.stack.push(elem)
    }
  }

  remove(elem: T) {
    const index = this.stack.indexOf(elem)
    if (index !== -1) {
      this.stack.splice(index, 1)
    }
  }

  getIndex(elem: T) {
    return this.stack.indexOf(elem)
  }

  size() {
    return this.stack.length
  }

  clear() {
    this.stack = []
  }

  toArray() {
    return this.stack
  }

  includes(elem: T) {
    return this.stack.includes(elem)
  }

  fromHighestToLowest() {
    return this.stack.slice().reverse()
  }
}
