'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Search } from '@/lib/db-queries'

interface UseSearchHistoryResult {
  searches: Search[]
  isLoading: boolean
  error: string | null
  create: (data: Omit<Search, 'id' | 'created_at' | 'updated_at' | 'weather_json'>) => Promise<Search>
  update: (id: number, data: Partial<Omit<Search, 'id' | 'created_at' | 'updated_at'>>) => Promise<Search>
  remove: (id: number) => Promise<void>
  refresh: () => Promise<void>
}

export function useSearchHistory(): UseSearchHistoryResult {
  const [searches, setSearches] = useState<Search[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/searches')
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? 'Failed to fetch searches')
      }
      const data = await res.json()
      setSearches(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const create = useCallback(
    async (data: Omit<Search, 'id' | 'created_at' | 'updated_at' | 'weather_json'>) => {
      const res = await fetch('/api/searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? 'Failed to create search')
      }
      const created: Search = await res.json()
      setSearches((prev) => [created, ...prev])
      return created
    },
    []
  )

  const update = useCallback(async (id: number, data: Partial<Omit<Search, 'id' | 'created_at' | 'updated_at'>>) => {
    const res = await fetch(`/api/searches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.error ?? 'Failed to update search')
    }
    const updated: Search = await res.json()
    setSearches((prev) => prev.map((s) => (s.id === id ? updated : s)))
    return updated
  }, [])

  const remove = useCallback(async (id: number) => {
    const res = await fetch(`/api/searches/${id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) {
      const body = await res.json()
      throw new Error(body.error ?? 'Failed to delete search')
    }
    setSearches((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return { searches, isLoading, error, create, update, remove, refresh }
}
