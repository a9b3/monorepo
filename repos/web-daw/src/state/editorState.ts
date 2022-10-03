import { readable, writable, derived } from 'svelte/store'
import { EditorState } from './editor'

const editorState = new EditorState()
const writeableEditorState = writable(editorState)
const { subscribe } = writeableEditorState

export function setSelected(id) {
  editorState.selected = id
  writeableEditorState.update(() => editorState)
}

export default {
  subscribe,
}
