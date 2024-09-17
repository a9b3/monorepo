import shortcutManager from '@renderer/src/state/shortcutManager'
import { writable } from 'svelte/store'

const { subscribe, update } = writable<{
  manager: typeof shortcutManager
}>({
  manager: shortcutManager
})

export default {
  subscribe
}
