import ShortcutManager from '@renderer/src/app/lib/shortcut/Manager'
import { writable } from 'svelte/store'

export const shortcutManager = new ShortcutManager()

const { subscribe, update } = writable<{
  manager: typeof shortcutManager
}>({
  manager: shortcutManager
})

function setContext(_: HTMLElement, context: string) {
  shortcutManager.pushActiveContext(context)

  return {
    destroy() {
      shortcutManager.popActiveContext(context)
    }
  }
}

export default {
  subscribe,
  setContext
}
