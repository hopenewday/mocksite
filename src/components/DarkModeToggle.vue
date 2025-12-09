<template>
  <button
    class="px-4 py-2 border-4 border-black dark:border-brutal-white bg-brutal-yellow dark:bg-brutal-black text-black dark:text-brutal-white font-black rounded-brutal shadow-brutal hover:shadow-brutal-lg transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 active:shadow-brutal"
    :title="dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    @click="toggle"
  >
    <span
      v-if="dark"
      class="text-lg"
    >☀️</span>
    <span
      v-else
      class="text-lg"
    >🌙</span>
  </button>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { computed } from 'vue'
const settings = useSettingsStore()
const dark = computed(() => settings.darkMode)
function toggle() { settings.toggleDark() }
</script>