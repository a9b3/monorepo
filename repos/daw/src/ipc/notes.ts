export interface Note {
  id: string
  title: string
  body: string
  lastModified: string
  cursorStart: number
  cursorEnd: number
}

export interface UpsertNoteArgs {
  id?: string
  title?: string
  body?: string
  // ISO8601 strings
  // YYYY-MM-DD hh:mm:ss
  lastModified?: string
  cursorStart?: number
  cursorEnd?: number
}

type SortByFields = 'lastModified' | 'rank'
type SortDirections = 'ASC' | 'DESC'
export interface SearchNotesArgs {
  query: string
  sortBy?: { field: SortByFields; direction: SortDirections }[]
}

export interface DeleteNoteArgs {
  id: string
}

export interface GetNoteArgs {
  id: string
}

export interface ApiMethods {
  upsertNote: (args: UpsertNoteArgs) => Promise<Note>
  searchNotes: (args: SearchNotesArgs) => Promise<Note[]>
  deleteNote: (args: DeleteNoteArgs) => Promise<boolean>
  getNote: (args: GetNoteArgs) => Promise<Note>
}

export const UPSERT_NOTE = 'upsertNote'
export const SEARCH_NOTES = 'searchNotes'
export const DELETE_NOTE = 'deleteNote'
export const GET_NOTE = 'getNote'
