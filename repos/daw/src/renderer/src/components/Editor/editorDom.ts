import Editor from '@renderer/src/app/lib/Editor'
import {
  keyParser,
  getMouseEventCaretRange,
  isMetaKey,
  getEndOffset,
  isElementEditable,
  rangeIncludesRange,
  getBlockIdAtRange
} from './utils'

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
    return document.activeElement?.closest(`[${this.blockAttr}]`)
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
}

export class EditorDom {
  editorEl: HTMLElement | null = null
  editor: Editor
  domHelper: EditorDomHelper = new EditorDomHelper()
  focusId: string | undefined

  constructor({ editor }: { editor: Editor }) {
    this.editor = editor
  }

  /**
   * Invoke upon editor dom element creation.
   */
  onEditorCreate(editorEl: HTMLElement) {
    this.editorEl = editorEl

    const teardown = this.handleTextSelection()
    window.addEventListener('keydown', this.keydownhandler)

    return () => {
      teardown()
      window.removeEventListener('keydown', this.keydownhandler)
    }
  }

  /**
   * Register a block element to the editor. Need this to keep track of the
   * focused blocks id.
   */
  onBlockCreate = (blockEl: HTMLElement, id: string) => {
    blockEl.dataset.blockId = id

    if (this.focusId === id) {
      blockEl.focus()
    }

    const oninput = (evt: Event) => {
      if (!evt.target) return
      const text = this.domHelper.extractElText(evt.target as HTMLElement)
      this.editor.updateBlock(id, { properties: { text } })
    }

    const onfocus = () => {
      this.focusId = id
    }

    blockEl.addEventListener('input', oninput)
    blockEl.addEventListener('focus', onfocus)

    return {
      destroy: () => {
        blockEl.removeEventListener('input', oninput)
        blockEl.removeEventListener('focus', onfocus)
      }
    }
  }

  /**
   * Setup text selection behavior.
   * This is to allow selecting text across multiple blocks.
   * This is a workaround for the default behavior of contenteditable elements.
   *
   * 1. On mousedown keep track of origin range (caret position).
   * 2. On mousemove set selection range to include contents between origin and
   *    current range.
   * 3. On mouseup reset origin range.
   */
  handleTextSelection() {
    let originRange: Range | null = null

    function onMouseDown(evt: MouseEvent) {
      originRange = getMouseEventCaretRange(evt)
    }

    // set selection range to include contents within blocks
    function onMouseMove(evt: MouseEvent) {
      if (!originRange) return

      const curRange = getMouseEventCaretRange(evt)

      const selection = window.getSelection()
      if (!selection) return

      let setBaseAndExtentArgs: [Node, number, any, any] =
        originRange.comparePoint(curRange.startContainer, curRange.startOffset) === -1
          ? [
              originRange.endContainer,
              originRange.endOffset,
              curRange.startContainer,
              curRange.startOffset
            ]
          : [
              originRange.startContainer,
              originRange.startOffset,
              curRange.endContainer,
              curRange.endOffset
            ]

      selection.removeAllRanges()
      selection.setBaseAndExtent(...setBaseAndExtentArgs)

      evt.preventDefault()
      evt.stopPropagation()
    }

    function onMouseUp() {
      originRange = null
    }

    this.editorEl?.addEventListener('mousedown', onMouseDown)
    this.editorEl?.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      this.editorEl?.removeEventListener('mousedown', onMouseDown)
      this.editorEl?.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }

  /**
   * Handle keyboard events.
   */
  keydownhandler = (evt: KeyboardEvent) => {
    const trigger = keyParser.fromKeyboardEvent(evt)
    const focusedBlockEl = this.domHelper.getActiveBlockEl()
    const focusId = focusedBlockEl?.getAttribute('data-block-id')
    const block = focusId ? this.editor.getBlockById(focusId) : null

    if (trigger === 'Tab') {
      evt.preventDefault()
    }

    // Handle editor wide key handlers.
    this.editorWideHandlers
      .filter((handler) => handler.trigger === trigger)
      .forEach((handler) => {
        handler.action({ block, evt })
        if (handler.preventDefault) {
          evt.preventDefault()
        }
        if (handler.stopPropagation) {
          evt.stopPropagation()
        }
      })

    if (!block) return

    // Handle block specific key handlers.
    this.keyhandlers
      .filter((handler) => {
        return (
          // Key trigger matches
          handler.trigger === trigger &&
          // check if event originated from a block element (events from subtree
          // should not trigger block specific handlers)
          evt.target === focusedBlockEl &&
          // Block type match
          ((handler.blockType && block && handler.blockType.includes(block.type)) ||
            handler.blockType === '*')
        )
      })
      .forEach((handler) => {
        handler.action({ block, evt })
        if (handler.preventDefault) {
          evt.preventDefault()
        }
        if (handler.stopPropagation) {
          evt.stopPropagation()
        }
      })
  }

