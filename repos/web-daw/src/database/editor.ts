// import PouchDB from 'pouchdb/dist/pouchdb.js'
import PouchDB from 'pouchdb'
import debounce from 'lodash/debounce'
import type { ProjectT } from './project'

export interface EditorT {
  id?: string
  openedProjects: ProjectT[]
  selectedProjectId: string | undefined
  inFocusElement: string | undefined
  user?: string
}

export class EditorDb {
  database: PouchDB.Database<EditorT>

  constructor(...conf: ConstructorParameters<typeof PouchDB>) {
    if (conf) {
      this.configureDb(...conf)
    }
  }

  configureDb(...conf: ConstructorParameters<typeof PouchDB>) {
    this.database = new PouchDB(...conf)

    // TODO local storage
    this.database.createIndex({
      index: { fields: ['user'] },
    })
  }

  getDb() {
    if (!this.database) {
      throw new Error(`'configureDb' must be called before trying to use it.`)
    }
    return this.database
  }

  async create(editor: EditorT) {
    console.log(`create`)
    const id = crypto.randomUUID()
    await this.getDb().put({
      ...editor,
      id,
      _id: id,
    })
    console.log(`aftercreate`)
    return {
      ...editor,
      id,
    }
  }

  update = debounce(async (id: string, editor: EditorT) => {
    const response = await this.getDb().get(id)
    console.log(`this onek`, response, editor)
    await this.getDb().put({
      ...response,
      ...editor,
      id: response.id,
      _rev: response._rev,
    })
    console.log(`after`, response)
    return this.getDb().get(id)
  }, 1000)

  async getById(id: string) {
    const response = await this.getDb().get(id)
    return response
  }

  async getByUserId(id: string): Promise<EditorT> {
    const { docs } = await this.getDb().find({
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
