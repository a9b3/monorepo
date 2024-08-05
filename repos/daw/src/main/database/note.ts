import { ipcMain, ipcRenderer } from 'electron'
import Database from 'better-sqlite3'
import {
  ApiMethods,
  UpsertNoteArgs,
  SearchNotesArgs,
  UPSERT_NOTE,
  SEARCH_NOTES,
  DELETE_NOTE,
  GET_NOTE,
  DeleteNoteArgs,
  GetNoteArgs,
  Note
} from '@ipc/notes'

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
    ipcMain.handle(UPSERT_NOTE, async (_, args: UpsertNoteArgs) => {
      const statement = `
        INSERT INTO notes(id, title, body)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          body = excluded.body,
          lastModified = datetime('now');
        RETURNING *;
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
    ipcMain.handle(SEARCH_NOTES, async (_, args: SearchNotesArgs) => {
      const statement = args.query
        ? `
          WITH fuzzy_matches AS (
            SELECT word, distance
            FROM fuzzy_words
            WHERE word MATCH '${args.query}*'
            ORDER BY distance
            LIMIT 20
          )
          SELECT notes.*, fuzzy_matches.distance
          FROM notes_fts
          JOIN notes ON notes.id = notes_fts.rowid
          JOIN fuzzy_matches ON notes_fts MATCH fuzzy_matches.word
          ORDER BY fuzzy_matches.distance, bm25(notes_fts, 1.0, 0.5, 0.0) DESC;
        `
        : `SELECT * FROM notes;`

      return db.prepare(statement).all()
    })
  },
  [DELETE_NOTE]: (db: Database.Database) => {
    ipcMain.handle(DELETE_NOTE, async (_, args: DeleteNoteArgs) => {
      const statement = `DELETE FROM notes WHERE id = ?;`
      db.prepare(statement).run(args.id)
    })
  },
  [GET_NOTE]: (db: Database.Database) => {
    ipcMain.handle(GET_NOTE, async (_, args: GetNoteArgs) => {
      const statement = `SELECT * FROM notes WHERE id = ?;`
      return db.prepare(statement).get(args.id)
    })
  }
}

export const invokers: ApiMethods = {
  [UPSERT_NOTE]: async (args: UpsertNoteArgs) => {
    return await ipcRenderer.invoke(UPSERT_NOTE, args)
  },
  [SEARCH_NOTES]: async (args: SearchNotesArgs) => {
    return await ipcRenderer.invoke(SEARCH_NOTES, args)
  },
  [DELETE_NOTE]: async function (args: DeleteNoteArgs): Promise<void> {
    return await ipcRenderer.invoke(DELETE_NOTE, args)
  },
  [GET_NOTE]: async function (args: GetNoteArgs): Promise<Note> {
    return await ipcRenderer.invoke(GET_NOTE, args)
  }
}
