<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Icon } from '@iconify/vue/offline'
import { formatClock } from '@/lib/weather'

const WIDTH = 320
const Y = 16
const PAD_X = 18
const DAY_MINUTES = 24 * 60
const HOURS = Array.from({ length: 25 }, (_, hour) => hour)
const HOUR_LABELS = [0, 6, 12, 18, 24]

const props = defineProps({
  sunrise: {
    type: String,
    required: true,
  },
  sunset: {
    type: String,
    required: true,
  },
  utcOffsetSeconds: {
    type: Number,
    default: undefined,
  },
  time: {
    type: String,
    default: '',
  },
})

const nowMs = ref(Date.now())
let timer = 0

onMounted(() => {
  timer = window.setInterval(() => {
    nowMs.value = Date.now()
  }, 60_000)
})

onUnmounted(() => {
  window.clearInterval(timer)
})

function locationNow() {
  if (typeof props.utcOffsetSeconds !== 'number') return naiveStamp(props.time)
  const shifted = new Date(nowMs.value + props.utcOffsetSeconds * 1000)
  return Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
    shifted.getUTCHours(),
    shifted.getUTCMinutes(),
  )
}

function naiveStamp(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso ?? '')
  if (!match) return null
  return Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4], +match[5])
}

function minutesOfDay(stamp) {
  if (stamp == null) return null
  const date = new Date(stamp)
  return date.getUTCHours() * 60 + date.getUTCMinutes()
}

function xAt(minutes) {
  const ratio = Math.min(DAY_MINUTES, Math.max(0, minutes)) / DAY_MINUTES
  return PAD_X + ratio * (WIDTH - PAD_X * 2)
}

function leftOf(minutes) {
  return `${(xAt(minutes) / WIDTH) * 100}%`
}

const sunriseMinutes = computed(() => minutesOfDay(naiveStamp(props.sunrise)))
const sunsetMinutes = computed(() => minutesOfDay(naiveStamp(props.sunset)))
const nowMinutes = computed(() => minutesOfDay(locationNow()) ?? 0)

const sunVisible = computed(() => {
  const start = sunriseMinutes.value
  const end = sunsetMinutes.value
  if (start == null || end == null) return false
  return nowMinutes.value >= start && nowMinutes.value <= end
})
const sunX = computed(() => xAt(nowMinutes.value))
const track = `M ${PAD_X} ${Y} H ${WIDTH - PAD_X}`
const daylight = computed(() => {
  const start = sunriseMinutes.value
  const end = sunsetMinutes.value
  if (start == null || end == null || end <= start) return ''
  return `M ${xAt(start)} ${Y} H ${xAt(end)}`
})

const sunriseLabel = computed(() => formatClock(props.sunrise))
const sunsetLabel = computed(() => formatClock(props.sunset))

function hourLabel(hour) {
  return `${String(hour).padStart(2, '0')}:00`
}
</script>

<template>
  <figure
    class="rounded-3xl border border-[var(--line)] bg-[var(--glass)] px-4 pt-3 pb-3 backdrop-blur-md"
  >
    <figcaption>
      <div class="relative h-5">
        <p
          v-if="sunriseMinutes != null"
          class="absolute bottom-0 flex -translate-x-1/2 items-center gap-1 text-xs whitespace-nowrap"
          :style="{ left: leftOf(sunriseMinutes) }"
        >
          <Icon icon="lucide:sunrise" class="size-3.5 text-[var(--muted)]" />
          <span class="text-[var(--muted)]">Восход</span>
          <span class="font-medium tabular-nums">{{ sunriseLabel }}</span>
        </p>
        <p
          v-if="sunsetMinutes != null"
          class="absolute bottom-0 flex -translate-x-1/2 items-center gap-1 text-xs whitespace-nowrap"
          :style="{ left: leftOf(sunsetMinutes) }"
        >
          <Icon icon="lucide:sunset" class="size-3.5 text-[var(--muted)]" />
          <span class="text-[var(--muted)]">Закат</span>
          <span class="font-medium tabular-nums">{{ sunsetLabel }}</span>
        </p>
      </div>
      <svg class="mt-1 block w-full" :viewBox="`0 0 ${WIDTH} 30`" fill="none" aria-hidden="true">
        <path
          :d="track"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          opacity="0.22"
        />
        <path
          v-if="daylight"
          :d="daylight"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        />
        <line
          v-for="hour in HOURS"
          :key="hour"
          :x1="xAt(hour * 60)"
          :x2="xAt(hour * 60)"
          :y1="hour % 6 === 0 ? 3 : 8"
          :y2="Y - 3"
          stroke="currentColor"
          stroke-width="1.25"
          stroke-linecap="round"
          :opacity="hour % 6 === 0 ? 0.55 : 0.28"
        />
        <template v-if="sunVisible">
          <circle :cx="sunX" :cy="Y" r="12" fill="#ffd60a" opacity="0.28" />
          <circle :cx="sunX" :cy="Y" r="6.5" fill="#ffd60a" />
        </template>
      </svg>
      <div class="relative mt-1 h-4 text-[11px] text-[var(--muted)] tabular-nums">
        <span
          v-for="hour in HOUR_LABELS"
          :key="hour"
          class="absolute -translate-x-1/2"
          :style="{ left: leftOf(hour * 60) }"
        >
          {{ hourLabel(hour) }}
        </span>
      </div>
    </figcaption>
  </figure>
</template>
