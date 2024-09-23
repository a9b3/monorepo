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

    this.pollForElement(`[data-block-id="${block?.id}"]`).then((el) => {
      el.focus()
    })

    this.emit('currentFocusBlock', block)
    this.emit('*')
  }

  setCurrentFocusPage(page: Page | null): void {
    this.currentFocusPage = page
    const firstBlockId = page ? page.children[0]?.id : null
    if (firstBlockId) {
      this.pollForElement(`[data-block-id="${firstBlockId}"]`).then((el) => {
        el.focus()
      })
    }
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
   * Poll for an element to exist in the DOM using raf for 5 seconds then
   * resolve
   */
  pollForElement(selector: string): Promise<HTMLElement> {
    return new Promise((resolve) => {
      let timeout: number
      const poll = () => {
        const el = document.querySelector(selector)
        if (el) {
          resolve(el as HTMLElement)
          cancelAnimationFrame(timeout)
        } else {
          timeout = requestAnimationFrame(poll)
        }
      }
      poll()
    })
  }

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

  registerListeners() {
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
    shortcutManager.popActiveContext('blockEditor')
  }
}

const blockEditor = new BlockEditor()

export default blockEditor
