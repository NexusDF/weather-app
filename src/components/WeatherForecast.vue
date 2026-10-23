<script setup>
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
  ProgressIndicator,
  ProgressRoot,
} from 'reka-ui'
import WeatherIcon from './WeatherIcon.vue'
import {
  describeWeather,
  formatClock,
  formatDayLabel,
  formatDayMonth,
  formatTemp,
} from '@/lib/weather'

defineProps({
  hourly: {
    type: Array,
    required: true,
  },
  daily: {
    type: Array,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  currentTime: {
    type: String,
    default: '',
  },
})

function hourLabel(time, index, currentTime) {
  if (index === 0 && currentTime && time.slice(0, 13) === currentTime.slice(0, 13)) return 'Сейчас'
  return formatClock(time)
}

function precipLabel(value) {
  return `Вероятность осадков ${Math.round(value ?? 0)} процентов`
}
</script>

<template>
  <section
    class="rounded-3xl border border-[var(--line)] bg-[var(--glass)] p-3 backdrop-blur-md sm:p-4"
  >
    <h2 class="sr-only">Прогноз</h2>
    <TabsRoot default-value="hourly">
      <TabsList
        class="relative grid grid-cols-2 rounded-full bg-black/10 p-1"
        aria-label="Период прогноза"
      >
        <TabsIndicator
          class="pointer-events-none absolute top-1 left-0 z-0 h-(--reka-tabs-indicator-thickness) w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) rounded-full bg-[var(--pill)] transition-all duration-300"
        />
        <TabsTrigger
          value="hourly"
          class="relative z-10 rounded-full px-3 py-2 text-sm text-[var(--muted)] data-[state=active]:text-[var(--ink)]"
        >
          По часам
        </TabsTrigger>
        <TabsTrigger
          value="daily"
          class="relative z-10 rounded-full px-3 py-2 text-sm text-[var(--muted)] data-[state=active]:text-[var(--ink)]"
        >
          7 дней
        </TabsTrigger>
      </TabsList>

      <TabsContent value="hourly" class="pt-4 outline-none">
        <div
          class="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <article
            v-for="(hour, index) in hourly"
            :key="hour.time"
            class="flex w-16 shrink-0 snap-start flex-col items-center gap-1 px-1 py-1"
          >
            <span class="text-xs text-[var(--muted)]">{{
              hourLabel(hour.time, index, currentTime)
            }}</span>
            <WeatherIcon :code="hour.weatherCode" :is-day="hour.isDay" class="size-6" />
            <span class="text-sm font-medium tabular-nums">{{
              formatTemp(hour.temperature, unit)
            }}</span>
            <span class="h-4 text-xs text-[var(--muted)]">
              {{
                hour.precipitationProbability > 0
                  ? `${Math.round(hour.precipitationProbability)}%`
                  : ''
              }}
            </span>
          </article>
        </div>
      </TabsContent>

      <TabsContent value="daily" class="pt-2 outline-none">
        <ol>
          <li
            v-for="(day, index) in daily"
            :key="day.time"
            class="grid grid-cols-[4.6rem_1.75rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-[var(--line)] py-3 last:border-b-0"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium">{{ formatDayLabel(day.time, index) }}</p>
              <p class="text-xs text-[var(--muted)]">{{ formatDayMonth(day.time) }}</p>
            </div>
            <WeatherIcon :code="day.weatherCode" :is-day="true" class="size-7" />
            <div class="min-w-0">
              <p class="truncate text-xs text-[var(--muted)]">
                {{ describeWeather(day.weatherCode) }}
              </p>
              <div class="mt-1.5 flex items-center gap-2">
                <ProgressRoot
                  class="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--pill)]"
                  :model-value="Math.max(0, Math.min(100, day.precipitationProbability || 0))"
                  :get-value-label="precipLabel"
                >
                  <ProgressIndicator
                    class="h-full rounded-full bg-[var(--ink)]"
                    :style="{
                      width: `${Math.max(0, Math.min(100, day.precipitationProbability || 0))}%`,
                    }"
                  />
                </ProgressRoot>
                <span class="w-8 shrink-0 text-right text-xs tabular-nums text-[var(--muted)]">
                  {{ Math.round(day.precipitationProbability || 0) }}%
                </span>
              </div>
            </div>
            <p
              class="flex items-baseline justify-end gap-1.5 text-sm whitespace-nowrap tabular-nums"
            >
              <span class="text-[var(--muted)]">{{ formatTemp(day.temperatureMin, unit) }}</span>
              <span class="font-medium">{{ formatTemp(day.temperatureMax, unit) }}</span>
            </p>
          </li>
        </ol>
      </TabsContent>
    </TabsRoot>
  </section>
</template>
