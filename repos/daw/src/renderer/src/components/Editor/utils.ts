export function rangeIncludesRange(range1, range2) {
  return (
    range1.compareBoundaryPoints(Range.START_TO_START, range2) <= 0 &&
    range1.compareBoundaryPoints(Range.END_TO_END, range2) >= 0
  )
}

export function getMouseEventCaretRange(evt) {
  var range,
    x = evt.clientX,
    y = evt.clientY

  // Try the simple IE way first
  if (document.body.createTextRange) {
    range = document.body.createTextRange()
    range.moveToPoint(x, y)
  } else if (typeof document.createRange != 'undefined') {
    // Try Mozilla's rangeOffset and rangeParent properties,
    // which are exactly what we want
    if (typeof evt.rangeParent != 'undefined') {
      range = document.createRange()
      range.setStart(evt.rangeParent, evt.rangeOffset)
      range.collapse(true)
    }

    // Try the standards-based way next
    else if (document.caretPositionFromPoint) {
      var pos = document.caretPositionFromPoint(x, y)
      range = document.createRange()
      range.setStart(pos.offsetNode, pos.offset)
      range.collapse(true)
    }

    // Next, the WebKit way
    else if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y)
    }
  }

  return range
}

export function isValidUrl(string: string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export function insertNodeAtCursor(node: Node, cursor?: Range): void {
  const selection: Selection | null = window.getSelection()
  if (selection && selection.rangeCount) {
    const range: Range = cursor || selection.getRangeAt(0)
    range.deleteContents()
    range.insertNode(node)

    // Move the cursor to the end of the inserted node
    range.setStartAfter(node)
    range.setEndAfter(node)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

export class EditorDomHelper {
  blockAttr = 'data-block-id'

  getById(id: string): HTMLDivElement | null {
    return document.querySelector(`[${this.blockAttr}="${id}"]`)
  }

  getClientRect(r: Range) {
    return r.getClientRects()[0] ? r.getClientRects()[0] : r.startContainer.getClientRects()[0]
  }

  cursorAtTop(cursor: Range, el: HTMLElement): boolean {
    const range = document.createRange()
    range.selectNodeContents(el.firstChild || el)

    return this.getClientRect(cursor).top === this.getClientRect(range).top
  }

  cursorAtBottom(cursor: Range, el: HTMLElement): boolean {
    const range = document.createRange()
    range.selectNodeContents(el.lastChild || el)

    return this.getClientRect(cursor).bottom === this.getClientRect(range).bottom
  }

  /**
   * Check if cursor is at the top/bottom/left/right of the element.
   */
  isRangeAtBoundary(cursor: Range, el: HTMLElement, position: 'top' | 'bottom' | 'left' | 'right') {
    const elementRect = el.getBoundingClientRect()
    let cursorRect = cursor.getBoundingClientRect()
    cursorRect =
      cursorRect.height === 0 && cursorRect.width === 0
        ? cursor.startContainer.getBoundingClientRect()
        : cursorRect

    const buffer = 5
    const padding = Number(
      window
        .getComputedStyle(el)
        ['padding' + position[0].toUpperCase() + position.substring(1)].replace('px', ''),
    )
    let elValue = elementRect[position]
    if (position === 'bottom') {
      elValue = elValue - padding
    } else {
      elValue = elValue + padding
    }

    return Math.abs(elValue - cursorRect[position]) <= buffer
  }

  setCursorAt(node: Node | null, offset: number) {
    const newRange = document.createRange()
    if (!node) return
    newRange.setStart(
      node.firstChild || node,
      Math.min(offset, node.firstChild ? node.firstChild.length : node.length),
    )
    newRange.collapse(true)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(newRange)
  }

  getRangeValues(n: Node, key: string): [node: Node, offset: number] {
    return n[key] ? [n[key], n[key].length] : [n, n.length]
  }

  setNodeValue(n: Node, value: string) {
    if (n instanceof HTMLElement) {
      n.innerHTML = value
    } else {
      n.nodeValue = value
    }

    n.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
  }

  getActiveBlockEl() {
    return document.activeElement
  }

  extractElText(el: Node) {
    let ret = ''
    if (el.nodeType === Node.TEXT_NODE) {
      ret = el.nodeValue || ''
    }
    if (el.nodeType === Node.ELEMENT_NODE) {
      ret = (el as HTMLElement).innerHTML
    }

    if (ret === '<br>') {
      ret = ''
    }
    return ret
  }

  getSelectionRange() {
    const selection = window.getSelection()
    return {
      sRange: selection?.getRangeAt(0),
      selection: selection,
    }
  }

  setSelectionRange(range: Range) {
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    return selection
  }

  focusBlockEl(id: string) {
    const el = this.getById(id)
    if (el) {
      el.focus()
    }
  }
}

export const domHelper = new EditorDomHelper()
