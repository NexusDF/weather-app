const MINUTE = 60 * 1000

export const REFRESH_KEY = 'vue-weather:refresh'

export const REFRESH_OPTIONS = [
  { value: '15', label: 'Каждые 15 минут' },
  { value: '30', label: 'Каждые 30 минут' },
  { value: '60', label: 'Каждый час' },
  {
    value: 'focus',
    label: 'Только при возвращении',
    detail: 'Если прогноз старше 10 минут',
  },
]

export function readRefresh() {
  try {
    const stored = localStorage.getItem(REFRESH_KEY)
    if (REFRESH_OPTIONS.some((option) => option.value === stored)) return stored
  } catch {
    return '30'
  }
  return '30'
}

export function refreshIntervalMs(value) {
  const minutes = Number(value)
  if (minutes === 15 || minutes === 30 || minutes === 60) return minutes * MINUTE
  return false
}
