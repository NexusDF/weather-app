<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue/offline'
import { useQueryClient } from '@tanstack/vue-query'
import { ToggleGroupItem, ToggleGroupRoot, TooltipProvider } from 'reka-ui'
import WeatherDetails from './WeatherDetails.vue'
import WeatherForecast from './WeatherForecast.vue'
import WeatherForm from './WeatherForm.vue'
import WeatherSettings from './WeatherSettings.vue'
import WeatherTemperature from './WeatherTemperature.vue'
import { citySearchOptions, reversePlaceOptions, useForecast } from '@/lib/queries'
import { REFRESH_KEY, readRefresh } from '@/lib/refresh'
import { MOSCOW_PLACE, sceneOf, themeColor, themeScheme } from '@/lib/weather'

const PLACE_KEY = 'vue-weather:place'
const UNIT_KEY = 'vue-weather:unit'
const FORECAST_ERROR = 'Не удалось загрузить прогноз. Проверьте соединение и попробуйте ещё раз.'

const place = ref(readStoredPlace())
const weather = ref(null)
const locating = ref(false)
const locateError = ref('')
const unit = ref(readUnit())
const refresh = ref(readRefresh())
const queryClient = useQueryClient()
const forecast = useForecast(place, refresh)

const scene = computed(() => {
  if (weather.value) return sceneOf(weather.value.current.weatherCode, weather.value.current.isDay)
  const hour = new Date().getHours()
  return hour >= 7 && hour < 19 ? 'clear-day' : 'clear-night'
})

const refreshing = computed(() => Boolean(weather.value) && forecast.isFetching.value)
const showProgress = computed(() => locating.value || forecast.isFetching.value)
const initialLoading = computed(
  () => Boolean(place.value) && !weather.value && forecast.isFetching.value,
)
const forecastFailed = computed(
  () => Boolean(place.value) && forecast.isError.value && !forecast.isFetching.value,
)

watch(
  () => forecast.data.value,
  (value) => {
    if (value) weather.value = value
  },
  { immediate: true },
)

watch(refresh, (value) => {
  localStorage.setItem(REFRESH_KEY, value)
})

watch(
  scene,
  (value) => {
    const color = themeColor(value)
    const current = document.querySelector('meta[name="theme-color"]')
    if (current?.getAttribute('content') !== color) {
      current?.remove()
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'theme-color')
      meta.setAttribute('content', color)
      document.head.append(meta)
    }
    document.documentElement.style.colorScheme = themeScheme(value)
  },
  { immediate: true },
)

watch(
  place,
  (value) => {
    document.title = value?.name ? `${value.name} — Погода` : 'Погода'
    if (!value) return
    localStorage.setItem(PLACE_KEY, JSON.stringify(value))
  },
  { immediate: true },
)

onMounted(async () => {
  if (place.value) return
  try {
    const cities = await queryClient.fetchQuery(citySearchOptions('Москва'))
    place.value = cities[0] ?? MOSCOW_PLACE
  } catch {
    place.value = MOSCOW_PLACE
  }
})

function readStoredPlace() {
  try {
    const raw = localStorage.getItem(PLACE_KEY)
    if (!raw) return null
    const stored = JSON.parse(raw)
    if (!stored || typeof stored.name !== 'string') return null
    if (typeof stored.latitude !== 'number' || typeof stored.longitude !== 'number') return null
    return {
      id: stored.id ?? `${stored.latitude},${stored.longitude}`,
      name: stored.name,
      admin1: stored.admin1 || '',
      country: stored.country || '',
      latitude: stored.latitude,
      longitude: stored.longitude,
    }
  } catch {
    return null
  }
}

function readUnit() {
  return localStorage.getItem(UNIT_KEY) === 'fahrenheit' ? 'fahrenheit' : 'celsius'
}

function onUnitUpdate(value) {
  if (value !== 'celsius' && value !== 'fahrenheit') return
  unit.value = value
  localStorage.setItem(UNIT_KEY, value)
}

function reload() {
  forecast.refetch()
}

function useMyLocation() {
  locateError.value = ''
  if (!navigator.geolocation) {
    locateError.value = 'Браузер не умеет определять местоположение'
    return
  }

  locating.value = true
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        place.value = await queryClient.fetchQuery(
          reversePlaceOptions(position.coords.latitude, position.coords.longitude),
        )
      } catch {
        place.value = {
          id: `geo:${position.coords.latitude.toFixed(3)},${position.coords.longitude.toFixed(3)}`,
          name: 'Моё местоположение',
          admin1: '',
          country: '',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      } finally {
        locating.value = false
      }
    },
    (error) => {
      locating.value = false
      if (error?.code === 1) locateError.value = 'Доступ к местоположению закрыт'
      else if (error?.code === 3)
        locateError.value = 'Определение местоположения заняло слишком много времени'
      else locateError.value = 'Не удалось определить местоположение'
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
  )
}
</script>

