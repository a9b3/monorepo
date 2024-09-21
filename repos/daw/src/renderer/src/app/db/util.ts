import dbState from './db'

function getAllDocuments(storeName: string) {
  return new Promise((resolve, reject) => {
    const db = dbState.getDb()

    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const documents = []

    const cursorRequest = store.openCursor()

    cursorRequest.onerror = (event) => reject('Error reading data')

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        documents.push(cursor.value)
        cursor.continue()
      } else {
        resolve(documents)
      }
    }
  })
}

export default {
  getAllDocuments
}
