<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">Typing Speed Test</h2>
    
    <div class="grid md:grid-cols-4 gap-4 mb-6">
      <select v-model="duration" class="input text-sm">
        <option value="15">15 seconds</option>
        <option value="30">30 seconds</option>
        <option value="60">60 seconds</option>
        <option value="120">2 minutes</option>
      </select>
      <select v-model="difficulty" class="input text-sm">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button v-if="!started" class="btn-primary btn-primary-lime" @click="startTest">Start Test</button>
      <button v-if="started && !finished" class="btn-primary btn-primary-pink" @click="finishTest">Finish</button>
    </div>

    <!-- Text to Type -->
    <div class="bg-brutal-white border-4 border-black p-8 mb-6 min-h-32">
      <div class="text-lg leading-relaxed font-mono">
        <span
          v-for="(char, idx) in testText"
          :key="idx"
          :class="{
            'bg-brutal-lime': idx < userInput.length && userInput[idx] === char,
            'bg-red-200': idx < userInput.length && userInput[idx] !== char,
            'bg-brutal-yellow': idx === userInput.length,
            'opacity-50': idx < userInput.length
          }"
        >
          {{ char }}
        </span>
      </div>
    </div>

    <!-- Input -->
    <textarea
      v-model="userInput"
      :disabled="!started || finished"
      class="input w-full h-32 font-mono resize-none mb-6"
      placeholder="Click 'Start Test' and begin typing..."
      @focus="autoStart"
    ></textarea>

    <!-- Timer & Stats -->
    <div v-if="started && !finished" class="grid md:grid-cols-4 gap-4 mb-6">
      <div class="bg-brutal-cyan border-4 border-black p-4 text-center">
        <div class="text-sm font-bold text-brutal-gray">Time</div>
        <div class="text-4xl font-black">{{ timeRemaining }}s</div>
      </div>
      <div class="bg-brutal-yellow border-4 border-black p-4 text-center">
        <div class="text-sm font-bold text-brutal-gray">WPM</div>
        <div class="text-4xl font-black">{{ wpm.toFixed(0) }}</div>
      </div>
      <div class="bg-brutal-lime border-4 border-black p-4 text-center">
        <div class="text-sm font-bold text-brutal-gray">Accuracy</div>
        <div class="text-4xl font-black">{{ accuracy.toFixed(1) }}%</div>
      </div>
      <div class="bg-brutal-pink border-4 border-black p-4 text-center">
        <div class="text-sm font-bold text-brutal-gray">Errors</div>
        <div class="text-4xl font-black">{{ errors }}</div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="finished" class="grid md:grid-cols-4 gap-4">
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <div class="text-sm font-bold text-brutal-gray">WPM</div>
        <div class="text-4xl font-black">{{ finalWPM.toFixed(0) }}</div>
      </div>
      <div class="bg-brutal-yellow border-4 border-black p-6">
        <div class="text-sm font-bold text-brutal-gray">Accuracy</div>
        <div class="text-4xl font-black">{{ accuracy.toFixed(1) }}%</div>
      </div>
      <div class="bg-brutal-lime border-4 border-black p-6">
        <div class="text-sm font-bold text-brutal-gray">Characters</div>
        <div class="text-4xl font-black">{{ userInput.length }}</div>
      </div>
      <div class="bg-brutal-pink border-4 border-black p-6">
        <div class="text-sm font-bold text-brutal-gray">Total Errors</div>
        <div class="text-4xl font-black">{{ errors }}</div>
      </div>
    </div>

    <button v-if="finished" class="btn-primary btn-primary-lime w-full mt-6" @click="resetTest">Try Again</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Typing Speed Test',
  meta: [
    { name: 'description', content: 'Test your typing speed and accuracy.' },
    { property: 'og:title', content: 'Typing Speed Test' },
    { property: 'og:description', content: 'Test your typing speed and accuracy.' }
  ]
})

const testTexts = {
  easy: 'The quick brown fox jumps over the lazy dog.',
  medium: 'JavaScript is a versatile programming language used for web development. It enables interactive websites and modern applications.',
  hard: 'The paradigmatic shift in contemporary epistemology reflects a sophisticated integration of phenomenological inquiry and post-structuralist methodology.'
}

const duration = ref('60')
const difficulty = ref('medium')
const started = ref(false)
const finished = ref(false)
const userInput = ref('')
const elapsedTime = ref(0)
let timerInterval: number | null = null

const testText = computed(() => testTexts[difficulty.value as keyof typeof testTexts])

const timeRemaining = computed(() => Math.max(0, parseInt(duration.value) - elapsedTime.value))

const errors = computed(() => {
  let errorCount = 0
  for (let i = 0; i < userInput.value.length; i++) {
    if (userInput.value[i] !== testText.value[i]) {
      errorCount++
    }
  }
  return errorCount
})

const accuracy = computed(() => {
  if (userInput.value.length === 0) return 100
  return ((userInput.value.length - errors.value) / userInput.value.length) * 100
})

const wpm = computed(() => {
  if (elapsedTime.value === 0) return 0
  const words = userInput.value.trim().split(/\s+/).length
  return (words / elapsedTime.value) * 60
})

const finalWPM = computed(() => {
  const words = userInput.value.trim().split(/\s+/).length
  return (words / parseInt(duration.value)) * 60
})

onMounted(() => {
  timerInterval = window.setInterval(() => {
    if (started.value && !finished.value) {
      elapsedTime.value++
      if (elapsedTime.value >= parseInt(duration.value)) {
        finishTest()
      }
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

function autoStart() {
  if (!started.value && !finished.value) {
    startTest()
  }
}

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

function resetTest() {
  userInput.value = ''
  elapsedTime.value = 0
  started.value = false
  finished.value = false
}
</script>
