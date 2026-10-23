<script setup>
import { Icon } from '@iconify/vue/offline'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from 'reka-ui'

const ICONS = {
  humidity: 'lucide:droplets',
  wind: 'lucide:wind',
  pressure: 'lucide:gauge',
  cloud: 'lucide:cloud',
  precipitation: 'lucide:cloud-rain',
  uv: 'lucide:sun',
}

defineProps({
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <TooltipRoot>
    <TooltipTrigger
      type="button"
      class="flex cursor-help flex-col gap-1 rounded-2xl border border-[var(--line)] bg-[var(--glass)] px-3 py-3 text-left backdrop-blur-md"
    >
      <span class="flex items-center gap-1.5 text-xs text-[var(--muted)]">
        <Icon :icon="ICONS[icon]" class="block size-4 shrink-0" />
        {{ label }}
      </span>
      <span class="text-base font-medium tabular-nums">{{ value }}</span>
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent
        side="top"
        :side-offset="8"
        class="z-50 max-w-56 rounded-xl bg-slate-900 px-3 py-2 text-xs leading-relaxed text-white shadow-lg"
      >
        {{ hint }}
        <TooltipArrow class="fill-slate-900" :width="12" :height="6" />
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
