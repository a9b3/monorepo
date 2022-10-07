let dragState = undefined

export function createDragSource(arg: any) {
  return function dragSourceHandler(node: HTMLElement) {
    const onDrag = () => {
      dragState = arg
    }

    node.addEventListener('dragstart', onDrag)

    return {
      destroy() {
        node.removeEventListener('dragstart', onDrag)
      },
    }
  }
}

export function createDragTarget(onDrop: (arg: any) => void) {
  return function dragTargetHandler(node) {
    const handleDrop = () => {
      onDrop(dragState)
      dragState = undefined
      node.style.opacity = 1
    }

    const handleDragover = evt => {
      node.style.opacity = 0.6
      evt.preventDefault()
    }

    const handleDragLeave = evt => {
      node.style.opacity = 1
    }

    node.addEventListener('dragover', handleDragover)
    node.addEventListener('dragleave', handleDragLeave)
    node.addEventListener('drop', handleDrop)

    return {
      destroy() {
        node.removeEventListener('dragover', handleDragover)
        node.removeEventListener('dragleave', handleDragLeave)
        node.removeEventListener('drop', handleDrop)
      },
    }
  }
}
