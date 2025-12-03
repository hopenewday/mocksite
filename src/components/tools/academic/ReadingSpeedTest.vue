<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">Reading Speed Test</h2>
    
    <div class="grid md:grid-cols-4 gap-4 mb-6">
      <select v-model="difficulty" class="input text-sm">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <input v-model.number="testDuration" type="number" min="30" max="300" step="30" class="input text-sm" placeholder="Duration (s)">
      <button v-if="!started" class="btn-primary btn-primary-lime" @click="startTest">Start Test</button>
      <button v-else class="btn-primary btn-primary-pink" @click="finishTest">Finish Test</button>
    </div>

    <!-- Text Display -->
    <div class="bg-brutal-white border-4 border-black p-8 mb-6 min-h-64">
      <div class="text-lg leading-relaxed">
        <span
          v-for="(word, idx) in textWords"
          :key="idx"
          :class="{ 'bg-brutal-yellow': idx === currentWordIdx, 'opacity-50': idx < currentWordIdx }"
        >
          {{ word }}
          <span v-if="idx < textWords.length - 1">&nbsp;</span>
        </span>
      </div>
    </div>

    <!-- User Input -->
    <div v-if="started" class="mb-6">
      <textarea
        v-model="userInput"
        class="input w-full h-24 resize-none"
        placeholder="Start typing here..."
        :disabled="!started"
      ></textarea>
    </div>

    <!-- Results -->
    <div v-if="finished" class="grid md:grid-cols-4 gap-4">
      <div class="bg-brutal-yellow border-4 border-black p-6">
        <div class="text-sm font-bold text-brutal-gray">WPM</div>
        <div class="text-4xl font-black">{{ wpm.toFixed(0) }}</div>
      </div>
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <div class="text-sm font-bold text-brutal-gray">Accuracy</div>
        <div class="text-4xl font-black">{{ accuracy.toFixed(1) }}%</div>
      </div>
      <div class="bg-brutal-lime border-4 border-black p-6">
        <div class="text-sm font-bold text-brutal-gray">Words Read</div>
        <div class="text-4xl font-black">{{ wordsRead }}</div>
      </div>
      <div class="bg-brutal-pink border-4 border-black p-6">
        <div class="text-sm font-bold text-brutal-gray">Time</div>
        <div class="text-4xl font-black">{{ elapsedTime }}s</div>
      </div>
    </div>

    <!-- Timer -->
    <div v-if="started && !finished" class="mt-6 text-center text-4xl font-black">
      Time: {{ timeRemaining }}s
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Reading Speed Test',
  meta: [
    { name: 'description', content: 'Test your reading speed and comprehension.' },
    { property: 'og:title', content: 'Reading Speed Test' },
    { property: 'og:description', content: 'Test your reading speed and comprehension.' }
  ]
})

const difficulty = ref('medium')
const testDuration = ref(60)
const started = ref(false)
const finished = ref(false)
const userInput = ref('')
const currentWordIdx = ref(0)
const elapsedTime = ref(0)
let timerInterval: number | null = null

const testTexts = {
  easy: 'The quick brown fox jumps over the lazy dog. This is a simple sentence used for testing. Reading speed is measured in words per minute. Practice helps improve your reading ability significantly.',
  medium: 'The advancement of technology has revolutionized modern education. Students now have access to vast amounts of information through digital platforms. However, critical thinking and analysis remain essential skills. Digital literacy has become increasingly important in our interconnected world.',
  hard: 'The paradigmatic shift in contemporary epistemology reflects a sophisticated integration of phenomenological inquiry and post-structuralist methodology. Contemporary discourse on the ontological status of abstract entities necessitates a reevaluation of fundamental categorical frameworks.'
}

const textWords = computed(() => testTexts[difficulty.value as keyof typeof testTexts].split(/\s+/))

const wordsRead = computed(() => {
  if (!userInput.value) return 0
  return userInput.value.trim().split(/\s+/).length
})

const wpm = computed(() => {
  if (elapsedTime.value === 0) return 0
  return (wordsRead.value / elapsedTime.value) * 60
})

const accuracy = computed(() => {
  if (wordsRead.value === 0) return 0
  const userWords = userInput.value.trim().split(/\s+/)
  let correct = 0
  userWords.forEach((word, idx) => {
    if (textWords.value[idx]?.toLowerCase() === word.toLowerCase()) correct++
  })
  return (correct / Math.max(wordsRead.value, textWords.value.length)) * 100
})

const timeRemaining = computed(() => Math.max(0, testDuration.value - elapsedTime.value))

onMounted(() => {
  timerInterval = window.setInterval(() => {
    if (started.value && !finished.value) {
      elapsedTime.value++
      if (elapsedTime.value >= testDuration.value) {
        finishTest()
      }
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

function startTest() {
  started.value = true
  finished.value = false
  userInput.value = ''
  elapsedTime.value = 0
}

function finishTest() {
  started.value = false
  finished.value = true
}
</script>
