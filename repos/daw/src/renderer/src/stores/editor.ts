import Editor from '@renderer/src/app/lib/Editor'
import blockApi from '@renderer/src/app/db/block'
import { writable } from 'svelte/store'
import { shortcutManager } from './shortcutManager'

export const editor = new Editor(shortcutManager)

const { subscribe, update } = writable<{
  editor: typeof editor
}>({
  editor: editor
})

// Listen to all events and save to the database
editor.emitter.on('*', () => {
  update((state) => state)

  if (editor.page) {
    blockApi.saveBlock(editor.page)
  }
})

const moveCursorToEnd = (contentEle) => {
  const range = document.createRange()
  const selection = window.getSelection()
  range.setStart(contentEle, contentEle.childNodes.length)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

/**
 * Focus the element if it is the current focus block.
 */
export function setBlockBehavior(node: HTMLElement, id: string) {
  if (id === editor.currentBlockId) {
    node.focus()
  }

  function handleChange() {
    if (editor.currentBlockId === id) {
      node.focus()
    }
  }

  function onFocus() {
    editor.setCurrentFocusBlockId(id)
    moveCursorToEnd(node)
  }

  function onInput(evt) {
    editor.updateBlock(id, {
      properties: {
        text: evt.target.value || evt.target.innerHTML || ''
      }
    })
  }

  editor.emitter.on('*', handleChange)
  node.addEventListener('focusin', onFocus)
  node.addEventListener('input', onInput)

  return {
    destroy() {
      editor.emitter.off('*', handleChange)
      node.removeEventListener('focusin', onFocus)
      node.removeEventListener('input', onInput)
    }
  }
}

export default {
  subscribe
}
