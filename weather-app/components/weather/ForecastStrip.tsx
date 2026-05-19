import type { ForecastResponse, ForecastItem } from '@/lib/weather-api'
import { ForecastCard } from './ForecastCard'

interface ForecastStripProps {
  data: ForecastResponse
}

interface DayForecast {
  date: Date
  icon: string
  description: string
  tempMax: number
  tempMin: number
}

function groupByDay(items: ForecastItem[]): DayForecast[] {
  const dayMap = new Map<string, ForecastItem[]>()

  for (const item of items) {
    const date = new Date(item.dt * 1000)
    const key = date.toISOString().split('T')[0]
    const existing = dayMap.get(key)
    if (existing) {
      existing.push(item)
    } else {
      dayMap.set(key, [item])
    }
  }

  return Array.from(dayMap.entries())
    .slice(0, 5)
    .map(([dateStr, dayItems]) => {
      // Prefer noon reading, fallback to first
      const noon = dayItems.find((i) => {
        const hour = new Date(i.dt * 1000).getHours()
        return hour >= 11 && hour <= 13
      }) ?? dayItems[0]

      const tempMax = Math.max(...dayItems.map((i) => i.temp_max))
      const tempMin = Math.min(...dayItems.map((i) => i.temp_min))

      return {
        date: new Date(dateStr + 'T12:00:00'),
        icon: noon.icon,
        description: noon.description,
        tempMax,
        tempMin,
      }
    })
}

export function ForecastStrip({ data }: ForecastStripProps) {
  const days = groupByDay(data.list)

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        5-Day Forecast
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {days.map((day, i) => (
          <ForecastCard
            key={i}
            date={day.date}
            icon={day.icon}
            description={day.description}
            tempMax={day.tempMax}
            tempMin={day.tempMin}
          />
        ))}
      </div>
    </div>
  )
}
