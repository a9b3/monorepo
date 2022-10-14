type KeyboardHandler = (evt: KeyboardEvent) => void

class Keyboard {
  started = false
  #handlers: KeyboardHandler[] = []
  #onkeydown: KeyboardHandler = evt => {
    this.#handlers.forEach(handler => {
      try {
        handler(evt)
      } catch (err) {
        console.error(err)
      }
    })
  }

  attach(handler: KeyboardHandler) {
    const idx = this.#handlers.findIndex(x => x === handler)
    if (idx === -1) {
      this.#handlers.push(handler)
    }
  }

  detach(handler: KeyboardHandler) {
    const idx = this.#handlers.findIndex(x => x === handler)
    if (idx !== -1) {
      this.#handlers.splice(idx, 1)
    }
  }

  start() {
    if (!this.started) {
      window.addEventListener('keydown', this.#onkeydown)
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      window.removeEventListener('keydown', this.#onkeydown)
      this.started = false
    }
  }
}

export const keyboard = new Keyboard()
keyboard.start()
