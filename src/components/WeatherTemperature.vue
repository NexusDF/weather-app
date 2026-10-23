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
      <span v-if="refreshing"> · обновляем</span>
    </p>
  </section>
  <SunPath
    v-if="current.sunrise && current.sunset"
    class="mt-5"
    :sunrise="current.sunrise"
    :sunset="current.sunset"
    :time="current.time"
    :utc-offset-seconds="current.utcOffsetSeconds"
  />
</template>
