import EventEmitter from 'events'
import type { Block, Page } from '@renderer/src/app/types/block'
import type { Editor as EditorI } from '@renderer/src/app/types/editor'
import shortcutManager from '@renderer/src/state/shortcutManager'
import blockApi from '../db/block'

class Editor implements EditorI {
  emitter = new EventEmitter()
  currentFocusBlock: Block | null = null
  currentFocusPage: Page | null = null
  selectedBlocks: Block[] = []

  constructor() {
    this.emitter.setMaxListeners(100)
  }

  /*************************************
   * Setters
   *************************************/

  setCurrentFocusBlock(block: Block | null): void {
    this.currentFocusBlock = block
    const idx = this.currentFocusPage?.children.findIndex((b) => b.id === block?.id) as number
    this.currentFocusPage?.children.splice(idx, 1, block)
    if (!block) return

    this.emitter.emit('currentFocusBlock', block)
    this.emitter.emit('*')
  }

  setCurrentFocusPage(page: Page | null): void {
    this.currentFocusPage = page

    this.emitter.emit('*')
  }

  /*************************************
   * Block Manipulation
   *************************************/

  addBlock(createdBlock: Block, idx: number, direction: 'above' | 'below'): void {
    if (!this.currentFocusPage) return
    if (idx === undefined || idx === null) {
      this.currentFocusPage.children.push(createdBlock)
    } else {
      if (direction === 'above') {
        this.currentFocusPage.children.splice(idx, 0, createdBlock)
      } else {
        this.currentFocusPage.children.splice(idx + 1, 0, createdBlock)
      }
    }

    this.setCurrentFocusBlock(createdBlock)

    this.emitter.emit('*')
  }

  moveBlock(idx: number, toIdx: number): void {
    throw new Error('Method not implemented.')
    this.emitter.emit('*')
  }

  deleteBlock(id: string): void {
    if (!this.currentFocusPage) return
    const idx = this.currentFocusPage.children.findIndex((block) => block.id === id)
    if (idx === undefined || idx === null) return
    this.currentFocusPage.children.splice(idx, 1)

    this.emitter.emit('*')
  }

  /*************************************
   * Helpers
   *************************************/

  /**
   * Insert a block relative to the currently focused block
   */
  addRelativeToFocusedBlock(createdBlock: Block, direction: 'above' | 'below'): void {
    const idx = this.currentFocusPage?.children.findIndex(
      (block) => this.currentFocusBlock?.id === block.id
    )
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

  /*************************************
   * Listeners
   *************************************/

  registerFocusIn = (evt: FocusEvent) => {
    const node = evt.target as HTMLElement
    const id = node.getAttribute('data-block-id')
    if (id) {
      const block = this.currentFocusPage?.children.find((block) => block.id === id)
      if (!block) return
      this.currentFocusBlock = block

      this.emitter.emit('currentFocusBlock', block)
      this.emitter.emit('*')
    }
  }

  specialDelete = (evt: KeyboardEvent) => {
    const node = evt.target as HTMLElement
    const currentIdx = this.currentFocusPage?.children.findIndex(
      (b) => b.id === this.currentFocusBlock?.id
    )
    if (
      evt.key === 'Backspace' &&
      node.getAttribute('data-block-id') === this.currentFocusBlock?.id
    ) {
      if (this.currentFocusBlock?.properties.text === '') {
        this.deleteBlock(this.currentFocusBlock.id)
        evt.stopPropagation()
        if (currentIdx && currentIdx > 0) {
          this.setCurrentFocusBlock(this.currentFocusPage?.children[currentIdx - 1] || null)
        }
      }
    }
  }

  specialDownArrow = (evt: KeyboardEvent) => {
    if (evt.key === 'ArrowDown') {
      evt.preventDefault()
      evt.stopPropagation()
      this.cursorDown()
    }
  }

  registerListeners() {
    document.addEventListener('focusin', this.registerFocusIn)
    document.addEventListener('keydown', this.specialDelete)

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
            this.addRelativeToFocusedBlock(this.createEmptyTextBlock(), 'below')
          },
          preventDefault: true,
          stopPropagation: true
        },
        {
          key: 'shift+meta+Enter',
          title: 'Insert Block Above',
          description: 'Insert a new block above the current block',
          action: () => {
            this.addRelativeToFocusedBlock(this.createEmptyTextBlock(), 'above')
          },
          preventDefault: true,
          stopPropagation: true
        },
        // {
        //   key: 'Tab',
        //   title: 'Tab'
        // },
        {
          key: 'Enter',
          title: 'Enter',
          description:
            'For certain block types (like headers), pressing enter will create a new block below the current block',
          action: (e) => {
            if (['header', 'text'].includes(this.currentFocusBlock?.type)) {
              this.addRelativeToFocusedBlock(this.createEmptyTextBlock(), 'below')
              e.preventDefault()
              e.stopPropagation()
            } else if (this.currentFocusBlock?.type === 'listItem') {
              this.addRelativeToFocusedBlock(
                this.createListItemBlock(
                  this.currentFocusBlock.properties.listType,
                  this.currentFocusBlock.properties.indentLevel
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

  removeListeners() {
    document.removeEventListener('focusin', this.registerFocusIn)
    document.removeEventListener('keydown', this.specialDelete)
    shortcutManager.popActiveContext('blockEditor')
  }
}

const editor = new Editor()

editor.emitter.on('*', () => {
  if (editor.currentFocusPage) {
    blockApi.saveBlock(editor.currentFocusPage)
  }
})

export default editor
