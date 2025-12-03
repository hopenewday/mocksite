<template>
  <button
    class="px-2 py-1 border rounded"
    @click="toggle"
  >
    <span v-if="dark">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { computed } from 'vue'
const settings = useSettingsStore()
const dark = computed(() => settings.darkMode)
function toggle() { settings.toggleDark() }
</script>