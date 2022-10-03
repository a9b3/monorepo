// @ts-expect-error Using for type only
import PouchDB from 'pouchdb/dist/pouchdb.js'

interface ListResponse<T> {
  results: T[]
  next: string | undefined
}

export interface DbInterface<T extends { id?: string }> {
  database: InstanceType<typeof PouchDB>
  configureDb(...conf: ConstructorParameters<typeof PouchDB>): void
  getDb(): InstanceType<typeof PouchDB>
  create(createReq: Omit<T, 'id' | 'createdAt'>): Promise<T>
  update(id: string, project: T): Promise<T>
  getById(id: string): Promise<T>
  get(getReq: { limit?: number; startkey?: string }): Promise<ListResponse<T>>
  remove(id: string, revId: string): Promise<boolean>
}
