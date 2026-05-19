'use client'

import { useState, useCallback } from 'react'

interface Coords {
  lat: number
  lon: number
}

interface UseGeolocationResult {
  coords: Coords | null
  error: string | null
  isLoading: boolean
  trigger: () => void
}

export function useGeolocation(): UseGeolocationResult {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const trigger = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
        setIsLoading(false)
      },
      (err) => {
        setError(err.message)
        setIsLoading(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }, [])

  return { coords, error, isLoading, trigger }
}
