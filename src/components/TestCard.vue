<template>
  <div class="card p-6 min-h-[180px] flex flex-col justify-between">
    <div>
      <div class="font-semibold mb-3 text-lg">
        {{ title }}
      </div>
      <div class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        30 questions • 30 mins
      </div>
    </div>
    <router-link
      :to="'/test/' + title"
      class="btn-primary w-full text-center"
    >
      Start
    </router-link>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
