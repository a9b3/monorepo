import PouchDB from 'pouchdb'
import debounce from 'lodash/debounce'
import type { Project } from 'src/daw/Project'

export interface EditorT {
  id?: string
  openedProjects: Project[]
  selectedProjectId: string | undefined
  inFocusElement: string | undefined
  user?: string
}

export class EditorDb {
  #database: PouchDB.Database<EditorT>

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

  async create(editor: EditorT) {
    const id = crypto.randomUUID()
    await this.#database.put({
      ...editor,
      createdAt: Date.now(),
      id,
      _id: id,
    })
    return this.getById(id)
  }

  update = debounce(async (id: string, editor: EditorT) => {
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
  async getByUserId(id: string): Promise<EditorT> {
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
        user: id,
      })
      return created
    }
    return docs[0]
  }
}

export default new EditorDb('editor')
