import { writable } from 'svelte/store'

const filesStore = writable<EditorDoc>({
  files: {},
})

export default filesStore