<template>
  <TooltipProvider :delay-duration="250">
    <div class="scene min-h-dvh" :data-scene="scene">
      <div class="fetch-bar" :class="{ 'is-on': showProgress }" aria-hidden="true" />
      <div class="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-8 px-4 py-6 sm:py-10">
        <header class="flex items-center justify-between gap-3">
          <p class="min-w-0 text-xs tracking-[0.22em] text-[var(--muted)] uppercase">
            DAlina Погода
          </p>
          <div class="flex shrink-0 items-center gap-2">
            <ToggleGroupRoot
              :model-value="unit"
              type="single"
              class="flex rounded-full border border-[var(--line)] bg-[var(--glass)] p-1 backdrop-blur-md"
              aria-label="Единица температуры"
              @update:model-value="onUnitUpdate"
            >
              <ToggleGroupItem
                value="celsius"
                class="rounded-full px-3 py-1 text-sm text-[var(--muted)] data-[state=on]:bg-[var(--fill)] data-[state=on]:text-[var(--fill-ink)]"
              >
                °C
              </ToggleGroupItem>
              <ToggleGroupItem
                value="fahrenheit"
                class="rounded-full px-3 py-1 text-sm text-[var(--muted)] data-[state=on]:bg-[var(--fill)] data-[state=on]:text-[var(--fill-ink)]"
              >
                °F
              </ToggleGroupItem>
            </ToggleGroupRoot>
            <WeatherSettings v-model="refresh" />
          </div>
        </header>

        <WeatherForm
          v-model="place"
          :locating="locating"
          :locate-error="locateError"
          @locate="useMyLocation"
        />

        <Transition name="panel" mode="out-in">
          <div v-if="initialLoading" key="loading" class="flex flex-col gap-4">
            <p class="sr-only">Загружаем прогноз</p>
            <div class="skeleton h-36 rounded-3xl" aria-hidden="true" />
            <div class="grid grid-cols-3 gap-2" aria-hidden="true">
              <div v-for="item in 6" :key="item" class="skeleton h-16 rounded-2xl" />
            </div>
            <div class="skeleton h-44 rounded-3xl" aria-hidden="true" />
          </div>

          <div
            v-else-if="forecastFailed && !weather"
            key="error"
            class="rounded-3xl border border-[var(--line)] bg-[var(--glass)] p-5 backdrop-blur-md"
          >
            <p class="text-lg font-medium">Прогноз не загрузился</p>
            <p class="mt-1 text-sm text-[var(--muted)]">{{ FORECAST_ERROR }}</p>
            <button
              type="button"
              class="mt-4 rounded-full bg-[var(--fill)] px-4 py-2 text-sm font-medium text-[var(--fill-ink)]"
              @click="reload"
            >
              Повторить
            </button>
          </div>

          <div
            v-else-if="weather && place"
            key="weather"
            class="weather-panel flex flex-col gap-8"
            :data-refreshing="refreshing || undefined"
          >
            <WeatherTemperature
              :place="place"
              :current="weather.current"
              :tomorrow="weather.daily[1]"
              :unit="unit"
              :refreshing="refreshing"
            />
            <WeatherDetails :current="weather.current" />
            <WeatherForecast
              :hourly="weather.hourly"
              :daily="weather.daily"
              :unit="unit"
              :current-time="weather.current.time"
            />
            <p v-if="forecastFailed" class="text-sm">
              {{ FORECAST_ERROR }}
              <button type="button" class="ml-2 underline underline-offset-2" @click="reload">
                Повторить
              </button>
            </p>
          </div>
        </Transition>

        <footer
          class="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-2 text-xs text-[var(--muted)]"
        >
          <p>
            Прогноз
            <a
              class="underline underline-offset-2"
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
            >
              Open-Meteo
            </a>
          </p>
          <p class="ml-auto flex items-center gap-1.5">
            <Icon icon="lucide:heart" class="size-3.5 shrink-0 fill-current" aria-hidden="true" />
            Люблю тебя Алиночка
          </p>
        </footer>
      </div>
    </div>
  </TooltipProvider>
</template>
