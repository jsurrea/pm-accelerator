'use client'

import { useState, useEffect } from 'react'
import type { YouTubeVideo } from '@/lib/youtube-api'

interface UseYouTubeResult {
  videos: YouTubeVideo[]
  isLoading: boolean
  error: string | null
}

export function useYouTube(location: string | null): UseYouTubeResult {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!location) {
      setVideos([])
      return
    }

    const controller = new AbortController()

    async function fetchVideos() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/youtube?q=${encodeURIComponent(location!)}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          setVideos([])
          return
        }
        const data = await res.json()
        setVideos(Array.isArray(data) ? data : [])
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Failed to load videos')
        setVideos([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
    return () => controller.abort()
  }, [location])

  return { videos, isLoading, error }
}
