import EventEmitter from 'events'
import type { Block, Page, PageChild } from '@renderer/src/app/types/block'
import type {
  Editor as EditorI,
  EditorEventName,
  EditorEvent
} from '@renderer/src/app/types/editor'
import ShortcutManager from '../shortcut/Manager'

export default class Editor implements EditorI {
  currentBlockId: string | null = null
  page: Page | null = null
  selectedBlocks: Block[] = []
  emitter = new EventEmitter()
  shortcutManager: ShortcutManager

  constructor(shortcutManager: ShortcutManager) {
    this.shortcutManager = shortcutManager
    this.emitter.setMaxListeners(0)
  }

  on(event: EditorEventName, listener: (event: EditorEvent) => void) {
    this.emitter.on(event, listener)
  }

  off(event: EditorEventName, listener: (event: EditorEvent) => void) {
    this.emitter.off(event, listener)
  }

  setPage(page: Page | null): void {
    this.page = page

    this.emitter.emit('page', { type: 'page', page: this.page })
    this.emitter.emit('*')
  }

  setCurrentBlockId(id: string | null): void {
    this.currentBlockId = id

    this.emitter.emit('focus', { type: 'focus', blockId: id })
    this.emitter.emit('*')
  }

  getCurrentBlock() {
    return this.page?.children.find((b) => b.id === this.currentBlockId) || null
  }

  getBlockById(id: string): PageChild | undefined {
    return this.page?.children.find((b) => b.id === id)
  }

  addBlock(createdBlock: PageChild, idx: number, direction: string) {
    if (!this.page) return

    const insertIdx = direction === 'above' ? idx : idx + 1
    this.page.children.splice(insertIdx, 0, createdBlock)
    this.setCurrentBlockId(createdBlock.id)
    this.emitter.emit('page', { type: 'page', page: this.page })
    this.emitter.emit('*')
  }

  moveBlock(idx: number, toIdx: number): void {
    throw new Error('Method not implemented.')
    this.emitter.emit('*')
  }

  moveBlocks(ids: string[], toIdx: number): void {
    throw new Error('Method not implemented.')
    this.emitter.emit('*')
  }

  getNextBlockFrom(id: string): PageChild | null {
    if (!this.page) return null
    const idx = this.page.children.findIndex((block) => block.id === id)
    if (idx === undefined || idx === null) return null
    return this.page.children[idx + 1] || null
  }

  getPreviousBlockFrom(id: string): PageChild | null {
    if (!this.page) return null
    const idx = this.page.children.findIndex((block) => block.id === id)
    if (idx === undefined || idx === null) return null
    return this.page.children[idx - 1] || null
  }

  focusNextBlock(): void {
    if (!this.page) return
    const idx = this.page.children.findIndex((block) => block.id === this.currentBlockId)
    if (idx === undefined || idx === null) return
    if (idx < this.page.children.length - 1) {
      this.setCurrentBlockId(this.page.children[idx + 1].id)
    }
  }

  focusPrevBlock(): void {
    if (!this.page) return
    const idx = this.page.children.findIndex((block) => block.id === this.currentBlockId)
    if (idx === undefined || idx === null) return
    if (idx > 0) {
      this.setCurrentBlockId(this.page.children[idx - 1].id)
    }
  }

  deleteBlock(id: string): void {
    if (!this.page) return
    const idx = this.page.children.findIndex((block) => block.id === id)
    if (idx === undefined || idx === null) return
    this.page.children.splice(idx, 1)

    if (idx && idx > 0) {
      this.setCurrentBlockId(this.page?.children[idx - 1].id || null)
    }

    this.emitter.emit('cursor', {
      type: 'cursor',
      blockId: this.currentBlockId,
      cursor: this.getCurrentBlock()?.properties.text.length
    })
    this.emitter.emit('page', { type: 'page', page: this.page })
    this.emitter.emit('*')
  }

  updateBlock(id: string, updates: any): void {
    const block = this.page?.children.find((b) => b.id === id)
    if (!block) return
    block.type = updates.type || block.type
    block.properties = { ...block.properties, ...updates.properties }
    block.children = updates.children || block.children
    block.lastModified = new Date().toISOString()

    this.emitter.emit('block', { type: 'block', block })
    this.emitter.emit('*')
  }

  /*************************************
   * Helpers
   *************************************/

  /**
   * Insert a block relative to the currently focused block
   */
  addRelativeToFocusedBlock(createdBlock: PageChild, direction: 'above' | 'below'): void {
    const idx = this.page?.children.findIndex((block) => this.currentBlockId === block.id)
    if (idx === undefined || idx === null) return
    this.addBlock(createdBlock, idx, direction)
  }
}
