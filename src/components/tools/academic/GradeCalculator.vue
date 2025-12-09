<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">
      Grade Calculator
    </h2>
    
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- Controls -->
      <div class="bg-brutal-white dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-6 space-y-4 md:col-span-1">
        <div>
          <label class="font-black block mb-2">Desired Final Grade</label>
          <input
            v-model.number="desiredGrade"
            type="number"
            min="0"
            max="100"
            step="1"
            class="input w-full"
          >
        </div>

        <div>
          <label class="font-black block mb-2">Final Exam Weight %</label>
          <input
            v-model.number="finalWeight"
            type="number"
            min="0"
            max="100"
            step="1"
            class="input w-full"
          >
        </div>

        <button
          class="btn-primary btn-primary-cyan w-full"
          @click="calculateNeeded"
        >
          Calculate Grade Needed
        </button>

        <div class="grid grid-cols-2 gap-2">
          <button
            class="btn-primary btn-primary-lime"
            :class="{ 'animate-copy-bounce': copying }"
            @click="copyGrade"
          >
            {{ copying ? 'Copied!' : 'Copy' }}
          </button>
          <button
            class="btn-primary btn-primary-yellow"
            @click="clearAssignments"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- Assignments -->
      <div class="md:col-span-2 bg-brutal-cyan dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-6">
        <h3 class="font-black mb-4">
          Assignments & Tests
        </h3>
        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div
            v-for="(item, idx) in assignments"
            :key="idx"
            class="bg-brutal-white dark:bg-brutal-black border-2 border-black dark:border-brutal-white p-3 grid grid-cols-4 gap-2 items-end"
          >
            <input
              v-model="item.name"
              type="text"
              placeholder="Name"
              class="input text-xs col-span-2"
            >
            <input
              v-model.number="item.score"
              type="number"
              min="0"
              max="100"
              placeholder="Score"
              class="input text-xs"
            >
            <button
              class="btn-small btn-primary-pink text-xs"
              @click="removeAssignment(idx)"
            >
              ✕
            </button>
          </div>
        </div>
        <button
          class="btn-primary btn-primary-lime w-full mt-4"
          @click="addAssignment"
        >
          + Add Assignment
        </button>
      </div>
    </div>

    <!-- Results -->
    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-brutal-yellow dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-6">
        <div class="text-sm font-bold text-brutal-gray mb-2">
          Current Grade
        </div>
        <div class="text-4xl font-black">
          {{ currentGrade.toFixed(1) }}%
        </div>
        <div class="text-sm font-bold mt-2 text-brutal-gray">
          {{ getLetterGrade(currentGrade) }}
        </div>
      </div>

      <div class="bg-brutal-lime dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-6">
        <div class="text-sm font-bold text-brutal-gray mb-2">
          Grade Needed on Final
        </div>
        <div class="text-4xl font-black">
          {{ neededGrade.toFixed(1) }}%
        </div>
        <div
          v-if="neededGrade > 100"
          class="text-sm text-red-600 font-bold mt-2"
        >
          ❌ Impossible
        </div>
        <div
          v-else-if="neededGrade > 80"
          class="text-sm text-orange-600 font-bold mt-2"
        >
          ⚠️ Difficult
        </div>
        <div
          v-else
          class="text-sm text-green-600 font-bold mt-2"
        >
          ✓ Achievable
        </div>
      </div>

      <div class="bg-brutal-pink dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-6">
        <div class="text-sm font-bold text-brutal-gray mb-2">
          Predicted Final Grade
        </div>
        <div class="text-4xl font-black">
          {{ predictedGrade.toFixed(1) }}%
        </div>
        <div class="text-sm font-bold mt-2 text-brutal-gray">
          {{ getLetterGrade(predictedGrade) }}
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="mt-8 bg-brutal-white dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-6">
      <div class="flex justify-between mb-2">
        <span class="font-black">Current Progress</span>
        <span class="font-black">{{ currentGrade.toFixed(1) }}%</span>
      </div>
      <div class="w-full bg-brutal-gray border-2 border-black h-6">
        <div
          class="bg-brutal-cyan border-2 border-black h-6"
          :style="{ width: `${Math.min(100, currentGrade)}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'

useHead({
  title: 'Grade Calculator',
  meta: [
    { name: 'description', content: 'Calculate your current grade, final exam needed, and predicted grade.' },
    { property: 'og:title', content: 'Grade Calculator' },
    { property: 'og:description', content: 'Calculate your current grade, final exam needed, and predicted grade.' }
  ]
})

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

const desiredGrade = ref(80)
const finalWeight = ref(20)

const assignments = ref<Array<{ name: string; score: number }>>([
  { name: 'Quiz 1', score: 85 },
  { name: 'Midterm', score: 78 }
])

const currentGrade = computed(() => {
  if (assignments.value.length === 0) return 0
  const sum = assignments.value.reduce((acc, a) => acc + a.score, 0)
  return sum / assignments.value.length
})

const neededGrade = computed(() => {
  const currentWeight = 100 - finalWeight.value
  return (desiredGrade.value * currentWeight - currentGrade.value * currentWeight) / finalWeight.value
})

const predictedGrade = computed(() => {
  const currentWeight = 100 - finalWeight.value
  const finalScore = Math.min(100, Math.max(0, neededGrade.value))
  return (currentGrade.value * currentWeight + finalScore * finalWeight.value) / 100
})

function getLetterGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

function addAssignment() {
  assignments.value.push({ name: '', score: 0 })
}

function removeAssignment(idx: number) {
  assignments.value.splice(idx, 1)
}

function clearAssignments() {
  assignments.value = [{ name: 'Quiz 1', score: 85 }, { name: 'Midterm', score: 78 }]
}

function calculateNeeded() {
  // Trigger reactivity
}

function copyGrade() {
  copyWithFeedback(`Current: ${currentGrade.value.toFixed(1)}% | Needed: ${neededGrade.value.toFixed(1)}%`)
}
</script>
