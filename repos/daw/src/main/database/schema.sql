-- Create the notes table
CREATE TABLE IF NOT EXISTS notes(
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  lastModified TIMESTAMP DEFAULT (datetime('now', 'localtime')),
  cursorStart INTEGER DEFAULT 0,
  cursorEnd INTEGER DEFAULT 0
);

-- Create the FTS5 virtual table
CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING FTS5(
  title,
  body,
  content='notes',
  content_rowid='id',
  tokenize="trigram",
);

-- Create triggers for FTS5 table
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
