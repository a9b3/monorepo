import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import Database from 'better-sqlite3'
import { initNotesTable } from './note'

const appPath = process.env.NODE_ENV === 'production' ? `${process.resourcesPath}/app` : __dirname

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
  // const migrationFile = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')
  // db.exec(migrationFile)
  const statement = `
-- Create the notes table
CREATE TABLE IF NOT EXISTS notes(
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  lastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the FTS5 virtual table
CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING FTS5(
  title,
  body,
  content='notes',
  content_rowid='id'
);

-- Create the spellfix1 virtual table
CREATE VIRTUAL TABLE IF NOT EXISTS fuzzy_words USING spellfix1;

-- Create triggers for FTS5 table
CREATE TRIGGER IF NOT EXISTS notes_after_insert AFTER INSERT ON notes BEGIN
  INSERT INTO notes_fts(rowid, title, body) VALUES (new.id, new.title, new.body);
  INSERT INTO fuzzy_words(word) SELECT value FROM (
    SELECT new.title AS value UNION ALL SELECT new.body
  ) WHERE value != '';
END;

CREATE TRIGGER IF NOT EXISTS notes_after_update AFTER UPDATE ON notes BEGIN
  INSERT INTO notes_fts(notes_fts, rowid, title, body) VALUES ('delete', old.rowid, old.title, old.body);
  INSERT INTO notes_fts(rowid, title, body) VALUES (new.id, new.title, new.body);
  INSERT INTO fuzzy_words(word) SELECT value FROM (
    SELECT new.title AS value UNION ALL SELECT new.body
  ) WHERE value != '';
END;

CREATE TRIGGER IF NOT EXISTS notes_after_delete AFTER DELETE ON notes BEGIN
  INSERT INTO notes_fts(notes_fts, rowid, title, body) VALUES ('delete', old.id, old.title, old.body);
END;

-- Populate fuzzy_words table with existing data
INSERT INTO fuzzy_words(word)
SELECT DISTINCT value
FROM (
  SELECT title AS value FROM notes
  UNION ALL
  SELECT body FROM notes
)
WHERE value != '';
    `
  db.exec(statement)
}
