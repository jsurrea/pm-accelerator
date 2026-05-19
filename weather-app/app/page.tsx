'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { SearchBar } from '@/components/weather/SearchBar'
import type { LocationOption } from '@/components/weather/SearchBar'
import { CurrentWeather } from '@/components/weather/CurrentWeather'
import { ForecastStrip } from '@/components/weather/ForecastStrip'
import { VideoGallery } from '@/components/youtube/VideoGallery'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { useWeather } from '@/hooks/useWeather'
import { useYouTube } from '@/hooks/useYouTube'

const LocationMapDynamic = dynamic(
  () => import('@/components/map/LocationMap').then((m) => m.LocationMapWrapper),
  { ssr: false, loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse" /> }
)

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null)
  const { data: weatherData, isLoading, error } = useWeather(
    selectedLocation?.lat ?? null,
    selectedLocation?.lon ?? null
  )
  const { videos, isLoading: videosLoading } = useYouTube(selectedLocation?.label ?? null)

  return (
    <div className="space-y-6">
      <Header />

      <SearchBar onLocationSelect={setSelectedLocation} />

      {error && <ErrorBanner message={error} />}

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {!isLoading && weatherData && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CurrentWeather data={weatherData.current} />
            <LocationMapDynamic
              lat={selectedLocation!.lat}
              lon={selectedLocation!.lon}
              label={selectedLocation?.label}
            />
          </div>

          <ForecastStrip data={weatherData.forecast} />

          <VideoGallery
            videos={videos}
            isLoading={videosLoading}
            location={selectedLocation?.label}
          />
        </>
      )}

      {!isLoading && !weatherData && !error && (
        <div className="text-center py-16 text-gray-400">
          <svg
            className="h-16 w-16 mx-auto mb-4 opacity-40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
          <p className="text-lg">Search for a location to see the weather</p>
          <p className="text-sm mt-1">Try typing a city name or zip code above</p>
        </div>
      )}
    </div>
  )
}
