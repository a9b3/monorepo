import Editor from '@renderer/src/app/lib/Editor'
import ShortcutManager from '@renderer/src/app/lib/shortcut/Manager'
import { domHelper, getMouseEventCaretRange, rangeIncludesRange } from './utils'

const actions = ({
  editor,
  setFocusId
}: {
  editor: Editor
  setFocusId?: (id: string | undefined) => void
}) => ({
  createAbove: (evt) => {
    const id = evt.target.getAttribute('data-block-id')
    const block = editor.getBlockById(id)
    if (!block) return

    const focusId = editor.addBlock({
      blockType: 'text',
      id: block.id,
      direction: 'above'
    })
    setFocusId(focusId)

    evt.stopPropagation()
    evt.preventDefault()
  },
  createBelow: (evt) => {
    const id = evt.target.getAttribute('data-block-id')
    const block = editor.getBlockById(id)
    if (!block) return

    const focusId = editor.addBlock({
      blockType: 'text',
      id: block.id,
      direction: 'below'
    })
    setFocusId(focusId)

    evt.stopPropagation()
    evt.preventDefault()
  },
  /**
   * Tab behavior:
   * 1. If no previous block do not allow indent.
   * 2. If previous block is a list item, allow +1 indent level.
   *    Also indent the subtree of list items defined by everything below
   *    the current block that has an indent level greater than the current
   *    block.
   */
  tabIndent: (evt) => {
    const id = evt.target.getAttribute('data-block-id')
    const block = editor.getBlockById(id)
    if (!block) return
    if (block.type !== 'listItem') return

    const prevBlock = editor.getPreviousBlockFrom(id)
    if (!prevBlock || prevBlock.type !== 'listItem') return
    if (block.properties.indentLevel > prevBlock.properties.indentLevel) return

    const curIndent = block.properties.indentLevel

    let curBlock = block
    do {
      editor.updateBlock(curBlock.id, {
        properties: { indentLevel: curBlock.properties.indentLevel + 1 }
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
  shiftTabIndent: (evt) => {
    const id = evt.target.getAttribute('data-block-id')
    const block = editor.getBlockById(id)
    if (!block) return
    if (block.type !== 'listItem') return
    if (block.properties.indentLevel === 0) return

    const curIndent = block.properties.indentLevel
    let curBlock = block
    do {
      editor.updateBlock(curBlock.id, {
        properties: { indentLevel: curBlock.properties.indentLevel - 1 }
      })
      curBlock = editor.getNextBlockFrom(curBlock.id)
    } while (
      curBlock &&
      curBlock.type === 'listItem' &&
      curBlock.properties.indentLevel > curIndent
    )

    evt.previousDefault()
    evt.stopPropagation()
  },
  tabEnter: (evt) => {
    const id = evt.target.getAttribute('data-block-id')
    const block = editor.getBlockById(id)
    if (!block) return
    if (block.type !== 'listItem') return

    if (block.properties.text === '') {
      const focusId = editor.addBlock({
        blockType: 'text',
        id: block.id,
        direction: 'below'
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
      direction: 'below'
    })
    setFocusId(focusId)

    evt.stopPropagation()
    evt.preventDefault()
  },
  tabDelete: (evt) => {
    const id = evt.target.getAttribute('data-block-id')
    const block = editor.getBlockById(id)
    if (!block) return
    if (block.type !== 'listItem') return

    if (block.properties.text === '') {
      editor.updateBlock(block.id, { type: 'text' })
      evt.preventDefault()
      evt.stopPropagation()
    }
  },
  deleteIfEmpty: (evt) => {
    const id = evt.target.getAttribute('data-block-id')
    const block = editor.getBlockById(id)
    if (!block) return

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
  /**
   * Handle moving the cursor with arrow keys.
   */
  moveCursor: ({ direction }: { direction: 'up' | 'down' | 'left' | 'right' }) => {
    return (evt) => {
      const id = evt.target.getAttribute('data-block-id')
      const { sRange, selection } = domHelper.getSelectionRange()
      if (!selection || !sRange) return
      const curEl = domHelper.getById(id)
      if (!curEl) return
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
  }
})

const sharedShortcuts = ({
  editor,
  setFocusId
}: {
  editor: Editor
  setFocusId?: (id: string | undefined) => void
}) => [
  {
    key: 'shift+Enter',
    title: 'Create new block below',
    description: 'Create a new block below the current block',
    action: actions({ editor }).createBelow
  },
  {
    key: 'meta+shift+Enter',
    title: 'Create new block above',
    description: 'Create a new block aAbovethe current block',
    action: actions({ editor }).createAbove
  },
  {
    key: 'Enter',
    title: 'Create new block below',
    description: 'Create a new block below the current block',
    action: actions({ editor }).createBelow
  },
  {
    key: 'Backspace',
    title: 'Delete',
    description: 'Delete selected content',
    action: actions({ editor }).deleteIfEmpty
  },
  {
    key: 'ArrowUp',
    title: 'Arrow Up to move focus to block above',
    description: 'Move focus to block above',
    action: actions({ editor }).moveCursor({ direction: 'up' })
  },
  {
    key: 'ArrowDown',
    title: 'Arrow Down to move focus to block below',
    desceription: 'Move focus to block below',
    action: actions({ editor }).moveCursor({ direction: 'down' })
  },
  {
    key: 'ArrowLeft',
    title: 'Left Arrow move to top block if cursor is at start',
    description: 'Move to top block if cursor is at start',
    action: actions({ editor }).moveCursor({ direction: 'left' })
  },
  {
    key: 'ArrowRight',
    title: 'Arrow Right move to bottom block if cursor is at end',
    description: 'Move to bottom block if cursor is at end',
    action: actions({ editor }).moveCursor({ direction: 'right' })
  }
]

const blockShortcuts = ({
  editor,
  setFocusId
}: {
  editor: Editor
  setFocusId: (id: string | undefined) => void
}) => ({
  text: {
    context: 'text',
    title: 'Text Block Shortcuts',
    description: 'Shortcuts for text blocks',
    shortcuts: sharedShortcuts({ editor }).concat(...[])
  },
  header: {
    context: 'header',
    title: 'Header Block Shortcuts',
    description: 'Shortcuts for header blocks',
    shortcuts: sharedShortcuts({ editor }).concat(...[])
  },
  code: {
    context: 'code',
    title: 'Code Block Shortcuts',
    description: 'Shortcuts for code blocks',
    shortcuts: sharedShortcuts({ editor }).concat(...[])
  },
  listItem: {
    context: 'listItem',
    title: 'List Item Shortcuts',
    description: 'Shortcuts for list items',
    shortcuts: sharedShortcuts({ editor }).concat(
      ...[
        {
          key: 'Tab',
          title: 'Tab to indent list item',
          description: 'Indent list item',
          action: actions({ editor }).tabIndent
        },
        {
          key: 'shift+Tab',
          title: 'Shift+Tab to unindent list item',
          description: 'Unindent list item',
          action: actions({ editor }).shiftTabIndent
        },
        {
          key: 'Backspace',
          title: 'Delete',
          description: 'Delete selected content',
          action: actions({ editor }).tabDelete
        },
        {
          key: 'Enter',
          title: 'Create new list item below',
          description: 'Create a new list item below the current list item',
          action: actions({ editor, setFocusId }).tabEnter
        }
      ]
    )
  }
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

  /**
   * Invoke upon editor dom element creation.
   */
  onEditorCreate = (editorEl: HTMLElement) => {
    this.editorEl = editorEl

    const teardown = this.handleTextSelection()
    const teardownShortcut = this.shortcutManager.register(this.#shortcuts, {
      container: this.editorEl,
      activateContext: true
    })
    function disableTab(evt: KeyboardEvent) {
      if (evt.key === 'Tab') {
        evt.preventDefault()
      }
    }
    window.addEventListener('keydown', disableTab)

    return () => {
      teardown()
      teardownShortcut()
      window.removeEventListener('keydown', disableTab)
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

    const block = this.editor.getBlockById(id)
    if (!block) return
    const teardown = this.shortcutManager.register(
      blockShortcuts({
        editor: this.editor,
        setFocusId: (id) => {
          this.focusId = id
        }
      })[block.type],
      {
        container: blockEl
      }
    )

    const oninput = (evt: Event) => {
      if (!evt.target) return
      const text = domHelper.extractElText(evt.target as HTMLElement)
      this.editor.updateBlock(id, { properties: { text } })
    }

    const onfocus = () => {
      this.focusId = id
      this.shortcutManager.pushActiveContext(block.type)
    }

    const onblur = () => {
      this.shortcutManager.popActiveContext(block.type)
    }

    blockEl.addEventListener('input', oninput)
    blockEl.addEventListener('focus', onfocus)
    blockEl.addEventListener('onblur', onblur)

    return {
      destroy: () => {
        teardown()
        blockEl.removeEventListener('input', oninput)
        blockEl.removeEventListener('focus', onfocus)
        blockEl.removeEventListener('onblur', onblur)
      }
    }
  }

  /**
   * Editor shortcuts.
   */
  #shortcuts = {
    context: 'editor',
    title: 'Editor Shortcuts',
    description: 'Shortcuts for the editor',
    shortcuts: [
      /**
       * Handle delete across blocks.
       * 1. For each block if selection range encompasses the block, delete the block.
       * 2. Then find block that is partially selected and delete the selected text.
       */
      {
        key: 'Backspace',
        title: 'Delete',
        description: 'Delete selected content',
        action: (event) => {
          const { selection, sRange } = domHelper.getSelectionRange()
          if (!selection || selection.isCollapsed || !sRange) return

          domHelper.setNodeValue(
            sRange.startContainer,
            domHelper.extractElText(sRange.startContainer).slice(0, sRange.startOffset)
          )
          domHelper.setNodeValue(
            sRange.endContainer,
            domHelper.extractElText(sRange.endContainer).slice(sRange.endOffset)
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

          event.preventDefault()
          event.stopPropagation()
        }
      },
      {
        key: 'meta+a',
        title: 'Cmd+A to select all blocks',
        description: 'Select all blocks',
        action: (event) => {
          const all = this.editorEl?.querySelectorAll('[data-block-id]') || []
          if (all.length === 0) return

          const range = document.createRange()
          range.setStart(all[0], 0)
          range.setEnd(...domHelper.getRangeValues(all[all.length - 1], 'lastChild'))
          domHelper.setSelectionRange(range)

          event.preventDefault()
          event.stopPropagation()
        }
      }
    ]
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
      console.log(document.elementFromPoint(evt.clientX, evt.clientY))
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
}
