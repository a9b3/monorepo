/**
 * This module provides functions for searching blocks. It saves the search
 * index into the database and loads it when the app starts. During app runtime
 * incrementally updates the search index in memory.
 *
 * The search index is a MiniSearch instance that indexes block titles and text.
 */

import MiniSearch from 'minisearch'
import { Block } from '../types/block'
import { default as dbState, OBJ_STORES } from './db'
import dbUtil from './util'

/**
 * MiniSearch options. This object is used to initialize the MiniSearch instance
 */
let miniSearchOpts = {
  fields: ['id', 'properties.text', 'properties.title'],
  storeFields: ['id'],
  extractField: (doc: Block, fieldName: string) => {
    let res = ''
    if (fieldName === 'id') {
      res = doc.id
    }
    if (fieldName === 'properties.text') {
      res = extractAll(doc, ['text']).join(' ')
    }
    if (fieldName === 'properties.title') {
      res = extractAll(doc, ['title']).join(' ')
    }
    return res
  }
}
let miniSearch = new MiniSearch(miniSearchOpts)

/**
 * Extract all values of the specified fields from a block and its children.
 * Returns an array of strings.
 *
 * Used in the MiniSearch extractField option.
 */
function extractAll(block: Block, fields: string[]): string[] {
  const result: string[] = []
  const stack: Block[] = [block]
  const processed: Set<string> = new Set()

  while (stack.length > 0) {
    const currentBlock = stack.pop()!

    if (processed.has(currentBlock.id)) {
      continue
    }
    processed.add(currentBlock.id)

    const extractedFields: string[] = []

    fields.forEach((field) => {
      const value = currentBlock.properties[field]
      if (value) {
        extractedFields.push(value)
      }
    })

    result.push(...extractedFields)

    // Add children to the stack
    currentBlock.children.forEach((child) => {
      if (child) {
        stack.push(child)
      }
    })
  }

  return result
}

/**
 * Add a block to the search index.
 */
function addIndex(block: Block) {
  miniSearch.add(block)
}

/**
 * Update a block in the search index.
 */
function updateIndex(id: string, block: Block) {
  miniSearch.discard(id)
  miniSearch.add(block)
}

/**
 * Remove a block from the search index.
 */
function removeIndex(id: string) {
  miniSearch.discard(id)
}

/**
 * Search the index for a query.
 */
function search(query: string) {
  return miniSearch.search(query, { fuzzy: 0.2 })
}

/**
 * Run this immediately after the database initialization. It loads the search
 * index from the database and initializes the MiniSearch instance.
 */
async function initSearchIndex() {
  const index = await new Promise((resolve, reject) => {
    const db = dbState.getDb()
    const transaction = db.transaction(OBJ_STORES.searchIndex)
    const objectStore = transaction.objectStore(OBJ_STORES.searchIndex)
    const request = objectStore.getAll()

    request.onerror = function (event) {
      reject(event)
    }

    request.onsuccess = function () {
      const index = request.result
      resolve(index[0])
    }
  })

  if (index) {
    miniSearch = MiniSearch.loadJSON(index as string, miniSearchOpts)
  } else {
    // If no index is found in the database, create a new one
    const blocks = await dbUtil.getAllDocuments(OBJ_STORES.blocks)
    miniSearch.addAll(blocks)
  }
}

/**
 * Save the search index to the database.
 */
async function saveSearchIndex() {
  return new Promise<void>((resolve, reject) => {
    const db = dbState.getDb()
    const transaction = db.transaction(OBJ_STORES.searchIndex, 'readwrite')
    const objectStore = transaction.objectStore(OBJ_STORES.searchIndex)

    const index = miniSearch.toJSON()
    const request = objectStore.put(index, 'index')

    request.onerror = function (event) {
      reject(event)
    }

    request.onsuccess = function () {
      resolve()
    }
  })
}

export default {
  addIndex,
  updateIndex,
  removeIndex,
  search,
  initSearchIndex,
  saveSearchIndex
}
