import { ipcMain, ipcRenderer } from 'electron'
import Database from 'better-sqlite3'
import crypto from 'crypto'
import { upsertNoteArgs, searchNotesArgs, UPSERT_NOTE, SEARCH_NOTES } from '../../ipc/notes'

export async function initNotesTable(db: Database.Database): Promise<void> {
  for (const key in handlers) {
    if (handlers.hasOwnProperty(key)) {
      const createHandler = handlers[key]
      if (createHandler) {
        createHandler(db)
      }
    }
  }
}

export const handlers = {
  [UPSERT_NOTE]: (db: Database.Database) => {
    ipcMain.handle('upsertNote', async (_, args: upsertNoteArgs) => {
      const statement = `
        INSERT INTO notes(id, title, content, lastModified)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title
            content = excluded.content
        `

      return db.prepare(statement).run(args.id || crypto.randomUUID(), args.title, args.content)
    })
  },
  [SEARCH_NOTES]: (db: Database.Database) => {
    /*
      https://www.geeksforgeeks.org/sqlite-full-text-search/
      the arguments are:
      table name, column index, symbol/text to insert before each matched
      data, symbol/text to insert after each matched data
    */
    ipcMain.handle('searchNotes', async (_, args: searchNotesArgs) => {
      const statement = `
        SELECT * FROM notes_fts WHERE notes_fts MATCH ? ORDER BY bm25(notes_fts, 1.0, 0.5, 0.0) DESC
        `

      return db.prepare(statement).run(args.query)
    })
  }
}

export const invokers = {
  [UPSERT_NOTE]: async (args: upsertNoteArgs) => {
    return await ipcRenderer.invoke('upsertNote', args)
  },
  [SEARCH_NOTES]: async (args: searchNotesArgs) => {
    return await ipcRenderer.invoke('searchNotes', args)
  }
}
