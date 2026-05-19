import type { YouTubeVideo } from '@/lib/youtube-api'
import { Spinner } from '@/components/ui/Spinner'

interface VideoGalleryProps {
  videos: YouTubeVideo[]
  isLoading: boolean
  location?: string | null
}

export function VideoGallery({ videos, isLoading, location }: VideoGalleryProps) {
  if (!location) return null

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Videos: {location}
      </h3>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      )}

      {!isLoading && videos.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-lg">
          Video gallery unavailable or loading...
        </div>
      )}

      {!isLoading && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video.videoId} className="rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="relative pb-[56.25%]">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-2 bg-white">
                <p className="text-xs text-gray-600 line-clamp-2">{video.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
