<template>
  <div class="rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-4 flex items-center gap-6">
    <AnimatedScore
      :value="percent"
      :aria-label="'Score'"
    />
    <div class="flex-1">
      <div class="text-xl font-semibold">
        {{ title }}
      </div>
      <div class="mt-2 grid grid-cols-3 gap-3 text-sm">
        <div class="rounded-lg border p-3">
          {{ correctLabel }}: {{ correct }}
        </div>
        <div class="rounded-lg border p-3">
          {{ incorrectLabel }}: {{ incorrect }}
        </div>
        <div class="rounded-lg border p-3">
          {{ unansweredLabel }}: {{ unanswered }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AnimatedScore from './AnimatedScore.vue'
defineProps<{ title: string; percent: number; correct: number; incorrect: number; unanswered: number; correctLabel: string; incorrectLabel: string; unansweredLabel: string }>()
</script>