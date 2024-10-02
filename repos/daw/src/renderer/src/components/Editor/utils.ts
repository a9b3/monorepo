export function isMetaKey(s: string) {
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

export function getEndOffset(el: HTMLElement) {
  if (el.lastChild.nodeValue === null) {
    return 0
  }
  return el.lastChild?.innerHTML?.length || el.lastChild?.textContent?.length || 0
}

export function isElementEditable(element) {
  // Check if it's a form input that allows text input
  if (element instanceof HTMLElement) {
    const tagName = element.tagName.toLowerCase()
    if (tagName === 'input') {
      const inputType = element.type.toLowerCase()
      const editableInputTypes = [
        'text',
        'password',
        'number',
        'email',
        'tel',
        'url',
        'search',
        'date',
        'datetime-local',
        'time',
        'month',
        'week'
      ]
      return editableInputTypes.includes(inputType) && !element.disabled && !element.readOnly
    }
    if (tagName === 'textarea') {
      return !element.disabled && !element.readOnly
    }
  }

  // Check for contentEditable
  if (element.isContentEditable) {
    return true
  }

  // Check if it's inside a contentEditable container
  let parent = element.parentElement
  while (parent) {
    if (parent.isContentEditable) {
      return true
    }
    parent = parent.parentElement
  }

  return false
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

export function getBlockIdAtRange(range: Range) {
  const queryKey = '[data-block-id]'

  console.log(range)

  let n1 =
    runQuery(range.startContainer, queryKey) ||
    (range.startContainer.parentElement && runQuery(range.startContainer.parentElement, queryKey))
  const n2 =
    runQuery(range.endContainer, queryKey) ||
    (range.endContainer.parentElement && runQuery(range.endContainer.parentElement, queryKey))

  return {
    startBlockId: n1 && n1.getAttribute('data-block-id'),
    endBlockId: n2 && n2.getAttribute('data-block-id')
  }
}

function runQuery(n: Node, query: string) {
  if (n.nodeType === Node.ELEMENT_NODE) {
    return (n as HTMLElement).closest(query)
  }
  return
}
