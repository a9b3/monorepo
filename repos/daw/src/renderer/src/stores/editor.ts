import Editor from '@renderer/src/app/lib/Editor'
import blockApi from '@renderer/src/app/db/block'
import { writable } from 'svelte/store'
import DebounceQueue from '@renderer/src/app/lib/ds/debounceQueue'

export const editor = new Editor()

const { subscribe, update } = writable<{
  editor: typeof editor
}>({
  editor: editor
})

const debounceQueue = new DebounceQueue(50)

// Listen to all events and save to the database
editor.emitter.on('*', () => {
  update((state) => state)

  debounceQueue.add(async () => {
    if (editor.page) {
      await blockApi.saveBlock(editor.page)
    }
  })
})

export default {
  subscribe
}
