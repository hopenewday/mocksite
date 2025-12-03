<template>
  <div class="card card-brutal-purple p-8">
    <h2 class="subheading-brutal mb-6">
      Text Diff Tool
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Original Text -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Original Text
        </h3>
        
        <textarea 
          v-model="originalText"
          placeholder="Enter original text here..."
          class="input w-full h-64 resize-none mb-4"
        />
        
        <div class="flex gap-2">
          <button
            class="btn-primary btn-primary-pink"
            @click="clearOriginal"
          >
            Clear
          </button>
          
          <button
            class="btn-primary btn-primary-cyan"
            @click="pasteOriginal"
          >
            Paste
          </button>
        </div>
        
        <div class="text-sm font-bold text-brutal-gray mt-2">
          Characters: {{ originalCharacterCountDisplay }} | Words: {{ originalWordCountDisplay }}
        </div>
      </div>
      
      <!-- Modified Text -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Modified Text
        </h3>
        
        <textarea 
          v-model="modifiedText"
          placeholder="Enter modified text here..."
          class="input w-full h-64 resize-none mb-4"
        />
        
        <div class="flex gap-2">
          <button
            class="btn-primary btn-primary-pink"
            @click="clearModified"
          >
            Clear
          </button>
          
          <button
            class="btn-primary btn-primary-cyan"
            @click="pasteModified"
          >
            Paste
          </button>
        </div>
        
        <div class="text-sm font-bold text-brutal-gray mt-2">
          Characters: {{ modifiedCharacterCountDisplay }} | Words: {{ modifiedWordCountDisplay }}
        </div>
      </div>
    </div>
    
    <!-- Compare Button -->
    <div class="text-center mb-8">
      <button 
        :disabled="!originalText || !modifiedText"
        class="btn-primary btn-primary-lime px-8 py-4 text-lg disabled:opacity-50"
        @click="compareTexts"
      >
        Compare Texts
      </button>
    </div>
    
    <!-- Diff Results -->
    <div
      v-if="diffResult"
      class="space-y-6"
    >
      <!-- Summary -->
      <div class="bg-brutal-yellow border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Comparison Summary
        </h3>
        
        <div class="grid md:grid-cols-4 gap-4">
          <div class="text-center bg-brutal-white border-2 border-black p-4">
            <div class="text-2xl font-black text-brutal-lime">
              {{ diffResult.added }}
            </div>
            <div class="text-sm font-bold">
              Added
            </div>
          </div>
          
          <div class="text-center bg-brutal-white border-2 border-black p-4">
            <div class="text-2xl font-black text-brutal-pink">
              {{ diffResult.removed }}
            </div>
            <div class="text-sm font-bold">
              Removed
            </div>
          </div>
          
          <div class="text-center bg-brutal-white border-2 border-black p-4">
            <div class="text-2xl font-black text-brutal-cyan">
              {{ diffResult.modified }}
            </div>
            <div class="text-sm font-bold">
              Modified
            </div>
          </div>
          
          <div class="text-center bg-brutal-white border-2 border-black p-4">
            <div class="text-2xl font-black text-brutal-gray">
              {{ diffResult.unchanged }}
            </div>
            <div class="text-sm font-bold">
              Unchanged
            </div>
          </div>
        </div>
      </div>
      
      <!-- Side by Side Comparison -->
      <div class="bg-brutal-lime border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Side by Side Comparison
        </h3>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <h4 class="font-bold mb-2">
              Original
            </h4>
            <div class="bg-brutal-white border-2 border-black p-4 max-h-64 overflow-y-auto">
              <div 
                v-for="(line, index) in diffResult.originalLines" 
                :key="index"
                :class="getLineClass(line.type)"
                class="p-1 font-mono text-sm"
              >
                {{ line.content }}
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="font-bold mb-2">
              Modified
            </h4>
            <div class="bg-brutal-white border-2 border-black p-4 max-h-64 overflow-y-auto">
              <div 
                v-for="(line, index) in diffResult.modifiedLines" 
                :key="index"
                :class="getLineClass(line.type)"
                class="p-1 font-mono text-sm"
              >
                {{ line.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Unified View -->
      <div class="bg-brutal-pink border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Unified View
        </h3>
        
        <div class="bg-brutal-white border-2 border-black p-4 max-h-64 overflow-y-auto">
          <div 
            v-for="(line, index) in diffResult.unifiedLines" 
            :key="index"
            :class="getLineClass(line.type)"
            class="p-1 font-mono text-sm"
          >
            <span class="inline-block w-8 font-black">{{ line.prefix }}</span>
            {{ line.content }}
          </div>
        </div>
      </div>
      
      <!-- Export Options -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Export Options
        </h3>
        
        <div class="flex gap-4">
          <button
            class="btn-primary btn-primary-cyan"
            @click="exportAsHTML"
          >
            Export as HTML
          </button>
          
          <button
            class="btn-primary btn-primary-lime"
            @click="exportAsText"
          >
            Export as Text
          </button>
          
          <button
            class="btn-primary btn-primary-yellow"
            :class="{ 'animate-copy-bounce': copyingDiff }"
            :data-state="copyingDiff ? 'success' : null"
            @click="copyDiff"
          >
            <span v-if="copyingDiff">Copied!</span>
            <span v-else>Copy Diff</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { useCountUp } from '../../../composables/useCountUp'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'

interface DiffLine {
  content: string
  type: 'added' | 'removed' | 'modified' | 'unchanged'
  prefix?: string
}

interface DiffResult {
  added: number
  removed: number
  modified: number
  unchanged: number
  originalLines: DiffLine[]
  modifiedLines: DiffLine[]
  unifiedLines: DiffLine[]
}

useHead({
  title: 'Text Diff Tool',
  meta: [
    { name: 'description', content: 'Compare two blocks of text and highlight differences.' },
    { property: 'og:title', content: 'Text Diff Tool' },
    { property: 'og:description', content: 'Compare two blocks of text and highlight differences.' }
  ]
})

const originalText = ref('')
const modifiedText = ref('')
const diffResult = ref<DiffResult | null>(null)

// Count-up animations
const originalCharacterCountAnimation = useCountUp(0, { duration: 600 })
const originalWordCountAnimation = useCountUp(0, { duration: 600 })
const modifiedCharacterCountAnimation = useCountUp(0, { duration: 600 })
const modifiedWordCountAnimation = useCountUp(0, { duration: 600 })

// Copy feedback
const { isCopying: copyingDiff, copyWithFeedback: copyDiffFeedback } = useCopyFeedback()

const originalWordCount = computed(() => {
  if (!originalText.value.trim()) return 0
  return originalText.value.trim().split(/\s+/).length
})

const modifiedWordCount = computed(() => {
  if (!modifiedText.value.trim()) return 0
  return modifiedText.value.trim().split(/\s+/).length
})

// Update count-up animations when values change
watch(() => originalText.value.length, (newValue) => originalCharacterCountAnimation.setValue(newValue))
watch(originalWordCount, (newValue) => originalWordCountAnimation.setValue(newValue))
watch(() => modifiedText.value.length, (newValue) => modifiedCharacterCountAnimation.setValue(newValue))
watch(modifiedWordCount, (newValue) => modifiedWordCountAnimation.setValue(newValue))

// Display values for template
const originalCharacterCountDisplay = computed(() => originalCharacterCountAnimation.displayValue.value)
const originalWordCountDisplay = computed(() => originalWordCountAnimation.displayValue.value)
const modifiedCharacterCountDisplay = computed(() => modifiedCharacterCountAnimation.displayValue.value)
const modifiedWordCountDisplay = computed(() => modifiedWordCountAnimation.displayValue.value)

const compareTexts = () => {
  if (!originalText.value || !modifiedText.value) return
  
  const originalLines = originalText.value.split('\n')
  const modifiedLines = modifiedText.value.split('\n')
  
  // Simple diff algorithm
  const { original, modified, unified } = performDiff(originalLines, modifiedLines)
  
  // Calculate statistics
  const stats = calculateStatistics(original, modified)
  
  diffResult.value = {
    ...stats,
    originalLines: original,
    modifiedLines: modified,
    unifiedLines: unified
  }
}

const performDiff = (original: string[], modified: string[]) => {
  const originalResult: DiffLine[] = []
  const modifiedResult: DiffLine[] = []
  const unifiedResult: DiffLine[] = []
  
  const maxLength = Math.max(original.length, modified.length)
  
  for (let i = 0; i < maxLength; i++) {
    const originalLine = original[i] || ''
    const modifiedLine = modified[i] || ''
    
    if (originalLine === modifiedLine) {
      originalResult.push({ content: originalLine, type: 'unchanged' })
      modifiedResult.push({ content: modifiedLine, type: 'unchanged' })
      unifiedResult.push({ content: originalLine, type: 'unchanged', prefix: '  ' })
    } else {
      if (originalLine) {
        originalResult.push({ content: originalLine, type: 'removed' })
        unifiedResult.push({ content: originalLine, type: 'removed', prefix: '- ' })
      }
      
      if (modifiedLine) {
        modifiedResult.push({ content: modifiedLine, type: 'added' })
        unifiedResult.push({ content: modifiedLine, type: 'added', prefix: '+ ' })
      }
    }
  }
  
  return { original: originalResult, modified: modifiedResult, unified: unifiedResult }
}

const calculateStatistics = (originalLines: DiffLine[], modifiedLines: DiffLine[]) => {
  let added = 0
  let removed = 0
  let modifiedCount = 0
  let unchanged = 0
  
  originalLines.forEach(line => {
    if (line.type === 'removed') removed++
    else if (line.type === 'unchanged') unchanged++
    else if (line.type === 'modified') modifiedCount++
  })
  
  modifiedLines.forEach(line => {
    if (line.type === 'added') added++
  })
  
  return { added, removed, modified: modifiedCount, unchanged }
}

const getLineClass = (type: string) => {
  switch (type) {
    case 'added':
      return 'bg-green-200 border-l-4 border-green-500'
    case 'removed':
      return 'bg-red-200 border-l-4 border-red-500'
    case 'modified':
      return 'bg-yellow-200 border-l-4 border-yellow-500'
    case 'unchanged':
      return ''
    default:
      return ''
  }
}

const clearOriginal = () => {
  originalText.value = ''
  diffResult.value = null
}

const clearModified = () => {
  modifiedText.value = ''
  diffResult.value = null
}

const pasteOriginal = async () => {
  try {
    const text = await navigator.clipboard.readText()
    originalText.value = text
  } catch (error) {
    console.error('Failed to paste text:', error)
  }
}

const pasteModified = async () => {
  try {
    const text = await navigator.clipboard.readText()
    modifiedText.value = text
  } catch (error) {
    console.error('Failed to paste text:', error)
  }
}

const exportAsHTML = () => {
  if (!diffResult.value) return
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Text Diff Result</title>
      <style>
        body { font-family: monospace; margin: 20px; }
        .added { background-color: #d4edda; color: #155724; }
        .removed { background-color: #f8d7da; color: #721c24; }
        .unchanged { }
        .line { padding: 2px 0; }
      </style>
    </head>
    <body>
      <h1>Text Diff Result</h1>
      <div>
  `
  
  diffResult.value.unifiedLines.forEach(line => {
    html += `<div class="line ${line.type}">${line.prefix}${line.content}</div>`
  })
  
  html += `
      </div>
    </body>
    </html>
  `
  
  downloadFile(html, 'diff_result.html', 'text/html')
}

const exportAsText = () => {
  if (!diffResult.value) return
  
  let text = ''
  diffResult.value.unifiedLines.forEach(line => {
    text += `${line.prefix}${line.content}\n`
  })
  
  downloadFile(text, 'diff_result.txt', 'text/plain')
}

const copyDiff = async () => {
  if (!diffResult.value) return
  
  let text = ''
  diffResult.value.unifiedLines.forEach(line => {
    text += `${line.prefix}${line.content}\n`
  })
  
  await copyDiffFeedback(text, 'Diff copied!')
}

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>
