<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Text to Speech (TTS)
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Convert text to speech with voice selection and audio controls.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <label class="font-black block mb-2">Text Input</label>
          <textarea 
            v-model="text" 
            rows="8" 
            class="input-brutal w-full"
            placeholder="Enter text to convert to speech..."
          />

          <div class="mt-3 flex items-center justify-between text-sm">
            <span class="font-black">{{ text.length }} characters</span>
            <button
              class="btn-primary btn-primary-yellow"
              @click="pasteText"
            >
              Paste
            </button>
          </div>

          <div
            v-if="errorMessage"
            class="mt-4"
          >
            <ErrorBanner :message="errorMessage" />
          </div>

          <div
            v-if="!isSupported"
            class="mt-4 p-3 bg-red-100 border-4 border-red-500 text-red-800"
          >
            <p class="font-black">
              ⚠️ Your browser doesn't support speech synthesis
            </p>
          </div>

          <div
            v-if="isSupported"
            class="mt-4 space-y-4"
          >
            <div>
              <label class="font-black block mb-1">Voice Selection</label>
              <select
                v-model="selectedVoice"
                class="input-brutal w-full"
              >
                <option value="">
                  Default Voice
                </option>
                <option
                  v-for="voice in voices"
                  :key="voice.name"
                  :value="voice.name"
                >
                  {{ voice.name }} ({{ voice.lang }})
                </option>
              </select>
            </div>

            <div>
              <label class="font-black block mb-1">Speed: {{ speed }}x</label>
              <input 
                v-model="speed" 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1"
                class="w-full"
              >
              <div class="flex justify-between text-xs">
                <span>0.5x</span>
                <span>1x</span>
                <span>2x</span>
              </div>
            </div>

            <div>
              <label class="font-black block mb-1">Pitch: {{ pitch }}</label>
              <input 
                v-model="pitch" 
                type="range" 
                min="0" 
                max="2" 
                step="0.1"
                class="w-full"
              >
              <div class="flex justify-between text-xs">
                <span>0</span>
                <span>1</span>
                <span>2</span>
              </div>
            </div>

            <div>
              <label class="font-black block mb-1">Volume: {{ volume }}%</label>
              <input 
                v-model="volume" 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                class="w-full"
              >
              <div class="flex justify-between text-xs">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap items-center gap-3">
              <button 
                class="btn-primary btn-primary-yellow" 
                :disabled="!text.trim() || isSpeaking" 
                @click="speak"
              >
                {{ isSpeaking ? '🔊 Speaking...' : '🔊 Speak' }}
              </button>
              <button 
                class="btn-primary btn-primary-lime" 
                :disabled="!isSpeaking && !isPaused" 
                @click="pauseResume"
              >
                {{ isPaused ? '▶️ Resume' : '⏸️ Pause' }}
              </button>
              <button 
                class="btn-primary btn-primary-pink" 
                :disabled="!isSpeaking && !isPaused" 
                @click="stop"
              >
                ⏹️ Stop
              </button>
            </div>

            <div
              v-if="isSpeaking"
              class="mt-4 p-3 bg-brutal-lime border-2 border-black"
            >
              <div class="flex items-center justify-between">
                <span class="font-black">Speaking...</span>
                <span class="font-black">{{ Math.round(progress) }}%</span>
              </div>
              <div class="mt-2 w-full bg-gray-300 border-2 border-black h-2">
                <div 
                  class="bg-brutal-cyan h-full transition-all duration-300"
                  :style="{ width: progress + '%' }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <h3 class="font-black mb-4">
            Controls & Settings
          </h3>
          
          <div class="space-y-4">
            <div class="p-3 bg-brutal-yellow border-2 border-black">
              <h4 class="font-black mb-2">
                Voice Information
              </h4>
              <div class="text-sm space-y-1">
                <p><strong>Available Voices:</strong> {{ voices.length }}</p>
                <p><strong>Current Voice:</strong> {{ currentVoiceName || 'Default' }}</p>
                <p><strong>Language:</strong> {{ currentVoiceLanguage || 'Default' }}</p>
              </div>
            </div>

            <div class="p-3 bg-brutal-lime border-2 border-black">
              <h4 class="font-black mb-2">
                Quick Actions
              </h4>
              <div class="space-y-2">
                <button
                  class="btn-primary btn-primary-white w-full"
                  @click="loadSample"
                >
                  Load Sample Text
                </button>
                <button
                  class="btn-primary btn-primary-white w-full"
                  @click="clearText"
                >
                  Clear Text
                </button>
              </div>
            </div>

            <div class="p-3 bg-brutal-pink border-2 border-black">
              <h4 class="font-black mb-2">
                Tips
              </h4>
              <ul class="text-sm space-y-1">
                <li>• Use punctuation for natural pauses</li>
                <li>• Different browsers have different voices</li>
                <li>• Voice quality depends on system settings</li>
                <li>• Works offline with built-in voices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'
import ErrorBanner from '@/components/ErrorBanner.vue'

