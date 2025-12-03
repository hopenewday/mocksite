<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          CSS Minifier & Beautifier
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Minify CSS code to reduce file size or beautify it for readability.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <label class="font-black">Mode:</label>
            <label class="inline-flex items-center gap-2">
              <input
                v-model="mode"
                type="radio"
                value="minify"
              >
              <span>Minify</span>
            </label>
            <label class="inline-flex items-center gap-2">
              <input
                v-model="mode"
                type="radio"
                value="beautify"
              >
              <span>Beautify</span>
            </label>
          </div>

          <div
            v-if="mode === 'beautify'"
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

          <label class="font-black block mb-2">Input CSS</label>
          <textarea 
            v-model="input" 
            rows="12" 
            class="input-brutal w-full font-mono text-sm"
            placeholder="Paste your CSS here..."
          />

          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button
              class="btn-primary btn-primary-yellow"
              :disabled="!input.trim()"
              @click="processCSS"
            >
              {{ mode === 'minify' ? 'Minify' : 'Beautify' }}
            </button>
            <button
              class="btn-primary btn-primary-lime"
              :disabled="!output"
              :class="{ 'animate-copy-bounce': copyingOutput }"
              @click="copyOutput"
            >
              Copy CSS
            </button>
            <button
              class="btn-primary btn-primary-pink"
              :disabled="!output"
              @click="downloadOutput"
            >
              Download
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
        </div>

        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <div class="flex items-center justify-between mb-2">
            <label class="font-black block">Output CSS</label>
            <div
              v-if="stats.originalSize && stats.processedSize"
              class="text-sm font-black"
            >
              {{ formatSize(stats.processedSize) }} / {{ formatSize(stats.originalSize) }}
            </div>
          </div>
          <textarea 
            :value="output" 
            readonly 
            rows="12" 
            class="input-brutal w-full font-mono text-sm"
            placeholder="Minified or beautified CSS will appear here..."
          />

          <div
            v-if="stats.savings"
            class="mt-3 p-2 bg-brutal-lime border-2 border-black text-center"
          >
            <p class="font-black">
              Size reduction: {{ stats.savings }}%
            </p>
            <p
              v-if="stats.savings >= 50"
              class="text-green-600 text-sm"
            >
              🎉 Great savings achieved!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import { saveAs } from 'file-saver'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'

useHead({
  title: 'CSS Minifier & Beautifier - Free Online Tool',
  meta: [
    { name: 'description', content: 'Minify CSS code to reduce file size or beautify it for readability. Free online CSS tool.' },
    { property: 'og:title', content: 'CSS Minifier & Beautifier' },
    { property: 'og:description', content: 'Minify CSS code to reduce file size or beautify it for readability.' }
  ]
})

const mode = ref<'minify' | 'beautify'>('minify')
const indentation = ref('2')
const input = ref('')
const output = ref('')
const error = ref('')

const stats = ref({
  originalSize: 0,
  processedSize: 0,
  savings: 0
})

const { copyWithFeedback, isCopying: copyingOutput } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

const minifyCSS = (css: string): string => {
  let minified = css

  // Remove comments
  minified = minified.replace(/\/\*[\s\S]*?\*\//g, '')

  // Remove unnecessary whitespace
  minified = minified.replace(/\s+/g, ' ')

  // Remove spaces around specific characters
  minified = minified.replace(/\s*{/g, '{')
  minified = minified.replace(/}/g, '}')
  minified = minified.replace(/;/g, ';')
  minified = minified.replace(/:\s*/g, ':')
  minified = minified.replace(/,\s*/g, ',')
  minified = minified.replace(/>\s*/g, '>')
  minified = minified.replace(/\+\s*/g, '+')
  minified = minified.replace(/~\s*/g, '~')

  // Remove spaces around selectors
  minified = minified.replace(/\s*([>+~])\s*/g, '$1')

  // Remove leading and trailing whitespace
  minified = minified.trim()

  return minified
}

const beautifyCSS = (css: string, indent: string = '  '): string => {
  let beautified = css

  // Remove comments first
  beautified = beautified.replace(/\/\*[\s\S]*?\*\//g, '')

  // Add proper indentation
  let indentLevel = 0
  beautified = beautified
    .replace(/\{/g, '{\n' + indent.repeat(indentLevel + 1))
    .replace(/\}/g, '\n' + indent.repeat(Math.max(0, indentLevel - 1)) + '}\n' + indent.repeat(indentLevel - 1))
    .replace(/;/g, ';\n' + indent.repeat(indentLevel + 1))
    .replace(/:\s*/g, ': ')

  // Clean up extra newlines and whitespace
  beautified = beautified
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')

  return beautified
}

const processCSS = () => {
  error.value = ''
  output.value = ''
  stats.value = { originalSize: 0, processedSize: 0, savings: 0 }
  
  const trimmedInput = input.value.trim()
  if (!trimmedInput) {
    error.value = 'Please enter CSS code'
    return
  }

  stats.value.originalSize = trimmedInput.length

  try {
    if (mode.value === 'minify') {
      output.value = minifyCSS(trimmedInput)
      stats.value.processedSize = output.value.length
    } else {
      const indent = indentation.value === '\\t' ? '\t' : indentation.value
      output.value = beautifyCSS(trimmedInput, indent)
      stats.value.processedSize = output.value.length
    }

    if (stats.value.originalSize > stats.value.processedSize) {
      stats.value.savings = Math.round((1 - stats.value.processedSize / stats.value.originalSize) * 100)
    }

    celebrateFirstUse('css-minifier')

  } catch (e: any) {
    error.value = e.message || 'CSS processing failed'
  }
}

const copyOutput = async () => {
  if (!output.value) return
  await copyWithFeedback(output.value)
}

const downloadOutput = () => {
  if (!output.value) return
  const blob = new Blob([output.value], { type: 'text/css' })
  saveAs(blob, mode.value === 'minify' ? 'minified.css' : 'beautified.css')
}

const clearAll = () => {
  input.value = ''
  output.value = ''
  error.value = ''
  stats.value = { originalSize: 0, processedSize: 0, savings: 0 }
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
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
