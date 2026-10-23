const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

const WEATHER_TEXT = {
  0: 'Ясно',
  1: 'Почти ясно',
  2: 'Переменная облачность',
  3: 'Пасмурно',
  45: 'Туман',
  48: 'Туман с изморозью',
  51: 'Слабая морось',
  53: 'Морось',
  55: 'Сильная морось',
  56: 'Ледяная морось',
  57: 'Сильная ледяная морось',
  61: 'Небольшой дождь',
  63: 'Дождь',
  65: 'Сильный дождь',
  66: 'Ледяной дождь',
  67: 'Сильный ледяной дождь',
  71: 'Небольшой снег',
  73: 'Снег',
  75: 'Сильный снег',
  77: 'Снежные зёрна',
  80: 'Небольшой ливень',
  81: 'Ливень',
  82: 'Сильный ливень',
  85: 'Снегопад',
  86: 'Сильный снегопад',
  95: 'Гроза',
  96: 'Гроза с градом',
  99: 'Сильная гроза с градом',
}

const WIND_DIRECTIONS = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ']

export const MOSCOW_PLACE = {
  id: 524901,
  name: 'Москва',
  admin1: '',
  country: 'Россия',
  latitude: 55.7558,
  longitude: 37.6173,
}

export function placeLabel(place) {
  if (!place?.name) return ''
  return place.country ? `${place.name}, ${place.country}` : place.name
}

export function placeSubtitle(place) {
  if (!place) return ''
  const region = place.admin1 && place.admin1 !== place.name ? place.admin1 : ''
  return [region, place.country].filter(Boolean).join(', ')
}

export function describeWeather(code) {
  return WEATHER_TEXT[code] ?? 'Без описания'
}

export function weatherKind(code) {
  if (code === 0) return 'clear'
  if (code === 1 || code === 2) return 'partly'
  if (code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow'
  if ([95, 96, 99].includes(code)) return 'thunder'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain'
  return 'cloudy'
}

export function sceneOf(code, isDay) {
  const kind = weatherKind(code)
  if (kind === 'snow' || kind === 'fog' || kind === 'thunder') return kind
  const phase = isDay ? 'day' : 'night'
  if (kind === 'clear' || kind === 'partly' || kind === 'rain' || kind === 'cloudy') {
    return `${kind}-${phase}`
  }
  return `cloudy-${phase}`
}

export function formatTemp(value, unit) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—'
  const degrees = unit === 'fahrenheit' ? (value * 9) / 5 + 32 : value
  return `${Math.round(degrees)}°`
}

export function formatClock(iso) {
  if (!iso) return ''
  return (iso.split('T')[1] ?? '').slice(0, 5)
}

export function formatDayLabel(iso, index) {
  if (index === 0) return 'Сегодня'
  if (index === 1) return 'Завтра'
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  const label = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    timeZone: 'UTC',
  })
    .format(date)
    .replace('.', '')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function formatDayMonth(iso) {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
    .format(date)
    .replace('.', '')
}

export function windDirection(degrees) {
  if (typeof degrees !== 'number' || Number.isNaN(degrees)) return ''
  const index = Math.round(degrees / 45) % 8
  return WIND_DIRECTIONS[index]
}

export function formatWind(speed, direction) {
  if (typeof speed !== 'number') return '—'
  const text = `${Math.round(speed)} м/с`
  const dir = windDirection(direction)
  return dir ? `${text} ${dir}` : text
}

export function formatPressure(value) {
  if (typeof value !== 'number') return '—'
  return `${Math.round(value)} гПа`
}

export function formatPercent(value) {
  if (typeof value !== 'number') return '—'
  return `${Math.round(value)}%`
}

export function formatMm(value) {
  if (typeof value !== 'number') return '—'
  const rounded = Math.round(value * 10) / 10
  return `${rounded} мм`
}

export function formatUv(value) {
  if (typeof value !== 'number') return '—'
  const rounded = Math.round(value)
  if (rounded <= 2) return `${rounded} · низкий`
  if (rounded <= 5) return `${rounded} · средний`
  if (rounded <= 7) return `${rounded} · высокий`
  if (rounded <= 10) return `${rounded} · очень высокий`
  return `${rounded} · экстремальный`
}

