export interface ProjectI {
  id: string
  name: string
  ownerId: string
  createdAt: Date
  createdBy: string
  modifiedAt: Date
  modifiedBy: string
}

type DBStuff = 'id' | 'createdAt'

interface API<T, O extends string> {
  create(doc: Omit<T, O>): Promise<T>
  get(doc: T): Promise<T>
  getById(id: string): Promise<T>
  update(doc: Omit<T, O>): Promise<T>
  delete(id: string): Promise<T>
}

export class api implements API<ProjectI, DBStuff> {
  async create(doc: Omit<ProjectI, DBStuff>) {
    return {} as ProjectI
  }
}
