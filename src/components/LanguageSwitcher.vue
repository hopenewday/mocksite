<template>
  <select
    class="px-2 py-1 border rounded"
    :value="locale"
    @change="onChange"
  >
    <option value="en">
      EN
    </option>
    <option value="hi">
      HI
    </option>
  </select>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { useI18n } from 'vue-i18n'

const settings = useSettingsStore()
const { locale } = useI18n()
function onChange(e: Event) {
  const v = (e.target as HTMLSelectElement).value
  settings.setLocale(v)
  locale.value = v
}
</script>