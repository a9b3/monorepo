import EventEmitter from 'events'
import type { Block, Page } from '@renderer/src/app/types/block'
import type { Editor as EditorI } from '@renderer/src/app/types/editor'
import ShortcutManager from './shortcut/Manager'

export default class Editor implements EditorI {
  emitter = new EventEmitter()
  shortcutManager: ShortcutManager
  currentBlockId: string | null = null
  page: Page | null = null
  selectedBlocks: Block[] = []

  constructor(shortcutManager: ShortcutManager) {
    this.shortcutManager = shortcutManager
    this.emitter.setMaxListeners(0)
  }

  /*************************************
   * Setters
   *************************************/

  setCurrentFocusBlockId(id: string | null): void {
    this.currentBlockId = id
    this.emitter.emit('*')
  }

  getCurrentFocusBlock(): Block | null {
    return this.page?.children.find((b) => b.id === this.currentBlockId) || null
  }

  setCurrentFocusPage(page: Page | null): void {
    this.page = page
    this.emitter.emit('*')
  }

  updatePage() {}

  /*************************************
   * Block Manipulation
   *************************************/

  addBlock(createdBlock: Block, idx: number, direction: 'above' | 'below'): void {
    if (!this.page) return
    if (idx === undefined || idx === null) {
      this.page.children.push(createdBlock)
    } else {
      if (direction === 'above') {
        this.page.children.splice(idx, 0, createdBlock)
      } else {
        this.page.children.splice(idx + 1, 0, createdBlock)
      }
    }

    this.setCurrentFocusBlockId(createdBlock.id)

    this.emitter.emit('*')
  }

  moveBlock(idx: number, toIdx: number): void {
    throw new Error('Method not implemented.')
    this.emitter.emit('*')
  }

  deleteBlock(id: string): void {
    if (!this.page) return
    const idx = this.page.children.findIndex((block) => block.id === id)
    if (idx === undefined || idx === null) return
    this.page.children.splice(idx, 1)

    if (idx && idx > 0) {
      this.setCurrentFocusBlockId(this.page?.children[idx - 1].id || null)
    }

    this.emitter.emit('*')
  }

  updateBlock(id: string, updates: any): void {
    const block = this.page?.children.find((b) => b.id === id)
    if (!block) return
    block.type = updates.type || block.type
    block.properties = { ...block.properties, ...updates.properties }
    block.children = updates.children || block.children
    block.lastModified = new Date().toISOString()

    this.emitter.emit('*')
  }

  /*************************************
   * Helpers
   *************************************/

  /**
   * Insert a block relative to the currently focused block
   */
  addRelativeToFocusedBlock(createdBlock: Block, direction: 'above' | 'below'): void {
    const idx = this.page?.children.findIndex((block) => this.currentBlockId === block.id)
    if (idx === undefined || idx === null) return
    this.addBlock(createdBlock, idx, direction)
  }

  lastBlockIsEmptyText(block: Block) {
    const lastBlock = block.children[block.children.length - 1]
    if (!lastBlock) return false
    return lastBlock.type === 'text' && lastBlock.properties.text === ''
  }

  createEmptyTextBlock() {
    return {
      id: window.crypto.randomUUID(),
      type: 'text' as 'text',
      properties: {
        text: ''
      },
      children: [],
      lastModified: new Date().toISOString()
    }
  }

  createListItemBlock(listType: string, indentLevel: number) {
    return {
      id: window.crypto.randomUUID(),
      type: 'listItem' as 'listItem',
      properties: {
        text: '',
        listType,
        indentLevel,
        checked: false
      },
      children: [],
      lastModified: new Date().toISOString()
    }
  }

  /*************************************
   * Selection
   *************************************/

  selectBlock(id: string): void {
    throw new Error('Method not implemented.')
  }
  clearSelection(): void {
    throw new Error('Method not implemented.')
  }

  /*************************************
   * Navigation
   *************************************/

  cursorDown(): void {
    throw new Error('Method not implemented.')
  }
  cursorUp(): void {
    throw new Error('Method not implemented.')
  }
}

export function onEditorCreate({ editor, shortcutManager }) {
  shortcutManager.register({
    title: 'Block Editor',
    context: 'blockEditor',
    description: 'Shortcuts for block editor',
    shortcuts: [
      {
        key: 'meta+Enter',
        title: 'Insert Block',
        description: 'Insert a new block below the current block',
        action: () => {
          editor.addRelativeToFocusedBlock(editor.createEmptyTextBlock(), 'below')
        },
        preventDefault: true,
        stopPropagation: true
      },
      {
        key: 'shift+meta+Enter',
        title: 'Insert Block Above',
        description: 'Insert a new block above the current block',
        action: () => {
          editor.addRelativeToFocusedBlock(editor.createEmptyTextBlock(), 'above')
        },
        preventDefault: true,
        stopPropagation: true
      },
      {
        key: 'Backspace',
        title: 'Delete Block',
        description: 'Delete the current block',
        action: (evt) => {
          if (editor.getCurrentFocusBlock()?.properties.text === '') {
            const idx = editor.page?.children.findIndex((b) => b.id === editor.currentBlockId)
            editor.deleteBlock(editor.currentBlockId)

            if (idx && idx > 0) {
              editor.setCurrentFocusBlockId(editor.page?.children[idx - 1].id || null)
            }

            evt.preventDefault()
            evt.stopPropagation()
          }
        }
      },
      {
        key: 'Enter',
        title: 'Insert New Line',
        description:
          'Insert a new line in the current block for Header and Text blocks, or a new list item for List blocks',
        action: (e) => {
          const curBlock = editor.getCurrentFocusBlock()
          if (['header', 'text'].includes(curBlock?.type || '')) {
            editor.addRelativeToFocusedBlock(editor.createEmptyTextBlock(), 'below')

            e.preventDefault()
            e.stopPropagation()
          } else if (curBlock?.type === 'listItem') {
            editor.addRelativeToFocusedBlock(
              editor.createListItemBlock(
                curBlock.properties.listType,
                curBlock.properties.indentLevel
              ),
              'below'
            )

            e.preventDefault()
            e.stopPropagation()
          }
        }
      }
    ]
  })
  shortcutManager.pushActiveContext('blockEditor')
}

export function onEditorDestroy({ shortcutManager }) {
  shortcutManager.popActiveContext('blockEditor')
}
