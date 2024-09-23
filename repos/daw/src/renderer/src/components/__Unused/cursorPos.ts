/**
 * return the start and end position of the cursor in the container element
 */
export function getCursorRange(containerEl: Node): {
  start: number
  end: number
} | null {
  const selection = window.getSelection()
  if (!selection) return null
  if (selection.rangeCount === 0) return null

  const range = selection.getRangeAt(0)
  const preSelectionRange = range.cloneRange()
  preSelectionRange.selectNodeContents(containerEl)
  preSelectionRange.setEnd(range.startContainer, range.startOffset)
  const start = preSelectionRange.toString().length

  return {
    start: start,
    end: start + range.toString().length
  }
}

/**
 * set the cursor position in the container element
 */
export function setCursorRange(containerEl: any, savedSel: { start: any; end: any }) {
  if (!savedSel) return

  const charIndex = (containerEl: Node, index: number) => {
    const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT, null)
    let currentIndex = 0
    while (walker.nextNode()) {
      // @ts-ignore
      const nodeLength = walker.currentNode.length
      if (currentIndex + nodeLength > index) {
        return [walker.currentNode, index - currentIndex]
      }
      currentIndex += nodeLength
    }

    return [walker.currentNode, index - currentIndex + walker.currentNode.length]
  }

  const range = document.createRange()
  // @ts-ignore
  const [startNode, startOffset] = charIndex(containerEl, savedSel.start)
  const [endNode, endOffset] = charIndex(containerEl, savedSel.end)

  range.setStart(startNode, startOffset)
  range.setEnd(endNode, endOffset)

  const selection = window.getSelection()
  if (!selection) return
  selection.removeAllRanges()
  selection.addRange(range)
}
