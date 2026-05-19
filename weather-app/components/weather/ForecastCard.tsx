import Image from 'next/image'

interface ForecastCardProps {
  date: Date
  icon: string
  description: string
  tempMax: number
  tempMin: number
}

export function ForecastCard({ date, icon, description, tempMax, tempMin }: ForecastCardProps) {
  const dayName = date.toLocaleDateString([], { weekday: 'short' })
  const monthDay = date.toLocaleDateString([], { month: 'short', day: 'numeric' })

  return (
    <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100 min-w-[90px]">
      <div className="text-sm font-semibold text-gray-700">{dayName}</div>
      <div className="text-xs text-gray-400">{monthDay}</div>
      <Image
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
        width={50}
        height={50}
      />
      <div className="text-sm font-bold text-gray-800">{Math.round(tempMax)}°</div>
      <div className="text-xs text-gray-500">{Math.round(tempMin)}°</div>
    </div>
  )
}
