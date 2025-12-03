<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">
      UUID Generator
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Controls -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Configuration
        </h3>
        
        <div class="space-y-6">
          <div class="bg-brutal-cyan border-2 border-black p-4 text-center">
            <span class="block font-black text-sm uppercase mb-1">Single UUID</span>
            <div class="text-xl font-mono font-bold break-all bg-white p-2 border-2 border-black mb-2">
              {{ latestUUID || 'Generate to see UUID' }}
            </div>
            <button 
              class="btn-secondary btn-sm w-full"
              :disabled="!latestUUID"
              @click="copyWithFeedback(latestUUID)"
            >
              Copy
            </button>
          </div>
        
          <div>
            <label class="font-black mb-2 block">Quantity (1-100)</label>
            <div class="flex gap-2">
              <input 
                v-model.number="quantity"
                type="number"
                min="1"
                max="100"
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
          
          <div class="flex flex-wrap gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="uppercase"
                type="checkbox"
                class="checkbox"
              >
              <span class="font-bold">Uppercase</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="hyphens"
                type="checkbox"
                class="checkbox"
              >
              <span class="font-bold">Hyphens</span>
            </label>
          </div>
          
          <div class="flex gap-2">
            <button
              class="btn-primary btn-primary-black flex-1"
              @click="generateUUIDs"
            >
              Generate UUIDs
            </button>
            <button
              class="btn-secondary flex-1"
              :disabled="generatedUUIDs.length === 0"
              @click="copyAll"
            >
              Copy All
            </button>
          </div>
        </div>
      </div>
      
      <!-- Output List -->
      <div class="bg-brutal-white border-4 border-black p-6 flex flex-col h-[500px]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-black text-lg">
            Generated List <span v-if="generatedUUIDs.length">({{ generatedUUIDs.length }})</span>
          </h3>
          <button 
            v-if="generatedUUIDs.length" 
            class="text-sm underline font-bold hover:text-brutal-pink"
            @click="clear"
          >
            Clear
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto border-2 border-black bg-gray-50 p-2 font-mono text-sm space-y-1">
          <div 
            v-for="(uuid, index) in generatedUUIDs" 
            :key="index"
            class="flex items-center justify-between p-2 hover:bg-white border-b border-gray-200 last:border-0 group"
          >
            <span class="break-all">{{ uuid }}</span>
            <button 
              class="opacity-0 group-hover:opacity-100 text-xs bg-black text-white px-2 py-1 rounded"
              @click="copyWithFeedback(uuid)"
            >
              Copy
            </button>
          </div>
          
          <div
            v-if="generatedUUIDs.length === 0"
            class="h-full flex items-center justify-center text-gray-400 italic"
          >
            Click generate to start
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'
import { useHead } from '@vueuse/head'

// SEO
useHead({
  title: 'UUID Generator - Free Online Tool',
  meta: [
    { name: 'description', content: 'Generate random UUID v4 identifiers instantly. Bulk generation, uppercase/lowercase options.' },
    { name: 'keywords', content: 'uuid generator, guid generator, uuid v4, bulk uuid' }
  ]
})

// Composables
const { copyWithFeedback } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

// State
const quantity = ref(1)
const uppercase = ref(false)
const hyphens = ref(true)
const generatedUUIDs = ref<string[]>([])

const latestUUID = computed(() => generatedUUIDs.value.length > 0 ? generatedUUIDs.value[0] : '')

// Logic
const generateSingleUUID = (): string => {
  let uuid = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  if (!hyphens.value) {
    uuid = uuid.replace(/-/g, '')
  }
  
  if (uppercase.value) {
    uuid = uuid.toUpperCase()
  }
  
  return uuid
}

const generateUUIDs = () => {
  const count = Math.min(Math.max(1, quantity.value), 100)
  const newUUIDs = []
  
  for (let i = 0; i < count; i++) {
    newUUIDs.push(generateSingleUUID())
  }
  
  generatedUUIDs.value = newUUIDs
  celebrateFirstUse('uuid-generator')
}

const copyAll = () => {
  copyWithFeedback(generatedUUIDs.value.join('\n'))
}

const clear = () => {
  generatedUUIDs.value = []
}

// Initial generation
generateUUIDs()
</script>
