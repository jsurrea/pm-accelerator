import { NextRequest, NextResponse } from 'next/server'
import { getCurrentWeather, getForecast } from '@/lib/weather-api'

export async function GET(request: NextRequest) {
  const latParam = request.nextUrl.searchParams.get('lat')
  const lonParam = request.nextUrl.searchParams.get('lon')

  if (!latParam || !lonParam) {
    return NextResponse.json({ error: 'lat and lon query parameters are required' }, { status: 400 })
  }

  const lat = parseFloat(latParam)
  const lon = parseFloat(lonParam)

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: 'lat and lon must be valid numbers' }, { status: 400 })
  }

  try {
    const [current, forecast] = await Promise.all([
      getCurrentWeather(lat, lon),
      getForecast(lat, lon),
    ])
    return NextResponse.json({ current, forecast })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch weather data'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
