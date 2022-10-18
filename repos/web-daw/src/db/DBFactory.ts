import PouchDB from 'pouchdb'
import debounce from 'lodash/debounce'

export interface DBManagedFields {
  _id: string
  _rev?: string
  id: string
  createdAt: number | undefined
  lastModified: number | undefined
}

export class DBFactory<T> {
  db: PouchDB.Database<T & DBManagedFields>
  database: string
  ready = false

  async init(database: string) {
    this.db = new PouchDB(database)
    this.database = database
    this.ready = true
  }

  async getById(id: string): Promise<(T & DBManagedFields) | undefined> {
    try {
      return this.db.get(id)
    } catch (err) {
      console.error({ database: this.database, id }, err)
      return undefined
    }
  }

  async create(doc: T): Promise<(T & DBManagedFields) | undefined> {
    const id = crypto.randomUUID()
    try {
      await this.db.put({
        ...doc,
        _id: id,
        createdAt: Date.now(),
        id,
        lastModified: Date.now(),
      })
      return this.db.get(id)
    } catch (err) {
      console.error({ database: this.database, id, doc }, err)
      return undefined
    }
  }

  update = debounce(
    async (id: string, doc: T): Promise<(T & DBManagedFields) | undefined> => {
      try {
        const response = await this.getById(id)
        await this.db.put({
          ...doc,
          _id: response.id,
          _rev: response._rev,
          createdAt: response.createdAt,
          id: response.id,
          lastModified: Date.now(),
        })
        return this.db.get(id)
      } catch (err) {
        console.error({ database: this.database, id, doc }, err)
        return undefined
      }
    },
    500
  )

  /**
   * https://docs.couchdb.org/en/latest/ddocs/views/pagination.html
   */
  async get(
    args: { limit?: number; startkey?: string } = {}
  ): Promise<{ results: (T & DBManagedFields)[]; next: string | undefined }> {
    try {
      const res = await this.db.allDocs({
        include_docs: true,
        startkey: args.startkey,
        limit: args.limit,
      })
      return {
        results: res.rows.map(row => row.doc),
        next:
          res.rows.length === args.limit + 1
            ? res.rows[res.rows.length - 1].id
            : undefined,
      }
    } catch (err) {
      console.error({ database: this.database, limit, startkey }, err)
      return undefined
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const doc = await this.getById(id)
      await this.db.remove(id, doc._rev)
      return true
    } catch (err) {
      console.error({ database: this.database, id }, err)
      return false
    }
  }
}
