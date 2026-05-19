import Image from 'next/image'
import type { CurrentWeather as CurrentWeatherType } from '@/lib/weather-api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface CurrentWeatherProps {
  data: CurrentWeatherType
}

function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function windDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {data.city}, {data.country}
          </h2>
          <Badge color="blue" className="mt-1 capitalize">
            {data.description}
          </Badge>
        </div>
        <Image
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          width={80}
          height={80}
          className="drop-shadow"
        />
      </div>

      <div className="mt-4">
        <div className="text-6xl font-light text-blue-700">
          {Math.round(data.temp)}°C
        </div>
        <p className="text-gray-500 mt-1">
          Feels like {Math.round(data.feels_like)}°C
          · H: {Math.round(data.temp_max)}° L: {Math.round(data.temp_min)}°
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Humidity</div>
          <div className="text-lg font-semibold text-gray-800">{data.humidity}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Wind</div>
          <div className="text-lg font-semibold text-gray-800">
            {data.wind_speed} m/s {windDirection(data.wind_deg)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Pressure</div>
          <div className="text-lg font-semibold text-gray-800">{data.pressure} hPa</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Sunrise / Sunset</div>
          <div className="text-sm font-semibold text-gray-800">
            {formatTime(data.sunrise)} / {formatTime(data.sunset)}
          </div>
        </div>
      </div>
    </Card>
  )
}
