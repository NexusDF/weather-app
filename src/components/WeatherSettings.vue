<script setup>
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
import { REFRESH_OPTIONS } from '@/lib/refresh'

const refresh = defineModel({ type: String, required: true })
</script>

<template>
  <DialogRoot>
    <TooltipRoot>
      <TooltipTrigger as-child>
        <DialogTrigger
          class="grid size-9 place-items-center rounded-full border border-[var(--line)] bg-[var(--glass)] text-[var(--ink)] backdrop-blur-md transition hover:bg-[var(--pill)]"
          aria-label="Настройки"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            />
          </svg>
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
      <DialogOverlay class="fixed inset-0 z-[60] bg-slate-950/45 backdrop-blur-sm" />
      <DialogContent
        class="fixed top-1/2 left-1/2 z-[60] w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl outline-none"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <DialogTitle class="text-lg font-medium">Обновление</DialogTitle>
            <DialogDescription class="mt-1 text-sm text-slate-500">
              Как часто запрашивать свежий прогноз, пока вы на этой вкладке.
            </DialogDescription>
          </div>
          <DialogClose
            class="grid size-8 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Закрыть"
          >
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </DialogClose>
        </div>

        <RadioGroupRoot
          v-model="refresh"
          class="mt-4 flex flex-col gap-2"
          orientation="vertical"
          aria-label="Частота обновления"
        >
          <RadioGroupItem
            v-for="option in REFRESH_OPTIONS"
            :key="option.value"
            :value="option.value"
            class="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-sky-700/40 data-[state=checked]:border-sky-700 data-[state=checked]:bg-sky-50"
          >
            <span
              class="grid size-4 shrink-0 place-items-center rounded-full border border-slate-300"
              aria-hidden="true"
            >
              <RadioGroupIndicator class="size-2 rounded-full bg-sky-700" />
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
