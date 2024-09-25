import editor from '@renderer/src/app/state/editor'

export function editorHelper(node: HTMLElement) {
  const id = node.getAttribute('data-block-id')

  if (id === editor.currentFocusBlock?.id) {
    node.focus()
  }

  function handleFocusBlockChange(block) {
    if (block.id === id) {
      node.focus()
    }
  }
  editor.on('currentFocusBlock', handleFocusBlockChange)

  function handleInput() {
    const id = node.getAttribute('data-block-id')
    const block = editor.currentFocusPage?.children.find((block) => block.id === id)
    if (!block) return
    block.properties.text = node.textContent || node.value || ''
    editor.emit('currentFocusBlock', block)
    editor.emit('*')
  }

  node.addEventListener('input', handleInput)

  return {
    destroy() {
      node.removeEventListener('input', handleInput)
      editor.off('currentFocusBlock', handleFocusBlockChange)
    }
  }
}