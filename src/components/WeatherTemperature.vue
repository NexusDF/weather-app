<script setup>
import SunPath from './SunPath.vue'
import WeatherIcon from './WeatherIcon.vue'
import { describeWeather, formatClock, formatTemp, placeSubtitle } from '@/lib/weather'

const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
  current: {
    type: Object,
    required: true,
  },
  tomorrow: {
    type: Object,
    default: null,
  },
  unit: {
    type: String,
    required: true,
  },
  refreshing: {
    type: Boolean,
    default: false,
  },
})

const subtitle = () => placeSubtitle(props.place)
</script>

<template>
  <section aria-live="polite">
    <h1 class="text-4xl font-semibold tracking-tight">{{ place.name }}</h1>
    <p v-if="subtitle()" class="mt-1 text-sm text-[var(--muted)]">{{ subtitle() }}</p>

    <div class="mt-6 flex items-center gap-4">
      <WeatherIcon :code="current.weatherCode" :is-day="current.isDay" class="size-20 sm:size-24" />
      <div class="min-w-0">
        <p class="text-7xl leading-none font-semibold tracking-tight tabular-nums sm:text-8xl">
          {{ formatTemp(current.temperature, unit) }}
        </p>
        <p class="mt-2 text-lg">{{ describeWeather(current.weatherCode) }}</p>
      </div>
    </div>

    <p class="mt-4 text-sm text-[var(--muted)]">
      Ощущается как {{ formatTemp(current.apparentTemperature, unit) }}
      <span v-if="formatClock(current.time)"> · обновлено в {{ formatClock(current.time) }}</span>
      <Transition name="swap">
        <span v-if="refreshing"> · обновляем</span>
      </Transition>
    </p>

    <div
      v-if="tomorrow"
      class="mt-5 flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--glass)] px-3.5 py-3 backdrop-blur-md"
    >
      <WeatherIcon :code="tomorrow.weatherCode" :is-day="true" class="size-9" />
      <div class="min-w-0 flex-1">
        <p class="text-xs tracking-[0.16em] text-[var(--muted)] uppercase">Завтра</p>
        <p class="mt-0.5 text-sm leading-snug">
          {{ describeWeather(tomorrow.weatherCode) }}
          <span v-if="tomorrow.precipitationProbability > 0" class="text-[var(--muted)]">
            · {{ Math.round(tomorrow.precipitationProbability) }}%
          </span>
        </p>
      </div>
      <p class="shrink-0 text-right leading-tight tabular-nums">
        <span class="block text-lg font-medium">
          <span class="sr-only">Днём </span>{{ formatTemp(tomorrow.temperatureMax, unit) }}
        </span>
        <span class="mt-0.5 block text-sm text-[var(--muted)]">
          <span class="sr-only">Ночью </span>{{ formatTemp(tomorrow.temperatureMin, unit) }}
        </span>
      </p>
    </div>
    <SunPath
      v-if="current.sunrise && current.sunset"
      class="mt-5"
      :sunrise="current.sunrise"
      :sunset="current.sunset"
      :time="current.time"
      :utc-offset-seconds="current.utcOffsetSeconds"
    />
  </section>
</template>
