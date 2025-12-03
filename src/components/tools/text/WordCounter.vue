<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">
      Word Counter
    </h2>
    
    <div class="space-y-6">
      <!-- Text Input -->
      <div>
        <label class="font-black mb-2 block">Enter Your Text</label>
        <textarea 
          v-model="text"
          placeholder="Type or paste your text here..."
          class="input w-full h-48 resize-none"
        />
      </div>
      
      <!-- Statistics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-brutal-white border-4 border-black p-4 text-center">
          <div class="text-2xl font-black text-brutal-cyan">
            {{ wordCountDisplay }}
          </div>
          <div class="text-sm font-bold">
            Words
          </div>
        </div>
        
        <div class="bg-brutal-white border-4 border-black p-4 text-center">
          <div class="text-2xl font-black text-brutal-pink">
            {{ characterCountDisplay }}
          </div>
          <div class="text-sm font-bold">
            Characters
          </div>
        </div>
        
        <div class="bg-brutal-white border-4 border-black p-4 text-center">
          <div class="text-2xl font-black text-brutal-yellow">
            {{ characterCountNoSpacesDisplay }}
          </div>
          <div class="text-sm font-bold">
            No Spaces
          </div>
        </div>
        
        <div class="bg-brutal-white border-4 border-black p-4 text-center">
          <div class="text-2xl font-black text-brutal-lime">
            {{ paragraphCountDisplay }}
          </div>
          <div class="text-sm font-bold">
            Paragraphs
          </div>
        </div>
      </div>
      
      <!-- Detailed Statistics -->
      <div class="bg-brutal-yellow border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Detailed Statistics
        </h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="font-bold">Sentences:</span>
              <span class="font-black">{{ sentenceCountDisplay }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Lines:</span>
              <span class="font-black">{{ lineCountDisplay }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Reading Time:</span>
              <span class="font-black">{{ readingTime }} min</span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="font-bold">Speaking Time:</span>
              <span class="font-black">{{ speakingTime }} min</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Avg Word Length:</span>
              <span class="font-black">{{ averageWordLength.toFixed(1) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Spaces:</span>
              <span class="font-black">{{ spaceCountDisplay }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Word Frequency -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Top Words
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div 
            v-for="(word, index) in topWords" 
            :key="word.word"
            class="bg-brutal-white border-2 border-black p-2 flex justify-between items-center"
          >
            <span class="font-bold">{{ word.word }}</span>
            <span class="font-black text-brutal-cyan">{{ word.countDisplay }}</span>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-4">
        <button 
          :disabled="!text"
          class="btn-primary btn-primary-lime flex-1 disabled:opacity-50"
          :class="{ 'animate-copy-bounce': copyingStats }"
          :data-state="copyingStats ? 'success' : null"
          @click="copyStatistics"
        >
          <span v-if="copyingStats">Copied!</span>
          <span v-else>Copy Statistics</span>
        </button>
        
        <button 
          class="btn-primary btn-primary-pink flex-1"
          @click="clearText"
        >
          Clear Text
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { useCountUp } from '../../../composables/useCountUp'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'

useHead({
  title: 'Word Counter',
  meta: [
    { name: 'description', content: 'Count words, characters, sentences, and paragraphs.' },
    { property: 'og:title', content: 'Word Counter' },
    { property: 'og:description', content: 'Count words, characters, sentences, and paragraphs.' }
  ]
})

const text = ref('')

// Copy feedback
const { isCopying: copyingStats, copyWithFeedback: copyStatsFeedback } = useCopyFeedback()

// Count-up animations for main stats
const wordCountAnimation = useCountUp(0, { duration: 800 })
const characterCountAnimation = useCountUp(0, { duration: 800 })
const characterCountNoSpacesAnimation = useCountUp(0, { duration: 800 })
const paragraphCountAnimation = useCountUp(0, { duration: 800 })
const sentenceCountAnimation = useCountUp(0, { duration: 600 })
const lineCountAnimation = useCountUp(0, { duration: 600 })
const spaceCountAnimation = useCountUp(0, { duration: 600 })

const wordCount = computed(() => {
  if (!text.value.trim()) return 0
  return text.value.trim().split(/\s+/).length
})

const characterCount = computed(() => text.value.length)

const characterCountNoSpaces = computed(() => text.value.replace(/\s/g, '').length)

const paragraphCount = computed(() => {
  if (!text.value.trim()) return 0
  return text.value.split(/\n\n+/).filter(p => p.trim()).length
})

const sentenceCount = computed(() => {
  if (!text.value.trim()) return 0
  return text.value.split(/[.!?]+/).filter(s => s.trim()).length
})

const lineCount = computed(() => {
  if (!text.value) return 0
  return text.value.split('\n').length
})

const spaceCount = computed(() => (text.value.match(/\s/g) || []).length)

// Update count-up animations when values change
watch(wordCount, (newValue) => wordCountAnimation.setValue(newValue))
watch(characterCount, (newValue) => characterCountAnimation.setValue(newValue))
watch(characterCountNoSpaces, (newValue) => characterCountNoSpacesAnimation.setValue(newValue))
watch(paragraphCount, (newValue) => paragraphCountAnimation.setValue(newValue))
watch(sentenceCount, (newValue) => sentenceCountAnimation.setValue(newValue))
watch(lineCount, (newValue) => lineCountAnimation.setValue(newValue))
watch(spaceCount, (newValue) => spaceCountAnimation.setValue(newValue))

// Display values for template
const wordCountDisplay = computed(() => wordCountAnimation.displayValue.value)
const characterCountDisplay = computed(() => characterCountAnimation.displayValue.value)
const characterCountNoSpacesDisplay = computed(() => characterCountNoSpacesAnimation.displayValue.value)
const paragraphCountDisplay = computed(() => paragraphCountAnimation.displayValue.value)
const sentenceCountDisplay = computed(() => sentenceCountAnimation.displayValue.value)
const lineCountDisplay = computed(() => lineCountAnimation.displayValue.value)
const spaceCountDisplay = computed(() => spaceCountAnimation.displayValue.value)

const averageWordLength = computed(() => {
  const words = text.value.trim().split(/\s+/).filter(w => w.length > 0)
  if (words.length === 0) return 0
  const totalLength = words.reduce((sum, word) => sum + word.length, 0)
  return totalLength / words.length
})

const readingTime = computed(() => {
  const wordsPerMinute = 200
  return Math.ceil(wordCount.value / wordsPerMinute)
})

const speakingTime = computed(() => {
  const wordsPerMinute = 150
  return Math.ceil(wordCount.value / wordsPerMinute)
})

const topWords = computed(() => {
  if (!text.value.trim()) return []
  
  const words = text.value.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2)
  
  const frequency: Record<string, number> = {}
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1
  })
  
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([word, count]) => ({ 
      word, 
      count,
      countDisplay: count.toLocaleString()
    }))
})

const clearText = () => {
  text.value = ''
}

const copyStatistics = async () => {
  const stats = `
Word Counter Statistics
=======================

Words: ${wordCount.value}
Characters: ${characterCount.value}
Characters (no spaces): ${characterCountNoSpaces.value}
Paragraphs: ${paragraphCount.value}
Sentences: ${sentenceCount.value}
Lines: ${lineCount.value}
Spaces: ${spaceCount.value}

Reading Time: ${readingTime.value} min
Speaking Time: ${speakingTime.value} min
Average Word Length: ${averageWordLength.value.toFixed(1)}

Top Words:
${topWords.value.map(w => `  ${w.word}: ${w.count}`).join('\n')}
`.trim()

  await copyStatsFeedback(stats)
}
</script>
