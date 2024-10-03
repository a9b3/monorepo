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

  getById(id: string) {
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

  setCursorAt(node: Node, offset: number) {
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
}

export class EditorDom {
  editorEl: HTMLElement | null = null
  editor: Editor
  blocks: Map<string, HTMLElement> = new Map()
  focusId: string | undefined
  domHelper: EditorDomHelper = new EditorDomHelper()

  constructor({ editor }: { editor: Editor }) {
    this.editor = editor
  }

  #editorSetup = false

  /**
   * Invoke upon editor dom element creation.
   */
  onEditorCreate(editorEl: HTMLElement) {
    if (this.#editorSetup) return
    this.#editorSetup = true

    this.editorEl = editorEl

    const teardown = this.handleTextSelection()
    window.addEventListener('keydown', this.keydownhandler)

    return () => {
      this.#editorSetup = false
      teardown()
      window.removeEventListener('keydown', this.keydownhandler)
    }
  }

  /**
   * Blocks are implemented as div contenteditable or textareas or inputs,
   * extract the text value from these various elements.
   */
  #extractElText = (el: HTMLElement) => {
    if (el.nodeType === Node.TEXT_NODE) {
      return el.nodeValue || ''
    }
    if (el.nodeType === Node.ELEMENT_NODE) {
      return el.innerHTML
    }
  }

  // NOTE: This is a workaround for svelte's inability to track dom
  // create/destroy accurately. In a dom tree if a node is removed, for all the
  // subsequent nodes svelte will recreate the node and destroy the old node in
  // that order resulting in a inaccurate call sequence of create/destroy for a
  // node that is supposed to be the same.
  #trackSvelteDomUpdates = new Map()

  /**
   * Register a block element to the editor. Need this to keep track of the
   * focused blocks id.
   */
  onBlockCreate = (blockEl: HTMLElement, id: string) => {
    const svelteDomUpdateId = window.crypto.randomUUID()
    this.#trackSvelteDomUpdates.set(id, svelteDomUpdateId)

    blockEl.dataset.blockId = id
    this.blocks.set(id, blockEl)

    if (this.focusId === id) {
      blockEl.focus()
    }

    const onfocus = () => {
      this.focusId = id
    }

    const oninput = (evt: Event) => {
      if (!evt.target) return
      const text = this.#extractElText(evt.target as HTMLElement)
      this.editor.updateBlock(id, { properties: { text } })
    }

    blockEl.addEventListener('focus', onfocus)
    blockEl.addEventListener('input', oninput)

    return {
      update: () => {
        this.blocks.set(id, blockEl)
      },
      destroy: () => {
        if (this.#trackSvelteDomUpdates.get(id) === svelteDomUpdateId) {
          this.blocks.delete(id)
        }
        blockEl.removeEventListener('focus', onfocus)
        blockEl.removeEventListener('input', oninput)
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
   *
   * note: browsers only support selection range with one range at a time, this
   */
  handleTextSelection() {
    // should be a collapsed range (e.g. a caret)
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
   * Check if the event target is a block that is currently focused
   */
  #eventTargetIsFocusedBlock(evt: Event) {
    const target = evt.target
    if (target instanceof HTMLElement) {
      if (!this.focusId) return false
      const block = this.blocks.get(this.focusId)
      if (!block) return false
      return block === target
    }
    return false
  }

  /**
   * Handle keyboard events.
   */
  keydownhandler = (evt: KeyboardEvent) => {
    const trigger = keyParser.fromKeyboardEvent(evt)
    const block = this.focusId ? this.editor.getBlockById(this.focusId) : null

    if (trigger === 'Tab') {
      evt.preventDefault()
    }

    this.keyhandlers
      .filter((handler) => {
        return (
          handler.trigger === trigger &&
          ((handler.blockType && block && handler.blockType.includes(block.type)) ||
            handler.blockType === '*') &&
          this.#eventTargetIsFocusedBlock(evt)
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
        const selection = window.getSelection()
        if (!selection) return
        if (selection.isCollapsed) return

        const range = selection.getRangeAt(0)

        const startContainer = range.startContainer
        const endContainer = range.endContainer

        this.domHelper.setNodeValue(
          startContainer,
          this.#extractElText(startContainer).slice(0, range.startOffset)
        )
        this.domHelper.setNodeValue(
          endContainer,
          this.#extractElText(endContainer).slice(range.endOffset)
        )

        // Find blocks that are fully selected and delete them.
        const toBeDeleted: string[] = []
        document.querySelectorAll('[data-block-id]').forEach((el) => {
          const r = document.createRange()
          r.selectNodeContents(el)

          if (rangeIncludesRange(range, r)) {
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
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(range)
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
          if (id) {
            this.focusId = id
            this.editor.deleteBlock(block.id)
            this.blocks.get(this.focusId)?.focus()

            const range = document.createRange()
            range.selectNodeContents(this.blocks.get(this.focusId))
            window.getSelection()?.removeAllRanges()
            window.getSelection()?.addRange(range)
            window.getSelection()?.collapseToEnd()
            evt.stopPropagation()
            evt.preventDefault()
          }
        }
      }
    },
    {
      title: 'Arrow Up to move focus to block above',
      trigger: 'ArrowUp',
      blockType: '*',
      action: ({ block, evt }) => {
        const selection = window.getSelection()
        if (!selection) return

        const blockEl = this.domHelper.getById(block.id)
        if (!blockEl) return

        selection.collapseToStart()
        if (this.domHelper.cursorAtTop(selection.getRangeAt(0), blockEl)) {
          const id = this.editor.getPreviousBlockFrom(block.id)?.id
          if (id) {
            this.domHelper.setCursorAt(
              this.domHelper.getById(id).lastChild || this.domHelper.getById(id),
              selection.getRangeAt(0).startOffset
            )
            evt.preventDefault()
            evt.stopPropagation()
          }
        }
      }
    },

    {
      title: 'Arrow Down to move focus to block below',
      trigger: 'ArrowDown',
      blockType: '*',
      action: ({ block, evt }) => {
        const selection = window.getSelection()
        if (!selection) return

        const blockEl = this.domHelper.getById(block.id)
        if (!blockEl) return

        selection.collapseToEnd()
        if (this.domHelper.cursorAtBottom(selection.getRangeAt(0), blockEl)) {
          const id = this.editor.getNextBlockFrom(block.id)?.id
          if (id) {
            this.domHelper.setCursorAt(
              this.domHelper.getById(id).firstChild || this.domHelper.getById(id),
              selection.getRangeAt(0).startOffset
            )
            evt.preventDefault()
            evt.stopPropagation()
          }
        }
      }
    },
    {
      title: 'Left Arrow move to top block if cursor is at start',
      trigger: 'ArrowLeft',
      blockType: '*',
      action: ({ block, evt }) => {
        const selection = window.getSelection()
        if (!selection) return

        const blockEl = this.domHelper.getById(block.id)
        if (!blockEl) return

        if (selection.getRangeAt(0).startOffset === 0) {
          const id = this.editor.getPreviousBlockFrom(block.id)?.id
          if (id) {
            const prevChild = this.domHelper.getById(id).lastChild || this.domHelper.getById(id)
            this.domHelper.setCursorAt(prevChild, prevChild.length)
            evt.preventDefault()
            evt.stopPropagation()
          }
        }
      }
    },
    {
      title: 'Arrow Right move to bottom block if cursor is at end',
      trigger: 'ArrowRight',
      blockType: '*',
      action: ({ block, evt }) => {
        const selection = window.getSelection()
        if (!selection) return

        const blockEl = this.domHelper.getById(block.id)
        if (!blockEl) return

        if (selection.getRangeAt(0).endOffset === blockEl.lastChild.length) {
          const id = this.editor.getNextBlockFrom(block.id)?.id
          if (id) {
            const nextChild = this.domHelper.getById(id).firstChild || this.domHelper.getById(id)
            this.domHelper.setCursorAt(nextChild, 0)
            evt.preventDefault()
            evt.stopPropagation()
          }
        }
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
        }
      },
      preventDefault: true,
      stopPropagation: true
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
}
