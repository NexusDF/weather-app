import { keepPreviousData } from '@tanstack/query-core'
import { queryOptions, useQuery } from '@tanstack/vue-query'
import { toValue } from 'vue'
import { refreshIntervalMs } from '@/lib/refresh'
import { fetchForecast, reversePlace, searchCities } from '@/lib/weather'

const MINUTE = 60 * 1000
const DAY = 24 * 60 * MINUTE

export function citySearchOptions(name) {
  const term = name.trim()
  return queryOptions({
    queryKey: ['cities', term],
    queryFn: ({ signal }) => searchCities(term, signal),
    enabled: term.length >= 2,
    staleTime: DAY,
    gcTime: DAY,
  })
}

export function useCitySearch(name) {
  return useQuery(() => citySearchOptions(toValue(name)))
}

export function reversePlaceOptions(latitude, longitude) {
  return queryOptions({
    queryKey: ['place', 'reverse', Number(latitude.toFixed(3)), Number(longitude.toFixed(3))],
    queryFn: ({ signal }) => reversePlace(latitude, longitude, signal),
    staleTime: DAY,
    gcTime: DAY,
  })
}

export function useForecast(place, refresh) {
  return useQuery(() => {
    const current = toValue(place)
    const latitude = current?.latitude
    const longitude = current?.longitude
    const interval = refreshIntervalMs(toValue(refresh))
    const staleTime = interval || 10 * MINUTE
    return queryOptions({
      queryKey: ['forecast', latitude ?? null, longitude ?? null],
      queryFn: ({ signal }) => fetchForecast(latitude, longitude, signal),
      enabled: typeof latitude === 'number' && typeof longitude === 'number',
      staleTime,
      gcTime: Math.max(30 * MINUTE, staleTime),
      refetchInterval: interval,
      placeholderData: keepPreviousData,
    })
  })
}
