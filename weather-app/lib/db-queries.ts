import { getDb } from './db'

export interface Search {
  id: number
  location: string
  lat: number
  lon: number
  date_from: string
  date_to: string
  weather_json: string
  created_at: string
  updated_at: string
}

export type CreateSearchData = Omit<Search, 'id' | 'created_at' | 'updated_at'>
export type UpdateSearchData = Partial<Omit<Search, 'id' | 'created_at' | 'updated_at'>>

export function getAllSearches(): Search[] {
  const db = getDb()
  return db.prepare('SELECT * FROM searches ORDER BY created_at DESC').all() as Search[]
}

export function getSearchById(id: number): Search | undefined {
  const db = getDb()
  return db.prepare('SELECT * FROM searches WHERE id = ?').get(id) as Search | undefined
}

export function createSearch(data: CreateSearchData): Search {
  const db = getDb()
  const now = new Date().toISOString()
  const stmt = db.prepare(`
    INSERT INTO searches (location, lat, lon, date_from, date_to, weather_json, created_at, updated_at)
    VALUES (@location, @lat, @lon, @date_from, @date_to, @weather_json, @created_at, @updated_at)
  `)
  const result = stmt.run({ ...data, created_at: now, updated_at: now })
  const inserted = getSearchById(result.lastInsertRowid as number)
  if (!inserted) throw new Error('Failed to retrieve inserted search')
  return inserted
}

export function updateSearch(id: number, data: UpdateSearchData): Search | undefined {
  const db = getDb()
  const existing = getSearchById(id)
  if (!existing) return undefined

  const now = new Date().toISOString()
  const updated = { ...existing, ...data, updated_at: now }

  db.prepare(`
    UPDATE searches
    SET location = @location,
        lat = @lat,
        lon = @lon,
        date_from = @date_from,
        date_to = @date_to,
        weather_json = @weather_json,
        updated_at = @updated_at
    WHERE id = @id
  `).run({ ...updated, id })

  return getSearchById(id)
}

export function deleteSearch(id: number): boolean {
  const db = getDb()
  const result = db.prepare('DELETE FROM searches WHERE id = ?').run(id)
  return result.changes > 0
}
