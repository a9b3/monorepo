/**
 * ex.
  const block = {
   id: '123',
   type: 'page',
   properties: {
     title: 'My First Note'
   },
   children: [
     {
       id: '456',
       type: 'header',
       properties: {
         level: 1,
       },
       children: [
         {
           id: '789',
           type: 'text',
           properties: {
             text: 'Hello, World!'
           },
           children: [],
           lastModified: '2021-09-01T00:00:00.000Z',
         }
       ],
       lastModified: '2021-09-01T00:00:00.000Z',
     }
   ],
   lastModified: '2021-09-01T00:00:00.000Z',
  }
 */

export interface BaseBlock {
  id: string
  children: Block[]
  lastModified: string
  type: string
  properties: any
}

/********** Block Types **********/

export type Block = Header | Code | ListItem | Text

export interface Page extends BaseBlock {
  type: 'page'
  properties: {
    title: string
  }
}

export interface Text extends BaseBlock {
  type: 'text'
  properties: {
    text: string
  }
}

export interface Header extends BaseBlock {
  type: 'header'
  properties: {
    text: string
    level: number
  }
}

export interface Code extends BaseBlock {
  type: 'code'
  properties: {
    text: string
    language: string
  }
}

export interface ListItem extends BaseBlock {
  type: 'listItem'
  properties: {
    text: string
    listType: 'todo' | 'bullet' | 'numbered'
    checked: boolean
  }
}

/************* API ***************/

interface GetAllBlocksOpts {
  sortBy?: { field: string; direction: 'DSC' | 'ASC' }[]
  filterBy?: { field: string; value: string }[]
}

export interface API {
  createBlock(
    block: Omit<Partial<Block> & Required<Pick<Block, 'type' | 'properties'>>, 'id'>
  ): Promise<Block>
  saveBlock(block: Partial<Block> & Required<Pick<Block, 'id'>>): Promise<Block>
  deleteBlock(id: string): Promise<boolean>
  deleteBlocks(ids: string[]): Promise<boolean>
  getBlockById(id: string): Promise<Block | undefined>
  searchBlocks(opt: { query: string }): Promise<Block[]>
  getAllBlocks(opts?: GetAllBlocksOpts): Promise<Block[]>
}
