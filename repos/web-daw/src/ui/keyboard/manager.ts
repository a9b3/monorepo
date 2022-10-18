export type ComboHandler = {
  handler: () => void
  key: string
  description?: string
}

function keyEventToComboKey(evt: KeyboardEvent) {
  const modKeys = {
    Alt: true,
    Ctrl: true,
    Meta: true,
    Shift: true,
  }
  return [
    evt.altKey ? 'Alt' : undefined,
    evt.ctrlKey ? 'Ctrl' : undefined,
    evt.metaKey ? 'Meta' : undefined,
    evt.shiftKey ? 'Shift' : undefined,
    evt.code === 'Space' ? 'Space' : modKeys[evt.key] ? undefined : evt.key,
  ]
    .filter(Boolean)
    .join('+')
}

export class KeyboardManager {
  started = false

  combos: { [key: string]: ComboHandler[] } = {}

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

  attach(comboKey: string, handler: ComboHandler) {
    this.combos[comboKey] = this.combos[comboKey] || []
    this.combos[comboKey].push(handler)
  }

  detach(comboKey: string, key: string) {
    this.combos[comboKey] = this.combos[comboKey].filter(
      comboHandler => comboHandler.key !== key
    )
  }

  #onkeydown = (evt: KeyboardEvent) => {
    const comboKey = keyEventToComboKey(evt)

    const callbacks = this.combos[comboKey]
    if (callbacks) {
      callbacks.forEach(({ handler }) => handler())
    }
  }
}
