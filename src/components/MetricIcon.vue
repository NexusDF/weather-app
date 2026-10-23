<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
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
    <path
      v-if="name === 'humidity'"
      d="M12 3c.6 2.6 5 6.2 5 10a5 5 0 0 1-10 0c0-3.8 4.4-7.4 5-10z"
    />

    <template v-else-if="name === 'wind'">
      <path d="M3.5 8.2h10.6a2.3 2.3 0 1 0-1.7-3.9" />
      <path d="M3.5 12h13.4a2.3 2.3 0 1 1-1.7 3.9" />
      <path d="M3.5 15.8h6.2" />
    </template>

    <template v-else-if="name === 'pressure'">
      <path d="M4.8 16.6a7.6 7.6 0 1 1 14.4 0" />
      <path d="M12 16.2 15.4 10.2" />
      <circle cx="12" cy="16.2" r="1.05" fill="currentColor" stroke="none" />
    </template>

    <path
      v-else-if="name === 'cloud'"
      d="M7 17.4h9.2a3.4 3.4 0 0 0 .4-6.8 4.6 4.6 0 0 0-8.8-1.2A3.2 3.2 0 0 0 7 17.4z"
    />

    <template v-else-if="name === 'precipitation'">
      <path d="M6.8 12.6h9.4a3.2 3.2 0 0 0 .3-6.4 4.4 4.4 0 0 0-8.5-1.1 3.1 3.1 0 0 0-1.2 7.5z" />
      <path d="M8.2 15.2 7.3 17.6M12 15.2l-.9 2.4M15.8 15.2l-.9 2.4" />
    </template>

    <template v-else-if="name === 'uv'">
      <circle cx="12" cy="12" r="3.6" />
      <path
        d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5l1.5 1.5M17 17l1.5 1.5M18.5 5.5 17 7M7 17l-1.5 1.5"
      />
    </template>
  </svg>
</template>
