import editor from '@renderer/src/app/state/editor'

export function editorHelper(node: HTMLElement) {
  const id = node.getAttribute('data-block-id')

  if (id === editor.currentFocusBlock?.id) {
    node.focus()
  }

  function handleChange() {
    if (editor.currentFocusBlock === id) {
      node.focus()
    }
  }
  editor.emitter.on('*', handleChange)

  function handleInput() {
    const id = node.getAttribute('data-block-id')
    const block = editor.currentFocusPage?.children.find((block) => block.id === id)
    if (!block) return
    block.properties.text = node.textContent || node.value || ''
    editor.emitter.emit('currentFocusBlock', block)
    editor.emitter.emit('*')
  }

  node.addEventListener('input', handleInput)

  return {
    destroy() {
      node.removeEventListener('input', handleInput)
      editor.emitter.off('currentFocusBlock', handleInput)
    }
  }
}
