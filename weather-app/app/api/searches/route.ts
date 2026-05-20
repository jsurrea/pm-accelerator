import { NextRequest, NextResponse } from 'next/server'
import { getAllSearches, createSearch } from '@/lib/db-queries'
import { CreateSearchSchema } from '@/lib/validators'
import { getCurrentWeather, getForecast } from '@/lib/weather-api'

export async function GET() {
  try {
    const searches = await getAllSearches()
    return NextResponse.json(searches)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch searches'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = CreateSearchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { location, lat, lon, date_from, date_to } = parsed.data

    const [current, forecast] = await Promise.all([
      getCurrentWeather(lat, lon),
      getForecast(lat, lon),
    ])

    const weather_json = JSON.stringify({ current, forecast })
    const search = await createSearch({
      location,
      lat,
      lon,
      date_from,
      date_to,
      weather_json,
    })

    return NextResponse.json(search, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create search'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
