import { default as dbState, OBJ_STORES } from './db'
import { Block, API } from '../types/block'
import blockSearchIndex from './blockSearchIndex'

/**
 * Create a new block in the database. The block will be assigned a random uuid.
 */
const createBlock: API['createBlock'] = async (block) => {
  const result: Block = await new Promise<Block>((resolve, reject) => {
    const db = dbState.getDb()
    const transaction = db.transaction(OBJ_STORES.blocks, 'readwrite')
    const objectStore = transaction.objectStore(OBJ_STORES.blocks)

    const id = window.crypto.randomUUID()
    const createBlock = {
      parent: null,
      children: [],
      lastModified: new Date().toISOString(),
      ...block,
      id
    }

    const request = objectStore.add(createBlock, id)

    request.onerror = function (event) {
      reject(event)
    }

    request.onsuccess = function () {
      resolve(createBlock as Block)
    }
  })
  blockSearchIndex.addIndex(result)
  return result
}

/**
 * Search for blocks in the database.
 */
const searchBlocks: API['searchBlocks'] = async ({ query }) => {
  const ids = blockSearchIndex.search(query).map((d) => d.id)

  const db = dbState.getDb()
  const transaction = db.transaction(OBJ_STORES.blocks)
  const objectStore = transaction.objectStore(OBJ_STORES.blocks)

  const blocks = []
  for (const id of ids) {
    const request = objectStore.get(id)
    await new Promise((resolve, reject) => {
      request.onerror = function (event) {
        reject(event)
      }

      request.onsuccess = function () {
        blocks.push(request.result)
        resolve(request.result)
      }
    })
  }

  return blocks
}

/**
 * Save a block to the database and update the search index.
 */
const saveBlock: API['saveBlock'] = async (block) => {
  const updatedId = await new Promise<string>((resolve, reject) => {
    const db = dbState.getDb()
    const transaction = db.transaction(OBJ_STORES.blocks, 'readwrite')
    const objectStore = transaction.objectStore(OBJ_STORES.blocks)

    const request = objectStore.put(block, block.id)

    request.onerror = function (event) {
      reject(event)
    }

    request.onsuccess = function (event) {
      resolve(event.target.result)
    }
  })

  const updatedBlock = (await getBlockById(updatedId)) as Block

  blockSearchIndex.updateIndex(updatedBlock.id, updatedBlock)

  return updatedBlock
}

/**
 * Delete a block from the database.
 */
const deleteBlock: API['deleteBlock'] = async (id) => {
  return new Promise<boolean>((resolve, reject) => {
    const db = dbState.getDb()
    const transaction = db.transaction(OBJ_STORES.blocks, 'readwrite')
    const objectStore = transaction.objectStore(OBJ_STORES.blocks)

    const request = objectStore.delete(id)

    request.onerror = function (event) {
      reject(event)
    }

    request.onsuccess = function () {
      resolve(true)
    }
  })
}

/**
 * Delete multiple blocks from the database.
 */
const deleteBlocks: API['deleteBlocks'] = async (ids) => {
  return new Promise<boolean>((resolve, reject) => {
    const db = dbState.getDb()
    const transaction = db.transaction(OBJ_STORES.blocks, 'readwrite')
    const objectStore = transaction.objectStore(OBJ_STORES.blocks)

    ids.forEach((id) => {
      objectStore.delete(id)
    })

    transaction.oncomplete = function () {
      resolve(true)
    }

    transaction.onerror = function (event) {
      reject(event)
    }
  })
}

/**
 * Get a block by its ID.
 */
const getBlockById: API['getBlockById'] = async (id) => {
  return new Promise<Block>((resolve, reject) => {
    const db = dbState.getDb()
    const transaction = db.transaction(OBJ_STORES.blocks)
    const objectStore = transaction.objectStore(OBJ_STORES.blocks)

    const request = objectStore.get(id)

    request.onerror = function (event) {
      reject(event)
    }

    request.onsuccess = function () {
      resolve(request.result)
    }
  })
}

function getNestedProperty(obj: any, path: string) {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null
  }, obj)
}

/**
 * Get all blocks from the database.
 */
const getAllBlocks: API['getAllBlocks'] = async (opts = {}) => {
  const db = dbState.getDb()
  const transaction = db.transaction(OBJ_STORES.blocks)
  const objectStore = transaction.objectStore(OBJ_STORES.blocks)

  const request = objectStore.getAll()

  return new Promise<Block[]>((resolve, reject) => {
    request.onerror = function (event) {
      reject(event)
    }

    request.onsuccess = function () {
      let blocks = request.result

      if (opts.sortBy) {
        blocks = blocks.sort((a, b) => {
          for (const sort of opts.sortBy) {
            if (sort.field === 'lastModified') {
              return sort.direction === 'ASC'
                ? new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
                : new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
            }
            if (a[sort.field] < b[sort.field]) {
              return sort.direction === 'ASC' ? -1 : 1
            } else if (a[sort.field] > b[sort.field]) {
              return sort.direction === 'DSC' ? 1 : -1
            }
          }
          return 0
        })
      }
      if (opts.filterBy) {
        blocks = blocks.filter((block) => {
          for (const filter of opts.filterBy) {
            if (getNestedProperty(block, filter.field) !== filter.value) {
              return false
            }
          }
          return true
        })
      }

      resolve(blocks)
    }
  })
}

const APIImpl: API = {
  getBlockById,
  createBlock,
  searchBlocks,
  saveBlock,
  deleteBlock,
  deleteBlocks,
  getAllBlocks
}

export default APIImpl
