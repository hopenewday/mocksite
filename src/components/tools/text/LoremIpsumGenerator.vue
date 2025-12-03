<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Lorem Ipsum Generator
    </h2>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- Controls -->
      <div class="bg-brutal-white border-4 border-black p-6 space-y-4 md:col-span-1">
        <div>
          <label class="font-black block mb-2">Mode</label>
          <div class="flex flex-wrap gap-2">
            <button
              :class="btnClass(mode === 'paragraphs')"
              @click="mode='paragraphs'"
            >
              Paragraphs
            </button>
            <button
              :class="btnClass(mode === 'sentences')"
              @click="mode='sentences'"
            >
              Sentences
            </button>
            <button
              :class="btnClass(mode === 'words')"
              @click="mode='words'"
            >
              Words
            </button>
          </div>
        </div>

        <div>
          <label class="font-black block mb-2">Quantity</label>
          <input
            v-model.number="quantity"
            type="number"
            min="1"
            max="100"
            class="input w-full"
          >
          <small class="font-bold text-brutal-gray">1–100</small>
        </div>

        <label class="flex items-center gap-2">
          <input
            v-model="startWithClassic"
            type="checkbox"
            class="w-4 h-4"
          >
          <span class="font-black">Start with "Lorem ipsum dolor sit amet..."</span>
        </label>

        <div>
          <button
            class="btn-primary btn-primary-lime w-full"
            :class="{ 'animate-brutal-bounce': justGenerated }"
            @click="generate"
          >
            <span v-if="justGenerated">Generated!</span>
            <span v-else>Generate</span>
          </button>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button
            class="btn-primary btn-primary-cyan"
            :class="{ 'animate-copy-bounce': copying }"
            :data-state="copying ? 'success' : null"
            @click="copyOutput"
          >
            <span v-if="copying">Copied!</span>
            <span v-else>Copy</span>
          </button>
          <button
            class="btn-primary btn-primary-pink"
            @click="clearOutput"
          >
            Clear
          </button>
        </div>

        <div class="text-sm font-bold text-brutal-gray">
          Characters: {{ charCountDisplay }} | Words: {{ wordCountDisplay }}
        </div>
      </div>

      <!-- Output -->
      <div class="md:col-span-2 bg-brutal-cyan border-4 border-black p-6">
        <textarea
          v-model="output"
          class="input w-full h-[32rem] resize-none bg-brutal-gray"
          placeholder="Generated lorem ipsum will appear here..."
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from '@vueuse/head'
import { useCountUp } from '../../../composables/useCountUp'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'
import { useMilestones } from '../../../composables/useMilestones'

useHead({
  title: 'Lorem Ipsum Generator',
  meta: [
    { name: 'description', content: 'Generate lorem ipsum text by paragraphs, sentences, or words.' },
    { property: 'og:title', content: 'Lorem Ipsum Generator' },
    { property: 'og:description', content: 'Generate lorem ipsum text by paragraphs, sentences, or words.' }
  ]
})

const { celebrateFirstUse } = useMilestones()

const mode = ref<'paragraphs' | 'sentences' | 'words'>('paragraphs')
const quantity = ref(3)
const startWithClassic = ref(true)
const output = ref('')
const justGenerated = ref(false)

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

const charCount = computed(() => output.value.length)
const wordCount = computed(() => (output.value.trim() ? output.value.trim().split(/\s+/).length : 0))

const charCountAnim = useCountUp(0, { duration: 600 })
const wordCountAnim = useCountUp(0, { duration: 600 })

const charCountDisplay = computed(() => charCountAnim.displayValue.value)
const wordCountDisplay = computed(() => wordCountAnim.displayValue.value)

function btnClass(active: boolean) {
  return [
    'btn-primary',
    active ? 'btn-primary-yellow' : 'btn-primary-white'
  ]
}

function copyOutput() {
  if (!output.value) return
  copyWithFeedback(output.value)
}

function clearOutput() {
  output.value = ''
}

const PARAGRAPHS: string[] = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Donec sollicitudin molestie malesuada.',
  'Pellentesque in ipsum id orci porta dapibus. Proin eget tortor risus. Nulla quis lorem ut libero malesuada feugiat.',
  'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Nulla porttitor accumsan tincidunt.',
  'Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.'
]

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickParagraphs(n: number): string[] {
  const result: string[] = []
  for (let i = 0; i < n; i++) {
    result.push(PARAGRAPHS[getRandomInt(0, PARAGRAPHS.length - 1)])
  }
  return result
}

function sentencesFromParagraphs(paragraphs: string[]): string[] {
  return paragraphs.flatMap(p => p.split(/(?<=[.!?])\s+/).filter(Boolean))
}

function wordsFromSentences(sentences: string[]): string[] {
  return sentences.flatMap(s => s.replace(/[^\w\s'-]/g, '').split(/\s+/).filter(Boolean))
}

function generate() {
  celebrateFirstUse('lorem-ipsum')

  let text = ''
  const qty = Math.min(Math.max(quantity.value, 1), 100)

  if (mode.value === 'paragraphs') {
    const paras = pickParagraphs(qty)
    if (startWithClassic.value) paras[0] = PARAGRAPHS[0]
    text = paras.join('\n\n')
  } else if (mode.value === 'sentences') {
    const sentences = sentencesFromParagraphs(pickParagraphs(8))
    const chosen: string[] = []
    if (startWithClassic.value) chosen.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
    while (chosen.length < qty && sentences.length) {
      const index = getRandomInt(0, sentences.length - 1)
      chosen.push(sentences.splice(index, 1)[0])
    }
    text = chosen.join(' ')
  } else {
    // words
    const sentences = sentencesFromParagraphs(pickParagraphs(8))
    const words = wordsFromSentences(sentences)
    const chosen: string[] = []
    if (startWithClassic.value) {
      chosen.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet')
    }
    while (chosen.length < qty && words.length) {
      const index = getRandomInt(0, words.length - 1)
      chosen.push(words[index])
    }
    text = chosen.join(' ')
  }

  output.value = text
  justGenerated.value = true
  setTimeout(() => (justGenerated.value = false), 1000)

  // update counters
  charCountAnim.setValue(charCount.value)
  wordCountAnim.setValue(wordCount.value)
}
</script>
