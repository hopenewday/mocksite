<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      GPA Calculator
    </h2>
    
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- Controls -->
      <div class="bg-brutal-white dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-6 space-y-4 md:col-span-1">
        <div>
          <label class="font-black block mb-2">Grade Scale</label>
          <select
            v-model="gradeScale"
            class="input w-full"
          >
            <option value="4.0">
              4.0 Scale
            </option>
            <option value="5.0">
              5.0 Scale
            </option>
            <option value="10.0">
              10.0 Scale
            </option>
          </select>
        </div>

        <div>
          <label class="flex items-center gap-2">
            <input
              v-model="isWeighted"
              type="checkbox"
              class="w-4 h-4"
            >
            <span class="font-black">Weighted GPA</span>
          </label>
        </div>

        <div v-if="cumulative.previousGPA">
          <label class="font-black block mb-2">Previous GPA</label>
          <input
            v-model.number="cumulative.previousGPA"
            type="number"
            step="0.01"
            min="0"
            class="input w-full"
          >
        </div>

        <div v-if="cumulative.previousGPA">
          <label class="font-black block mb-2">Previous Credits</label>
          <input
            v-model.number="cumulative.previousCredits"
            type="number"
            min="0"
            class="input w-full"
          >
        </div>

        <button
          class="btn-primary btn-primary-lime w-full"
          @click="toggleCumulative"
        >
          {{ cumulative.previousGPA ? 'Semester GPA' : 'Cumulative GPA' }}
        </button>

        <div class="grid grid-cols-2 gap-2">
          <button
            class="btn-primary btn-primary-cyan"
            :class="{ 'animate-copy-bounce': copying }"
            @click="copyGPA"
          >
            {{ copying ? 'Copied!' : 'Copy GPA' }}
          </button>
          <button
            class="btn-primary btn-primary-pink"
            @click="clearCourses"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- Courses -->
      <div class="md:col-span-2 bg-brutal-yellow dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-6">
        <h3 class="font-black mb-4">
          Courses
        </h3>
        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div
            v-for="(course, idx) in courses"
            :key="idx"
            class="bg-brutal-white border-2 border-black p-4 space-y-2"
          >
            <input
              v-model="course.name"
              type="text"
              placeholder="Course name"
              class="input w-full text-sm"
            >
            <div class="grid grid-cols-3 gap-2">
              <input
                v-model="course.grade"
                type="text"
                placeholder="Grade (A, B+, 3.5...)"
                class="input text-sm"
              >
              <input
                v-model.number="course.credits"
                type="number"
                placeholder="Credits"
                min="0.5"
                step="0.5"
                class="input text-sm"
              >
              <input
                v-if="isWeighted"
                v-model.number="course.weight"
                type="number"
                placeholder="Weight %"
                min="0"
                max="100"
                class="input text-sm"
              >
            </div>
            <button
              class="btn-small btn-primary-pink w-full text-xs"
              @click="removeCourse(idx)"
            >
              Remove
            </button>
          </div>
        </div>
        <button
          class="btn-primary btn-primary-lime w-full mt-4"
          @click="addCourse"
        >
          + Add Course
        </button>
      </div>
    </div>

    <!-- Results -->
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <div class="text-sm font-bold text-brutal-gray mb-2">
          Semester GPA
        </div>
        <div class="text-4xl font-black">
          {{ calculatedGPA.toFixed(2) }}
        </div>
        <div class="text-sm font-bold mt-2">
          Credits: {{ totalCredits }}
        </div>
      </div>
      
      <div
        v-if="cumulative.previousGPA"
        class="bg-brutal-pink border-4 border-black p-6"
      >
        <div class="text-sm font-bold text-brutal-gray mb-2">
          Cumulative GPA
        </div>
        <div class="text-4xl font-black">
          {{ cumulativeGPA.toFixed(2) }}
        </div>
        <div class="text-sm font-bold mt-2">
          Total Credits: {{ totalCredits + cumulative.previousCredits }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'

useHead({
  title: 'GPA Calculator',
  meta: [
    { name: 'description', content: 'Calculate your semester and cumulative GPA with multiple grade scales.' },
    { property: 'og:title', content: 'GPA Calculator' },
    { property: 'og:description', content: 'Calculate your semester and cumulative GPA with multiple grade scales.' }
  ]
})

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

const gradeScale = ref<'4.0' | '5.0' | '10.0'>('4.0')
const isWeighted = ref(false)

const courses = ref<Array<{ name: string; grade: string; credits: number; weight: number }>>([
  { name: '', grade: '', credits: 3, weight: 100 }
])

const cumulative = ref({ previousGPA: 0, previousCredits: 0 })

const gradeToPoints: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0
}

const gradeToPoints5: Record<string, number> = {
  'A+': 5.0, 'A': 5.0, 'A-': 4.5,
  'B+': 4.0, 'B': 3.5, 'B-': 3.0,
  'C+': 2.5, 'C': 2.0, 'C-': 1.5,
  'D+': 1.0, 'D': 0.5, 'F': 0
}

function convertGrade(grade: string): number {
  const g = grade.toUpperCase().trim()
  
  if (gradeScale.value === '4.0') {
    return gradeToPoints[g] ?? parseFloat(g) ?? 0
  } else if (gradeScale.value === '5.0') {
    return gradeToPoints5[g] ?? parseFloat(g) ?? 0
  } else {
    return Math.min(10, Math.max(0, parseFloat(g) ?? 0))
  }
}

const calculatedGPA = computed(() => {
  const validCourses = courses.value.filter(c => c.grade && c.credits > 0)
  if (validCourses.length === 0) return 0
  
  const points = validCourses.map(c => convertGrade(c.grade) * c.credits)
  const weights = validCourses.map(c => c.weight || 100)
  
  if (isWeighted.value) {
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    return totalWeight > 0 ? (points.reduce((a, b) => a + b, 0) / weights.reduce((a, b) => a + b, 0)) : 0
  }
  
  const totalCredits = validCourses.reduce((a, c) => a + c.credits, 0)
  return totalCredits > 0 ? points.reduce((a, b) => a + b, 0) / totalCredits : 0
})

const totalCredits = computed(() => 
  courses.value.reduce((sum, c) => sum + (c.credits || 0), 0)
)

const cumulativeGPA = computed(() => {
  if (!cumulative.value.previousGPA || !cumulative.value.previousCredits) return calculatedGPA.value
  
  const prevPoints = cumulative.value.previousGPA * cumulative.value.previousCredits
  const currPoints = calculatedGPA.value * totalCredits.value
  const total = cumulative.value.previousCredits + totalCredits.value
  
  return total > 0 ? (prevPoints + currPoints) / total : 0
})

function addCourse() {
  courses.value.push({ name: '', grade: '', credits: 3, weight: 100 })
}

function removeCourse(idx: number) {
  courses.value.splice(idx, 1)
}

function clearCourses() {
  courses.value = [{ name: '', grade: '', credits: 3, weight: 100 }]
}

function toggleCumulative() {
  if (cumulative.value.previousGPA) {
    cumulative.value = { previousGPA: 0, previousCredits: 0 }
  } else {
    cumulative.value = { previousGPA: 3.5, previousCredits: 30 }
  }
}

function copyGPA() {
  const gpa = cumulative.value.previousGPA ? cumulativeGPA.value : calculatedGPA.value
  copyWithFeedback(`GPA: ${gpa.toFixed(2)}`)
}
</script>
