import type { Block, Page } from '@renderer/src/app/types/block'

export interface Editor {
  currentBlockId: string | null
  page: Page | null
  selectedBlocks: Block[]

  /******* Setters *******/
  setCurrentFocusBlockId(id: string | null): void
  setCurrentFocusPage(page: Page | null): void

  /******* Block Manipulation *******/
  addBlock(createdBlock: Block, idx: number, direction: 'above' | 'below'): void
  moveBlock(idx: number, toIdx: number): void
  deleteBlock(id: string): void
  updateBlock(id: string, block: Partial<Block>): void

  /******* Helper Functions *******/
  addRelativeToFocusedBlock(createdBlock: Block, direction: 'above' | 'below'): void

  /******* Block Selection *******/
  selectBlock(id: string): void
  clearSelection(): void

  /******* Navigation *******/
  cursorDown(): void
  cursorUp(): void
}
