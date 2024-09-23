import EventEmitter from 'events'
import type { Block, Page } from '@renderer/src/app/types/block'
import shortcutManager from '@renderer/src/state/shortcutManager'

class BlockEditor extends EventEmitter {
  currentInFocusWindow: string = ''
  selectedPage: Page | null = null
  currentlyInFocusBlock: Block | null = null

  /*************************************
   * Block Manipulation
   *************************************/

  insertBlockBelowCurrentBlock(createdBlock: Block) {
    if (!this.selectedPage) return
    const idx = this.selectedPage.children.findIndex(
      (block) => this.currentlyInFocusBlock?.id === block.id
    )
    if (idx === undefined || idx === null) {
      this.selectedPage.children.push(createdBlock)
    } else {
      this.selectedPage.children.splice(idx + 1, 0, createdBlock)
    }
    this.currentlyInFocusBlock = createdBlock
    this.emit('selectedPage', this.selectedPage)
    this.emit('*')
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
            this.insertBlockBelowCurrentBlock(this.createEmptyTextBlock())
          }
        }
      ]
    })
    shortcutManager.pushActiveContext('blockEditor')
  }

  removeListeners() {
    shortcutManager.popActiveContext('blockEditor')
  }

  /*************************************
   * Setters
   *************************************/

  setCurrentInFocusWindow(id: string) {
    this.currentInFocusWindow = id
    this.emit('currentInFocusWindow', id)
    this.emit('*')
  }

  setSelectedPage(pageBlock: Page | null) {
    this.selectedPage = pageBlock
    this.emit('selectedPage', pageBlock)
    this.emit('*')
  }

  setCurrentlyInFocusBlock(block: Block | null) {
    console.log(`here`)
    this.currentlyInFocusBlock = block
    this.emit('currentlyInFocusBlock', block)
    this.emit('*')
  }

  /*************************************
   * Utils
   *************************************/

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
      parent: this.selectedPage?.id || null,
      lastModified: new Date().toISOString()
    }
  }
}

const blockEditor = new BlockEditor()

export default blockEditor
