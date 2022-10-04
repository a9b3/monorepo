interface ListResponse<T> {
  results: T[]
  next: string | undefined
}

export interface DBInterface<
  T extends { id?: string; _id?: string; _rev?: string }
> {
  create(createReq: Omit<T, 'id' | '_id' | '_rev'>): Promise<T>
  update(id: string, project: T): Promise<T>
  getById(id: string): Promise<T>
  get?(getReq: { limit?: number; startkey?: string }): Promise<ListResponse<T>>
  remove?(id: string): Promise<boolean>
}
