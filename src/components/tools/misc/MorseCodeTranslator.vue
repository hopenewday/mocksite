<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Morse Code Translator
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Convert text to Morse code and vice versa with audio playback.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <label class="font-black">Direction:</label>
            <label class="inline-flex items-center gap-2">
              <input
                v-model="direction"
                type="radio"
                value="text-to-morse"
              >
              <span>Text → Morse</span>
            </label>
            <label class="inline-flex items-center gap-2">
              <input
                v-model="direction"
                type="radio"
                value="morse-to-text"
              >
              <span>Morse → Text</span>
            </label>
          </div>

          <div
            v-if="direction === 'text-to-morse'"
            class="mb-4"
          >
            <label class="font-black block mb-1">Audio Speed (WPM)</label>
            <input 
              v-model="speed" 
              type="range" 
              min="1" 
              max="40" 
              class="w-full"
            >
            <div class="text-center font-black">
              {{ speed }} WPM
            </div>
          </div>

          <label class="font-black block mb-2">{{ direction === 'text-to-morse' ? 'Text Input' : 'Morse Input' }}</label>
          <textarea 
            v-model="input" 
            rows="8" 
            class="input-brutal w-full"
            :placeholder="direction === 'text-to-morse' ? 'Enter text here...' : 'Enter morse code here...'"
          />

          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button
              class="btn-primary btn-primary-yellow"
              :disabled="!input.trim()"
              @click="translate"
            >
              Translate
            </button>
            <button
              class="btn-primary btn-primary-lime"
              :disabled="!output"
              :class="{ 'animate-copy-bounce': copyingOutput }"
              @click="copyOutput"
            >
              Copy Output
            </button>
            <button
              v-if="direction === 'text-to-morse'"
              class="btn-primary btn-primary-pink"
              :disabled="!output"
              @click="playAudio"
            >
              Play Audio
            </button>
            <button
              class="btn-primary btn-primary-white"
              @click="clearAll"
            >
              Clear
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

          <div
            v-if="direction === 'text-to-morse'"
            class="mt-4 p-3 bg-brutal-lime border-2 border-black"
          >
            <h3 class="font-black mb-2">
              Morse Code Reference
            </h3>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>A: .-</div><div>B: -...</div>
              <div>C: -.-.</div><div>D: -..</div>
              <div>E: .</div><div>F: ..-.</div>
              <div>G: --.</div><div>H: ....</div>
              <div>I: ..</div><div>J: .---</div>
              <div>K: -.-</div><div>L: .-..</div>
              <div>M: --</div><div>N: -.</div>
              <div>O: ---</div><div>P: .--.</div>
              <div>Q: --.-</div><div>R: .-.</div>
              <div>S: ...</div><div>T: -</div>
              <div>U: ..-</div><div>V: ...-</div>
              <div>W: .--</div><div>X: -..-</div>
              <div>Y: -.--</div><div>Z: --..</div>
              <div>0: -----</div><div>1: .----</div>
              <div>2: ..---</div><div>3: ...--</div>
              <div>4: ....-</div><div>5: .....</div>
              <div>6: -....</div><div>7: --...</div>
              <div>8: ---..</div><div>9: ----.</div>
            </div>
          </div>
        </div>

        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <label class="font-black block mb-2">{{ direction === 'text-to-morse' ? 'Morse Output' : 'Text Output' }}</label>
          <textarea 
            :value="output" 
            readonly 
            rows="8" 
            class="input-brutal w-full font-mono"
            placeholder="Translation will appear here..."
          />

          <div class="mt-3 p-2 bg-brutal-cyan border-2 border-black text-center">
            <p class="font-black">
              {{ direction === 'text-to-morse' ? 'Characters' : 'Morse Symbols' }}: {{ characterCount }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'

useHead({
  title: 'Morse Code Translator - Free Online Tool',
  meta: [
    { name: 'description', content: 'Convert text to Morse code and vice versa with audio playback. Free online Morse code translator.' },
    { property: 'og:title', content: 'Morse Code Translator' },
    { property: 'og:description', content: 'Convert text to Morse code and vice versa with audio playback.' }
  ]
})

const direction = ref<'text-to-morse' | 'morse-to-text'>('text-to-morse')
const speed = ref(15) // Words per minute
const input = ref('')
const output = ref('')
const error = ref('')

const { copyWithFeedback, isCopying: copyingOutput } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

const morseCodeMap: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
  '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.', ' ': '/'
}

const textToMorse = (text: string): string => {
  return text.toUpperCase()
    .split('')
    .map(char => morseCodeMap[char] || char)
    .join(' ')
    .replace(/\s+\//g, ' / ')
    .replace(/\s+/g, ' ')
    .trim()
}

const morseToText = (morse: string): string => {
  const reverseMap: Record<string, string> = {}
  Object.entries(morseCodeMap).forEach(([text, morse]) => {
    reverseMap[morse] = text
  })

  return morse
    .split(' / ')
    .join(' ')
    .split(' ')
    .map(symbol => reverseMap[symbol] || symbol)
    .join('')
}

const translate = () => {
  error.value = ''
  output.value = ''
  
  const trimmedInput = input.value.trim()
  if (!trimmedInput) {
    error.value = 'Please enter text to translate'
    return
  }

  try {
    if (direction.value === 'text-to-morse') {
      output.value = textToMorse(trimmedInput)
    } else {
      output.value = morseToText(trimmedInput)
    }

    celebrateFirstUse('morse-code')

  } catch (e: any) {
    error.value = e.message || 'Translation failed'
  }
}

const playAudio = () => {
  if (!output.value) return
  
  // Stop any currently playing audio
  window.speechSynthesis.cancel()
  
  // Convert Morse to audio beeps using Web Audio API
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const beepDuration = 1000 / speed.value * 60 / 60 // Duration in milliseconds
  const gapDuration = beepDuration / 3
  
  let currentTime = audioContext.currentTime
  
  output.value.split(' ').forEach((symbol, index) => {
    if (symbol === '.') {
      // Play short beep
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(600, currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + beepDuration / 1000)
      
      oscillator.start(currentTime)
      oscillator.stop(currentTime + beepDuration / 1000)
      
      currentTime += beepDuration / 1000 + gapDuration / 1000
    } else if (symbol === '-') {
      // Play long beep
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(600, currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + (beepDuration * 3) / 1000)
      
      oscillator.start(currentTime)
      oscillator.stop(currentTime + (beepDuration * 3) / 1000)
      
      currentTime += (beepDuration * 3) / 1000 + gapDuration / 1000
    } else if (symbol === '/') {
      // Pause between letters
      currentTime += (gapDuration * 3) / 1000
    }
    
    // Gap between symbols
    currentTime += gapDuration / 1000
  })
}

const copyOutput = async () => {
  if (!output.value) return
  await copyWithFeedback(output.value)
}

const clearAll = () => {
  input.value = ''
  output.value = ''
  error.value = ''
}

const characterCount = computed(() => {
  return direction.value === 'text-to-morse' 
    ? input.value.length 
    : output.value.length
})
</script>

