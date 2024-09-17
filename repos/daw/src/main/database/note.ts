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

const insertStatement = `
INSERT INTO notes (id, title, body)
VALUES (?, ?, ?)
ON CONFLICT(id) DO UPDATE SET
    title = excluded.title,
    body = excluded.body,
    lastModified = datetime('now');
`

const getStatement = `
SELECT *
FROM notes
WHERE id = ?;
`

const searchStatement = `
SELECT
  notes.id,
  notes.title,
  notes.body,
  notes.lastModified,
  notes_fts.rank
FROM
  notes_fts
JOIN
  notes ON notes.id = notes_fts.rowid
WHERE
  notes_fts.title LIKE ?
  OR notes_fts.body LIKE ?
ORDER BY notes_fts.rank
`

const getAllNotesStatement = `
SELECT *
FROM notes;
`

const deleteStatement = `
DELETE FROM notes
WHERE id = ?;
`

export const handlers = {
  [UPSERT_NOTE]: (db: Database.Database) => {
    ipcMain.handle(UPSERT_NOTE, async (_, args: UpsertNoteArgs) => {
      const insertStmt = db.prepare(insertStatement)
      const getStmt = db.prepare(getStatement)

      const info = insertStmt.run(args.id, args.title, args.body)
      if (info.lastInsertRowid) {
        return getStmt.get(info.lastInsertRowid)
      }

      return getStmt.get(args.id)
    })
  },
  [SEARCH_NOTES]: (db: Database.Database) => {
    ipcMain.handle(SEARCH_NOTES, async (_, args: SearchNotesArgs) => {
      const statement = args.query ? db.prepare(searchStatement) : db.prepare(getAllNotesStatement)
      return args.query ? statement.all(`%${args.query}%`, `%${args.query}%`) : statement.all()
    })
  },
  [DELETE_NOTE]: (db: Database.Database) => {
    ipcMain.handle(DELETE_NOTE, async (_, args: DeleteNoteArgs) => {
      db.prepare(deleteStatement).run(args.id)
    })
  },
  [GET_NOTE]: (db: Database.Database) => {
    ipcMain.handle(GET_NOTE, async (_, args: GetNoteArgs) => {
      return db.prepare(getStatement).get(args.id)
    })
  }
}

export const invokers: ApiMethods = {
  [UPSERT_NOTE]: async (args: UpsertNoteArgs) => {
    return ipcRenderer.invoke(UPSERT_NOTE, args)
  },
  [SEARCH_NOTES]: async (args: SearchNotesArgs) => {
    return ipcRenderer.invoke(SEARCH_NOTES, args)
  },
  [DELETE_NOTE]: async function (args: DeleteNoteArgs): Promise<void> {
    return ipcRenderer.invoke(DELETE_NOTE, args)
  },
  [GET_NOTE]: async function (args: GetNoteArgs): Promise<Note> {
    return ipcRenderer.invoke(GET_NOTE, args)
  }
}
