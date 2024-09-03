import { GenericTrie } from './trie'

interface KeyCombo {
  // The main key for this part of the shortcut (e.g., 'A', 'Enter', 'F1')
  key: string
  // Array of modifier keys (e.g., ['Ctrl', 'Shift'])
  modifiers: string[]
}

interface Shortcut {
  // Sequence of key combinations that make up the shortcut
  sequence: KeyCombo[]
  // Function to execute when the shortcut is triggered
  action: () => void
  // The context(s) in which this shortcut is active
  context: string | string[]
  // Optional description of what the shortcut does
  description?: string
}

interface ShortcutManager {
  // Adds a new shortcut to the manager
  addShortcut(shortcut: Shortcut): void
  // Removes a specific shortcut from the manager
  removeShortcut(sequence: KeyCombo[], context: string): void
  // Retrieves all shortcuts for a given context
  getShortcuts(context: string): Shortcut[]
  // Handles a key press event, potentially triggering a shortcut
  handleKeyPress(event: KeyboardEvent): void
  // Resolves which shortcuts are active based on current contexts
  resolveShortcuts(contextManager: ContextManager): Shortcut[]
  // Resets the current key sequence (e.g., after a timeout)
  resetKeySequence(): void
}

interface Context {
  // Unique name for the context
  name: string
  // Optional parent context name for hierarchical relationships
  parentContext?: string
  // Function that determines if this context is currently active
  isActive: () => boolean
}

interface ContextHierarchy {
  // Maps context names to their hierarchical information
  [contextName: string]: {
    // Names of child contexts
    children: string[]
    // Name of the parent context, if any
    parent?: string
  }
}

interface ContextManager {
  // Adds a new context to the manager
  addContext(context: Context): void
  // Removes a context from the manager
  removeContext(name: string): void
  // Returns an array of currently active context names
  getActiveContexts(): string[]
  // Returns the full hierarchy structure of contexts
  getContextHierarchy(): ContextHierarchy
  // Checks if a specific context is currently active
  isContextActive(name: string): boolean
  // Returns an array of ancestor context names for a given context
  getAncestors(contextName: string): string[]
  // Returns an array of descendant context names for a given context
  getDescendants(contextName: string): string[]
}

interface KeyboardShortcutsManager {
  // The shortcut manager instance
  shortcutManager: ShortcutManager
  // The context manager instance
  contextManager: ContextManager
  // Initializes the keyboard shortcuts manager
  init(): void
  // Cleans up and disables the keyboard shortcuts manager
  destroy(): void
  // Sets the timeout for key sequences
  setKeySequenceTimeout(ms: number): void
}

class ShortcutManager {
  public shortcuts: GenericTrie<string[], {}>

  constructor() {
    this.shortcuts = new GenericTrie<string[], () => void>()
  }

  register(trigger: string, handler: () => void) {
    this.shortcuts.addSequence(trigger.split('+'), handler)
  }

  handleEvent(e: KeyboardEvent) {
    const parsed = parseKeyboardEvent(e)
    const handler = this.shortcuts.findLongestPrefix(parsed.split('+'))
    if (handler) {
      e.preventDefault()
      handler()
    }
  }
}

export default new ShortcutManager()
