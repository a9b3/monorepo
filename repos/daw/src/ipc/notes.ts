export interface upsertNoteArgs {
  id?: string
  title: string
  body: string
  // ISO8601 strings
  // YYYY-MM-DD hh:mm:ss
  lastModified?: string
}

export interface searchNotesArgs {
  query: string
}

export interface api {
  upsertNote: (args: upsertNoteArgs) => Promise<void>
  searchNotes: (args: searchNotesArgs) => Promise<void>
}

export const UPSERT_NOTE = 'upsertNote'
export const SEARCH_NOTES = 'searchNotes'
