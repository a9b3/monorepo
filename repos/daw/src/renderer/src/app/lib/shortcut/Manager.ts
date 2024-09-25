export interface Shortcut {
  key: string
  title?: string
  description?: string
  preventDefault?: boolean
  stopPropagation?: boolean
  action: (e: KeyboardEvent) => void
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
}

function eventToShortcutKey(event: KeyboardEvent): string {
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

export default class ShortcutManager {
  listening = false
  shortcuts: Map<string, ShortcutGroup> = new Map()
  contextStack: string[] = []

  /**
   * Map of token to actions. The key is the parsed key.
   */
  tokenToActions: Map<string, ({ context: string } & Shortcut)[]> = new Map()

  keyhandler = (event: KeyboardEvent): void => {
    const token = eventToShortcutKey(event)
    const actions = this.tokenToActions.get(token)
    if (actions && actions.length > 0) {
      const validActions = actions.filter(({ context }) => this.contextStack.includes(context))
      if (validActions.length > 0) {
        // Find the action with the highest matching context
        const highestContextAction = validActions.reduce((prev, current) => {
          const prevIndex = this.contextStack.lastIndexOf(prev.context)
          const currentIndex = this.contextStack.lastIndexOf(current.context)
          return currentIndex > prevIndex ? current : prev
        })
        console.log('Action', highestContextAction)
        highestContextAction.action(event)
        highestContextAction.preventDefault && event.preventDefault()
        highestContextAction.stopPropagation && event.stopPropagation()
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
      const token = parseShortcutKey(shortcut.key)
      if (!this.tokenToActions.has(token)) {
        this.tokenToActions.set(token, [])
      }
      const idx = this.tokenToActions.get(token)!.findIndex((a) => a.context === context)
      if (idx !== -1) {
        this.tokenToActions.get(token)![idx] = { context, ...shortcut }
      } else {
        this.tokenToActions.get(token)!.push({ context, ...shortcut })
      }
    })
  }

  pushActiveContext(context: string): void {
    this.contextStack.push(context)
  }

  popActiveContext(context: string): void {
    this.contextStack = this.contextStack.filter((c) => c !== context)
  }
}
