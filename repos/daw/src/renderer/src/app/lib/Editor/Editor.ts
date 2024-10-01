import EventEmitter from 'events'
import type { Page, PageChild } from '@renderer/src/app/types/block'
import type {
  Editor as EditorI,
  EditorEventName,
  EditorEvent
} from '@renderer/src/app/types/editor'
import { createTextBlock, createListItemBlock } from './utils'

export default class Editor implements EditorI {
  page: Page | null = null
  emitter = new EventEmitter()

  constructor() {
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

    this.emitter.emit('*')
  }

  getBlockById(id: string): PageChild | undefined {
    return this.page?.children.find((b) => b.id === id)
  }

  addBlock = ({
    block,
    blockType,
    id,
    direction = 'below',
    args
  }: {
    block?: PageChild
    blockType?: 'text' | 'listItem'
    args?: any
    id?: string
    direction?: 'above' | 'below'
  }) => {
    if (!this.page) return

    if (blockType === 'text') {
      block = createTextBlock()
    } else if (blockType === 'listItem') {
      block = createListItemBlock(...(args as Parameters<typeof createListItemBlock>))
    }
    if (!block) {
      console.warn('Block type not supported', block, blockType)
      return
    }

    if (!id) {
      this.page.children.push(block)
      this.emitter.emit('*')
      return
    }

    const idx = this.page.children.findIndex((block) => block.id === id)
    const insertIdx = direction === 'above' ? idx : idx + 1
    this.page.children.splice(insertIdx, 0, block)
    this.emitter.emit('*')
    return block.id
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

  deleteBlock(id: string): void {
    if (!this.page) return
    const idx = this.page.children.findIndex((block) => block.id === id)
    if (idx === undefined || idx === null) return
    this.page.children.splice(idx, 1)

    this.emitter.emit('*')
  }

  deleteBlocks(ids: string[]): void {
    if (!this.page) return

    this.page.children = this.page.children.filter((b) => !ids.includes(b.id))

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
}
