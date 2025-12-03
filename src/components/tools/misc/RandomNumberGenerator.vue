<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Random Number Generator
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Controls -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Settings
        </h3>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="font-black mb-2 block">Min</label>
              <input 
                v-model.number="min"
                type="number"
                class="input w-full"
              >
            </div>
            <div>
              <label class="font-black mb-2 block">Max</label>
              <input 
                v-model.number="max"
                type="number"
                class="input w-full"
              >
            </div>
          </div>
          
          <div>
            <label class="font-black mb-2 block">Quantity</label>
            <div class="flex gap-2">
              <input 
                v-model.number="quantity"
                type="number"
                min="1"
                max="1000"
                class="input w-24"
              >
              <input 
                v-model.number="quantity"
                type="range"
                min="1"
                max="100"
                class="flex-1 accent-black"
              >
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="allowDecimals"
                type="checkbox"
                class="checkbox"
              >
              <span class="font-bold">Allow Decimals</span>
            </label>
            
            <div
              v-if="allowDecimals"
              class="ml-6"
            >
              <label class="font-black text-sm block">Precision: {{ precision }}</label>
              <input
                v-model.number="precision"
                type="range"
                min="1"
                max="10"
                class="w-full accent-black"
              >
            </div>

            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="noDuplicates"
                type="checkbox"
                class="checkbox"
              >
              <span class="font-bold">No Duplicates</span>
            </label>
            
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="sortOutput"
                type="checkbox"
                class="checkbox"
              >
              <span class="font-bold">Sort Output (Ascending)</span>
            </label>
          </div>
          
          <button
            class="btn-primary btn-primary-lime w-full"
            @click="generate"
          >
            Generate Numbers
          </button>
        </div>
      </div>
      
      <!-- Results -->
      <div class="bg-brutal-white border-4 border-black p-6 flex flex-col h-[500px]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-black text-lg">
            Results <span v-if="results.length">({{ results.length }})</span>
          </h3>
          <div class="flex gap-2">
            <button 
              v-if="results.length" 
              class="btn-secondary btn-sm"
              @click="copyAll"
            >
              Copy All
            </button>
          </div>
        </div>
        
        <!-- Stats -->
        <div
          v-if="results.length"
          class="grid grid-cols-3 gap-2 mb-4 text-xs font-bold text-center"
        >
          <div class="bg-brutal-yellow border-2 border-black p-1">
            Min: {{ stats.min }}
          </div>
          <div class="bg-brutal-pink border-2 border-black p-1">
            Max: {{ stats.max }}
          </div>
          <div class="bg-brutal-cyan border-2 border-black p-1">
            Avg: {{ stats.avg }}
          </div>
        </div>

        <div class="flex-1 overflow-y-auto border-2 border-black bg-gray-50 p-2 font-mono text-lg">
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(num, index) in results" 
              :key="index"
              class="bg-white border-2 border-black px-2 py-1 cursor-pointer hover:bg-brutal-lime transition-colors"
              title="Click to copy"
              @click="copyWithFeedback(num.toString())"
            >
              {{ num }}
            </span>
          </div>
          
          <div
            v-if="results.length === 0"
            class="h-full flex items-center justify-center text-gray-400 italic"
          >
            Ready to generate
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'
import { useHead } from '@vueuse/head'

// SEO
useHead({
  title: 'Random Number Generator - Free Online Tool',
  meta: [
    { name: 'description', content: 'Generate random numbers within a range. Support for decimals, no duplicates, and sorting.' },
    { name: 'keywords', content: 'random number generator, rng, random picker, lottery numbers' }
  ]
})

// Composables
const { copyWithFeedback } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

// State
const min = ref(1)
const max = ref(100)
const quantity = ref(5)
const allowDecimals = ref(false)
const precision = ref(2)
const noDuplicates = ref(false)
const sortOutput = ref(false)
const results = ref<number[]>([])

// Stats
const stats = computed(() => {
  if (results.value.length === 0) return { min: 0, max: 0, avg: 0 }
  const sum = results.value.reduce((a, b) => a + b, 0)
  return {
    min: Math.min(...results.value),
    max: Math.max(...results.value),
    avg: parseFloat((sum / results.value.length).toFixed(2))
  }
})

// Logic
const generate = () => {
  // Validation
  if (min.value >= max.value) {
    alert('Min must be less than Max')
    return
  }

  // Limit quantity
  const count = Math.min(Math.max(1, quantity.value), 1000)
  
  // Check if unique is possible
  const range = max.value - min.value + (allowDecimals.value ? 0 : 1) // +1 for integers inclusive
  if (noDuplicates.value && !allowDecimals.value && count > range) {
    alert(`Cannot generate ${count} unique integers in range ${min.value}-${max.value}`)
    return
  }

  const newResults: number[] = []
  const seen = new Set<number>()
  
  let attempts = 0
  const maxAttempts = count * 10 // prevent infinite loop
  
  while (newResults.length < count && attempts < maxAttempts) {
    attempts++
    let num = Math.random() * (max.value - min.value) + min.value
    
    if (!allowDecimals.value) {
      num = Math.floor(num)
      // For integer max inclusive in JS Math.random() * (max - min + 1) + min
      // But let's stick to simple floor(random * (max-min+1)) + min logic
       num = Math.floor(Math.random() * (max.value - min.value + 1)) + min.value
    } else {
       num = parseFloat(num.toFixed(precision.value))
    }

    if (noDuplicates.value) {
      if (seen.has(num)) continue
      seen.add(num)
    }
    
    newResults.push(num)
  }
  
  if (sortOutput.value) {
    newResults.sort((a, b) => a - b)
  }
  
  results.value = newResults
  celebrateFirstUse('random-number')
}

const copyAll = () => {
  copyWithFeedback(results.value.join(', '))
}
</script>
