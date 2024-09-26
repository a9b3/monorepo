let isSelecting = false
let originRange
let originCoords

function coordToRange(x: number, y: number) {
  return document.caretRangeFromPoint(x, y)
}

export function onMouseDown(evt: MouseEvent) {
  isSelecting = true

  window.getSelection()?.removeAllRanges()
  originRange = coordToRange(evt.clientX, evt.clientY)
  originCoords = { x: evt.clientX, y: evt.clientY }
}

export function onMouseMove(evt: MouseEvent) {
  if (!isSelecting) return
  const curRange = coordToRange(evt.clientX, evt.clientY)

  const range = document.createRange()
  if (
    originRange.startContainer.compareDocumentPosition(curRange.endContainer) &
    Node.DOCUMENT_POSITION_FOLLOWING
  ) {
    range.setStart(originRange.startContainer, originRange.startOffset)
    range.setEnd(curRange.endContainer, curRange.endOffset)
  } else {
    // TODO(fix) this is not working, selecting down works but not up
    range.setEnd(originRange.startContainer, originRange.startOffset)
    range.setStart(curRange.endContainer, curRange.endOffset)
    range.setEndAfter
  }

  window.getSelection()?.removeAllRanges()
  window.getSelection()?.addRange(range)
}

export function onMouseUp(evt: MouseEvent) {
  if (!isSelecting) return
  isSelecting = false
}
