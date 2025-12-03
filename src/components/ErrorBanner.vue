<template>
  <div
    class="rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 p-3"
    role="alert"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string }>()
</script>