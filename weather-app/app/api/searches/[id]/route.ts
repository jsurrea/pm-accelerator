import { NextRequest, NextResponse } from 'next/server'
import { getSearchById, updateSearch, deleteSearch } from '@/lib/db-queries'
import { UpdateSearchSchema } from '@/lib/validators'
import { getCurrentWeather, getForecast } from '@/lib/weather-api'

interface RouteParams {
  params: { id: string }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const id = parseInt(params.id, 10)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const search = getSearchById(id)
    if (!search) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 })
    }
    return NextResponse.json(search)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch search'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const id = parseInt(params.id, 10)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const parsed = UpdateSearchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const updateData = { ...parsed.data } as Record<string, unknown>

    // Re-fetch weather if lat/lon changed
    if (parsed.data.lat !== undefined && parsed.data.lon !== undefined) {
      const existing = getSearchById(id)
      const lat = parsed.data.lat ?? existing?.lat
      const lon = parsed.data.lon ?? existing?.lon
      if (lat !== undefined && lon !== undefined) {
        const [current, forecast] = await Promise.all([
          getCurrentWeather(lat, lon),
          getForecast(lat, lon),
        ])
        updateData.weather_json = JSON.stringify({ current, forecast })
      }
    }

    const updated = updateSearch(id, updateData)
    if (!updated) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update search'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const id = parseInt(params.id, 10)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const deleted = deleteSearch(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 })
    }
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete search'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
