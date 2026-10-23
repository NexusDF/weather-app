<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
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
import { Icon } from '@iconify/vue/offline'
import { useCitySearch } from '@/lib/queries'
import { placeLabel, placeSubtitle } from '@/lib/weather'

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
const submittedTerm = ref('')
const waiting = ref(false)
const selectedCity = ref(props.modelValue)
const cityQuery = useCitySearch(submittedTerm)

let timer = 0

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

const cities = computed(() => {
  if (waiting.value || submittedTerm.value.length < 2) return []
  return cityQuery.data.value ?? []
})

const searching = computed(() => {
  if (!canSearch(query.value)) return false
  if (waiting.value || submittedTerm.value !== query.value.trim()) return true
  return cityQuery.isFetching.value || cityQuery.isPending.value
})

const searchError = computed(() => {
  if (waiting.value || submittedTerm.value !== query.value.trim()) return ''
  if (!cityQuery.isError.value || cityQuery.isFetching.value) return ''
  return 'Не удалось выполнить поиск'
})

function canSearch(value) {
  const term = value.trim()
  const label = selectedCity.value ? placeLabel(selectedCity.value) : ''
  return term.length >= 2 && term !== label
}

function selectInputText(event) {
  const input = event.target
  if (!(input instanceof HTMLInputElement)) return
  input.select()
}

watch(query, (value) => {
  window.clearTimeout(timer)
  const term = value.trim()
  if (!canSearch(value)) {
    waiting.value = false
    submittedTerm.value = ''
    open.value = false
    return
  }

  waiting.value = true
  submittedTerm.value = ''
  open.value = true
  timer = window.setTimeout(() => {
    submittedTerm.value = term
    waiting.value = false
  }, 280)
})

onUnmounted(() => {
  window.clearTimeout(timer)
})
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
          class="relative flex items-center gap-2 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--glass)] px-3 shadow-sm backdrop-blur-md transition-[box-shadow,background-color] duration-200 focus-within:ring-2 focus-within:ring-[var(--ink)]/30"
        >
          <Icon
            icon="lucide:search"
            class="size-5 shrink-0 text-[var(--muted)]"
            :class="{ 'search-glyph': searching }"
          />
          <ComboboxInput
            id="city-search"
            v-model="query"
            :display-value="displayValue"
            placeholder="Найти город"
            spellcheck="false"
            class="h-12 w-full bg-transparent text-base text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
            @focus="selectInputText"
            @click="selectInputText"
          />
          <span v-if="searching" class="search-line" aria-hidden="true" />
        </ComboboxAnchor>

        <ComboboxPortal>
          <ComboboxContent
            position="popper"
            align="start"
            :side-offset="8"
            class="menu-pop z-50 max-h-80 w-(--reka-combobox-trigger-width) overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl"
          >
            <ComboboxViewport class="menu-pop-body max-h-80 overflow-y-auto p-1">
              <Transition name="swap" mode="out-in">
                <p
                  v-if="searching && !cities.length"
                  key="searching"
                  class="flex items-center px-3 py-3 text-sm text-slate-500"
                >
                  Ищем города
                  <span class="search-dots" aria-hidden="true"><span /><span /><span /></span>
                </p>
                <p v-else-if="searchError" key="error" class="px-3 py-3 text-sm text-slate-500">
                  {{ searchError }}
                </p>
                <div v-else :key="submittedTerm || 'results'">
                  <ComboboxEmpty class="px-3 py-6 text-center text-sm text-slate-500">
                    Такого города нет
                  </ComboboxEmpty>
                  <ComboboxItem
                    v-for="(city, index) in cities"
                    :key="city.id"
                    :value="city"
                    :text-value="placeLabel(city)"
                    class="search-item flex cursor-pointer flex-col rounded-xl px-3 py-2 outline-none transition-colors duration-150 data-[highlighted]:bg-sky-50"
                    :style="{ '--i': index }"
                  >
                    <span class="truncate font-medium">{{ city.name }}</span>
                    <span class="truncate text-sm text-slate-500">{{
                      placeSubtitle(city) || city.country
                    }}</span>
                  </ComboboxItem>
                </div>
              </Transition>
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
        <Icon v-if="locating" icon="lucide:loader-circle" class="size-5 motion-safe:animate-spin" />
        <Icon v-else icon="lucide:locate" class="size-5" />
      </button>
    </div>
    <Transition name="swap">
      <p v-if="locateError" class="text-sm">{{ locateError }}</p>
    </Transition>
  </div>
</template>
