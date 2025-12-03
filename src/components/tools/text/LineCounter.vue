<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">
      Line Counter
    </h2>

    <div class="grid md:grid-cols-3 gap-6">
      <!-- Text Input -->
      <div class="md:col-span-2 space-y-6">
        <div class="bg-brutal-white border-4 border-black p-6">
          <textarea
            v-model="text"
            placeholder="Paste or type your text here..."
            class="input w-full h-[32rem] resize-none"
          />
          <div class="mt-4 flex gap-4">
            <button
              class="btn-primary btn-primary-lime"
              :class="{ 'animate-brutal-bounce': justSorted }"
              @click="sortAndCalculate"
            >
              <span v-if="justSorted">Sorted!</span>
              <span v-else>Sort Lines</span>
            </button>
            <button
              class="btn-primary btn-primary-cyan"
              @click="copy"
            >
              Copy Text
            </button>
            <button
              class="btn-primary btn-primary-pink"
              @click="clear"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Statistics Overview -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-brutal-cyan border-4 border-black p-4 text-center">
            <div class="text-3xl font-black">
              {{ totalLinesDisplay }}
            </div>
            <div class="text-sm font-bold">
              Total Lines
            </div>
          </div>
          <div class="bg-brutal-pink border-4 border-black p-4 text-center">
            <div class="text-3xl font-black">
              {{ nonEmptyLinesDisplay }}
            </div>
            <div class="text-sm font-bold">
              Non-empty
            </div>
          </div>
          <div class="bg-brutal-yellow border-4 border-black p-4 text-center">
            <div class="text-3xl font-black">
              {{ uniqueLinesDisplay }}
            </div>
            <div class="text-sm font-bold">
              Unique Lines
            </div>
          </div>
          <div class="bg-brutal-white border-4 border-black p-4 text-center">
            <div class="text-3xl font-black">
              {{ charsDisplay }}
            </div>
            <div class="text-sm font-bold">
              Characters
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Statistics -->
      <div class="space-y-6">
        <div class="bg-brutal-yellow border-4 border-black p-6">
          <h3 class="font-black text-lg mb-4">
            Detailed Statistics
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="font-bold">Empty lines:</span>
              <span class="font-black">{{ emptyLinesDisplay }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Characters (no spaces):</span>
              <span class="font-black">{{ charsNoSpacesDisplay }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Words:</span>
              <span class="font-black">{{ wordsDisplay }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Avg chars per line:</span>
              <span class="font-black">{{ avgCharsDisplay }}</span>
            </div>
          </div>
        </div>

        <div class="bg-brutal-cyan border-4 border-black p-6">
          <h3 class="font-black text-lg mb-4">
            Options
          </h3>
          <div class="space-y-3">
            <label class="flex items-center gap-2">
              <input
                v-model="caseSensitive"
                type="checkbox"
                class="w-4 h-4"
              >
              <span class="font-black">Case sensitive counting</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="trimlines"
                type="checkbox"
                class="w-4 h-4"
              >
              <span class="font-black">Trim whitespace from lines</span>
            </label>
          </div>
        </div>

        <div class="bg-brutal-pink border-4 border-black p-6">
          <h3 class="font-black text-lg mb-4">
            Info
          </h3>
          <p class="text-sm font-bold">
            Line counter provides real-time statistics for your text. It counts total lines, non-empty lines, unique lines, and more.
          </p>
          <p class="text-sm font-black mt-2">
            Use the sort option to organize your lines alphabetically while maintaining all statistics.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { useCountUp } from '../../../composables/useCountUp'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'
import { useMilestones } from '../../../composables/useMilestones'
import { countLines, countCharacters, countWords, countUniqueLines, sortLines } from '../../../utils/textProcessing'

useHead({
  title: 'Line Counter',
  meta: [
    { name: 'description', content: 'Count total lines, non-empty lines, unique lines, characters, and words in your text with real-time statistics.' },
    { property: 'og:title', content: 'Line Counter' },
    { property: 'og:description', content: 'Count total lines, non-empty lines, unique lines, characters, and words in your text with real-time statistics.' }
  ]
})

const { celebrateFirstUse } = useMilestones()
const { copyWithFeedback } = useCopyFeedback()

const text = ref('')
const caseSensitive = ref(true)
const trimlines = ref(false)
const justSorted = ref(false)

// Basic statistics
const totalLines = computed(() => countLines(text.value))
const nonEmptyLines = computed(() => text.value.split('\n').filter(line => line.trim() !== '').length)
const emptyLines = computed(() => totalLines.value - nonEmptyLines.value)
const uniqueLines = computed(() => countUniqueLines(text.value, caseSensitive.value))
const chars = computed(() => countCharacters(text.value, true))
const charsNoSpaces = computed(() => countCharacters(text.value, false))
const words = computed(() => countWords(text.value))
const avgChars = computed(() => totalLines.value > 0 ? Math.round(chars.value / totalLines.value) : 0)

// Animated counters
const totalLinesAnim = useCountUp(0, { duration: 800 })
const nonEmptyLinesAnim = useCountUp(0, { duration: 800 })
const emptyLinesAnim = useCountUp(0, { duration: 600 })
const uniqueLinesAnim = useCountUp(0, { duration: 800 })
const charsAnim = useCountUp(0, { duration: 700 })
const charsNoSpacesAnim = useCountUp(0, { duration: 700 })
const wordsAnim = useCountUp(0, { duration: 600 })
const avgCharsAnim = useCountUp(0, { duration: 600 })

// Display values
const totalLinesDisplay = computed(() => totalLinesAnim.displayValue.value)
const nonEmptyLinesDisplay = computed(() => nonEmptyLinesAnim.displayValue.value)
const emptyLinesDisplay = computed(() => emptyLinesAnim.displayValue.value)
const uniqueLinesDisplay = computed(() => uniqueLinesAnim.displayValue.value)
const charsDisplay = computed(() => charsAnim.displayValue.value)
const charsNoSpacesDisplay = computed(() => charsNoSpacesAnim.displayValue.value)
const wordsDisplay = computed(() => wordsAnim.displayValue.value)
const avgCharsDisplay = computed(() => avgCharsAnim.displayValue.value)

// Update animations when values change
watch(totalLines, (val) => totalLinesAnim.setValue(val))
watch(nonEmptyLines, (val) => nonEmptyLinesAnim.setValue(val))
watch(emptyLines, (val) => emptyLinesAnim.setValue(val))
watch(uniqueLines, (val) => uniqueLinesAnim.setValue(val))
watch(chars, (val) => charsAnim.setValue(val))
watch(charsNoSpaces, (val) => charsNoSpacesAnim.setValue(val))
watch(words, (val) => wordsAnim.setValue(val))
watch(avgChars, (val) => avgCharsAnim.setValue(val))

function sortAndCalculate() {
  celebrateFirstUse('line-counter')
  if (trimlines.value) {
    const trimmed = text.value.split('\n').map(line => line.trim()).join('\n')
    text.value = sorted(trimmed, caseSensitive.value)
  } else {
    text.value = sorted(text.value, caseSensitive.value)
  }
  justSorted.value = true
  setTimeout(() => (justSorted.value = false), 1000)
}

function sorted(txt: string, caseSensitive: boolean): string {
  const lines = txt.split('\n')
  return sortLines(txt, caseSensitive).join('\n')
}

function copy() {
  if (!text.value) return
  copyWithFeedback(text.value)
}

function clear() {
  text.value = ''
}
</script>