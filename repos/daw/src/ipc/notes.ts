export interface Note {
  id: string
  title: string
  body: string
  lastModified: string
}

export interface UpsertNoteArgs {
  id?: string
  title: string
  body: string
  // ISO8601 strings
  // YYYY-MM-DD hh:mm:ss
  lastModified?: string
}

export interface SearchNotesArgs {
  query: string
}

export interface DeleteNoteArgs {
  id: string
}

export interface GetNoteArgs {
  id: string
}

export interface ApiMethods {
  upsertNote: (args: UpsertNoteArgs) => Promise<UpsertNoteArgs>
  searchNotes: (args: SearchNotesArgs) => Promise<UpsertNoteArgs[]>
  deleteNote: (args: DeleteNoteArgs) => Promise<void>
  getNote: (args: GetNoteArgs) => Promise<Note>
}

export const UPSERT_NOTE = 'upsertNote'
export const SEARCH_NOTES = 'searchNotes'
export const DELETE_NOTE = 'deleteNote'
export const GET_NOTE = 'getNote'
