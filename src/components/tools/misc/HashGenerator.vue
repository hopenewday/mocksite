<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Hash Generator
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Input Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Input
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Input Type</label>
            <select
              v-model="inputType"
              class="select"
            >
              <option value="text">
                Text
              </option>
              <option value="file">
                File
              </option>
            </select>
          </div>
          
          <!-- Text Input -->
          <div v-if="inputType === 'text'">
            <label class="font-black mb-2 block">Enter Text</label>
            <textarea 
              v-model="textInput"
              placeholder="Enter text to hash..."
              class="input w-full h-32 resize-none"
            />
          </div>
          
          <!-- File Input -->
          <div v-if="inputType === 'file'">
            <label class="font-black mb-2 block">Select File</label>
            <div 
              class="border-4 border-dashed border-brutal-gray p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors relative"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
            >
              <input 
                type="file" 
                class="absolute inset-0 opacity-0 cursor-pointer"
                @change="handleFileSelect"
              >
              <div v-if="selectedFile">
                <p class="font-bold">
                  {{ selectedFile.name }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ formatFileSize(selectedFile.size) }}
                </p>
              </div>
              <div v-else>
                <p class="font-bold">
                  Drop file here or click to upload
                </p>
              </div>
            </div>
          </div>
          
          <!-- Algorithms -->
          <div>
            <label class="font-black mb-2 block">Algorithms</label>
            <div class="grid grid-cols-2 gap-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="selectedAlgos"
                  type="checkbox"
                  value="SHA-1"
                  class="checkbox"
                >
                <span class="font-bold">SHA-1</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="selectedAlgos"
                  type="checkbox"
                  value="SHA-256"
                  class="checkbox"
                >
                <span class="font-bold">SHA-256</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="selectedAlgos"
                  type="checkbox"
                  value="SHA-384"
                  class="checkbox"
                >
                <span class="font-bold">SHA-384</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="selectedAlgos"
                  type="checkbox"
                  value="SHA-512"
                  class="checkbox"
                >
                <span class="font-bold">SHA-512</span>
              </label>
            </div>
          </div>

          <!-- Options -->
          <div class="flex items-center gap-2">
            <label class="font-black">Uppercase Output</label>
            <input
              v-model="uppercase"
              type="checkbox"
              class="checkbox"
            >
          </div>
          
          <button
            class="btn-primary btn-primary-black w-full"
            :disabled="isProcessing || (!textInput && !selectedFile)"
            @click="generateHashes"
          >
            {{ isProcessing ? 'Generating...' : 'Generate Hashes' }}
          </button>
        </div>
      </div>
      
      <!-- Output Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Generated Hashes
        </h3>
        
        <div
          v-if="Object.keys(results).length > 0"
          class="space-y-4"
        >
          <div
            v-for="(hash, algo) in results"
            :key="algo"
            class="relative"
          >
            <label class="font-bold text-sm block mb-1">{{ algo }}</label>
            <div class="flex">
              <input 
                readonly 
                :value="hash" 
                class="input rounded-r-none flex-1 font-mono text-sm"
              >
              <button 
                class="btn-secondary rounded-l-none px-3"
                :disabled="isCopying"
                @click="copyWithFeedback(hash)"
              >
                Copy
              </button>
            </div>
          </div>
          
          <button 
            class="btn-secondary w-full mt-4"
            @click="copyAll"
          >
            Copy All
          </button>
        </div>
        
        <div
          v-else
          class="h-full flex items-center justify-center text-gray-400 italic"
        >
          Hashes will appear here
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'
import { useHead } from '@vueuse/head'
import { formatSize } from '@/lib/formatUtils'

// SEO
useHead({
  title: 'Hash Generator - Free Online Tool',
  meta: [
    { name: 'description', content: 'Generate SHA-1, SHA-256, SHA-512 hashes from text or files securely in your browser.' },
    { name: 'keywords', content: 'hash generator, sha256 generator, sha1 generator, file hash, online hasher' }
  ]
})

// Composables
const { copyWithFeedback, isCopying } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

// State
const inputType = ref<'text' | 'file'>('text')
const textInput = ref('')
const selectedFile = ref<File | null>(null)
const selectedAlgos = ref(['SHA-256'])
const uppercase = ref(false)
const isProcessing = ref(false)
const results = ref<Record<string, string>>({})

// File Handling
const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    results.value = {}
  }
}

const handleFileDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    selectedFile.value = e.dataTransfer.files[0]
    results.value = {}
  }
}

// Hashing Logic
const bufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

const hashText = async (text: string, algo: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algo, data)
  return bufferToHex(hashBuffer)
}

const hashFile = async (file: File, algo: string): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest(algo, arrayBuffer)
  return bufferToHex(hashBuffer)
}

const generateHashes = async () => {
  if (!textInput.value && !selectedFile.value) return
  
  isProcessing.value = true
  results.value = {}
  
  try {
    for (const algo of selectedAlgos.value) {
      let hash = ''
      if (inputType.value === 'text') {
        hash = await hashText(textInput.value, algo)
      } else if (selectedFile.value) {
        hash = await hashFile(selectedFile.value, algo)
      }
      
      if (uppercase.value) {
        hash = hash.toUpperCase()
      }
      
      results.value[algo] = hash
    }
    
    celebrateFirstUse('hash-generator')
  } catch (error) {
    console.error('Hashing error:', error)
  } finally {
    isProcessing.value = false
  }
}

const copyAll = () => {
  const text = Object.entries(results.value)
    .map(([algo, hash]) => `${algo}: ${hash}`)
    .join('\n')
  copyWithFeedback(text)
}

// Watchers
watch(uppercase, () => {
  if (Object.keys(results.value).length > 0) {
    // Regenerate to apply case change immediately if we already have results
    // Or just transform existing results
    for (const key in results.value) {
      results.value[key] = uppercase.value 
        ? results.value[key].toUpperCase() 
        : results.value[key].toLowerCase()
    }
  }
})
</script>
