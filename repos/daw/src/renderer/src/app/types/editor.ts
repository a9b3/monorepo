import type { Block, Page } from '@renderer/src/app/types/block'

export interface PageEditor {
  currentFocusBlock: Block
  currentFocusPage: Page
  selectedBlocks: Block[]

  /******* Block Manipulation *******/
  addBlock(createdBlock: Block, idx: number, direction: 'above' | 'below'): void
  moveBlock(idx: number, toIdx: number): void
  deleteBlock(id: string): void

  /******* Helper Functions *******/
  addRelativeToFocusedBlock(createdBlock: Block, direction: 'above' | 'below'): void

  /******* Block Selection *******/
  selectBlock(id: string): void
  clearSelection(): void

  /******* Navigation *******/
  cursorDown(): void
  cursorUp(): void
}
