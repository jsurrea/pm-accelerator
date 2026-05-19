'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/weather/SearchBar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import type { Search } from '@/lib/db-queries'
import type { LocationOption } from '@/components/weather/SearchBar'

interface SearchFormProps {
  mode: 'create' | 'edit'
  initial?: Search
  onSubmit: (data: {
    location: string
    lat: number
    lon: number
    date_from: string
    date_to: string
  }) => Promise<void>
  onCancel: () => void
}

interface FormErrors {
  location?: string
  date_from?: string
  date_to?: string
  general?: string
}

export function SearchForm({ mode, initial, onSubmit, onCancel }: SearchFormProps) {
  const today = new Date().toISOString().split('T')[0]

  const [location, setLocation] = useState(initial?.location ?? '')
  const [lat, setLat] = useState<number | null>(initial?.lat ?? null)
  const [lon, setLon] = useState<number | null>(initial?.lon ?? null)
  const [dateFrom, setDateFrom] = useState(initial?.date_from ?? today)
  const [dateTo, setDateTo] = useState(initial?.date_to ?? today)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initial) {
      setLocation(initial.location)
      setLat(initial.lat)
      setLon(initial.lon)
      setDateFrom(initial.date_from)
      setDateTo(initial.date_to)
    }
  }, [initial])

  function handleLocationSelect(loc: LocationOption) {
    setLocation(loc.label)
    setLat(loc.lat)
    setLon(loc.lon)
    setErrors((prev) => ({ ...prev, location: undefined }))
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}

    if (!location.trim()) newErrors.location = 'Location is required'
    if (lat === null || lon === null) newErrors.location = 'Please select a location from the suggestions'
    if (!dateFrom) newErrors.date_from = 'Start date is required'
    if (!dateTo) newErrors.date_to = 'End date is required'
    if (dateFrom && dateTo && dateFrom > dateTo) {
      newErrors.date_from = 'Start date must be on or before end date'
    }
    if (dateTo && dateTo > today) {
      newErrors.date_to = 'End date cannot be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || lat === null || lon === null) return

    setIsSubmitting(true)
    setErrors({})
    try {
      await onSubmit({ location, lat, lon, date_from: dateFrom, date_to: dateTo })
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Submission failed' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && <ErrorBanner message={errors.general} />}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <SearchBar onLocationSelect={handleLocationSelect} />
        {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
        {location && (
          <p className="text-xs text-gray-500 mt-1">Selected: {location}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date From"
          type="date"
          value={dateFrom}
          max={today}
          onChange={(e) => setDateFrom(e.target.value)}
          error={errors.date_from}
          id="date_from"
        />
        <Input
          label="Date To"
          type="date"
          value={dateTo}
          max={today}
          onChange={(e) => setDateTo(e.target.value)}
          error={errors.date_to}
          id="date_to"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Search' : 'Update Search'}
        </Button>
      </div>
    </form>
  )
}
