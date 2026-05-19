import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'weather.db')

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined
}

function createDb(): Database.Database {
  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS searches (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      location     TEXT NOT NULL,
      lat          REAL NOT NULL,
      lon          REAL NOT NULL,
      date_from    TEXT NOT NULL,
      date_to      TEXT NOT NULL,
      weather_json TEXT NOT NULL,
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
  return db
}

export function getDb(): Database.Database {
  if (process.env.NODE_ENV === 'production') {
    return createDb()
  }
  if (!globalThis.__db) {
    globalThis.__db = createDb()
  }
  return globalThis.__db
}
