import PouchDB from 'pouchdb'
import debounce from 'lodash/debounce'
import type { Project } from 'src/daw/Project'
import type { DBInterface } from './DbInterface'

/**
 * Schema of the editor document in the database.
 */
export interface EditorDoc {
  id?: string
  openedProjects: Project[]
  selectedProjectId: string | undefined
  inFocusElement: string | undefined
  inFocusTrack: string | undefined
  user?: string
}

/**
 * The main interface for the editor database.
 */
export class EditorDB implements DBInterface<EditorDoc> {
  #database: PouchDB.Database<EditorDoc>

  constructor(...conf: ConstructorParameters<typeof PouchDB>) {
    if (!conf) {
      throw new Error(`Must initialize database`)
    }
    this.#database = new PouchDB(...conf)
    // TODO local storage need to figure out where to put createIndex statements
    this.#database.createIndex({
      index: { fields: ['user'] },
    })
  }

  async create(editor: EditorDoc) {
    const id = crypto.randomUUID()
    await this.#database.put({
      ...editor,
      createdAt: Date.now(),
      id,
      _id: id,
    })
    return this.getById(id)
  }

  /**
   * This is called frequenty upon user interacting with the editor so we can
   * debounce this for better perf.
   *
   * Just pass the class instance and this will handle serializing it.
   */
  update = debounce(async (id: string, editor: EditorDoc) => {
    const response = await this.getById(id)
    await this.#database.put({
      ...response,
      ...JSON.parse(JSON.stringify(editor)),
      id: response.id,
      _rev: response._rev,
    })
    return this.#database.get(id)
  }, 500)

  async getById(id: string) {
    return this.#database.get(id)
  }

  /**
   * Lazy create the editor settings for the given user.
   * TODO remove this later.
   */
  async getByUserId(id: string): Promise<EditorDoc> {
    const { docs } = await this.#database.find({
      selector: {
        user: id,
      },
    })
    if (!docs[0]) {
      const created = await this.create({
        openedProjects: [],
        selectedProjectId: undefined,
        inFocusElement: undefined,
        inFocusTrack: undefined
        user: id,
      })
      return created
    }
    return docs[0]
  }
}

export default new EditorDB('editor')
