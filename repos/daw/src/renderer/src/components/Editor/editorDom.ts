import Editor from '@renderer/src/app/lib/Editor'
import ShortcutManager from '@renderer/src/app/lib/shortcut/Manager'
import {
  isValidUrl,
  insertNodeAtCursor,
  domHelper,
  getMouseEventCaretRange,
  rangeIncludesRange,
} from './utils'

function extractBlockFromEvent(evt: KeyboardEvent, editor: Editor) {
  const id = (evt.target as HTMLElement).getAttribute('data-block-id')
  if (!id) return false
  const block = editor.getBlockById(id)
  if (!block) return false
  return block
}

function blockEventListener(cb: any, opts: { editor: Editor; types?: string[] }) {
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

type shortcutOpts = {
  editor: Editor
  setFocusId: (id: string | undefined) => void
  toggleUrlEdit: (arg: { href: string; text: string; trigger: HTMLElement; cursor: Range }) => void
}

const actions = ({ editor, setFocusId, toggleUrlEdit }: shortcutOpts) => ({
  createAbove: blockEventListener(
    ({ evt, block }) => {
      const focusId = editor.addBlock({
        blockType: 'text',
        id: block.id,
        direction: 'above',
      })
      setFocusId(focusId)

      evt.stopPropagation()
      evt.preventDefault()
    },
    { editor },
  ),

  createBelow: blockEventListener(
    ({ evt, block }) => {
      const focusId = editor.addBlock({
        blockType: 'text',
        id: block.id,
        direction: 'below',
      })
      setFocusId(focusId)

      evt.stopPropagation()
      evt.preventDefault()
    },
    { editor },
  ),

  /**
   * Tab behavior:
   * 1. If no previous block do not allow indent.
   * 2. If previous block is a list item, allow +1 indent level.
   *    Also indent the subtree of list items defined by everything below
   *    the current block that has an indent level greater than the current
   *    block.
   */
  tabIndent: blockEventListener(
    ({ evt, block }) => {
      const prevBlock = editor.getPreviousBlockFrom(block.id)
      if (!prevBlock || prevBlock.type !== 'listItem') return
      if (block.properties.indentLevel > prevBlock.properties.indentLevel) return

      const curIndent = block.properties.indentLevel

      let curBlock: any = block
      do {
        editor.updateBlock(curBlock.id, {
          properties: { indentLevel: curBlock.properties.indentLevel + 1 },
        })
        curBlock = editor.getNextBlockFrom(curBlock.id)
      } while (
        curBlock &&
        curBlock.type === 'listItem' &&
        curBlock.properties.indentLevel > curIndent
      )

      evt.stopPropagation()
      evt.preventDefault()
    },
    { editor, types: ['listItem'] },
  ),

  shiftTabIndent: blockEventListener(
    ({ evt, block }) => {
      if (block.properties.indentLevel === 0) return

      const curIndent = block.properties.indentLevel
      let curBlock: any = block
      do {
        editor.updateBlock(curBlock.id, {
          properties: { indentLevel: curBlock.properties.indentLevel - 1 },
        })
        curBlock = editor.getNextBlockFrom(curBlock.id)
      } while (
        curBlock &&
        curBlock.type === 'listItem' &&
        curBlock.properties.indentLevel > curIndent
      )

      evt.preventDefault()
      evt.stopPropagation()
    },
    { editor, types: ['listItem'] },
  ),
  tabEnter: blockEventListener(
    ({ evt, block }) => {
      if (block.properties.text === '') {
        const focusId = editor.addBlock({
          blockType: 'text',
          id: block.id,
          direction: 'below',
        })
        setFocusId(focusId)
        editor.deleteBlock(block.id)

        evt.stopPropagation()
        evt.preventDefault()
        return
      }

      const focusId = editor.addBlock({
        blockType: 'listItem',
        args: [block.properties.listType, block.properties.indentLevel],
        id: block.id,
        direction: 'below',
      })
      setFocusId(focusId)

      evt.stopPropagation()
      evt.preventDefault()
    },
    { editor, types: ['listItem'] },
  ),
  tabDelete: blockEventListener(
    ({ evt, block }) => {
      if (block.properties.text === '') {
        editor.updateBlock(block.id, { type: 'text' })
        evt.preventDefault()
        evt.stopPropagation()
      }
    },
    { editor, types: ['listItem'] },
  ),
  deleteIfEmpty: blockEventListener(
    ({ evt, block }) => {
      if (block.properties.text === '') {
        const id = editor.getPreviousBlockFrom(block.id)?.id
        if (!id) return

        editor.deleteBlock(block.id)

        const nextEl = domHelper.getById(id)
        if (!nextEl) return
        nextEl.focus()

        const range = document.createRange()
        range.selectNodeContents(nextEl)
        domHelper.setSelectionRange(range)?.collapseToEnd()

        evt.stopPropagation()
        evt.preventDefault()
      }
    },
    { editor },
  ),
  /**
   * Handle moving the cursor with arrow keys.
   */
  moveCursor: ({ direction }: { direction: 'up' | 'down' | 'left' | 'right' }) => {
    return (evt: KeyboardEvent) => {
      const id = (evt.target as HTMLElement).getAttribute('data-block-id')
      if (!id) return
      const { sRange, selection } = domHelper.getSelectionRange()
      if (!selection || !sRange) return
      const curEl = evt.target
      const moveId = ['up', 'left'].includes(direction)
        ? editor.getPreviousBlockFrom(id)?.id
        : editor.getNextBlockFrom(id)?.id
      const moveEl = domHelper.getById(moveId!)
      if (!moveEl) return
      let movedCursor = false

      if (direction === 'up' && domHelper.cursorAt(sRange, curEl, 'top')) {
        const moveElChild = moveEl.lastChild || moveEl
        domHelper.setCursorAt(moveElChild, sRange.startOffset)
        movedCursor = true
      } else if (direction === 'down' && domHelper.cursorAt(sRange, curEl, 'bottom')) {
        const moveElChild = moveEl.firstChild || moveEl
        domHelper.setCursorAt(moveElChild, sRange.startOffset)
        movedCursor = true
      } else if (
        direction === 'left' &&
        sRange.startOffset === 0 &&
        domHelper.cursorAt(sRange, curEl, 'top')
      ) {
        const moveElChild = moveEl.lastChild || moveEl
        domHelper.setCursorAt(moveElChild, moveElChild.length)
        movedCursor = true
      } else if (
        direction === 'right' &&
        domHelper.cursorAt(sRange, curEl, 'bottom') &&
        sRange.endOffset === (curEl.lastChild?.length || curEl.length || 0)
      ) {
        const moveElChild = moveEl.firstChild || moveEl
        domHelper.setCursorAt(moveElChild, 0)
        movedCursor = true
      }

      if (movedCursor) {
        evt.preventDefault()
        evt.stopPropagation()
      }
    }
  },
  deleteSelected: (event) => {
    const { selection, sRange } = domHelper.getSelectionRange()
    if (!selection || selection.isCollapsed || !sRange) return

    domHelper.setNodeValue(
      sRange.startContainer,
      domHelper.extractElText(sRange.startContainer).slice(0, sRange.startOffset),
    )
    domHelper.setNodeValue(
      sRange.endContainer,
      domHelper.extractElText(sRange.endContainer).slice(sRange.endOffset),
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
    editor.deleteBlocks(toBeDeleted)

    selection.removeAllRanges()

    event.preventDefault()
    event.stopPropagation()
  },
  selectAll: (event) => {
    const editorEl = document.querySelector('[data-editor]')
    const all = editorEl?.querySelectorAll('[data-block-id]') || []
    if (all.length === 0) return

    const range = document.createRange()
    range.setStart(all[0], 0)
    range.setEnd(...domHelper.getRangeValues(all[all.length - 1], 'lastChild'))
    domHelper.setSelectionRange(range)

    event.preventDefault()
    event.stopPropagation()
  },
  disable: (event) => {
    event.preventDefault()
    event.stopPropagation()
  },
  shiftArrow: (event) => {},
  editLink: blockEventListener(
    ({ evt, block }) => {
      evt.preventDefault()
      // cursor selection should be set to the link element if cursor is at the
      // start or end of the link element..
      // the current selection
      // the contiguous text under the cursor
      let cursorRange = window.getSelection()?.getRangeAt(0)
      let trigger: HTMLElement | null = null
      const sEl = cursorRange?.startContainer.parentElement
      const eEl = cursorRange?.endContainer.parentElement
      if (sEl?.tagName === 'A') {
        trigger = sEl
        cursorRange = document.createRange()
        cursorRange.selectNode(trigger)
      } else if (eEl?.tagName === 'A') {
        trigger = eEl
        cursorRange = document.createRange()
        cursorRange.selectNode(trigger)
      } else if (cursorRange?.collapsed) {
        trigger = cursorRange.startContainer
        if (trigger) {
          cursorRange = document.createRange()
          cursorRange.selectNode(trigger)
        }
      }
      if (!evt.target.contains(trigger)) {
        trigger = evt.target
      }

      let href = ''
      let text = cursorRange?.toString() || ''
      if (trigger?.tagName === 'A') {
        href = trigger.getAttribute('href') || ''
        text = trigger.innerText
      }

      trigger = trigger instanceof HTMLElement ? trigger : trigger?.parentElement

      toggleUrlEdit({ href, text, trigger, cursor: cursorRange })
    },
    { editor },
  ),
})

const conditions = (cases: Record<string, any>[]) => (evt: KeyboardEvent) => {
  for (const { condition, action } of cases) {
    if (condition(evt)) {
      action(evt)
      return
    }
  }
}

const isSelecting = () => {
  const { selection } = domHelper.getSelectionRange()
  return selection && !selection.isCollapsed
}

const isType =
  (types: string[], { editor }: shortcutOpts) =>
  (evt: KeyboardEvent) => {
    const id = (evt.target as HTMLElement).getAttribute('data-block-id')
    if (!id) return false
    const block = editor.getBlockById(id)
    return block && types.includes(block.type)
  }

const isBlockElement = (event: KeyboardEvent) => {
  return Boolean((event.target as HTMLElement).getAttribute('data-block-id'))
}

const editorShortcuts = (opts: shortcutOpts) => ({
  context: 'editor',
  title: 'Editor Shortcuts',
  description: 'Shortcuts for the editor',
  shortcuts: [
    {
      key: 'shift+Enter',
      title: 'Create new block below',
      description: 'Create a new block below the current block',
      action: actions(opts).createBelow,
    },
    {
      key: 'meta+shift+Enter',
      title: 'Create new block above',
      description: 'Create a new block aAbovethe current block',
      action: actions(opts).createAbove,
    },
    {
      key: 'Enter',
      title: 'Create new block below',
      description: 'Create a new block below the current block',
      action: conditions([
        { condition: isType(['listItem'], opts), action: actions(opts).tabEnter },
        { condition: isType(['header', 'text', 'url'], opts), action: actions(opts).createBelow },
      ]),
    },
    {
      key: 'Backspace',
      title: 'Delete',
      description: 'Delete selected content',
      action: conditions([
        { condition: isSelecting, action: actions(opts).deleteSelected },
        { condition: isType(['listItem'], opts), action: actions(opts).tabDelete },
        {
          condition: isType(['header', 'text', 'url', 'code'], opts),
          action: actions(opts).deleteIfEmpty,
        },
      ]),
    },
    {
      key: 'ArrowUp',
      title: 'Arrow Up to move focus to block above',
      description: 'Move focus to block above',
      action: actions(opts).moveCursor({ direction: 'up' }),
    },
    {
      key: 'ArrowDown',
      title: 'Arrow Down to move focus to block below',
      desceription: 'Move focus to block below',
      action: actions(opts).moveCursor({ direction: 'down' }),
    },
    {
      key: 'ArrowLeft',
      title: 'Left Arrow move to top block if cursor is at start',
      description: 'Move to top block if cursor is at start',
      action: actions(opts).moveCursor({ direction: 'left' }),
    },
    {
      key: 'ArrowRight',
      title: 'Arrow Right move to bottom block if cursor is at end',
      description: 'Move to bottom block if cursor is at end',
      action: actions(opts).moveCursor({ direction: 'right' }),
    },
    {
      key: 'Tab',
      title: 'Tab to indent list item',
      description: 'Indent list item',
      action: conditions([
        { condition: isType(['listItem'], opts), action: actions(opts).tabIndent },
        {
          condition: isType(['text', 'header', 'code', 'url'], opts),
          action: actions(opts).disable,
        },
      ]),
    },
    {
      key: 'shift+Tab',
      title: 'Shift+Tab to unindent list item',
      description: 'Unindent list item',
      action: conditions([
        { condition: isType(['listItem'], opts), action: actions(opts).shiftTabIndent },
        {
          condition: isType(['text', 'header', 'code', 'url'], opts),
          action: actions(opts).disable,
        },
      ]),
    },
    {
      key: 'meta+a',
      title: 'Cmd+A to select all blocks',
      description: 'Select all blocks',
      action: conditions([{ condition: isBlockElement, action: actions(opts).selectAll }]),
    },
    {
      key: 'ctrl+l',
      title: 'Ctrl+l to create a link',
      description: 'Create a link',
      action: conditions([
        {
          condition: isType(['text', 'header', 'listItem'], opts),
          action: actions(opts).editLink,
        },
      ]),
    },
  ],
})

/**
 * Glue between editor state and dom elements.
 *
 * Usage:
 * 1. Instantiate EditorDom with editor and shortcutManager.
 * 2. Attach onEditorCreate to the editor container element.
 *    - Registers shortcuts
 *    - Sets up text selection behavior.
 * 3. Attach onBlockCreate to each block element.
 *    - Sets an attribute with the block id.
 */
export class EditorDom {
  editorEl: HTMLElement | null = null
  editor: Editor
  shortcutManager: ShortcutManager
  // Represents the block id that has focus (text cursor).
  focusId: string | undefined

  constructor({ editor, shortcutManager }: { editor: Editor; shortcutManager: ShortcutManager }) {
    this.shortcutManager = shortcutManager
    this.editor = editor
  }

  insertLink = (href: string, text: string, cursor: Range) => {
    const link = document.createElement('a')
    link.href = href
    link.textContent = text

    insertNodeAtCursor(link, cursor)

    cursor.startContainer.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
  }

  /**
   * Invoke upon editor dom element creation.
   */
  onEditorCreate = (editorEl: HTMLElement, { toggleUrlEdit }) => {
    this.editorEl = editorEl
    editorEl.dataset.editor = 'true'

    const cleanupTextSelection = this.handleTextSelection()
    const cleanupShortcut = this.shortcutManager.register(
      editorShortcuts({
        editor: this.editor,
        setFocusId: (id) => {
          this.focusId = id
        },
        toggleUrlEdit,
      }),
      {
        activateContext: true,
      },
    )

    const inputListener = blockEventListener(
      ({ block, evt }) => {
        console.log(domHelper.extractElText(evt.target as HTMLElement))
        this.editor.updateBlock(block.id, {
          properties: { text: domHelper.extractElText(evt.target as HTMLElement) },
        })
      },
      { editor: this.editor },
    )

    const pasteListener = blockEventListener(
      ({ evt }) => {
        const text = evt.clipboardData?.getData('text/plain') || ''
        if (isValidUrl(text)) {
          evt.preventDefault()
          this.insertLink(text, text, window.getSelection()?.getRangeAt(0))
        }
      },
      { editor: this.editor },
    )

    editorEl.addEventListener('input', inputListener)
    editorEl.addEventListener('paste', pasteListener)

    return () => {
      cleanupTextSelection()
      cleanupShortcut()
      editorEl.removeEventListener('input', inputListener)
      editorEl.removeEventListener('paste', pasteListener)
    }
  }

  /**
   * Register a block element to the editor. Need this to keep track of the
   * focused blocks id.
   */
  onBlockCreate = (blockEl: HTMLElement, id: string) => {
    blockEl.dataset.blockId = id

    const onfocus = () => {
      this.focusId = id
    }

    blockEl.addEventListener('focus', onfocus)

    if (this.focusId === id) {
      blockEl.focus()
    }

    return {
      destroy: () => {
        blockEl.removeEventListener('focus', onfocus)
      },
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
              curRange.startOffset,
            ]
          : [
              originRange.startContainer,
              originRange.startOffset,
              curRange.endContainer,
              curRange.endOffset,
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
}
