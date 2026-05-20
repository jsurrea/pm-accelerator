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

export async function getAllSearches(): Promise<Search[]> {
  const db = await getDb()
  const result = await db.execute('SELECT * FROM searches ORDER BY created_at DESC')
  return result.rows as unknown as Search[]
}

export async function getSearchById(id: number): Promise<Search | undefined> {
  const db = await getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM searches WHERE id = ?',
    args: [id],
  })
  return result.rows[0] as unknown as Search | undefined
}

export async function createSearch(data: CreateSearchData): Promise<Search> {
  const db = await getDb()
  const now = new Date().toISOString()
  const result = await db.execute({
    sql: `
    INSERT INTO searches (location, lat, lon, date_from, date_to, weather_json, created_at, updated_at)
    VALUES (@location, @lat, @lon, @date_from, @date_to, @weather_json, @created_at, @updated_at)
  `,
    args: { ...data, created_at: now, updated_at: now },
  })
  const insertedId = Number(result.lastInsertRowid)
  const inserted = await getSearchById(insertedId)
  if (!inserted) throw new Error('Failed to retrieve inserted search')
  return inserted
}

export async function updateSearch(
  id: number,
  data: UpdateSearchData
): Promise<Search | undefined> {
  const db = await getDb()
  const existing = await getSearchById(id)
  if (!existing) return undefined

  const now = new Date().toISOString()
  const updated = { ...existing, ...data, updated_at: now }

  await db.execute({
    sql: `
      UPDATE searches
      SET location = @location,
          lat = @lat,
          lon = @lon,
          date_from = @date_from,
          date_to = @date_to,
          weather_json = @weather_json,
          updated_at = @updated_at
      WHERE id = @id
    `,
    args: { ...updated, id },
  })

  return getSearchById(id)
}

export async function deleteSearch(id: number): Promise<boolean> {
  const db = await getDb()
  const result = await db.execute({
    sql: 'DELETE FROM searches WHERE id = ?',
    args: [id],
  })
  return result.rowsAffected > 0
}
