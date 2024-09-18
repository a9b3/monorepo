export function saveCursorPosition(containerEl) {
  const selection = window.getSelection()
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

export function restoreCursorPosition(containerEl, savedSel) {
  console.log(`restoreCursorPosition: ${savedSel}`)
  if (!savedSel) return

  const charIndex = (containerEl, index) => {
    const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT, null, false)
    let currentIndex = 0
    while (walker.nextNode()) {
      const nodeLength = walker.currentNode.length
      if (currentIndex + nodeLength > index) {
        return [walker.currentNode, index - currentIndex]
      }
      currentIndex += nodeLength
    }
  }

  const range = document.createRange()
  const [startNode, startOffset] = charIndex(containerEl, savedSel.start)
  const [endNode, endOffset] = charIndex(containerEl, savedSel.end)

  range.setStart(startNode, startOffset)
  range.setEnd(endNode, endOffset)

  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

const saved = {}
export function rememberCursorPos(id, range) {
  saved[id] = range
}
export function getCursorPos(id) {
  return saved[id]
}
