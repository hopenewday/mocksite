<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          JSON Formatter & Validator
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Format, validate, minify JSON with syntax highlighting and error detection.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <label class="font-black">Action:</label>
            <label class="inline-flex items-center gap-2">
              <input
                v-model="action"
                type="radio"
                value="format"
              >
              <span>Format</span>
            </label>
            <label class="inline-flex items-center gap-2">
              <input
                v-model="action"
                type="radio"
                value="minify"
              >
              <span>Minify</span>
            </label>
            <label class="inline-flex items-center gap-2">
              <input
                v-model="action"
                type="radio"
                value="validate"
              >
              <span>Validate</span>
            </label>
          </div>

          <div
            v-if="action === 'format'"
            class="mb-3"
          >
            <label class="font-black block mb-1">Indentation</label>
            <select
              v-model="indentation"
              class="input-brutal w-full"
            >
              <option value="2">
                2 spaces
              </option>
              <option value="4">
                4 spaces
              </option>
              <option value="\t">
                Tab
              </option>
            </select>
          </div>

          <label class="font-black block mb-2">Input JSON</label>
          <textarea 
            v-model="input" 
            rows="12" 
            class="input-brutal w-full font-mono text-sm"
            placeholder="Paste your JSON here..."
          />

          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button
              class="btn-primary btn-primary-yellow"
              :disabled="!input.trim()"
              @click="processJSON"
            >
              {{ action.charAt(0).toUpperCase() + action.slice(1) }}
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
              class="btn-primary btn-primary-pink"
              @click="clearAll"
            >
              Clear
            </button>
            <span
              v-if="isValid === true"
              class="font-black text-green-600"
            >✓ Valid JSON</span>
            <span
              v-if="isValid === false"
              class="font-black text-red-600"
            >✗ Invalid JSON</span>
          </div>

          <div
            v-if="error"
            class="mt-3 p-3 bg-red-100 border-4 border-red-500 text-red-800"
          >
            <p class="font-black">
              Error: {{ error }}
            </p>
            <p
              v-if="errorLine"
              class="text-sm"
            >
              Line {{ errorLine }}, Column {{ errorColumn }}
            </p>
          </div>
        </div>

        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <div class="flex items-center justify-between mb-2">
            <label class="font-black block">Output</label>
            <div
              v-if="stats.originalSize && stats.processedSize"
              class="text-sm font-black"
            >
              {{ stats.processedSize }} ({{ formatSize(stats.processedSize) }}) / {{ formatSize(stats.originalSize) }}
            </div>
          </div>
          <textarea 
            :value="output" 
            readonly 
            rows="12" 
            class="input-brutal w-full font-mono text-sm"
            :class="{ 'bg-green-50': isValid === true, 'bg-red-50': isValid === false }"
            placeholder="Result will appear here..."
          />
          <div
            v-if="output"
            class="mt-4 border-4 border-black bg-white overflow-auto"
          >
            <pre class="language-json"><code v-html="highlighted" /></pre>
          </div>

          <div
            v-if="stats.savings"
            class="mt-3 p-2 bg-brutal-lime border-2 border-black text-center"
          >
            <p class="font-black">
              Size reduction: {{ stats.savings }}%
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'
import Prism from 'prismjs'
import 'prismjs/components/prism-json'
import 'prismjs/themes/prism.css'

useHead({
  title: 'JSON Formatter & Validator - Free Online Tool',
  meta: [
    { name: 'description', content: 'Format, validate, minify JSON with syntax highlighting and error detection. Free online JSON tool.' },
    { property: 'og:title', content: 'JSON Formatter & Validator' },
    { property: 'og:description', content: 'Format, validate, minify JSON with syntax highlighting and error detection.' }
  ]
})

const action = ref<'format' | 'minify' | 'validate'>('format')
const indentation = ref('2')
const input = ref('')
const output = ref('')
const error = ref('')
const errorLine = ref<number | null>(null)
const errorColumn = ref<number | null>(null)
const isValid = ref<boolean | null>(null)

const stats = ref({
  originalSize: 0,
  processedSize: 0,
  savings: 0
})

const { copyWithFeedback, isCopying: copyingOutput } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

const processJSON = () => {
  error.value = ''
  errorLine.value = null
  errorColumn.value = null
  output.value = ''
  isValid.value = null
  stats.value = { originalSize: 0, processedSize: 0, savings: 0 }
  
  const trimmedInput = input.value.trim()
  if (!trimmedInput) {
    error.value = 'Please enter JSON data'
    return
  }

  stats.value.originalSize = trimmedInput.length

  try {
    const parsed = JSON.parse(trimmedInput)
    isValid.value = true

    if (action.value === 'format') {
      const indent = indentation.value === '\\t' ? '\t' : indentation.value
      output.value = JSON.stringify(parsed, null, indent)
      stats.value.processedSize = output.value.length
    } else if (action.value === 'minify') {
      output.value = JSON.stringify(parsed)
      stats.value.processedSize = output.value.length
    } else if (action.value === 'validate') {
      output.value = JSON.stringify(parsed, null, 2)
      stats.value.processedSize = output.value.length
    }

    if (stats.value.originalSize > stats.value.processedSize) {
      stats.value.savings = Math.round((1 - stats.value.processedSize / stats.value.originalSize) * 100)
    }

    celebrateFirstUse('json-formatter')

  } catch (e: any) {
    isValid.value = false
    error.value = e.message || 'Invalid JSON format'
    
    // Try to get line and column info from error
    const match = e.message.match(/position (\d+)/)
    if (match) {
      const position = parseInt(match[1])
      const lines = input.value.substring(0, position).split('\n')
      errorLine.value = lines.length
      errorColumn.value = lines[lines.length - 1].length + 1
    }
  }
}

const copyOutput = async () => {
  if (!output.value) return
  await copyWithFeedback(output.value)
}

const clearAll = () => {
  input.value = ''
  output.value = ''
  error.value = ''
  errorLine.value = null
  errorColumn.value = null
  isValid.value = null
  stats.value = { originalSize: 0, processedSize: 0, savings: 0 }
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Auto-validate on input change (debounced)
let validationTimeout: number | null = null
watch(input, () => {
  if (validationTimeout) clearTimeout(validationTimeout)
  validationTimeout = setTimeout(() => {
    if (input.value.trim()) {
      try {
        JSON.parse(input.value)
        isValid.value = true
        error.value = ''
      } catch (e) {
        isValid.value = false
      }
    } else {
      isValid.value = null
      error.value = ''
    }
  }, 300)
})

const highlighted = computed(() => Prism.highlight(output.value || '', Prism.languages.json, 'json'))
</script>

<style scoped>
.input-brutal { @apply w-full p-3 border-4 border-black bg-white dark:bg-brutal-black text-black dark:text-white; }
.btn-primary { @apply px-4 py-2 border-4 border-black shadow-brutal font-black; }
.btn-primary-yellow { @apply bg-brutal-yellow; }
.btn-primary-lime { @apply bg-brutal-lime; }
.btn-primary-pink { @apply bg-brutal-pink; }
.card-brutal-white { @apply bg-brutal-white; }
.card-brutal-black { @apply bg-brutal-black; }
</style>
