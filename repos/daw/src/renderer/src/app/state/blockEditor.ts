import EventEmitter from 'events'
import type { Block, Page } from '@renderer/src/app/types/block'
import type { Editor } from '@renderer/src/app/types/editor'
import shortcutManager from '@renderer/src/state/shortcutManager'

class BlockEditor extends EventEmitter implements Editor {
  currentFocusBlock: Block | null = null
  currentFocusPage: Page | null = null
  selectedBlocks: Block[] = []

  /*************************************
   * Setters
   *************************************/

  setCurrentFocusBlock(block: Block | null): void {
    this.currentFocusBlock = block
    if (!block) return

    this.emit('currentFocusBlock', block)
    this.emit('*')
  }

  setCurrentFocusPage(page: Page | null): void {
    this.currentFocusPage = page
    this.emit('currentFocusPage', page)
    this.emit('*')
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

    this.emit('currentFocusPage', this.currentFocusPage)
    this.emit('*')
  }

  moveBlock(idx: number, toIdx: number): void {
    this.emit('currentFocusPage', this.currentFocusPage)
    this.emit('*')
    throw new Error('Method not implemented.')
  }

  deleteBlock(id: string): void {
    if (!this.currentFocusPage) return
    const idx = this.currentFocusPage.children.findIndex((block) => block.id === id)
    if (idx === undefined || idx === null) return
    this.currentFocusPage.children.splice(idx, 1)

    this.emit('currentFocusPage', this.currentFocusPage)
    this.emit('*')
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
      parent: this.currentFocusPage?.id || null,
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
    console.log(`focusin: ${evt.target}`, id)
    if (id) {
      const block = this.currentFocusPage?.children.find((block) => block.id === id)
      if (!block) return
      this.currentFocusBlock = block
      this.emit('currentFocusBlock', block)
      this.emit('*')
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
        {
          key: 'Enter',
          title: 'Enter',
          description:
            'For certain block types (like headers), pressing enter will create a new block below the current block',
          action: (e) => {
            if (this.currentFocusBlock?.type === 'header') {
              this.addRelativeToFocusedBlock(this.createEmptyTextBlock(), 'below')
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

const blockEditor = new BlockEditor()

export default blockEditor
