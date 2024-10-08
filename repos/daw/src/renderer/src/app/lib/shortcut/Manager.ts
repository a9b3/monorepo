import Stack from '@renderer/src/app/lib/ds/stack/stack'

export interface Shortcut {
  key: string
  action: (e: KeyboardEvent) => void
  title?: string
  description?: string
  preventDefault?: boolean
  stopPropagation?: boolean
}

export interface Shortcuts {
  title: string
  context: string
  description: string
  shortcuts: Shortcut[]
}

function isMetaKey(s: string) {
  return ['ctrl', 'alt', 'meta', 'shift'].includes(s)
}

const keyParser = {
  /**
   * Parse a shortcut key into a canonical form.
   * For example, 'ctrl+shift+a' and 'shift+ctrl+a' are equivalent.
   */
  fromString: (key: string) => {
    const metaKeys: string[] = []
    const keys: string[] = []
    const arr = key.split('+')
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index]
      if (isMetaKey(element)) {
        metaKeys.push(element)
      } else {
        keys.push(element)
      }
    }
    return metaKeys.sort().concat(keys.sort()).join('+')
  },

  /**
   * Convert a KeyboardEvent into a canonical shortcut key.
   * For example, 'ctrl+shift+a' and 'shift+ctrl+a' are equivalent.
   */
  fromKeyboardEvent: (event: KeyboardEvent) => {
    const metaKeys: string[] = []
    if (event.altKey) {
      metaKeys.push('alt')
    }
    if (event.ctrlKey) {
      metaKeys.push('ctrl')
    }
    if (event.metaKey) {
      metaKeys.push('meta')
    }
    if (event.shiftKey) {
      metaKeys.push('shift')
    }
    return metaKeys.sort().concat(event.key).join('+')
  }
}

/**
 * A manager for handling keyboard shortcuts.
 * This class allows for registering shortcuts and invoking the appropriate
 * action based on the current context.
 */
export default class ShortcutManager {
  private listening = false
  shortcuts: Map<string, Shortcuts> = new Map()
  contextStack: Stack<string> = new Stack()
  // Map of token to actions. The key is the parsed key. Used by the keyhandler
  // to quickly find the action associated with a key.
  // ex.
  // {
  //  'ctrl+shift+a': {
  //    'context1': { key: 'ctrl+shift+a', action: () => {}, ... },
  //    'context2': { key: 'ctrl+shift+a', action: () => {}, ... },
  //  }
  // }
  tokenToActions: Map<string, Map<string, Shortcut>> = new Map()

  constructor() {
    this.startListening()
  }

  startListening(): void {
    if (!this.listening) {
      this.listening = true
      window.addEventListener('keydown', this.keyhandler)
    }
  }

  stopListening(): void {
    this.listening = false
    window.removeEventListener('keydown', this.keyhandler)
  }

  register(
    shortcuts: Shortcuts,
    opts?: { container?: HTMLElement; activateContext?: boolean }
  ): () => void {
    const { context } = shortcuts
    this.shortcuts.set(context, shortcuts)

    shortcuts.shortcuts.forEach((shortcut) => {
      const token = keyParser.fromString(shortcut.key)
      if (!this.tokenToActions.has(token)) {
        this.tokenToActions.set(token, new Map())
      }
      if (this.tokenToActions.get(token)!.has(context)) {
        console.debug(`Shortcut ${shortcut.key} is already registered for context ${context}`)
      }
      this.tokenToActions.get(token)!.set(context, shortcut)
    })

    if (opts) {
      if (opts.activateContext) {
        this.pushActiveContext(context)
      }
      if (opts.container) {
        opts.container.addEventListener('keydown', this.keyhandler)
      }
    }

    return () => {
      if (opts) {
        if (opts.activateContext) {
          this.popActiveContext(context)
        }
        if (opts.container) {
          opts.container.removeEventListener('keydown', this.keyhandler)
        }
      }
    }
  }

  pushActiveContext(context: string): void {
    this.contextStack.push(context)
  }

  popActiveContext(context: string): void {
    this.contextStack.remove(context)
  }

  /**
   * Find and invoke the action associated with the highest context in the
   * context stack.
   */
  private keyhandler = (event: KeyboardEvent): void => {
    const token = keyParser.fromKeyboardEvent(event)
    const contextMap = this.tokenToActions.get(token)

    if (!contextMap) {
      return
    }

    for (const context of this.contextStack.fromHighestToLowest()) {
      const action = contextMap.get(context)
      if (action) {
        action.action(event)
        action.preventDefault && event.preventDefault()
        action.stopPropagation && event.stopPropagation()
        return
      }
    }
  }
}
