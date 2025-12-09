<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header
      v-if="!hasChildRoute"
      class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="font-black text-4xl uppercase text-black">
          Academic Tools
        </h1>
        <p class="text-black mt-2 text-lg opacity-80">
          Comprehensive tools for students
        </p>
      </div>
    </header>

    <div
      v-if="!hasChildRoute"
      class="max-w-7xl mx-auto p-6"
    >
      <!-- GPA & Grades Section -->
      <div class="grid md:grid-cols-3 gap-6 mb-6">
        <RouterLink
          to="/tools/academic/gpa-calculator"
          class="group"
        >
          <div class="card card-brutal-cyan border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              📊
            </div>
            <h2 class="font-black text-lg mb-2">
              GPA Calculator
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Calculate semester and cumulative GPA with multiple grade scales.
            </p>
          </div>
        </RouterLink>

        <RouterLink
          to="/tools/academic/grade-calculator"
          class="group"
        >
          <div class="card card-brutal-pink border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              📈
            </div>
            <h2 class="font-black text-lg mb-2">
              Grade Calculator
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Calculate current grade and predict final grade based on assignments.
            </p>
          </div>
        </RouterLink>

        <RouterLink
          to="/tools/academic/attendance-calculator"
          class="group"
        >
          <div class="card card-brutal-yellow border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              ✅
            </div>
            <h2 class="font-black text-lg mb-2">
              Attendance Calculator
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Track attendance and calculate how many classes you can miss.
            </p>
          </div>
        </RouterLink>
      </div>

      <!-- Math & Learning Section -->
      <div class="grid md:grid-cols-3 gap-6 mb-6">
        <RouterLink
          to="/tools/academic/fraction-calculator"
          class="group"
        >
          <div class="card card-brutal-lime border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              ➗
            </div>
            <h2 class="font-black text-lg mb-2">
              Fraction Calculator
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Calculate fractions with detailed step-by-step solutions.
            </p>
          </div>
        </RouterLink>

        <RouterLink
          to="/tools/academic/math-solver"
          class="group"
        >
          <div class="card card-brutal-cyan border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              🧮
            </div>
            <h2 class="font-black text-lg mb-2">
              Math Equation Solver
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Solve linear, quadratic, and system of equations.
            </p>
          </div>
        </RouterLink>

        <RouterLink
          to="/tools/academic/flashcard-maker"
          class="group"
        >
          <div class="card card-brutal-yellow border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              🎴
            </div>
            <h2 class="font-black text-lg mb-2">
              Flashcard Maker
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Create and study flashcards with interactive flip animation.
            </p>
          </div>
        </RouterLink>
      </div>

      <!-- Planning & Organization Section -->
      <div class="grid md:grid-cols-3 gap-6 mb-6">
        <RouterLink
          to="/tools/academic/assignment-tracker"
          class="group"
        >
          <div class="card card-brutal-pink border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              📋
            </div>
            <h2 class="font-black text-lg mb-2">
              Assignment Tracker
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Track assignments, due dates, and manage priorities effectively.
            </p>
          </div>
        </RouterLink>

        <RouterLink
          to="/tools/academic/exam-countdown"
          class="group"
        >
          <div class="card card-brutal-lime border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              ⏰
            </div>
            <h2 class="font-black text-lg mb-2">
              Exam Countdown
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Track upcoming exams with real-time countdown and notifications.
            </p>
          </div>
        </RouterLink>

        <RouterLink
          to="/tools/academic/study-planner"
          class="group"
        >
          <div class="card card-brutal-cyan border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              📅
            </div>
            <h2 class="font-black text-lg mb-2">
              Study Planner
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Plan your weekly study schedule by subject and time slots.
            </p>
          </div>
        </RouterLink>
      </div>

      <!-- Academic Tools Section -->
      <div class="grid md:grid-cols-3 gap-6 mb-6">
        <RouterLink
          to="/tools/academic/timetable-generator"
          class="group"
        >
          <div class="card card-brutal-yellow border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              🕐
            </div>
            <h2 class="font-black text-lg mb-2">
              Timetable Generator
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Create and organize your school timetable visually.
            </p>
          </div>
        </RouterLink>

        <RouterLink
          to="/tools/academic/citation-generator"
          class="group"
        >
          <div class="card card-brutal-pink border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              📚
            </div>
            <h2 class="font-black text-lg mb-2">
              Citation Generator
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Generate citations in APA, MLA, Chicago, and Harvard styles.
            </p>
          </div>
        </RouterLink>

        <RouterLink
          to="/tools/academic/reading-speed-test"
          class="group"
        >
          <div class="card card-brutal-lime border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              📖
            </div>
            <h2 class="font-black text-lg mb-2">
              Reading Speed Test
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Test your reading speed and comprehension abilities.
            </p>
          </div>
        </RouterLink>
      </div>

      <!-- Typing Test -->
      <div class="grid md:grid-cols-3 gap-6">
        <RouterLink
          to="/tools/academic/typing-speed-test"
          class="group"
        >
          <div class="card card-brutal-cyan border-4 border-black p-6 h-full group-hover:shadow-brutal-lg transition">
            <div class="text-4xl mb-3">
              ⌨️
            </div>
            <h2 class="font-black text-lg mb-2">
              Typing Speed Test
            </h2>
            <p class="text-sm font-bold text-brutal-gray">
              Test your typing speed, accuracy, and WPM with multiple difficulties.
            </p>
          </div>
        </RouterLink>
      </div>
    </div>

    <div
      v-else
      class="max-w-7xl mx-auto p-6"
    >
      <RouterView v-slot="{ Component }">
        <Transition
          name="route-fade"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const hasChildRoute = computed(() => {
  return route.name !== 'academic-tools'
})

useHead({
  title: 'Academic Tools',
  meta: [
    { name: 'description', content: 'Complete suite of academic tools for students: GPA calculator, grade tracker, study planner, and more.' },
    { property: 'og:title', content: 'Academic Tools' },
    { property: 'og:description', content: 'Complete suite of academic tools for students: GPA calculator, grade tracker, study planner, and more.' }
  ]
})
</script>
