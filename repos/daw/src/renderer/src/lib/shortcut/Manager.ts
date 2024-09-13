export interface Shortcut {
  key: string
  title?: string
  description?: string
  action: () => void
}

export interface ShortcutGroup {
  title: string
  context: string
  description: string
  shortcuts: Shortcut[]
}

function isMetaKey(s: string) {
  return ['ctrl', 'alt', 'meta', 'shift'].includes(s)
}

function parseShortcutKey(key: string) {
  const metaKeys = []
  const keys = []
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
}

function eventToShortcutKey(event: KeyboardEvent): string {
  const metaKeys = []
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

export default class ShortcutManager {
  listening = false
  shortcuts: Map<string, ShortcutGroup> = new Map()
  contextStack: string[] = []

  /**
   * Map of token to action the key is the parsed key.
   */
  tokenToAction: Map<string, { context: string; action: () => void }> = new Map()

  keyhandler = (event: KeyboardEvent): void => {
    const token = eventToShortcutKey(event)
    if (this.tokenToAction.has(token)) {
      const { context, action } = this.tokenToAction.get(token)
      if (action && this.contextStack.includes(context)) {
        action()
      }
    }
  }

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

  register(shortcutGroup: ShortcutGroup): void {
    const { context } = shortcutGroup
    this.shortcuts.set(context, shortcutGroup)
    shortcutGroup.shortcuts.forEach((shortcut) => {
      this.tokenToAction.set(parseShortcutKey(shortcut.key), { context, action: shortcut.action })
    })
  }

  pushActiveContext(context: string): void {
    this.contextStack.push(context)
  }

  popActiveContext(context: string): void {
    this.contextStack = this.contextStack.filter((c) => c !== context)
  }
}
