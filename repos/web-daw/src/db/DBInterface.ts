export interface DBInterface<T, O extends string> {
  create(doc: Omit<T, O>): Promise<T>
  get(doc: T): Promise<T>
  getById(id: string): Promise<T>
  update(doc: Omit<T, O>): Promise<T>
  delete(id: string): Promise<T>
}
