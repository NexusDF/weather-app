<script setup>
import { computed, ref, watch } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport,
} from 'reka-ui'
import { placeLabel, placeSubtitle, searchCities } from '@/lib/weather'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  locating: {
    type: Boolean,
    default: false,
  },
  locateError: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'locate'])

const open = ref(false)
const query = ref('')
const cities = ref([])
const searching = ref(false)
const searchError = ref('')
const selectedCity = ref(props.modelValue)

let timer = 0
let controller
let activeTerm = ''

watch(
  () => props.modelValue,
  (value) => {
    selectedCity.value = value
  },
  { immediate: true, flush: 'sync' },
)

const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) return
    selectedCity.value = value
    open.value = false
    emit('update:modelValue', value)
  },
})

function displayValue(value) {
  if (!value || typeof value !== 'object') return ''
  return placeLabel(value)
}

function cancelSearch() {
  window.clearTimeout(timer)
  controller?.abort()
  activeTerm = ''
  searching.value = false
  searchError.value = ''
  cities.value = []
}

watch(query, (value) => {
  const term = value.trim()
  const label = selectedCity.value ? placeLabel(selectedCity.value) : ''
  window.clearTimeout(timer)
  controller?.abort()

  if (!term || term.length < 2 || term === label) {
    cancelSearch()
    open.value = false
    return
  }

  cities.value = []
  searchError.value = ''
  searching.value = true
  open.value = true
  timer = window.setTimeout(() => {
    search(term)
  }, 280)
})

async function search(term) {
  const current = new AbortController()
  controller = current
  activeTerm = term
  searching.value = true
  try {
    const results = await searchCities(term, current.signal)
    if (activeTerm !== term) return
    cities.value = results
    searching.value = false
  } catch (error) {
    if (error?.name === 'AbortError' || activeTerm !== term) return
    cities.value = []
    searchError.value = 'Не удалось выполнить поиск'
    searching.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <ComboboxRoot
        v-model="selected"
        v-model:open="open"
        by="id"
        class="min-w-0 flex-1"
        :ignore-filter="true"
        :highlight-on-hover="true"
        :open-on-click="false"
        :open-on-focus="false"
      >
        <ComboboxLabel for="city-search" class="sr-only">Город</ComboboxLabel>
        <ComboboxAnchor
          class="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--glass)] px-3 shadow-sm backdrop-blur-md focus-within:ring-2 focus-within:ring-[var(--ink)]/30"
        >
          <svg
            class="size-5 shrink-0 text-[var(--muted)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16.5 4.5 4.5" />
          </svg>
          <ComboboxInput
            id="city-search"
            v-model="query"
            :display-value="displayValue"
            placeholder="Найти город"
            spellcheck="false"
            class="h-12 w-full bg-transparent text-base text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
          />
        </ComboboxAnchor>

        <ComboboxPortal>
          <ComboboxContent
            position="popper"
            align="start"
            :side-offset="8"
            class="z-50 max-h-80 w-(--reka-combobox-trigger-width) overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl"
          >
            <ComboboxViewport class="max-h-80 overflow-y-auto p-1">
              <p v-if="searching && !cities.length" class="px-3 py-3 text-sm text-slate-500">
                Ищем города…
              </p>
              <p v-else-if="searchError" class="px-3 py-3 text-sm text-slate-500">
                {{ searchError }}
              </p>
              <template v-else>
                <ComboboxEmpty class="px-3 py-6 text-center text-sm text-slate-500">
                  Такого города нет
                </ComboboxEmpty>
                <ComboboxItem
                  v-for="city in cities"
                  :key="city.id"
                  :value="city"
                  :text-value="placeLabel(city)"
                  class="flex cursor-pointer flex-col rounded-xl px-3 py-2 outline-none data-[highlighted]:bg-sky-50"
                >
                  <span class="truncate font-medium">{{ city.name }}</span>
                  <span class="truncate text-sm text-slate-500">{{
                    placeSubtitle(city) || city.country
                  }}</span>
                </ComboboxItem>
              </template>
            </ComboboxViewport>
          </ComboboxContent>
        </ComboboxPortal>
      </ComboboxRoot>

      <button
        type="button"
        class="grid size-12 shrink-0 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--glass)] text-[var(--ink)] backdrop-blur-md transition hover:bg-[var(--pill)] disabled:opacity-60"
        :disabled="locating"
        aria-label="Погода рядом со мной"
        @click="emit('locate')"
      >
        <svg
          v-if="locating"
          class="size-5 motion-safe:animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" opacity="0.3" />
          <path
            d="M12 4a8 8 0 0 1 8 8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <svg
          v-else
          class="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3.25" />
          <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2" />
        </svg>
      </button>
    </div>
    <p v-if="locateError" class="text-sm">{{ locateError }}</p>
  </div>
</template>
