import { EventEmitter } from 'events'

/**
 * Window Manager
 */
class WindowManager extends EventEmitter {
  // top of stack is back
  stack: HTMLElement[] = []
  zStart = 50

  constructor() {
    super()
    this.on('update', this.#onupdate)
  }

  #onupdate = () => {
    this.stack.forEach((el, idx) => {
      el.style.zIndex = String(idx + this.zStart)
    })
  }

  getZIndex(el: HTMLElement) {
    const idx = this.stack.indexOf(el)
    return this.zStart + idx
  }

  /**
   * Adds item to the top of the stack. Finds in stack if it already exists else
   * it creates it.
   */
  upsert = (el: HTMLElement) => {
    // it exists so move it to the front of the stack
    this.remove(el)
    this.stack.push(el)

    this.emit('update')
  }
  // alias
  focus = this.upsert

  remove(el: HTMLElement) {
    const prevIdx = this.stack.indexOf(el)
    if (prevIdx > -1) {
      this.stack.splice(prevIdx, 1)
    }

    this.emit('update')
  }
}

export default new WindowManager()
