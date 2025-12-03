<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Text to Speech
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Speak text with selectable voice, rate, and pitch.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <div class="flex items-center justify-between mb-2">
            <label class="font-black">Text Input</label>
            <div class="text-sm font-black">
              {{ input.length }} characters
            </div>
          </div>
          <textarea
            v-model="input"
            rows="10"
            class="input-brutal w-full"
            placeholder="Enter text to speak..."
          />

          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="font-black block mb-1">Voice</label>
              <select
                v-model="selectedVoiceIndex"
                class="input-brutal w-full"
              >
                <option
                  v-for="(v, i) in voices"
                  :key="v.voiceURI"
                  :value="i"
                >
                  {{ v.name }} ({{ v.lang }})
                </option>
              </select>
            </div>
            <div>
              <label class="font-black block mb-1">Rate</label>
              <input
                v-model.number="rate"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                class="w-full"
              >
              <div class="text-center font-black">
                {{ rate.toFixed(1) }}x
              </div>
            </div>
            <div>
              <label class="font-black block mb-1">Pitch</label>
              <input
                v-model.number="pitch"
                type="range"
                min="0"
                max="2"
                step="0.1"
                class="w-full"
              >
              <div class="text-center font-black">
                {{ pitch.toFixed(1) }}
              </div>
            </div>
            <div>
              <label class="font-black block mb-1">Volume</label>
              <input
                v-model.number="volume"
                type="range"
                min="0"
                max="1"
                step="0.1"
                class="w-full"
              >
              <div class="text-center font-black">
                {{ volume.toFixed(1) }}
              </div>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button
              class="btn-primary btn-primary-yellow"
              :disabled="!canSpeak"
              @click="speak"
            >
              Speak
            </button>
            <button
              class="btn-primary btn-primary-lime"
              :disabled="!speaking"
              @click="pause"
            >
              Pause
            </button>
            <button
              class="btn-primary btn-primary-pink"
              :disabled="!paused"
              @click="resume"
            >
              Resume
            </button>
            <button
              class="btn-primary btn-primary-white"
              :disabled="!speaking"
              @click="stop"
            >
              Stop
            </button>
          </div>

          <div
            v-if="error"
            class="mt-3 p-3 bg-red-100 border-4 border-red-500 text-red-800"
          >
            <p class="font-black">
              Error: {{ error }}
            </p>
          </div>
        </div>

        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <label class="font-black block mb-2">Status</label>
          <div class="p-3 bg-brutal-lime border-2 border-black">
            <p class="font-black">
              Voices: {{ voices.length }}
            </p>
            <p class="font-black">
              Speaking: {{ speaking ? 'Yes' : 'No' }}
            </p>
            <p class="font-black">
              Paused: {{ paused ? 'Yes' : 'No' }}
            </p>
          </div>

          <div class="mt-4">
            <button
              class="btn-primary btn-primary-lime"
              :disabled="!input"
              :class="{ 'animate-copy-bounce': copyingInput }"
              @click="copyInput"
            >
              Copy Text
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  }
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'

useHead({
  title: 'Text to Speech - Free Online Tool',
  meta: [
    { name: 'description', content: 'Speak text with selectable voice, rate, and pitch. Free online TTS tool.' },
    { property: 'og:title', content: 'Text to Speech' },
    { property: 'og:description', content: 'Speak text with selectable voice, rate, and pitch.' }
  ]
})

const input = ref('')
const voices = ref<SpeechSynthesisVoice[]>([])
const selectedVoiceIndex = ref<number>(0)
const rate = ref(1)
const pitch = ref(1)
const volume = ref(1)
const error = ref('')
const speaking = ref(false)
const paused = ref(false)

const utterance = ref<SpeechSynthesisUtterance | null>(null)

const { copyWithFeedback, isCopying: copyingInput } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

const canSpeak = computed(() => !!input.value.trim() && voices.value.length > 0)

const loadVoices = () => {
  const list = window.speechSynthesis.getVoices()
  voices.value = list
  if (voices.value.length > 0 && selectedVoiceIndex.value >= voices.value.length) selectedVoiceIndex.value = 0
}

const speak = () => {
  error.value = ''
  if (!canSpeak.value) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(input.value)
  const v = voices.value[selectedVoiceIndex.value]
  if (v) u.voice = v
  u.rate = rate.value
  u.pitch = pitch.value
  ;(u as any).volume = volume.value
  u.onend = () => {
    speaking.value = false
    paused.value = false
  }
  u.onerror = (e) => {
    error.value = String((e as any)?.error || 'Speech error')
    speaking.value = false
    paused.value = false
  }
  utterance.value = u
  window.speechSynthesis.speak(u)
  speaking.value = true
  paused.value = false
  celebrateFirstUse('text-to-speech')
}

const pause = () => {
  if (!speaking.value || paused.value) return
  window.speechSynthesis.pause()
  paused.value = true
}

const resume = () => {
  if (!speaking.value || !paused.value) return
  window.speechSynthesis.resume()
  paused.value = false
}

const stop = () => {
  window.speechSynthesis.cancel()
  speaking.value = false
  paused.value = false
}

const copyInput = async () => {
  if (!input.value) return
  await copyWithFeedback(input.value)
}

const voiceHandler = () => loadVoices()

onMounted(() => {
  loadVoices()
  window.speechSynthesis.addEventListener('voiceschanged', voiceHandler)
})

onBeforeUnmount(() => {
  window.speechSynthesis.removeEventListener('voiceschanged', voiceHandler)
  window.speechSynthesis.cancel()
})
</script>

<style scoped>
.input-brutal { @apply w-full p-3 border-4 border-black bg-white dark:bg-brutal-black text-black dark:text-white; }
.btn-primary { @apply px-4 py-2 border-4 border-black shadow-brutal font-black; }
.btn-primary-yellow { @apply bg-brutal-yellow; }
.btn-primary-lime { @apply bg-brutal-lime; }
.btn-primary-pink { @apply bg-brutal-pink; }
.btn-primary-white { @apply bg-white; }
.card-brutal-white { @apply bg-brutal-white; }
.card-brutal-black { @apply bg-brutal-black; }
</style>