useHead({
  title: 'Text to Speech (TTS) - Free Online Tool',
  meta: [
    { name: 'description', content: 'Convert text to speech with voice selection and audio controls. Free online TTS tool.' },
    { property: 'og:title', content: 'Text to Speech (TTS)' },
    { property: 'og:description', content: 'Convert text to speech with voice selection and audio controls.' }
  ]
})

const text = ref('')
const voices = ref<SpeechSynthesisVoice[]>([])
const selectedVoice = ref('')
const speed = ref(1)
const pitch = ref(1)
const volume = ref(100)
const isSpeaking = ref(false)
const isPaused = ref(false)
const progress = ref(0)
const isSupported = ref(false)
const errorMessage = ref('')

let utterance: SpeechSynthesisUtterance | null = null
let updateInterval: number | null = null

const { copyWithFeedback } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

const currentVoiceName = computed(() => {
  if (!selectedVoice.value) return ''
  const voice = voices.value.find(v => v.name === selectedVoice.value)
  return voice?.name || ''
})

const currentVoiceLanguage = computed(() => {
  if (!selectedVoice.value) return ''
  const voice = voices.value.find(v => v.name === selectedVoice.value)
  return voice?.lang || ''
})

const loadVoices = () => {
  if ('speechSynthesis' in window) {
    isSupported.value = true
    voices.value = window.speechSynthesis.getVoices()
    
    // Some browsers load voices asynchronously
    if (voices.value.length === 0) {
      setTimeout(loadVoices, 100)
    }
  }
}

const speak = () => {
  errorMessage.value = ''
  if (!isSupported.value) {
    errorMessage.value = 'Speech synthesis is not supported in your browser.'
    return
  }
  
  if (!text.value.trim()) {
    errorMessage.value = 'Please enter some text to speak.'
    return
  }

  try {
    // Stop any current speech
    window.speechSynthesis.cancel()

    utterance = new SpeechSynthesisUtterance(text.value)
    
    // Set voice
    if (selectedVoice.value) {
      const voice = voices.value.find(v => v.name === selectedVoice.value)
      if (voice) {
        utterance.voice = voice
      }
    }

    // Set properties
    utterance.rate = speed.value
    utterance.pitch = pitch.value
    utterance.volume = volume.value / 100

    // Event handlers
    utterance.onstart = () => {
      isSpeaking.value = true
      isPaused.value = false
      progress.value = 0
      startProgressUpdate()
    }

    utterance.onend = () => {
      isSpeaking.value = false
      isPaused.value = false
      progress.value = 100
      stopProgressUpdate()
      
      if (progress.value === 100) {
        celebrateFirstUse('text-to-speech')
      }
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      errorMessage.value = 'An error occurred during speech playback. Please try again or switch voices.'
      isSpeaking.value = false
      isPaused.value = false
      stopProgressUpdate()
    }

    utterance.onpause = () => {
      isPaused.value = true
    }

    utterance.onresume = () => {
      isPaused.value = false
    }

    window.speechSynthesis.speak(utterance)
  } catch (err: any) {
    console.error('TTS execution error:', err)
    errorMessage.value = 'Failed to initialize system speech: ' + (err.message || 'Unknown error')
  }
}

const pauseResume = () => {
  if (!isSupported.value) return

  try {
    if (isPaused.value) {
      window.speechSynthesis.resume()
    } else {
      window.speechSynthesis.pause()
    }
  } catch (err) {
    console.error(err)
  }
}

const stop = () => {
  if (!isSupported.value) return

  try {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    isPaused.value = false
    progress.value = 0
    stopProgressUpdate()
  } catch (err) {
    console.error(err)
  }
}

const startProgressUpdate = () => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  
  updateInterval = setInterval(() => {
    if (isSpeaking.value && !isPaused.value) {
      progress.value = Math.min(progress.value + 1, 95)
    }
  }, 100)
}

const stopProgressUpdate = () => {
  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }
}

const pasteText = async () => {
  errorMessage.value = ''
  try {
    const clipboardText = await navigator.clipboard.readText()
    text.value = clipboardText
  } catch (err) {
    console.error('Failed to paste from clipboard:', err)
    errorMessage.value = 'Could not access clipboard. Please paste manually.'
  }
}

const loadSample = () => {
  errorMessage.value = ''
  text.value = `Hello! This is a text to speech demonstration. 

I can read any text you type here with natural-sounding speech. You can adjust the speed, pitch, and volume using the controls.

Try changing the voice selection to hear different speech patterns. Some browsers support multiple languages and voice types.

Text to speech is great for accessibility, learning, or simply having your computer read content aloud while you multitask.`
}

const clearText = () => {
  errorMessage.value = ''
  text.value = ''
  stop()
}

onMounted(() => {
  loadVoices()
  
  // Handle voices changed event for Chrome
  if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
  }
})

onBeforeUnmount(() => {
  stop() // Ensure speech stops when navigating away
  if ('speechSynthesis' in window) {
    window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }
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