  /**
   * Editor wide key handlers.
   */
  editorWideHandlers = [
    /**
     * Handle delete across blocks.
     * 1. For each block if selection range encompasses the block, delete the block.
     * 2. Then find block that is partially selected and delete the selected text.
     */
    {
      title: 'Delete selected blocks or text',
      trigger: 'Backspace',
      action: ({ evt }) => {
        const { selection, sRange } = this.domHelper.getSelectionRange()
        if (!selection || selection.isCollapsed || !sRange) return

        this.domHelper.setNodeValue(
          sRange.startContainer,
          this.domHelper.extractElText(sRange.startContainer).slice(0, sRange.startOffset)
        )
        this.domHelper.setNodeValue(
          sRange.endContainer,
          this.domHelper.extractElText(sRange.endContainer).slice(sRange.endOffset)
        )

        // Find blocks that are fully selected and delete them.
        const toBeDeleted: string[] = []
        document.querySelectorAll('[data-block-id]').forEach((el) => {
          const r = document.createRange()
          r.selectNodeContents(el)

          if (rangeIncludesRange(sRange, r)) {
            toBeDeleted.push(el.getAttribute('data-block-id')!)
          }
        })
        this.editor.deleteBlocks(toBeDeleted)

        selection.removeAllRanges()

        evt.preventDefault()
        evt.stopPropagation()
      }
    },
    {
      title: 'Shift+Enter to create new block below regardless of cursor',
      trigger: 'shift+Enter',
      action: ({ block }) => {
        this.focusId = this.editor.addBlock({
          blockType: 'text',
          id: block?.id,
          direction: 'below'
        })
      },
      preventDefault: true,
      stopPropagation: true
    },
    {
      title: 'Shift+Meta+Enter to create new block above regardless of cursor',
      trigger: 'meta+shift+Enter',
      action: ({ block }) => {
        this.focusId = this.editor.addBlock({
          blockType: 'text',
          id: block?.id,
          direction: 'above'
        })
      },
      preventDefault: true,
      stopPropagation: true
    },
    {
      title: 'Cmd+A to select all blocks',
      trigger: 'meta+a',
      action: () => {
        const all = this.editorEl?.querySelectorAll('[data-block-id]') || []
        if (all.length === 0) return

        const range = document.createRange()
        range.setStart(all[0], 0)
        range.setEnd(...this.domHelper.getRangeValues(all[all.length - 1], 'lastChild'))
        this.domHelper.setSelectionRange(range)
      },
      preventDefault: true,
      stopPropagation: true
    }
  ]

