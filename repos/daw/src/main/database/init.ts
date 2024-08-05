import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import Database from 'better-sqlite3'
import { initNotesTable } from './note'

export async function initDatabase(): Promise<Database.Database> {
  const databaseFilepath = (process.env.NODE_ENV = 'dev'
    ? './demo.db'
    : path.join(app.getPath('userData'), 'my_database.db'))

  const db = new Database(databaseFilepath)
  db.loadExtension(path.join(app.getAppPath(), 'src/main/database/spellfix'))
  // Performance reasons
  // https://github.com/WiseLibs/better-sqlite3?tab=readme-ov-file#usage
  db.pragma('journal_mode = WAL')

  runMigration(db)
  initNotesTable(db)

  return db
}

function runMigration(db: Database.Database) {
  const migrationFile = fs.readFileSync(
    path.join(app.getAppPath(), 'src/main/database/schema.sql'),
    'utf-8'
  )
  db.exec(migrationFile)
}
