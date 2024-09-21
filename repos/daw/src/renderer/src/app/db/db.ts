// Purpose: This file is used to create the database and the object store.

export let OBJ_STORES = {
  blocks: 'blocks',
  searchIndex: 'searchIndex'
}

class DBState {
  db: IDBDatabase | null = null

  /**
   * Set the database instance which will be used by getDb().
   */
  setDb(db: IDBDatabase) {
    this.db = db
  }

  /**
   * Get the database instance.
   */
  getDb(): IDBDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call initDatabase() first.')
    }
    return this.db
  }
}

export default new DBState()
