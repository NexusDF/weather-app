<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ToggleGroupItem, ToggleGroupRoot, TooltipProvider } from 'reka-ui'
import WeatherDetails from './WeatherDetails.vue'
import WeatherForecast from './WeatherForecast.vue'
import WeatherForm from './WeatherForm.vue'
import WeatherTemperature from './WeatherTemperature.vue'
import { fetchForecast, MOSCOW_PLACE, reversePlace, sceneOf, searchCities } from '@/lib/weather'

const PLACE_KEY = 'vue-weather:place'
const UNIT_KEY = 'vue-weather:unit'

const place = ref(readStoredPlace())
const weather = ref(null)
const status = ref('idle')
const errorMessage = ref('')
const locating = ref(false)
const locateError = ref('')
const unit = ref(readUnit())

let forecastController

const scene = computed(() => {
  if (weather.value) return sceneOf(weather.value.current.weatherCode, weather.value.current.isDay)
  const hour = new Date().getHours()
  return hour >= 7 && hour < 19 ? 'clear-day' : 'clear-night'
})

const refreshing = computed(() => status.value === 'refreshing')

watch(
  place,
  (value) => {
    document.title = value?.name ? `${value.name} — Погода` : 'Погода'
    if (!value) return
    localStorage.setItem(PLACE_KEY, JSON.stringify(value))
    loadWeather(value)
  },
  { immediate: true },
)

onMounted(async () => {
  if (place.value) return
  try {
    const [city] = await searchCities('Москва')
    place.value = city ?? MOSCOW_PLACE
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

async function loadWeather(target) {
  forecastController?.abort()
  const controller = new AbortController()
  forecastController = controller
  status.value = weather.value ? 'refreshing' : 'loading'
  errorMessage.value = ''
  try {
    const next = await fetchForecast(target.latitude, target.longitude, controller.signal)
    if (controller.signal.aborted) return
    weather.value = next
    status.value = 'ready'
  } catch (error) {
    if (error?.name === 'AbortError') return
    errorMessage.value = 'Не удалось загрузить прогноз. Проверьте соединение и попробуйте ещё раз.'
    status.value = 'error'
  }
}

function reload() {
  if (place.value) loadWeather(place.value)
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
        place.value = await reversePlace(position.coords.latitude, position.coords.longitude)
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
      <div class="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-8 px-4 py-6 sm:py-10">
        <header class="flex items-center justify-between gap-3">
          <p class="text-xs tracking-[0.22em] text-[var(--muted)] uppercase">DAlina Погода</p>
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
        </header>

        <WeatherForm
          v-model="place"
          :locating="locating"
          :locate-error="locateError"
          @locate="useMyLocation"
        />

        <div v-if="status === 'loading' && !weather" class="flex flex-col gap-4">
          <p class="sr-only">Загружаем прогноз</p>
          <div
            class="h-36 animate-pulse rounded-3xl bg-[var(--glass)] motion-reduce:animate-none"
            aria-hidden="true"
          />
          <div class="grid grid-cols-3 gap-2" aria-hidden="true">
            <div
              v-for="item in 6"
              :key="item"
              class="h-16 animate-pulse rounded-2xl bg-[var(--glass)] motion-reduce:animate-none"
            />
          </div>
          <div
            class="h-44 animate-pulse rounded-3xl bg-[var(--glass)] motion-reduce:animate-none"
            aria-hidden="true"
          />
        </div>

        <div
          v-else-if="status === 'error' && !weather"
          class="rounded-3xl border border-[var(--line)] bg-[var(--glass)] p-5 backdrop-blur-md"
        >
          <p class="text-lg font-medium">Прогноз не загрузился</p>
          <p class="mt-1 text-sm text-[var(--muted)]">{{ errorMessage }}</p>
          <button
            type="button"
            class="mt-4 rounded-full bg-[var(--fill)] px-4 py-2 text-sm font-medium text-[var(--fill-ink)]"
            @click="reload"
          >
            Повторить
          </button>
        </div>

        <template v-else-if="weather && place">
          <WeatherTemperature
            :place="place"
            :current="weather.current"
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
          <p v-if="status === 'error'" class="text-sm">
            {{ errorMessage }}
            <button type="button" class="ml-2 underline underline-offset-2" @click="reload">
              Повторить
            </button>
          </p>
        </template>

        <footer class="mt-auto pt-2 text-xs text-[var(--muted)]">
          Прогноз
          <a
            class="underline underline-offset-2"
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
          >
            Open-Meteo
          </a>
        </footer>
      </div>
    </div>
  </TooltipProvider>
</template>
