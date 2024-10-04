import Editor from '@renderer/src/app/lib/Editor'
import blockApi from '@renderer/src/app/db/block'
import { writable } from 'svelte/store'
import debounce from 'lodash/debounce'

export const editor = new Editor()

const { subscribe, update } = writable<{
  editor: typeof editor
}>({
  editor: editor
})

// Listen to all events and save to the database
editor.emitter.on(
  '*',
  debounce(() => {
    update((state) => state)

    if (editor.page) {
      blockApi.saveBlock(editor.page)
    }
  }, 50)
)

export default {
  subscribe
}
