<script setup>
import { ref } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupRoot,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'
import { Icon } from '@iconify/vue/offline'
import { REFRESH_OPTIONS } from '@/lib/refresh'

const UNIT_OPTIONS = [
  { value: 'celsius', label: 'Цельсий', detail: '°C' },
  { value: 'fahrenheit', label: 'Фаренгейт', detail: '°F' },
]

const refresh = defineModel({ type: String, required: true })
const unit = defineModel('unit', { type: String, required: true })
const open = ref(false)
</script>

<template>
  <DialogRoot v-model:open="open">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <DialogTrigger
          class="grid size-9 place-items-center rounded-full border border-[var(--line)] bg-[var(--glass)] text-[var(--ink)] backdrop-blur-md transition hover:bg-[var(--pill)]"
          aria-label="Настройки"
        >
          <Icon
            icon="lucide:settings"
            class="size-5 transition duration-500 ease-out"
            :class="open ? 'rotate-90' : 'rotate-0'"
          />
        </DialogTrigger>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          side="bottom"
          :side-offset="8"
          class="z-[70] rounded-xl bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
        >
          Настройки
          <TooltipArrow class="fill-slate-900" :width="12" :height="6" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>

    <DialogPortal>
      <DialogOverlay class="dialog-overlay fixed inset-0 z-[60] bg-slate-950/45 backdrop-blur-sm" />
      <DialogContent
        class="dialog-panel fixed top-1/2 left-1/2 z-[60] max-h-[calc(100dvh-2rem)] w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl outline-none"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <DialogTitle class="text-lg font-medium">Настройки</DialogTitle>
            <DialogDescription class="mt-1 text-sm text-slate-500">
              Единицы температуры и частота обновления прогноза.
            </DialogDescription>
          </div>
          <DialogClose
            class="grid size-8 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Закрыть"
          >
            <Icon icon="lucide:x" class="size-4" />
          </DialogClose>
        </div>

        <p class="mt-5 text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
          Температура
        </p>
        <RadioGroupRoot
          v-model="unit"
          class="mt-2 flex flex-col gap-2"
          orientation="vertical"
          aria-label="Единица температуры"
        >
          <RadioGroupItem
            v-for="option in UNIT_OPTIONS"
            :key="option.value"
            :value="option.value"
            class="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-3 text-left outline-none transition-[border-color,background-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-sky-700/40 data-[state=checked]:border-sky-700 data-[state=checked]:bg-sky-50"
          >
            <span
              class="grid size-4 shrink-0 place-items-center rounded-full border border-slate-300"
              aria-hidden="true"
            >
              <RadioGroupIndicator class="choice-dot size-2 rounded-full bg-sky-700" />
            </span>
            <span class="min-w-0">
              <span class="block text-sm font-medium">{{ option.label }}</span>
              <span class="mt-0.5 block text-xs text-slate-500">{{ option.detail }}</span>
            </span>
          </RadioGroupItem>
        </RadioGroupRoot>

        <p class="mt-5 text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
          Обновление
        </p>
        <p class="mt-1 text-sm text-slate-500">
          Как часто запрашивать свежий прогноз, пока вы на этой вкладке.
        </p>
        <RadioGroupRoot
          v-model="refresh"
          class="mt-2 flex flex-col gap-2"
          orientation="vertical"
          aria-label="Частота обновления"
        >
          <RadioGroupItem
            v-for="option in REFRESH_OPTIONS"
            :key="option.value"
            :value="option.value"
            class="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-3 text-left outline-none transition-[border-color,background-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-sky-700/40 data-[state=checked]:border-sky-700 data-[state=checked]:bg-sky-50"
          >
            <span
              class="grid size-4 shrink-0 place-items-center rounded-full border border-slate-300"
              aria-hidden="true"
            >
              <RadioGroupIndicator class="choice-dot size-2 rounded-full bg-sky-700" />
            </span>
            <span class="min-w-0">
              <span class="block text-sm font-medium">{{ option.label }}</span>
              <span v-if="option.detail" class="mt-0.5 block text-xs text-slate-500">
                {{ option.detail }}
              </span>
            </span>
          </RadioGroupItem>
        </RadioGroupRoot>

        <DialogClose
          class="mt-4 w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
        >
          Готово
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
