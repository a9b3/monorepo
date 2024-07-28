import { ipcMain, ipcRenderer } from 'electron'

const Database = require('better-sqlite3')

/**
 * Initializes the notes table in the database with full search capabilities
 * using fts5.
 */
export async function initNotesTable(db: Database): Promise<void> {
  const statement = `
  CREATE VIRTUAL TABLE notes
  USING fts5(title, content, content='notes', content_rowid='id')
  `

  db.prepare(statement).run()

  handlers.upsertNote.createHandler(db)
}

interface upsertNoteArgs {
  title: string
  content: string
}

export const handlers = {
  upsertNote: {
    createHandler: (db: Database) => {
      ipcMain.handle('upsertNote', async (_, args: upsertNoteArgs) => {
        const statement = `
        INSERT INTO notes (title, content)
        VALUES (?, ?)
        ON CONFLICT(title) DO UPDATE SET content = excluded.content
        `

        db.prepare(statement).run(args.title, args.content)
      })
    },
    invoker: async (args: upsertNoteArgs) => {
      await ipcRenderer.invoke('upsertNote', args)
    }
  }
}
