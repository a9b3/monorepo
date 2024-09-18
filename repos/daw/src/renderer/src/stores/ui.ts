import ui from '@renderer/src/state/ui'
import { writable } from 'svelte/store'

const { subscribe, update } = writable<{
  ui: typeof ui
}>({
  ui: ui
})

export default {
  subscribe
}
