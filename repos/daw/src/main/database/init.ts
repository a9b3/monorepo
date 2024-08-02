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
  // Performance reasons
  // https://github.com/WiseLibs/better-sqlite3?tab=readme-ov-file#usage
  db.pragma('journal_mode = WAL')

  runMigration(db)
  initNotesTable(db)

  return db
}

function runMigration(db: Database.Database) {
  // const migrationFile = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')
  // db.exec(migrationFile)
  const statement = `
    CREATE TABLE IF NOT EXISTS notes(
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      lastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING FTS5(
      title,
      body,
      content='notes',
      content_rowid='id'
    );

    CREATE TRIGGER IF NOT EXISTS notes_after_insert AFTER INSERT ON notes BEGIN
      INSERT INTO notes_fts(rowid, title, body) VALUES (new.id, new.title, new.body);
    END;

    CREATE TRIGGER IF NOT EXISTS notes_after_update AFTER UPDATE ON notes BEGIN
      INSERT INTO notes_fts(notes_fts, rowid, title, body) VALUES ('delete', old.rowid, old.title, old.body);
      INSERT INTO notes_fts(rowid, title, body) VALUES (new.id, new.title, new.body);
    END;

    CREATE TRIGGER IF NOT EXISTS notes_after_delete AFTER DELETE ON notes BEGIN
      INSERT INTO notes_fts(notes_fts, rowid, title, body) VALUES ('delete', old.id, old.title, old.body);
    END;
    `
  db.exec(statement)
}
