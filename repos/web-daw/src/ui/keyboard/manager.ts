import { debounce } from 'lodash'

function keyEventToComboKey(evt: KeyboardEvent) {
  return [
    evt.altKey ? 'Alt' : undefined,
    evt.ctrlKey ? 'Ctrl' : undefined,
    evt.metaKey ? 'Meta' : undefined,
    evt.shiftKey ? 'Shift' : undefined,
    evt.code === 'Space' ? 'Space' : evt.key,
  ]
    .filter(Boolean)
    .join('+')
}

export class KeyboardManager {
  /**
   * Maximum time between key presses to be considered a combo
   */
  maxInterval = 100
  started = false
  pressedKeys = []
  #interval = undefined

  combos = {
    'Shift+?': () => {
      console.log(`test`)
    },
    Space: () => {
      console.log(`pressed space`)
    },
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

  #onkeydown = evt => {
    const comboKey = keyEventToComboKey(evt)
    console.log(`comboKey`, comboKey)
    this.pressedKeys.push(comboKey)

    let curNode = this.combos
    for (let i = 0; i < this.pressedKeys.length; i += 1) {
      const curKey = this.pressedKeys[i]
      curNode = curNode[curKey]
      if (!curNode) {
        break
      }
    }
    if (typeof curNode === 'function') {
      curNode()
      this.pressedKeys = []
    } else {
      this.pressedKeys.push(comboKey)
      if (this.#interval) clearInterval(this.#interval)
      this.#interval = setInterval(() => {
        this.pressedKeys = []
      }, this.maxInterval)
    }
  }

  // attach(handler: KeyboardHandler) {
  //   const idx = this.#handlers.findIndex(x => x === handler)
  //   if (idx === -1) {
  //     this.#handlers.push(handler)
  //   }
  // }
  //
  // detach(handler: KeyboardHandler) {
  //   const idx = this.#handlers.findIndex(x => x === handler)
  //   if (idx !== -1) {
  //     this.#handlers.splice(idx, 1)
  //   }
  // }
}
