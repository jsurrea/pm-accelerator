const BASE = 'https://api.openweathermap.org'
const KEY = process.env.OPENWEATHER_API_KEY

export interface GeoResult {
  name: string
  country: string
  state?: string
  lat: number
  lon: number
  displayName: string
}

export interface CurrentWeather {
  city: string
  country: string
  lat: number
  lon: number
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  humidity: number
  pressure: number
  description: string
  icon: string
  wind_speed: number
  wind_deg: number
  sunrise: number
  sunset: number
  dt: number
}

export interface ForecastItem {
  dt: number
  temp: number
  temp_min: number
  temp_max: number
  description: string
  icon: string
  humidity: number
  wind_speed: number
  dt_txt: string
}

export interface ForecastResponse {
  city: string
  country: string
  list: ForecastItem[]
}

export async function geocodeLocation(q: string): Promise<GeoResult[]> {
  if (!KEY) throw new Error('OPENWEATHER_API_KEY is not set')

  const isNumeric = /^\d+$/.test(q.trim())
  const results: GeoResult[] = []

  if (isNumeric) {
    try {
      const zipRes = await fetch(`${BASE}/geo/1.0/zip?zip=${encodeURIComponent(q)}&appid=${KEY}`)
      if (zipRes.ok) {
        const data = await zipRes.json()
        results.push({
          name: data.name,
          country: data.country,
          lat: data.lat,
          lon: data.lon,
          displayName: `${data.name}, ${data.country}`,
        })
      }
    } catch {
      // ignore zip errors, fall through to direct search
    }
  }

  const directRes = await fetch(
    `${BASE}/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${KEY}`
  )
  if (!directRes.ok) {
    const errText = await directRes.text()
    throw new Error(`Geocode API error: ${directRes.status} ${errText}`)
  }

  const directData = await directRes.json()
  const directResults: GeoResult[] = directData.map((item: Record<string, unknown>) => ({
    name: item.name as string,
    country: item.country as string,
    state: item.state as string | undefined,
    lat: item.lat as number,
    lon: item.lon as number,
    displayName: [item.name, item.state, item.country].filter(Boolean).join(', '),
  }))

  return [...results, ...directResults].slice(0, 5)
}

export async function getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  if (!KEY) throw new Error('OPENWEATHER_API_KEY is not set')

  const res = await fetch(
    `${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`
  )
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Weather API error: ${res.status} ${errText}`)
  }

  const data = await res.json()
  return {
    city: data.name,
    country: data.sys.country,
    lat: data.coord.lat,
    lon: data.coord.lon,
    temp: data.main.temp,
    feels_like: data.main.feels_like,
    temp_min: data.main.temp_min,
    temp_max: data.main.temp_max,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    wind_speed: data.wind.speed,
    wind_deg: data.wind.deg,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    dt: data.dt,
  }
}

export async function getForecast(lat: number, lon: number): Promise<ForecastResponse> {
  if (!KEY) throw new Error('OPENWEATHER_API_KEY is not set')

  const res = await fetch(
    `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&units=metric&appid=${KEY}`
  )
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Forecast API error: ${res.status} ${errText}`)
  }

  const data = await res.json()
  return {
    city: data.city.name,
    country: data.city.country,
    list: data.list.map((item: Record<string, unknown>) => {
      const main = item.main as Record<string, number>
      const weather = (item.weather as Record<string, unknown>[])[0] as Record<string, string>
      const wind = item.wind as Record<string, number>
      return {
        dt: item.dt as number,
        temp: main.temp,
        temp_min: main.temp_min,
        temp_max: main.temp_max,
        description: weather.description,
        icon: weather.icon,
        humidity: main.humidity,
        wind_speed: wind.speed,
        dt_txt: item.dt_txt as string,
      }
    }),
  }
}
