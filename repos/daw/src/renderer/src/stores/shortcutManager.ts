import ShortcutManager from '@renderer/src/app/lib/shortcut/Manager'
import { writable } from 'svelte/store'

export const shortcutManager = new ShortcutManager()

const { subscribe, update } = writable<{
  manager: typeof shortcutManager
}>({
  manager: shortcutManager
})

function setContext(_: HTMLElement, shortcuts: any) {
  const teardown = shortcutManager.register(shortcuts, {activateContext: true})

  return {
    destroy() {
      teardown()
    }
  }
}

export default {
  subscribe,
  setContext
}
