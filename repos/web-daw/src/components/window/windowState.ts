import { EventEmitter } from 'events'

class WindowState extends EventEmitter {
  stack = []

  getZIndex(item: any) {
    const idx = this.stack.indexOf(item)
    return (idx + 1) * 10
  }

  /**
   * Adds item to the top of the stack. Finds in stack if it already exists else
   * it creates it.
   */
  focus(item: any) {
    // it exists so move it to the front of the stack
    this.remove(item)
    this.stack.push(item)
    this.emit('change')
    return this.stack.length * 10
  }

  remove(item: any) {
    const prevIdx = this.stack.indexOf(item)
    if (prevIdx > -1) {
      this.stack.splice(prevIdx, 1)
    }
  }
}

export default new WindowState()