function normalizePlace(place) {
  return {
    id: place.id,
    name: place.name,
    admin1: place.admin1 || '',
    country: place.country || '',
    latitude: place.latitude,
    longitude: place.longitude,
    population: place.population || 0,
  }
}

function dedupePlaces(places) {
  const unique = new Map()
  for (const place of places) {
    const key = `${place.name}|${place.admin1}|${place.country}`
    const current = unique.get(key)
    if (!current || place.population > current.population) unique.set(key, place)
  }
  return [...unique.values()].map(({ population, ...place }) => place)
}

export async function searchCities(name, signal) {
  const url = new URL(GEOCODING_URL)
  url.searchParams.set('name', name)
  url.searchParams.set('count', '8')
  url.searchParams.set('language', 'ru')
  url.searchParams.set('format', 'json')

  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('Не удалось найти город')
  const data = await response.json()
  return dedupePlaces((data.results ?? []).map(normalizePlace))
}

export async function reversePlace(latitude, longitude, signal) {
  const url = new URL(REVERSE_URL)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('localityLanguage', 'ru')

  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('Не удалось определить город')
  const data = await response.json()
  const name = data.city || data.locality || data.principalSubdivision || 'Моё местоположение'
  const admin1 =
    data.principalSubdivision && data.principalSubdivision !== name ? data.principalSubdivision : ''

  return {
    id: `geo:${latitude.toFixed(3)},${longitude.toFixed(3)}`,
    name,
    admin1,
    country: data.countryName || '',
    latitude,
    longitude,
  }
}

function upcomingHours(hourly, currentTime) {
  const times = hourly?.time ?? []
  let start = 0
  for (let index = 0; index < times.length; index += 1) {
    if (times[index] <= currentTime) start = index
    else break
  }

  return times.slice(start, start + 24).map((time, offset) => {
    const index = start + offset
    return {
      time,
      temperature: hourly.temperature_2m?.[index] ?? null,
      precipitationProbability: hourly.precipitation_probability?.[index] ?? 0,
      weatherCode: hourly.weather_code?.[index] ?? 0,
      windSpeed: hourly.wind_speed_10m?.[index] ?? null,
      isDay: hourly.is_day?.[index] !== 0,
    }
  })
}

function shapeDaily(daily) {
  const times = daily?.time ?? []
  return times.map((time, index) => ({
    time,
    weatherCode: daily.weather_code?.[index] ?? 0,
    temperatureMax: daily.temperature_2m_max?.[index] ?? null,
    temperatureMin: daily.temperature_2m_min?.[index] ?? null,
    precipitationSum: daily.precipitation_sum?.[index] ?? null,
    precipitationProbability: daily.precipitation_probability_max?.[index] ?? 0,
    uvIndex: daily.uv_index_max?.[index] ?? null,
    windSpeed: daily.wind_speed_10m_max?.[index] ?? null,
    sunrise: daily.sunrise?.[index] ?? '',
    sunset: daily.sunset?.[index] ?? '',
  }))
}

export async function fetchForecast(latitude, longitude, signal) {
  const url = new URL(FORECAST_URL)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
  )
  url.searchParams.set(
    'hourly',
    [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
      'is_day',
    ].join(','),
  )
  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'precipitation_probability_max',
      'uv_index_max',
      'wind_speed_10m_max',
    ].join(','),
  )
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '7')
  url.searchParams.set('wind_speed_unit', 'ms')

  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('Не удалось загрузить прогноз')
  const data = await response.json()
  if (!data.current) throw new Error('Пустой ответ прогноза')

  const daily = shapeDaily(data.daily)
  const today = daily[0]

  return {
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      isDay: data.current.is_day !== 0,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      cloudCover: data.current.cloud_cover,
      pressure: data.current.pressure_msl,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      sunrise: today?.sunrise ?? '',
      sunset: today?.sunset ?? '',
      uvIndex: today?.uvIndex ?? null,
    },
    hourly: upcomingHours(data.hourly, data.current.time),
    daily,
  }
}
