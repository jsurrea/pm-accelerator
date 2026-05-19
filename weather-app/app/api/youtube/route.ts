import { NextRequest, NextResponse } from 'next/server'
import { searchYouTube } from '@/lib/youtube-api'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')

  if (!q || q.trim().length === 0) {
    return NextResponse.json([])
  }

  try {
    const videos = await searchYouTube(q)
    return NextResponse.json(videos)
  } catch {
    return NextResponse.json([])
  }
}
