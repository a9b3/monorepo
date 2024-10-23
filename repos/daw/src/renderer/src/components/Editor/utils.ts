import Editor from '@renderer/src/app/lib/Editor'

export type shortcutOpts = {
  editor: Editor
  setFocusId: (id: string | undefined) => void
  toggleUrlEdit: (arg: { href: string; text: string; trigger: HTMLElement; cursor: Range }) => void
}

export class Walker {
  element: HTMLElement

  constructor(element: HTMLElement) {
    this.element = element
  }

  firstNode() {
    const walker = document.createTreeWalker(this.element, NodeFilter.SHOW_TEXT, null)
    return walker.nextNode()
  }

  lastNode() {
    const walker = document.createTreeWalker(this.element, NodeFilter.SHOW_TEXT, null)
    let node: Node | null
    let lastNode: Node | null = null
    while ((node = walker.nextNode())) {
      lastNode = node
    }
    return lastNode
  }
}

export function isAtStart(range: Range, element: HTMLElement) {
  let node = new Walker(element).firstNode() || element
  return node === range.startContainer && range.startOffset === 0
}

export function isAtEnd(range: Range, element: HTMLElement) {
  let lastNode = new Walker(element).lastNode() || element
  return (
    lastNode === range.endContainer &&
    (lastNode.length ? range.endOffset === lastNode.length : true)
  )
}

export function rangeIncludesRange(range1: Range, range2: Range) {
  return (
    range1.compareBoundaryPoints(Range.START_TO_START, range2) <= 0 &&
    range1.compareBoundaryPoints(Range.END_TO_END, range2) >= 0
  )
}

export function blockEventListener(cb: any, opts: { editor: Editor; types?: string[] }) {
  return (evt: Event) => {
    const id = (evt.target as HTMLElement).getAttribute('data-block-id')
    if (!id) {
      return
    }

    const block = opts.editor.getBlockById(id)
    if (!block) {
      return
    }

    if (opts.types && !opts.types.includes(block.type)) {
      return
    }

    cb({ evt, block })
  }
}

export const conditions = (cases: Record<string, any>[]) => (evt: KeyboardEvent) => {
  for (const { condition, action } of cases) {
    if (condition(evt)) {
      action(evt)
      return
    }
  }
}

export const isSelecting = () => {
  const { selection } = getSelectionRange()
  return selection && !selection.isCollapsed
}

export const isType =
  (types: string[], { editor }: shortcutOpts) =>
  (evt: KeyboardEvent) => {
    const id = (evt.target as HTMLElement).getAttribute('data-block-id')
    if (!id) return false
    const block = editor.getBlockById(id)
    return block && types.includes(block.type)
  }

export const isBlockElement = (event: KeyboardEvent) => {
  return Boolean((event.target as HTMLElement).getAttribute('data-block-id'))
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

class EditorDomHelper {
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
}

export function replaceCurrentRange(range: Range) {
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
  return selection
}

export function getSelectionRange() {
  const selection = window.getSelection()
  return {
    sRange: selection?.getRangeAt(0),
    selection: selection,
  }
}

export const domHelper = new EditorDomHelper()
