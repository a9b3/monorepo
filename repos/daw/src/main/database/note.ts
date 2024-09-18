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
  GetNoteArgs
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

function generateStmt({
  command,
  fields,
  from,
  where,
  join,
  orderBy,
  limit
}: {
  command: 'select' | 'insert' | 'update' | 'delete'
  fields: string
  from: string
  where?: string
  join?: string
  orderBy?: string
  limit?: string
}) {
  let stmt = `${command.toUpperCase()} ${fields} FROM ${from}`

  if (join) {
    stmt += ` JOIN ${join}`
  }
  if (where) {
    stmt += ` WHERE ${where}`
  }
  if (orderBy) {
    stmt += ` ORDER BY ${orderBy}`
  }
  if (limit) {
    stmt += ` LIMIT ${limit}`
  }

  stmt += ';'
  return stmt
}

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
ORDER BY
  notes.lastModified DESC,
  notes_fts.rank
LIMIT 30
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
      const keys = Object.keys(args)
      // should produce something like:
      //
      // INSERT INTO notes (id, title, body)
      // VALUES (?, ?, ?)
      // ON CONFLICT(id) DO UPDATE SET
      //     title = excluded.title,
      //     body = excluded.body,
      //     lastModified = datetime('now', 'localtime');
      let insertSql = `INSERT INTO notes (${keys.join(', ')})`
      insertSql += ` VALUES (${Object.keys(args)
        .map(() => '?')
        .join(', ')})`
      insertSql += ` ON CONFLICT(id) DO UPDATE SET `
      insertSql += keys
        .filter((key) => ['id', 'lastModified'].indexOf(key) === -1)
        .map((key) => `${key} = excluded.${key}`)
        .join(', ')
      insertSql += `, lastModified = datetime('now', 'localtime')`
      insertSql += ';'

      const info = db.prepare(insertSql).run(...keys.map((key) => args[key]))

      if (args.id) {
        return db.prepare(getStatement).get(args.id)
      } else {
        return db.prepare(getStatement).get(info.lastInsertRowid)
      }
    })
  },
  [SEARCH_NOTES]: (db: Database.Database) => {
    ipcMain.handle(SEARCH_NOTES, async (_, args: SearchNotesArgs) => {
      let stmt = ''
      if (!args.query) {
        stmt = generateStmt({
          command: 'select',
          fields: '*',
          from: 'notes',
          ...(args.sortBy
            ? { orderBy: args.sortBy.map((s) => `${s.field} ${s.direction}`).join(', ') }
            : {})
        })
      } else {
        stmt = generateStmt({
          command: 'select',
          fields: [
            'notes.id',
            'notes.title',
            'notes.body',
            'notes.lastModified',
            'notes_fts.rank'
          ].join(', '),
          from: 'notes_fts',
          join: 'notes ON notes.id = notes_fts.rowid',
          where: 'notes_fts.title LIKE ? OR notes_fts.body LIKE ?',
          orderBy: 'notes.lastModified DESC, notes_fts.rank',
          limit: '30'
        })
      }

      const statement = db.prepare(stmt)
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
  [DELETE_NOTE]: async function (args: DeleteNoteArgs) {
    return ipcRenderer.invoke(DELETE_NOTE, args)
  },
  [GET_NOTE]: async function (args: GetNoteArgs) {
    return ipcRenderer.invoke(GET_NOTE, args)
  }
}
