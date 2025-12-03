<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Text Cleaner
    </h2>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- Input -->
      <div class="md:col-span-2 bg-brutal-white border-4 border-black p-6">
        <textarea
          v-model="input"
          class="input w-full h-[28rem] resize-none"
          placeholder="Paste or type text to clean..."
        />
        <div class="mt-4 flex gap-2">
          <button
            class="btn-primary btn-primary-pink"
            @click="input=''"
          >
            Clear
          </button>
          <button
            class="btn-primary btn-primary-cyan"
            @click="paste"
          >
            Paste
          </button>
          <button
            class="btn-primary btn-primary-lime"
            :class="{ 'animate-brutal-bounce': justCleaned }"
            @click="clean"
          >
            Clean
          </button>
        </div>
      </div>

      <!-- Options -->
      <div class="bg-brutal-yellow border-4 border-black p-6 space-y-3">
        <label class="flex items-center gap-2">
          <input
            v-model="opts.removeExtraSpaces"
            type="checkbox"
            class="w-4 h-4"
          >
          <span class="font-black">Remove extra spaces</span>
        </label>
        <label class="flex items-center gap-2">
          <input
            v-model="opts.removeLineBreaks"
            type="checkbox"
            class="w-4 h-4"
          >
          <span class="font-black">Remove line breaks</span>
        </label>
        <label class="flex items-center gap-2">
          <input
            v-model="opts.trimWhitespace"
            type="checkbox"
            class="w-4 h-4"
          >
          <span class="font-black">Trim whitespace</span>
        </label>
        <label class="flex items-center gap-2">
          <input
            v-model="opts.removeSpecial"
            type="checkbox"
            class="w-4 h-4"
          >
          <span class="font-black">Remove special characters</span>
        </label>
        <label class="flex items-center gap-2">
          <input
            v-model="opts.removeNumbers"
            type="checkbox"
            class="w-4 h-4"
          >
          <span class="font-black">Remove numbers</span>
        </label>
        <label class="flex items-center gap-2">
          <input
            v-model="opts.removePunctuation"
            type="checkbox"
            class="w-4 h-4"
          >
          <span class="font-black">Remove punctuation</span>
        </label>
        <div class="pt-2">
          <label class="font-black block mb-2">Case</label>
          <div class="flex flex-wrap gap-2">
            <button
              :class="btnCase('none')"
              @click="opts.case='none'"
            >
              None
            </button>
            <button
              :class="btnCase('lower')"
              @click="opts.case='lower'"
            >
              lowercase
            </button>
            <button
              :class="btnCase('upper')"
              @click="opts.case='upper'"
            >
              UPPERCASE
            </button>
          </div>
        </div>

        <div class="pt-4 space-y-2">
          <div class="text-sm font-bold text-brutal-gray">
            Before: {{ beforeChars }} chars | After: {{ afterChars }} chars
          </div>
          <div class="text-sm font-bold text-brutal-gray">
            Words: {{ afterWords }}
          </div>
          <div class="text-sm font-bold text-brutal-gray">
            Saved: {{ savedPercent }}%
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2">
          <button
            class="btn-primary btn-primary-lime"
            :class="{ 'animate-copy-bounce': copying }"
            :data-state="copying ? 'success' : null"
            @click="copy"
          >
            <span v-if="copying">Copied!</span>
            <span v-else>Copy</span>
          </button>
          <button
            class="btn-primary btn-primary-yellow"
            :data-state="downloaded ? 'success' : null"
            @click="download"
          >
            <span v-if="downloaded">Downloaded!</span>
            <span v-else>Download</span>
          </button>
        </div>
      </div>
    </div>

    <div class="bg-brutal-cyan border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Cleaned Output
      </h3>
      <textarea
        :value="output"
        readonly
        class="input w-full h-64 resize-none bg-brutal-gray"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'
import { useMilestones } from '../../../composables/useMilestones'
import { removeExtraSpaces, removeLineBreaks, trimWhitespace, removeSpecialChars, removeNumbers, removePunctuation, countCharacters as countChars, countWords as countWordsFn } from '../../../utils/textProcessing'

useHead({
  title: 'Text Cleaner',
  meta: [
    { name: 'description', content: 'Clean and format text by removing spaces, line breaks, punctuation, numbers, and more.' },
    { property: 'og:title', content: 'Text Cleaner' },
    { property: 'og:description', content: 'Clean and format text by removing spaces, line breaks, punctuation, numbers, and more.' }
  ]
})

const { celebrateFirstUse } = useMilestones()
const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

const input = ref('')
const output = ref('')
const justCleaned = ref(false)
const downloaded = ref(false)

const opts = ref<{ 
  removeExtraSpaces: boolean
  removeLineBreaks: boolean
  trimWhitespace: boolean
  removeSpecial: boolean
  removeNumbers: boolean
  removePunctuation: boolean
  case: 'none' | 'lower' | 'upper'
}>({
  removeExtraSpaces: true,
  removeLineBreaks: false,
  trimWhitespace: true,
  removeSpecial: false,
  removeNumbers: false,
  removePunctuation: false,
  case: 'none'
})

const beforeChars = computed(() => countChars(input.value))
const afterChars = computed(() => countChars(output.value))
const afterWords = computed(() => countWordsFn(output.value))
const savedPercent = computed(() => {
  if (beforeChars.value === 0) return 0
  return Math.round((1 - afterChars.value / beforeChars.value) * 100)
})

function btnCase(kind: 'none' | 'lower' | 'upper') {
  const active = opts.value.case === kind
  return ['btn-primary', active ? 'btn-primary-cyan' : 'btn-primary-white']
}

async function paste() {
  try {
    input.value = await navigator.clipboard.readText()
  } catch {}
}

function clean() {
  celebrateFirstUse('text-cleaner')

  let txt = input.value
  if (!txt) { output.value = ''; return }

  if (opts.value.trimWhitespace) txt = trimWhitespace(txt)
  if (opts.value.removeExtraSpaces) txt = removeExtraSpaces(txt)
  if (opts.value.removeLineBreaks) txt = removeLineBreaks(txt)
  if (opts.value.removeSpecial) txt = removeSpecialChars(txt)
  if (opts.value.removeNumbers) txt = removeNumbers(txt)
  if (opts.value.removePunctuation) txt = removePunctuation(txt)
  if (opts.value.case === 'lower') txt = txt.toLowerCase()
  if (opts.value.case === 'upper') txt = txt.toUpperCase()

  output.value = txt
  justCleaned.value = true
  setTimeout(() => (justCleaned.value = false), 900)
}

function copy() {
  if (!output.value) return
  copyWithFeedback(output.value)
}

function download() {
  if (!output.value) return
  const blob = new Blob([output.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'cleaned_text.txt'
  a.click()
  URL.revokeObjectURL(url)
  downloaded.value = true
  setTimeout(() => (downloaded.value = false), 1200)
}
</script>