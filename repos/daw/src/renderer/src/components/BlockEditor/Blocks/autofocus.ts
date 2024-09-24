import blockEditor from '@renderer/src/app/state/blockEditor'

export function autofocus(node: HTMLElement) {
  const id = node.getAttribute('data-block-id')

  if (id === blockEditor.currentFocusBlock?.id) {
    node.focus()
  }

  function handleInput(evt: HTMLInputElement) {}

  node.addEventListener('input', handleInput)

  return {
    destroy() {
      node.removeEventListener('input', handleInput)
    }
  }
}
