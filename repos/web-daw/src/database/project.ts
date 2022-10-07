import PouchDB from 'pouchdb'
import type { Track } from 'src/daw/Track'
import type { Controller } from 'src/daw/Controller'
import type { Mixer } from 'src/daw/Mixer'

import type { DBInterface } from './DbInterface'

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
  tracks: { [id: string]: Track }
  trackOrder: string[]
  controller: Controller
  mixer: Mixer
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

  update = async (id: string, project: ProjectDoc) => {
    const response = await this.#database.get(id)
    const override = response ? { id: response.id, _rev: response._rev } : {}
    await this.#database.put({
      ...JSON.parse(JSON.stringify(project)),
      ...override,
      _id: id,
    })
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
