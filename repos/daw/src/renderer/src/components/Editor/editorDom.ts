import Editor, { getBlockShortcuts, getListItemShortcuts } from '@renderer/src/app/lib/Editor'
import { svelte } from '@sveltejs/vite-plugin-svelte'

function isMetaKey(s: string) {
  return ['ctrl', 'alt', 'meta', 'shift'].includes(s)
}

const keyParser = {
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

function getEndOffset(el: HTMLElement) {
  if (el.lastChild.nodeValue === null) {
    return 0
  }
  return el.lastChild?.innerHTML?.length || el.lastChild?.textContent?.length || 0
}

function isElementEditable(element) {
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

function rangeIncludesRange(range1, range2) {
  return (
    range1.compareBoundaryPoints(Range.START_TO_START, range2) <= 0 &&
    range1.compareBoundaryPoints(Range.END_TO_END, range2) >= 0
  )
}

function getMouseEventCaretRange(evt) {
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

export class EditorDom {
  editorEl: HTMLElement | null = null
  editor: Editor
  blocks: Map<string, HTMLElement> = new Map()
  focusId: string | undefined

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
      const text = evt.target.value || evt.target.innerHTML
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
   */
  handleTextSelection() {
    let isSelecting = false
    // should be a collapsed range (e.g. a caret)
    let originRange: Range | null = null

    function onMouseDown(evt: MouseEvent) {
      isSelecting = true
      originRange = getMouseEventCaretRange(evt)
    }

    // set selection range to include contents within blocks
    function onMouseMove(evt: MouseEvent) {
      if (!isSelecting) return
      if (!originRange) return

      const curRange = getMouseEventCaretRange(evt)
      if (!isElementEditable(curRange.startContainer)) return

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
      isSelecting = false
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

  keydownhandler = (evt: KeyboardEvent) => {
    const trigger = keyParser.fromKeyboardEvent(evt)
    const block = this.focusId ? this.editor.getBlockById(this.focusId) : null

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

  editorWideHandlers = [
    /**
     * Handle delete across blocks.
     * 1. For each block if selection range encompasses the block, delete the block.
     * 2. Then find block that is partially selected and delete the selected text.
     */
    {
      title: 'Delete selected blocks or text',
      trigger: 'Backspace',
      action: () => {
        const selection = window.getSelection()
        if (selection?.isCollapsed) {
          return
        }

        // Find blocks that are fully selected and delete them.
        const toBeDeleted: string[] = []
        this.blocks.forEach((el, id) => {
          const range = document.createRange()
          if (!el.firstChild) {
            range.selectNode(el)
          } else {
            range.setStart(el.firstChild, 0)
            const endOffset = getEndOffset(el)
            range.setEnd(el.lastChild, endOffset)
          }

          if (rangeIncludesRange(selection?.getRangeAt(0), range)) {
            toBeDeleted.push(id)
          }
        })
        toBeDeleted.forEach((id) => {
          this.blocks.delete(id)
        })
        this.editor.deleteBlocks(toBeDeleted)

        // selection?.getRangeAt(0).deleteContents()
        // const startEl = selection?.getRangeAt(0).startContainer
        // const endEl = selection?.getRangeAt(0).endContainer
        //
        // startEl.textContent = startEl.textContent?.slice(0, selection?.getRangeAt(0).startOffset)
        // console.log(selection?.getRangeAt(0).endOffset)
        // endEl.textContent = endEl.textContent?.slice(selection?.getRangeAt(0).endOffset)
        console.log(selection?.getRangeAt(0).startContainer)
        console.log(selection?.getRangeAt(0).endContainer)

        debugger

        selection?.collapseToStart()
      }
      // preventDefault: true,
      // stopPropagation: true
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
    }
  ]

  keyhandlers: {
    title: string
    trigger: string
    blockType?: string[] | '*'
    action: (args: { block: any }) => void
    preventDefault?: boolean
    stopPropagation?: boolean
  }[] = [
    {
      title: 'Press enter for new empty text block',
      trigger: 'Enter',
      blockType: ['text', 'header'],
      action: ({ block }) => {
        console.log(`here`)
        this.focusId = this.editor.addBlock({
          blockType: 'text',
          id: block.id,
          direction: 'below'
        })
      },
      preventDefault: true,
      stopPropagation: true
    },
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
      action: ({ block }) => {
        const id = this.editor.getPreviousBlockFrom(block.id)?.id
        if (id) {
          this.focusId = id
          this.blocks.get(this.focusId)?.focus()
        }
      },
      preventDefault: true,
      stopPropagation: true
    },
    {
      title: 'Arrow Down to move focus to block below',
      trigger: 'ArrowDown',
      blockType: '*',
      action: ({ block }) => {
        const id = this.editor.getNextBlockFrom(block.id)?.id
        if (id) {
          this.focusId = id
          this.blocks.get(this.focusId)?.focus()
        }
      },
      preventDefault: true,
      stopPropagation: true
    }
  ]
}
