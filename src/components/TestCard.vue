<template>
  <div class="card p-5">
    <div class="font-semibold mb-2">
      {{ title }}
    </div>
    <div class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
      30 questions • 30 mins
    </div>
    <router-link
      :to="'/test/' + title"
      class="btn-primary"
    >
      Start
    </router-link>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
