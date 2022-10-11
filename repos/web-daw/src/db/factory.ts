import PouchDB from 'pouchdb'
import debounce from 'lodash/debounce'

export interface DBManagedFields {
  _id: string
  _rev: string
  id: string
  createdAt: number | undefined
  lastModified: number | undefined
}

export function dbFactory<T>(database: string) {
  const docDb = new PouchDB<T & DBManagedFields>(database)

  async function getById(id: string): Promise<T & DBManagedFields> {
    return docDb.get(id)
  }

  async function create(doc: T): Promise<T & DBManagedFields> {
    const id = crypto.randomUUID()
    await docDb.put({
      ...doc,
      _id: id,
      _rev: '1',
      createdAt: Date.now(),
      id,
      lastModified: Date.now(),
    })
    return docDb.get(id)
  }

  const update = debounce(
    async (id: string, doc: T): Promise<T & DBManagedFields> => {
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
    },
    500
  )

  /**
   * https://docs.couchdb.org/en/latest/ddocs/views/pagination.html
   */
  async function get(
    args: { limit?: number; startkey?: string } = {}
  ): Promise<{ results: (T & DBManagedFields)[]; next: string | undefined }> {
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
  }

  async function remove(id: string): Promise<boolean> {
    const doc = await getById(id)
    await docDb.remove(id, doc._rev)
    return true
  }

  return {
    docDb,
    create,
    get,
    getById,
    remove,
    update,
  }
}
