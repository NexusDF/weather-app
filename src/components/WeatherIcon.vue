<script setup>
import { computed } from 'vue'
import { weatherKind } from '@/lib/weather'

const props = defineProps({
  code: {
    type: Number,
    required: true,
  },
  isDay: {
    type: Boolean,
    default: true,
  },
})

const icon = computed(() => {
  const kind = weatherKind(props.code)
  if (kind === 'clear') return props.isDay ? 'sun' : 'moon'
  if (kind === 'partly') return props.isDay ? 'partly-day' : 'partly-night'
  return kind
})
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    class="block shrink-0"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="icon === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.2 5.2l1.5 1.5M17.3 17.3l1.5 1.5M18.8 5.2l-1.5 1.5M6.7 17.3l-1.5 1.5"
      />
    </template>

    <template v-else-if="icon === 'moon'">
      <path d="M15.6 3.2a7.1 7.1 0 1 0 5.1 11.9A5.7 5.7 0 0 1 15.6 3.2z" />
    </template>

    <template v-else-if="icon === 'partly-day'">
      <circle cx="16.6" cy="6.6" r="2.2" />
      <path d="M16.6 2.4v1.2M20.4 6.6h1.2M19.4 3.8l.8-.8" />
      <path d="M6.4 18.2h8.6a3 3 0 0 0 .4-6 4.2 4.2 0 0 0-8-1.1 2.9 2.9 0 0 0-1 7.1z" />
    </template>

    <template v-else-if="icon === 'partly-night'">
      <path d="M16.2 2.8a3.3 3.3 0 1 0 2.3 5.7 2.7 2.7 0 0 1-2.3-5.7z" />
      <path d="M6.4 18.2h8.6a3 3 0 0 0 .4-6 4.2 4.2 0 0 0-8-1.1 2.9 2.9 0 0 0-1 7.1z" />
    </template>

    <template v-else-if="icon === 'fog'">
      <path d="M7 11.2h8.4a2.7 2.7 0 0 0 .4-5.4 3.8 3.8 0 0 0-7.3-1 2.7 2.7 0 0 0-1.5 6.4z" />
      <path d="M4 15h16M6.5 18.4h11" />
    </template>

    <template v-else-if="icon === 'rain'">
      <path d="M6.6 13.4h9.2a3.2 3.2 0 0 0 .4-6.4 4.5 4.5 0 0 0-8.6-1.2 3.1 3.1 0 0 0-1 7.6z" />
      <path d="M8 16.2 7.1 18.6M12 16.2l-.9 2.4M16 16.2l-.9 2.4" />
    </template>

    <template v-else-if="icon === 'snow'">
      <path d="M6.6 13.2h9.2a3.2 3.2 0 0 0 .4-6.4 4.5 4.5 0 0 0-8.6-1.2 3.1 3.1 0 0 0-1 7.6z" />
      <g fill="currentColor" stroke="none">
        <circle cx="8" cy="17.4" r="1" />
        <circle cx="12" cy="19" r="1" />
        <circle cx="16" cy="17.4" r="1" />
      </g>
    </template>

    <template v-else-if="icon === 'thunder'">
      <path d="M6.6 12.6h9.2a3.2 3.2 0 0 0 .4-6.4 4.5 4.5 0 0 0-8.6-1.2 3.1 3.1 0 0 0-1 7.6z" />
      <path
        d="M12.3 11.6 10 15.6h2.1l-.9 3.3 3.4-4.4h-2.1l.8-2.9z"
        fill="currentColor"
        stroke="none"
      />
    </template>

    <path
      v-else
      d="M6.2 17.6h10.4a3.8 3.8 0 0 0 .5-7.5 5.2 5.2 0 0 0-10-1.4 3.7 3.7 0 0 0-.9 8.9z"
    />
  </svg>
</template>
