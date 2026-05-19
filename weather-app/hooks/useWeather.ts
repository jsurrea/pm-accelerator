'use client'

import { useState, useEffect } from 'react'
import type { CurrentWeather, ForecastResponse } from '@/lib/weather-api'

interface WeatherData {
  current: CurrentWeather
  forecast: ForecastResponse
}

interface UseWeatherResult {
  data: WeatherData | null
  isLoading: boolean
  error: string | null
}

export function useWeather(lat: number | null, lon: number | null): UseWeatherResult {
  const [data, setData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (lat === null || lon === null) return

    const controller = new AbortController()

    async function fetchWeather() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          const body = await res.json()
          throw new Error(body.error ?? 'Failed to fetch weather')
        }
        const json = await res.json()
        setData(json)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()
    return () => controller.abort()
  }, [lat, lon])

  return { data, isLoading, error }
}
