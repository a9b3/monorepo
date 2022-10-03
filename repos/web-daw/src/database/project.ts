import PouchDB from 'pouchdb/dist/pouchdb.js'
import type { DbInterface } from './DbInterface'

interface TimeSignature {
  top: number
  bottom: number
}

export interface ProjectT {
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

export class ProjectDb implements DbInterface<ProjectT> {
  database: PouchDB.Database<ProjectT>

  constructor(...conf: ConstructorParameters<typeof PouchDB>) {
    if (conf) {
      this.configureDb(...conf)
    }
  }

  configureDb(...conf: ConstructorParameters<typeof PouchDB>) {
    this.database = new PouchDB(...conf)
  }

  getDb() {
    if (!this.database) {
      throw new Error(`'configureDb' must be called before trying to use it.`)
    }
    return this.database
  }

  async create(project: ProjectT) {
    const id = crypto.randomUUID()
    const now = Date.now()
    await this.getDb().put({
      ...project,
      createdAt: now,
      id,
      _id: id,
    })

    return {
      ...project,
      createdAt: now,
      id,
    }
  }

  async update(id: string, project: ProjectT) {
    const response = await this.getDb().get(id)
    await this.getDb().put({ ...response, ...project })
    return await this.getDb().get(id)
  }

  async getById(id: string) {
    const response = await this.getDb().get(id)
    return response
  }

  /**
   * https://docs.couchdb.org/en/latest/ddocs/views/pagination.html
   */
  async get({ startkey, limit }: { limit?: number; startkey?: string } = {}) {
    const res = await this.getDb().allDocs({
      include_docs: true,
      startkey,
      limit,
    })
    return {
      results: res.rows.map((row: any) => row.doc),
      next:
        res.rows.length === limit + 1
          ? res.rows[res.rows.length - 1].id
          : undefined,
    }
  }

  async remove(id: string) {
    const doc = await this.getById(id)
    await this.getDb().remove(id, doc._rev)
    return true
  }
}

export default new ProjectDb('project')
