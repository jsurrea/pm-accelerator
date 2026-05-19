'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'
import type { GeoResult } from '@/lib/weather-api'

export interface LocationOption {
  label: string
  lat: number
  lon: number
}

interface SearchBarProps {
  onLocationSelect: (location: LocationOption) => void
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeoResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const containerRef = useRef<HTMLDivElement>(null)
  const { coords, isLoading: geoLoading, trigger: triggerGeo } = useGeolocation()

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }
    setIsSearching(true)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
      if (res.ok) {
        const data: GeoResult[] = await res.json()
        setSuggestions(data)
        setIsOpen(data.length > 0)
      }
    } catch {
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    fetchSuggestions(debouncedQuery)
  }, [debouncedQuery, fetchSuggestions])

  useEffect(() => {
    if (!coords) return
    onLocationSelect({ label: `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`, ...coords })
    setQuery(`${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`)
  }, [coords, onLocationSelect])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(result: GeoResult) {
    setQuery(result.displayName)
    setIsOpen(false)
    setSuggestions([])
    onLocationSelect({ label: result.displayName, lat: result.lat, lon: result.lon })
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            placeholder="Search for a city, zip code..."
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <svg
            className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {isSearching && (
            <div className="absolute right-3 top-3.5">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          )}
        </div>
        <button
          onClick={triggerGeo}
          disabled={geoLoading}
          title="Use my location"
          className="px-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {geoLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </button>
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((result, i) => (
            <li key={`${result.lat}-${result.lon}-${i}`}>
              <button
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50
                  transition-colors border-b border-gray-100 last:border-0"
              >
                <span className="font-medium">{result.name}</span>
                {result.state && <span className="text-gray-500">, {result.state}</span>}
                <span className="text-gray-500">, {result.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
