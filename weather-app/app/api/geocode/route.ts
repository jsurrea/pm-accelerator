import { NextRequest, NextResponse } from 'next/server'
import { geocodeLocation } from '@/lib/weather-api'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 })
  }

  try {
    const results = await geocodeLocation(q)
    return NextResponse.json(results)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to geocode location'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
