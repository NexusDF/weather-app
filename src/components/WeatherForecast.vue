<script setup>
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import WeatherIcon from './WeatherIcon.vue'
import { formatClock, formatTemp } from '@/lib/weather'

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

function dayNumber(iso) {
  return Number(iso.slice(8, 10))
}

function weekdayShort(iso) {
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

      <TabsContent value="daily" class="pt-4 outline-none">
        <ol class="grid grid-cols-7">
          <li
            v-for="(day, index) in daily"
            :key="day.time"
            class="flex min-w-0 flex-col items-center gap-1.5"
          >
            <span class="text-[11px] leading-none text-[var(--muted)]">{{
              weekdayShort(day.time)
            }}</span>
            <span
              class="flex size-7 items-center justify-center rounded-full text-sm leading-none font-medium tabular-nums"
              :class="index === 0 ? 'bg-[var(--fill)] text-[var(--fill-ink)]' : ''"
            >
              {{ dayNumber(day.time) }}
            </span>
            <WeatherIcon :code="day.weatherCode" :is-day="true" class="size-6" />
            <span class="text-sm leading-none font-medium tabular-nums">
              <span class="sr-only">Днём </span>{{ formatTemp(day.temperatureMax, unit) }}
            </span>
            <span class="text-xs leading-none tabular-nums text-[var(--muted)]">
              <span class="sr-only">Ночью </span>{{ formatTemp(day.temperatureMin, unit) }}
            </span>
          </li>
        </ol>
      </TabsContent>
    </TabsRoot>
  </section>
</template>
