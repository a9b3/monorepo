import PouchDB from 'pouchdb'
import type { DBInterface } from './DBInterface'

interface TimeSignature {
  top: number
  bottom: number
}

/**
 * Schema of the project document in the database.
 */
export interface ProjectDoc {
  _id?: string
  _rev?: string
  id?: string
  createdAt?: number
  createdBy: string
  name: string
  bpm: number
  timeSignature: TimeSignature
  clipSetIds: string[]
  playlistIds: string[]
}

/**
 * The main interface for the project database.
 */
export class ProjectDB implements DBInterface<ProjectDoc> {
  #database: PouchDB.Database<ProjectDoc>

  constructor(...conf: ConstructorParameters<typeof PouchDB>) {
    if (!conf) {
      throw new Error(`Must initialize database`)
    }
    this.#database = new PouchDB(...conf)
  }

  async create(project: ProjectDoc) {
    const id = crypto.randomUUID()
    await this.#database.put({
      ...project,
      createdAt: Date.now(),
      id,
      _id: id,
    })
    return this.getById(id)
  }

  async update(id: string, project: ProjectDoc) {
    const response = await this.#database.get(id)
    await this.#database.put({ ...response, ...project })
    return this.#database.get(id)
  }

  async getById(id: string) {
    return this.#database.get(id)
  }

  /**
   * https://docs.couchdb.org/en/latest/ddocs/views/pagination.html
   */
  async get({ startkey, limit }: { limit?: number; startkey?: string } = {}) {
    const res = await this.#database.allDocs({
      include_docs: true,
      startkey,
      limit,
    })
    return {
      results: res.rows.map(row => row.doc),
      next:
        res.rows.length === limit + 1
          ? res.rows[res.rows.length - 1].id
          : undefined,
    }
  }

  async remove(id: string) {
    const doc = await this.getById(id)
    await this.#database.remove(id, doc._rev)
    return true
  }
}

export default new ProjectDB('project')
