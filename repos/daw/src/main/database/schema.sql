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

INSERT INTO notes (id, title, body)
VALUES (1, 'First Note', 'lorem ipsum two')
ON CONFLICT(id) DO UPDATE SET
    title = excluded.title,
    body = excluded.body,
    lastModified = datetime('now');

INSERT INTO notes (id, title, body)
VALUES (2, 'Second Note', 'crazy garidos')
ON CONFLICT(id) DO UPDATE SET
    title = excluded.title,
    body = excluded.body,
    lastModified = datetime('now');
