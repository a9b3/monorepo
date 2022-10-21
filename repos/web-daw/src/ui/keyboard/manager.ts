import { BoundaryManager } from '../boundary/manager'

export const BOUNDARY_KEY = 'keyboard'

export type ComboHandler = {
  handler: () => void
  boundaryKey?: string
  key: string
  description?: string
}

/**
 * Tree data structure for keyboard shortcuts.
 */
export type ComboHandlers = {
  [boundaryKey: string]: ComboHandler
}

/**
 * Returns a string key
 */
function keyEventToComboKey(evt: KeyboardEvent): string {
  const modKeys = {
    Alt: true,
    Ctrl: true,
    Meta: true,
    Shift: true,
  }

  let pressedKey = modKeys[evt.key] ? undefined : evt.key
  // Space key is a special case since evt.key will just be an empty string " "
  // but we want to be able to use "Space" to assign handlers to.
  if (evt.code === 'Space') {
    pressedKey = 'Space'
  }

  return [
    evt.altKey ? 'Alt' : undefined,
    evt.ctrlKey ? 'Ctrl' : undefined,
    evt.metaKey ? 'Meta' : undefined,
    evt.shiftKey ? 'Shift' : undefined,
    pressedKey,
  ]
    .filter(Boolean)
    .join('+')
}

/**
 * Keyboard Shortcuts Manager
 */
export class KeyboardManager {
  started = false
  boundaryManager = new BoundaryManager(BOUNDARY_KEY)
  combos: { [comboKey: string]: ComboHandlers } = {}

  /**
   * Invoke once per application.
   */
  start() {
    if (!this.started) {
      window.addEventListener('keydown', this.#onkeydown)
      this.started = true
    }
  }

  stop() {
    window.removeEventListener('keydown', this.#onkeydown)
    if (this.started) {
      this.started = false
    }
  }

  /**
   * Attach into the combos data structure. The boundary path can be gotten by
   * calling boundaryManager.getEventBoundaryParents
   */
  attach(comboKey: string, handler: ComboHandler, boundaryKey: string) {
    this.combos[comboKey] = this.combos[comboKey] || {}
    this.combos[comboKey][boundaryKey] = handler
  }

  /**
   * Remove the registered handler at a given path, this will prune the subtree.
   */
  detach(comboKey: string, boundaryKey: string) {
    delete this.combos[comboKey]?.[boundaryKey]
    if (Object.keys(this.combos[comboKey]).length === 0) {
      delete this.combos[comboKey]
    }
  }

  /**
   * The keydown handler that will run the registered combo.
   *
   * 1. If comboKey is registered
   * 2. Get the traversable path to the active boundary
   * 3. Go down path in this.combos
   * 4. Run the lowest found handler
   */
  #onkeydown = (evt: KeyboardEvent) => {
    const comboKey = keyEventToComboKey(evt)
    const found = this.combos[comboKey]
    if (!found) {
      return
    }

    const path = this.boundaryManager
      .getActiveBoundaryPath()
      .map(boundary => boundary.key)

    for (let i = 0; i < path.length; i += 1) {
      if (found[path[i]]?.handler) {
        found[path[i]].handler()
        return
      }
    }
  }
}
