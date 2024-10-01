import type { Block, Page, PageChild } from '@renderer/src/app/types/block'

export type EditorEventName = '*'

export type EditorEvent = { type: '*' }

export interface Editor {
  page: Page | null

  on(event: EditorEventName, listener: (event: EditorEvent) => void): void
  off(event: EditorEventName, listener: (event: EditorEvent) => void): void

  setPage(page: Page | null): void

  getBlockById(id: string): PageChild | undefined
  addBlock(opts: {
    block?: PageChild
    blockType?: 'text' | 'listItem'
    args?: any
    id?: string
    direction?: 'above' | 'below'
  }): PageChild | undefined
  moveBlock(idx: number, toIdx: number): void
  moveBlocks(ids: string[], toIdx: number): void
  getPreviousBlockFrom(id: string): PageChild | null
  getNextBlockFrom(id: string): PageChild | null
  deleteBlock(id: string): void
  deleteBlocks(ids: string[]): void

  /**
   * Updates a block with the given id with the new block data.
   */
  updateBlock(id: string, block: Partial<PageChild>): void
}
