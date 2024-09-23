import blockEditor from '@renderer/src/app/state/blockEditor'
import { writable } from 'svelte/store'

const { subscribe, update } = writable<{
  editor: typeof blockEditor
}>({
  editor: blockEditor
})

blockEditor.on('*', () => update((state) => state))

export default {
  subscribe
}
