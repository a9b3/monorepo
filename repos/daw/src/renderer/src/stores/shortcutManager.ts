import ShortcutManager from '@renderer/src/lib/shortcut/Manager'
import { writable } from 'svelte/store'

const shortcutManager = new ShortcutManager()

const { subscribe, update } = writable<{
  manager: ShortcutManager
}>({
  manager: shortcutManager
})

export default {
  subscribe
}
