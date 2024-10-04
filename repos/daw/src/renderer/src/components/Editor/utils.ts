function isMetaKey(s: string) {
  return ['ctrl', 'alt', 'meta', 'shift'].includes(s)
}

export const keyParser = {
  /**
   * Parse a shortcut key into a canonical form.
   * For example, 'ctrl+shift+a' and 'shift+ctrl+a' are equivalent.
   */
  fromString: (key: string) => {
    const metaKeys: string[] = []
    const keys: string[] = []
    const arr = key.split('+')
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index]
      if (isMetaKey(element)) {
        metaKeys.push(element)
      } else {
        keys.push(element)
      }
    }
    return metaKeys.sort().concat(keys.sort()).join('+')
  },

  /**
   * Convert a KeyboardEvent into a canonical shortcut key.
   * For example, 'ctrl+shift+a' and 'shift+ctrl+a' are equivalent.
   */
  fromKeyboardEvent: (event: KeyboardEvent) => {
    const metaKeys: string[] = []
    if (event.altKey) {
      metaKeys.push('alt')
    }
    if (event.ctrlKey) {
      metaKeys.push('ctrl')
    }
    if (event.metaKey) {
      metaKeys.push('meta')
    }
    if (event.shiftKey) {
      metaKeys.push('shift')
    }
    return metaKeys.sort().concat(event.key).join('+')
  }
}

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

  cursorAt(cursor: Range, el: HTMLElement, position: 'top' | 'bottom' | 'left' | 'right') {
    const c = cursor.cloneRange()
    if (['top', 'left'].includes(position)) {
      c.collapse(true)
    } else {
      c.collapse()
    }
    const range = document.createRange()
    const selectFrom = ['top', 'left'].includes(position) ? el.firstChild || el : el.lastChild || el
    range.selectNodeContents(selectFrom)

    return this.getClientRect(c)[position] === this.getClientRect(range)[position]
  }

  setCursorAt(node: Node | null, offset: number) {
    const newRange = document.createRange()
    if (!node) return
    newRange.setStart(
      node.firstChild || node,
      Math.min(offset, node.firstChild ? node.firstChild.length : node.length)
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
    if (el.nodeType === Node.TEXT_NODE) {
      return el.nodeValue || ''
    }
    if (el.nodeType === Node.ELEMENT_NODE) {
      return (el as HTMLElement).innerHTML
    }
    return ''
  }

  getSelectionRange() {
    const selection = window.getSelection()
    return {
      sRange: selection?.getRangeAt(0),
      selection: selection
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
