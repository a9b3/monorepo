import PouchDB from 'pouchdb'
import debounce from 'lodash/debounce'

export interface DBManagedFields {
  _id: string
  _rev?: string
  id: string
  createdAt: number | undefined
  lastModified: number | undefined
}

export function dbFactory<T>(database: string) {
  let docDb = new PouchDB<T & DBManagedFields>(database)
  function getDb() {
    return docDb
  }

  // try {
  //   if (window.location.host === 'lllllllll.link') {
  //     docDb.destroy().then(() => {
  //       docDb = new PouchDB(database)
  //     })
  //   }
  // } catch (err) {
  //   console.error(`err`, err)
  // }

  async function getById(
    id: string
  ): Promise<(T & DBManagedFields) | undefined> {
    try {
      return docDb.get(id)
    } catch (err) {
      console.error({ database, id }, err)
      return undefined
    }
  }

  async function create(doc: T): Promise<(T & DBManagedFields) | undefined> {
    const id = crypto.randomUUID()
    try {
      await docDb.put({
        ...doc,
        _id: id,
        createdAt: Date.now(),
        id,
        lastModified: Date.now(),
      })
      return docDb.get(id)
    } catch (err) {
      console.error({ database, id, doc }, err)
      return undefined
    }
  }

  const update = debounce(
    async (id: string, doc: T): Promise<(T & DBManagedFields) | undefined> => {
      try {
        const response = await getById(id)
        await docDb.put({
          ...doc,
          _id: response.id,
          _rev: response._rev,
          createdAt: response.createdAt,
          id: response.id,
          lastModified: Date.now(),
        })
        return docDb.get(id)
      } catch (err) {
        console.error({ database, id, doc }, err)
        return undefined
      }
    },
    500
  )

  /**
   * https://docs.couchdb.org/en/latest/ddocs/views/pagination.html
   */
  async function get(
    args: { limit?: number; startkey?: string } = {}
  ): Promise<{ results: (T & DBManagedFields)[]; next: string | undefined }> {
    try {
      const res = await docDb.allDocs({
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
      console.error({ database, limit, startKey }, err)
      return undefined
    }
  }

  async function remove(id: string): Promise<boolean> {
    try {
      const doc = await getById(id)
      await docDb.remove(id, doc._rev)
      return true
    } catch (err) {
      console.error({ database, id }, err)
      return false
    }
  }

  return {
    docDb,
    getDb,
    create,
    get,
    getById,
    remove,
    update,
  }
}
