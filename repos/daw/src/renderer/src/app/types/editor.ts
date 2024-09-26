import type { Block, Page, PageChild } from '@renderer/src/app/types/block'

export type EditorEventName = 'page' | 'block' | 'cursor' | 'focus'

export type EditorEvent =
  | { type: 'page'; page: Page }
  | { type: 'block'; block: PageChild }
  | { type: 'cursor'; blockId: string; cursor: number }
  | { type: 'focus'; blockId: string }

export interface Editor {
  currentBlockId: string | null
  page: Page | null

  on(event: EditorEventName, listener: (event: EditorEvent) => void): void
  off(event: EditorEventName, listener: (event: EditorEvent) => void): void

  /**
   * Updates the page with the new page data.
   *
   * events: 'page'
   */
  setPage(page: Page | null): void

  /**
   * Sets the current block id.
   *
   * events: 'focus'
   */
  setCurrentBlockId(id: string | null): void

  /**
   * Returns the current block or null if the currentBlockId is null.
   */
  getCurrentBlock(): PageChild | null

  /**
   * Adds a block to the page at the given index and direction. If the direction
   * is 'above' then the block is added above the block at the given index.
   *
   * events: 'block', 'focus'
   */
  getBlockById(id: string): PageChild | undefined
  addBlock(block: PageChild, idx: number, direction: 'above' | 'below'): void
  moveBlock(idx: number, toIdx: number): void
  moveBlocks(ids: string[], toIdx: number): void
  focusNextBlock(): void
  focusPrevBlock(): void

  /**
   * Deletes a block from the page and updates the currentBlockId to the
   * previous block. If the previous block exists then also fire off 'focus' and
   * 'cursor' events with the previous block's id.
   *
   * events: 'focus', 'cursor', 'page'
   */
  deleteBlock(id: string): void

  /**
   * Updates a block with the given id with the new block data.
   */
  updateBlock(id: string, block: Partial<PageChild>): void

  addRelativeToFocusedBlock(createdBlock: PageChild, direction: 'above' | 'below'): void
}
