import path from 'path'
import { app } from 'electron'
import { initNotesTable } from './note'

const Database = require('better-sqlite3')

export async function initDatabase(): Promise<Database.Database> {
  const databaseFilepath = (process.env.NODE_ENV = 'dev'
    ? './demo.db'
    : path.join(app.getPath('userData'), 'my_database.db'))

  const db = new Database(databaseFilepath)
  // Performance reasons
  // https://github.com/WiseLibs/better-sqlite3?tab=readme-ov-file#usage
  db.pragma('journal_mode = WAL')

  await initNotesTable(db)

  return db
}
