import editor from '@renderer/src/app/state/editor'
import { writable } from 'svelte/store'

const { subscribe, update } = writable<{
  editor: typeof editor
}>({
  editor: editor
})

editor.on('*', () => update((state) => state))

export default {
  subscribe
}
