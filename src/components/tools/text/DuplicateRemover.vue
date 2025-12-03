<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">
      Duplicate Line Remover
    </h2>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- Controls & Stats -->
      <div class="space-y-6">
        <div class="bg-brutal-white border-4 border-black p-6 space-y-4">
          <h3 class="font-black text-lg">
            Options
          </h3>

          <label class="flex items-center gap-2">
            <input
              v-model="caseSensitive"
              type="checkbox"
              class="w-4 h-4"
            >
            <span class="font-black">Case sensitive</span>
          </label>

          <div class="grid grid-cols-2 gap-2">
            <button
              :disabled="!input"
              class="btn-primary btn-primary-lime disabled:opacity-50"
              :class="{ 'animate-brutal-bounce': justProcessed }"
              @click="process"
            >
              <span v-if="justProcessed">Done!</span>
              <span v-else>Remove Duplicates</span>
            </button>
            <button
              class="btn-primary btn-primary-cyan"
              :class="{ 'animate-brutal-bounce': justSorted }"
              @click="sortLines"
            >
              <span v-if="justSorted">Sorted!</span>
              <span v-else>Sort Lines</span>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button
              class="btn-primary btn-primary-yellow"
              :class="{ 'animate-copy-bounce': copying }"
              :data-state="copying ? 'success' : null"
              @click="copyOutput"
            >
              <span v-if="copying">Copied!</span>
              <span v-else>Copy</span>
            </button>
            <button
              class="btn-primary btn-primary-pink"
              @click="reset"
            >
              Clear
            </button>
          </div>
        </div>

        <div class="bg-brutal-yellow border-4 border-black p-6">
          <h3 class="font-black text-lg mb-4">
            Statistics
          </h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="font-bold">Total lines:</span>
              <span class="font-black">{{ totalLinesDisplay }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Unique lines:</span>
              <span class="font-black">{{ uniqueLinesDisplay }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Duplicates removed:</span>
              <span class="font-black text-brutal-pink">{{ duplicatesRemovedDisplay }}</span>
            </div>
            <div
              v-if="duplicatesRemoved > 0"
              class="pt-2"
            >
              <div class="text-sm font-black text-brutal-green">
                Great! You cleaned up your list!
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Text Areas -->
      <div class="md:col-span-2 grid md:grid-cols-2 gap-4">
        <div class="bg-brutal-white border-4 border-black p-6">
          <h3 class="font-black text-lg mb-4">
            Input
          </h3>
          <textarea
            v-model="input"
            class="input w-full h-[30rem] resize-none"
            placeholder="Paste your list with duplicate lines here..."
          />
        </div>
        <div class="bg-brutal-cyan border-4 border-black p-6">
          <h3 class="font-black text-lg mb-4">
            Output
          </h3>
          <textarea
            :value="output"
            readonly
            class="input w-full h-[30rem] resize-none bg-brutal-gray"
            placeholder="Unique lines will appear here..."
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'
import { useMilestones } from '../../../composables/useMilestones'
import { useCountUp } from '../../../composables/useCountUp'
import { removeDuplicateLines, sortLines as sortLinesUtil, countLines } from '../../../utils/textProcessing'

useHead({
  title: 'Duplicate Line Remover',
  meta: [
    { name: 'description', content: 'Remove duplicate lines from text. Sort lines alphabetically and compare with case sensitivity options.' },
    { property: 'og:title', content: 'Duplicate Line Remover' },
    { property: 'og:description', content: 'Remove duplicate lines from text. Sort lines alphabetically and compare with case sensitivity options.' }
  ]
})

const { celebrateFirstUse } = useMilestones()
const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

const input = ref('')
const output = ref('')
const caseSensitive = ref(true)
const justProcessed = ref(false)
const justSorted = ref(false)

const totalLines = computed(() => countLines(input.value))
const uniqueLines = computed(() => countLines(output.value))
const duplicatesRemoved = computed(() => totalLines.value - uniqueLines.value)

// Animation counters
const totalLinesAnim = useCountUp(0, { duration: 500 })
const uniqueLinesAnim = useCountUp(0, { duration: 500 })
const duplicatesRemovedAnim = useCountUp(0, { duration: 500 })

// Display values
const totalLinesDisplay = computed(() => totalLinesAnim.displayValue.value)
const uniqueLinesDisplay = computed(() => uniqueLinesAnim.displayValue.value)
const duplicatesRemovedDisplay = computed(() => duplicatesRemovedAnim.displayValue.value)

// Update animations when values change
watch(totalLines, (val) => totalLinesAnim.setValue(val))
watch(uniqueLines, (val) => uniqueLinesAnim.setValue(val))
watch(duplicatesRemoved, (val) => duplicatesRemovedAnim.setValue(val))

function process() {
  celebrateFirstUse('duplicate-remover')
  const lines = input.value.trim() ? removeDuplicateLines(input.value, caseSensitive.value) : []
  output.value = lines.join('\n')
  justProcessed.value = true
  setTimeout(() => (justProcessed.value = false), 1000)
}

function sortLines() {
  celebrateFirstUse('duplicate-remover')
  const lines = input.value.trim() ? sortLinesUtil(input.value, caseSensitive.value) : []
  output.value = lines.join('\n')
  justSorted.value = true
  setTimeout(() => (justSorted.value = false), 1000)
}

function copyOutput() {
  if (!output.value) return
  copyWithFeedback(output.value)
}

function reset() {
  input.value = ''
  output.value = ''
}
</script>