import { ipcMain, ipcRenderer } from 'electron'
import Database from 'better-sqlite3'
import crypto from 'crypto'
import { upsertNoteArgs, searchNotesArgs, UPSERT_NOTE, SEARCH_NOTES, api } from '../../ipc/notes'

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
    ipcMain.handle(UPSERT_NOTE, async (_, args: upsertNoteArgs) => {
      console.log(`upsertNote: ${JSON.stringify(args)}`)
      const statement = `INSERT INTO notes(id, title, body)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          body = excluded.body,
          lastModified = datetime('now');
        `

      return db.prepare(statement).run(args.id, args.title, args.body)
    })
  },
  [SEARCH_NOTES]: (db: Database.Database) => {
    /*
      https://www.geeksforgeeks.org/sqlite-full-text-search/
      the arguments are:
      table name, column index, symbol/text to insert before each matched
      data, symbol/text to insert after each matched data
    */
    ipcMain.handle(SEARCH_NOTES, async (_, args: searchNotesArgs) => {
      const statement = args.query
        ? `
        SELECT * FROM notes_fts WHERE notes_fts MATCH '${args.query}*' ORDER BY bm25(notes_fts, 1.0, 0.5, 0.0) DESC;
        `
        : `SELECT * FROM notes;`

      return db.prepare(statement).all()
    })
  }
}

export const invokers = {
  [UPSERT_NOTE]: async (args: upsertNoteArgs) => {
    return await ipcRenderer.invoke(UPSERT_NOTE, args)
  },
  [SEARCH_NOTES]: async (args: searchNotesArgs) => {
    return await ipcRenderer.invoke(SEARCH_NOTES, args)
  }
}
