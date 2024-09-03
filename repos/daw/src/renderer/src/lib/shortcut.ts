export interface RegisterArgs {
  handler: (e: KeyboardEvent) => void
  /**
   * The key to trigger the shortcut (e.g. 't', 'Control+Shift+T')
   * Meta keys allowed are 'Control', 'Shift', 'Alt', 'Meta'
   */
  trigger: string
  description?: string
  namespace?: string
  allowMultiple?: boolean
}

const shortcuts = {}

function parseKeyboardEvent(e: KeyboardEvent) {
  let parsed = []

  if (e.altKey) parsed.push('Alt')
  if (e.ctrlKey) parsed.push('Control')
  if (e.metaKey) parsed.push('Meta')
  if (e.shiftKey) parsed.push('Shift')
  if (e.key) parsed.push(e.key)

  return parsed.join('+')
}

export function register(args: RegisterArgs) {
  const { handler, trigger, description, namespace, allowMultiple } = args
  const key = namespace ? `${namespace}.${trigger}` : trigger
  if (shortcuts[key] && !allowMultiple) {
    console.warn(`Shortcut ${key} already exists.`)
    return
  }
  shortcuts[key] = { handler, description }

  window.addEventListener('keydown', (e) => {})
}

export class ShortcutManager {}
