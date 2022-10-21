import { BoundaryManager } from '../boundary/manager'

export const BOUNDARY_KEY = 'keyboard'

export type ComboHandler = {
  handler: () => void
  boundaryKey?: string
  key: string
  description?: string
}

/**
 * Tree data structure for keyboard shortcuts, each level is a depth in the
 * boundary tree.
 */
export type ComboHandlerTree = {
  [boundaryKey: string]: ComboHandler & {
    children?: ComboHandlerTree
  }
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

  /**
   * ex.
   *
   * 'Ctrl+t': {
      root: {
        handler: () => {},
        key: 'asd',
        description: 'Hello',
        children: {
          project: {
            handler: () => {},
            key: 'asd',
            description: 'Hello',
          },
        },
      },
   */
  combos: { [comboKey: string]: ComboHandlerTree } = {}

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
  attach(comboKey: string, handler: ComboHandler, path: string[] = []) {
    this.combos[comboKey] = this.combos[comboKey] || {}

    let node = this.combos[comboKey]
    for (let i = 0; i < path.length; i += 1) {
      if (!node[path[i]]) {
        node[path[i]] = {
          ...handler,
          children: {},
        }
        return
      }

      node = node[path[i]].children
    }
  }

  /**
   * Remove the registered handler at a given path, this will prune the subtree.
   */
  detach(comboKey: string, path: string[] = []) {
    let node = this.combos[comboKey]
    for (let i = 0; i <= path.length; i += 1) {
      if (!node[path[i]]) {
        return
      }
      node = node[path[i]].children
    }
    delete node[path[path.length - 1]]
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

    const path = this.boundaryManager
      .getEventBoundaryParents(this.boundaryManager.activeBoundary?.el)
      .map(boundary => boundary.key)

    let curNode = this.combos[comboKey]
    let comboHandler: ComboHandler & { children?: ComboHandlerTree }
    const foundStack = []
    for (let i = 0; i < path.length; i += 1) {
      comboHandler = curNode?.[path[i]]
      if (comboHandler) {
        foundStack.push(comboHandler)
      }
      curNode = comboHandler?.children
    }

    let run: { handler: () => void }
    while (foundStack.length > 0) {
      run = foundStack.pop()
      if (run && run.handler) {
        run.handler()
        return
      }
    }
  }
}

function flattenTree(node, res = []) {
  if (!node) {
    return res.flat()
  }
  res.push(node)

  for (let i = 0; i < Object.keys(node.children || []).length; i += 1) {
    res.push(flattenTree(node.children[i]))
  }
  return res.flat()
}

export function parseCombosForHelpMenu(
  combos: { [comboKey: string]: ComboHandlerTree },
  activeBoundary: string
) {
  console.log(combos)
  return Object.entries(combos).map(([comboKey, comboHandler]) => {
    return {
      comboKey,
      handlers: flattenTree(comboHandler),
    }
  })
}
