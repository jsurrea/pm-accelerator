import { createClient, type Client } from '@libsql/client'

let db: Client | undefined
let dbInit: Promise<void> | undefined

function createDbClient(): Client {
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  })
}

async function initializeDb(client: Client): Promise<void> {
  await client.execute(`
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
}

export async function getDb(): Promise<Client> {
  if (!db) {
    db = createDbClient()
  }
  if (!dbInit) {
    dbInit = initializeDb(db)
  }
  await dbInit
  return db
}
