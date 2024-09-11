import { EventEmitter } from 'events'

class UIState extends EventEmitter {
  #currentlyInFocus: string = ''

  get currentlyInFocus(): string {
    return this.#currentlyInFocus
  }

  set currentlyInFocus(value: string) {
    this.#currentlyInFocus = value
    this.emit('change')
  }
}

export default new UIState()
