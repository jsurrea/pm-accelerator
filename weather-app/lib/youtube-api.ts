const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY

export interface YouTubeVideo {
  videoId: string
  title: string
  thumbnail: string
}

export async function searchYouTube(query: string): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_KEY) return []

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search')
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('q', `${query} weather travel`)
    url.searchParams.set('type', 'video')
    url.searchParams.set('maxResults', '6')
    url.searchParams.set('key', YOUTUBE_KEY)

    const res = await fetch(url.toString())
    if (!res.ok) return []

    const data = await res.json()
    if (!data.items) return []

    return data.items.map((item: Record<string, unknown>) => {
      const id = item.id as Record<string, string>
      const snippet = item.snippet as Record<string, unknown>
      const thumbnails = snippet.thumbnails as Record<string, Record<string, string>>
      return {
        videoId: id.videoId,
        title: snippet.title as string,
        thumbnail: thumbnails?.medium?.url ?? thumbnails?.default?.url ?? '',
      }
    })
  } catch {
    return []
  }
}