  /**
   * Block specific key handlers.
   */
  keyhandlers: {
    title: string
    trigger: string
    blockType?: string[] | '*'
    action: (args: { block: any; evt: Event }) => boolean | undefined
    preventDefault?: boolean
    stopPropagation?: boolean
  }[] = [
    /*************************************************************************
     * Any
     *************************************************************************/

    {
      title: 'Delete block if empty',
      trigger: 'Backspace',
      blockType: '*',
      action: ({ block, evt }) => {
        if (block.properties.text === '') {
          const id = this.editor.getPreviousBlockFrom(block.id)?.id
          if (!id) return

          this.editor.deleteBlock(block.id)

          const nextEl = this.domHelper.getById(id)
          if (!nextEl) return
          nextEl.focus()

          const range = document.createRange()
          range.selectNodeContents(nextEl)
          this.domHelper.setSelectionRange(range)?.collapseToEnd()

          evt.stopPropagation()
          evt.preventDefault()
        }
      }
    },
    {
      title: 'Arrow Up to move focus to block above',
      trigger: 'ArrowUp',
      blockType: '*',
      action: ({ block, evt }) => {
        this.#moveCursor({ id: block.id, direction: 'up', evt })
      }
    },
    {
      title: 'Arrow Down to move focus to block below',
      trigger: 'ArrowDown',
      blockType: '*',
      action: ({ block, evt }) => {
        this.#moveCursor({ id: block.id, direction: 'down', evt })
      }
    },
    {
      title: 'Left Arrow move to top block if cursor is at start',
      trigger: 'ArrowLeft',
      blockType: '*',
      action: ({ block, evt }) => {
        this.#moveCursor({ id: block.id, direction: 'left', evt })
      }
    },
    {
      title: 'Arrow Right move to bottom block if cursor is at end',
      trigger: 'ArrowRight',
      blockType: '*',
      action: ({ block, evt }) => {
        this.#moveCursor({ id: block.id, direction: 'right', evt })
      }
    },

    /*************************************************************************
     * List Item
     *************************************************************************/

    {
      title: 'Enter for new empty list item',
      trigger: 'Enter',
      blockType: ['listItem'],
      action: ({ block }) => {
        if (block.properties.text === '') {
          this.focusId = this.editor.addBlock({
            blockType: 'text',
            id: block.id,
            direction: 'below'
          })
          this.editor.deleteBlock(block.id)
          return
        }

        this.focusId = this.editor.addBlock({
          blockType: 'listItem',
          args: [block.properties.listType, block.properties.indentLevel],
          id: block.id,
          direction: 'below'
        })
      },
      preventDefault: true,
      stopPropagation: true
    },
    {
      title: 'Tab to indent list item',
      trigger: 'Tab',
      blockType: ['listItem'],
      /**
       * Tab behavior:
       * 1. If no previous block do not allow indent.
       * 2. If previous block is a list item, allow +1 indent level.
       *    Also indent the subtree of list items defined by everything below
       *    the current block that has an indent level greater than the current
       *    block.
       */
      action: ({ block }) => {
        const prevBlock = this.editor.getPreviousBlockFrom(block.id)
        if (!prevBlock || prevBlock.type !== 'listItem') return
        if (block.properties.indentLevel > prevBlock.properties.indentLevel) return

        const curIndent = block.properties.indentLevel

        let curBlock = block
        do {
          this.editor.updateBlock(curBlock.id, {
            properties: { indentLevel: curBlock.properties.indentLevel + 1 }
          })
          curBlock = this.editor.getNextBlockFrom(curBlock.id)
        } while (
          curBlock &&
          curBlock.type === 'listItem' &&
          curBlock.properties.indentLevel > curIndent
        )
      },
      preventDefault: true,
      stopPropagation: true
    },
    {
      title: 'Shift tab to indent list item',
      trigger: 'shift+Tab',
      blockType: ['listItem'],
      /**
       * Shift+Tab behavior:
       * 1. If no previous block do not allow indent.
       * 2. Do not allow indent to be less than 0.
       */
      action: ({ block }) => {
        if (block.properties.indentLevel === 0) return
        const curIndent = block.properties.indentLevel

        let curBlock = block
        do {
          this.editor.updateBlock(curBlock.id, {
            properties: { indentLevel: curBlock.properties.indentLevel - 1 }
          })
          curBlock = this.editor.getNextBlockFrom(curBlock.id)
        } while (
          curBlock &&
          curBlock.type === 'listItem' &&
          curBlock.properties.indentLevel > curIndent
        )
      },
      preventDefault: true,
      stopPropagation: true
    },
    {
      title: 'Delete should turn empty list item back to textblock',
      trigger: 'Backspace',
      blockType: ['listItem'],
      action: ({ block, evt }) => {
        if (block.properties.text === '') {
          this.editor.updateBlock(block.id, { type: 'text' })
          evt.preventDefault()
          evt.stopPropagation()
        }
      }
    },

    /*************************************************************************
     * Text/Header
     *************************************************************************/

    {
      title: 'Press enter for new empty text block',
      trigger: 'Enter',
      blockType: ['text', 'header'],
      action: ({ block }) => {
        this.focusId = this.editor.addBlock({
          blockType: 'text',
          id: block.id,
          direction: 'below'
        })
      },
      preventDefault: true,
      stopPropagation: true
    }
  ]

  #moveCursor = ({
    id,
    direction,
    evt
  }: {
    id: string
    direction: 'up' | 'down' | 'left' | 'right'
    evt: Event
  }) => {
    const { sRange, selection } = this.domHelper.getSelectionRange()
    if (!selection || !sRange) return
    const curEl = this.domHelper.getById(id)
    if (!curEl) return
    const moveId = ['up', 'left'].includes(direction)
      ? this.editor.getPreviousBlockFrom(id)?.id
      : this.editor.getNextBlockFrom(id)?.id
    const moveEl = this.domHelper.getById(moveId!)
    if (!moveEl) return
    let movedCursor = false

    if (direction === 'up' && this.domHelper.cursorAt(sRange, curEl, 'top')) {
      const moveElChild = moveEl.lastChild || moveEl
      this.domHelper.setCursorAt(moveElChild, sRange.startOffset)
      movedCursor = true
    } else if (direction === 'down' && this.domHelper.cursorAt(sRange, curEl, 'bottom')) {
      const moveElChild = moveEl.firstChild || moveEl
      this.domHelper.setCursorAt(moveElChild, sRange.startOffset)
      movedCursor = true
    } else if (
      direction === 'left' &&
      sRange.startOffset === 0 &&
      this.domHelper.cursorAt(sRange, curEl, 'top')
    ) {
      const moveElChild = moveEl.lastChild || moveEl
      this.domHelper.setCursorAt(moveElChild, moveElChild.length)
      movedCursor = true
    } else if (
      direction === 'right' &&
      this.domHelper.cursorAt(sRange, curEl, 'bottom') &&
      sRange.endOffset === (curEl.lastChild?.length || curEl.length || 0)
    ) {
      const moveElChild = moveEl.firstChild || moveEl
      this.domHelper.setCursorAt(moveElChild, 0)
      movedCursor = true
    }

    if (movedCursor) {
      evt.preventDefault()
      evt.stopPropagation()
    }
  }
}
