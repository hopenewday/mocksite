<template>
  <div class="flex flex-wrap gap-3">
    <input
      v-model="exam"
      class="input"
      placeholder="Exam"
      aria-label="Filter by exam"
    >
    <select
      v-model="difficulty"
      class="select"
      aria-label="Filter by difficulty"
    >
      <option value="">
        All
      </option>
      <option value="easy">
        Easy
      </option>
      <option value="medium">
        Medium
      </option>
      <option value="hard">
        Hard
      </option>
    </select>
    <select
      v-model="language"
      class="select"
      aria-label="Filter by language"
    >
      <option value="">
        All
      </option>
      <option value="en">
        EN
      </option>
      <option value="hi">
        HI
      </option>
    </select>
    <button
      class="btn-primary"
      @click="apply"
    >
      Apply
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const exam = ref('')
const difficulty = ref('')
const language = ref('')
type Filters = { exam?: string; difficulty?: string; language?: string }
const emit = defineEmits<{ (e: 'apply', payload: Filters): void }>()
function apply() { emit('apply', { exam: exam.value || undefined, difficulty: difficulty.value || undefined, language: language.value || undefined }) }
</script>
