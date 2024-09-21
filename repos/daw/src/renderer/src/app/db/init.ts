import { default as dbState, OBJ_STORES } from './db'
import blockSearchIndex from './blockSearchIndex'

let DB_NAME = 'myDB'
let DB_VERSION = 1

export async function initDatabase(): Promise<IDBDatabase> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    let db: IDBDatabase
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = function (event) {
      console.error('Error opening database.')
      reject(event)
    }

    request.onsuccess = function (event) {
      db = (event.target as IDBOpenDBRequest).result
      console.debug('Database opened successfully.')
      resolve(db)
    }

    request.onupgradeneeded = function (event) {
      db = (event.target as IDBOpenDBRequest).result
      console.debug('Database upgrade needed.')

      const blocksStore = db.createObjectStore(OBJ_STORES.blocks)
      blocksStore.createIndex('lastModified', 'lastModified', { unique: false })

      db.createObjectStore(OBJ_STORES.searchIndex, { keyPath: 'id', autoIncrement: true })
    }
  })

  dbState.setDb(db)

  await blockSearchIndex.initSearchIndex()

  return db
}
