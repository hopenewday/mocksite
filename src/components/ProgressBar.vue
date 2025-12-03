<template>
  <div class="h-2 bg-neutral-200 dark:bg-neutral-800 rounded">
    <div
      class="h-2 bg-brand rounded transition-all"
      :style="{ width: percent + '%' }"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ percent: number }>()
</script>
