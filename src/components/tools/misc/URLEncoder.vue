<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">
      URL Encoder / Decoder
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Input -->
      <div class="bg-brutal-white border-4 border-black p-6 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-black text-lg">
            Input
          </h3>
          <div class="flex gap-2">
            <button 
              class="btn-sm"
              :class="mode === 'encode' ? 'btn-primary-black' : 'btn-secondary'"
              @click="mode = 'encode'"
            >
              Encode
            </button>
            <button 
              class="btn-sm"
              :class="mode === 'decode' ? 'btn-primary-black' : 'btn-secondary'"
              @click="mode = 'decode'"
            >
              Decode
            </button>
          </div>
        </div>
        
        <textarea 
          v-model="input"
          :placeholder="mode === 'encode' ? 'Enter text to encode...' : 'Enter URL to decode...'"
          class="input w-full flex-1 resize-none min-h-[200px] font-mono text-sm"
        />
        
        <div class="flex justify-between items-center mt-4">
          <span class="text-sm font-bold">{{ input.length }} chars</span>
          <button
            class="text-sm underline font-bold"
            @click="input = ''"
          >
            Clear
          </button>
        </div>
      </div>
      
      <!-- Output -->
      <div class="bg-brutal-white border-4 border-black p-6 flex flex-col">
        <h3 class="font-black text-lg mb-4">
          Result
        </h3>
        
        <textarea 
          readonly
          :value="output"
          class="input w-full flex-1 resize-none min-h-[200px] font-mono text-sm bg-gray-50"
        />
        
        <div class="flex gap-2 mt-4">
          <button 
            class="btn-primary btn-primary-cyan flex-1"
            :disabled="!output"
            @click="copyWithFeedback(output)"
          >
            Copy Result
          </button>
          <button 
            class="btn-secondary flex-1"
            :disabled="!output"
            @click="swap"
          >
            Swap
          </button>
        </div>
      </div>
    </div>

    <!-- Query Params Breakdown (Decode Mode Only) -->
    <div
      v-if="mode === 'decode' && queryParams.length > 0"
      class="bg-brutal-white border-4 border-black p-6"
    >
      <h3 class="font-black text-lg mb-4">
        Query Parameters
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border-2 border-black">
          <thead>
            <tr class="bg-brutal-yellow">
              <th class="border-2 border-black p-2 text-left">
                Key
              </th>
              <th class="border-2 border-black p-2 text-left">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(param, idx) in queryParams"
              :key="idx"
              class="hover:bg-gray-50"
            >
              <td class="border-2 border-black p-2 font-mono font-bold">
                {{ param.key }}
              </td>
              <td class="border-2 border-black p-2 font-mono break-all">
                {{ param.value }}
              </td>
            </tr>
          </tbody>
        </table>
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
  title: 'URL Encoder/Decoder - Free Online Tool',
  meta: [
    { name: 'description', content: 'Encode or decode URLs easily. Parse query parameters and analyze URL structure.' },
    { name: 'keywords', content: 'url encoder, url decoder, percent encoding, query parser' }
  ]
})

// Composables
const { copyWithFeedback } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

// State
const mode = ref<'encode' | 'decode'>('encode')
const input = ref('')

// Computed
const output = computed(() => {
  if (!input.value) return ''
  try {
    if (mode.value === 'encode') {
      return encodeURIComponent(input.value)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22')
    } else {
      return decodeURIComponent(input.value)
    }
  } catch (e) {
    return 'Error: Invalid input'
  }
})

const queryParams = computed(() => {
  if (mode.value !== 'decode' || !input.value) return []
  try {
    // Try to parse as full URL first
    let search = ''
    if (input.value.includes('?')) {
      search = input.value.split('?')[1]
    } else if (input.value.includes('=')) {
      search = input.value
    }
    
    if (!search) return []

    const params = new URLSearchParams(search)
    const result: { key: string, value: string }[] = []
    params.forEach((value, key) => {
      result.push({ key, value })
    })
    return result
  } catch (e) {
    return []
  }
})

// Actions
const swap = () => {
  input.value = output.value
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
}

// Watch for usage
watch(output, (newVal) => {
  if (newVal && newVal !== 'Error: Invalid input') {
    celebrateFirstUse('url-encoder')
  }
})
</script>
