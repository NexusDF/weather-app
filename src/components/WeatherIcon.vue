<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue/offline'
import { weatherKind } from '@/lib/weather'

const ICONS = {
  'clear-day': 'lucide:sun',
  'clear-night': 'lucide:moon',
  'partly-day': 'lucide:cloud-sun',
  'partly-night': 'lucide:cloud-moon',
  fog: 'lucide:cloud-fog',
  rain: 'lucide:cloud-rain',
  snow: 'lucide:cloud-snow',
  thunder: 'lucide:cloud-lightning',
  cloudy: 'lucide:cloud',
}

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
  if (kind === 'clear' || kind === 'partly') {
    return ICONS[`${kind}-${props.isDay ? 'day' : 'night'}`]
  }
  return ICONS[kind] ?? ICONS.cloudy
})
</script>

<template>
  <Icon :icon="icon" class="block shrink-0" />
</template>
