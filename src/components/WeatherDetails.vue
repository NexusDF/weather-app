<script setup>
import { computed } from 'vue'
import WeatherMetric from './WeatherMetric.vue'
import { formatMm, formatPercent, formatPressure, formatUv, formatWind } from '@/lib/weather'

const props = defineProps({
  current: {
    type: Object,
    required: true,
  },
})

const items = computed(() => [
  {
    icon: 'humidity',
    label: 'Влажность',
    value: formatPercent(props.current.humidity),
    hint: 'Сколько водяного пара в воздухе относительно максимума при этой температуре.',
  },
  {
    icon: 'wind',
    label: 'Ветер',
    value: formatWind(props.current.windSpeed, props.current.windDirection),
    hint: 'Скорость на высоте 10 метров и сторона, откуда дует ветер.',
  },
  {
    icon: 'pressure',
    label: 'Давление',
    value: formatPressure(props.current.pressure),
    hint: 'Атмосферное давление, приведённое к уровню моря.',
  },
  {
    icon: 'cloud',
    label: 'Облачность',
    value: formatPercent(props.current.cloudCover),
    hint: 'Какая часть неба закрыта облаками.',
  },
  {
    icon: 'precipitation',
    label: 'Осадки',
    value: formatMm(props.current.precipitation),
    hint: 'Сколько миллиметров выпало за предыдущий час.',
  },
  {
    icon: 'uv',
    label: 'УФ-индекс',
    value: formatUv(props.current.uvIndex),
    hint: 'Максимум за сегодня. От 3 уже стоит беречься солнца.',
  },
])
</script>

<template>
  <section>
    <h2 class="sr-only">Подробности</h2>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
      <WeatherMetric
        v-for="item in items"
        :key="item.label"
        :icon="item.icon"
        :label="item.label"
        :value="item.value"
        :hint="item.hint"
      />
    </div>
  </section>
</template>
