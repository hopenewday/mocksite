<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Base64 Encoder/Decoder
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
              <option value="url">
                URL
              </option>
            </select>
          </div>
          
          <!-- Text Input -->
          <div v-if="inputType === 'text'">
            <label class="font-black mb-2 block">Enter Text</label>
            <textarea 
              v-model="textInput"
              placeholder="Enter text to encode/decode..."
              class="input w-full h-32 resize-none"
            />
          </div>
          
          <!-- File Input -->
          <div v-if="inputType === 'file'">
            <label class="font-black mb-2 block">Select File</label>
            <div class="border-4 border-dashed border-brutal-gray p-4 text-center">
              <input 
                ref="fileInput"
                type="file" 
                class="hidden"
                @change="handleFileSelect"
              >
              <div
                class="cursor-pointer"
                @click="fileInput?.click()"
              >
                <div class="text-2xl mb-2">
                  📁
                </div>
                <p class="font-black text-sm">
                  Click to browse
                </p>
              </div>
            </div>
            <div
              v-if="selectedFile"
              class="mt-2 text-sm font-black"
            >
              Selected: {{ selectedFile.name }}
            </div>
          </div>
          
          <!-- URL Input -->
          <div v-if="inputType === 'url'">
            <label class="font-black mb-2 block">Enter URL</label>
            <input 
              v-model="urlInput"
              type="url"
              placeholder="https://example.com"
              class="input w-full"
            >
          </div>
          
          <div>
            <label class="font-black mb-2 block">Operation</label>
            <select
              v-model="operation"
              class="select"
            >
              <option value="encode">
                Encode to Base64
              </option>
              <option value="decode">
                Decode from Base64
              </option>
            </select>
          </div>
          
          <button 
            :disabled="!hasInput || isProcessing"
            class="btn-primary btn-primary-cyan w-full disabled:opacity-50"
            @click="processBase64"
          >
            {{ isProcessing ? 'Processing...' : `${operation === 'encode' ? 'Encode' : 'Decode'}` }}
          </button>
        </div>
      </div>
      
      <!-- Output Section -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Output
        </h3>
        
        <div
          v-if="outputResult"
          class="space-y-4"
        >
          <div>
            <label class="font-black mb-2 block">Result</label>
            <textarea 
              :value="outputResult"
              readonly
              class="input w-full h-32 resize-none bg-brutal-gray"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="bg-brutal-white border-2 border-black p-2">
              <span class="font-black">Length:</span>
              <span class="font-black">{{ outputResult.length }} chars</span>
            </div>
            <div class="bg-brutal-white border-2 border-black p-2">
              <span class="font-black">Size:</span>
              <span class="font-black">{{ formatFileSize(outputResult.length) }}</span>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button
              class="btn-primary btn-primary-lime flex-1"
              :class="{ 'animate-copy-bounce': copyingOutput }"
              :data-state="copyingOutput ? 'success' : null"
              @click="copyOutput"
            >
              <span v-if="copyingOutput">✓ Copied!</span>
              <span v-else>Copy Result</span>
            </button>
            <button 
              v-if="inputType === 'file' && operation === 'decode'"
              class="btn-primary btn-primary-yellow flex-1"
              @click="downloadDecodedFile"
            >
              Download File
            </button>
          </div>
        </div>
        
        <div
          v-else
          class="text-center py-8"
        >
          <p class="font-black text-brutal-gray">
            Result will appear here
          </p>
        </div>
      </div>
    </div>
    
    <!-- Format Information -->
    <div class="bg-brutal-lime border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Base64 Information
      </h3>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-bold mb-2">
            What is Base64?
          </h4>
          <p class="text-sm font-black mb-4">
            Base64 is an encoding scheme that converts binary data to ASCII text format. 
            It's commonly used for transmitting data over media that are designed to deal with text.
          </p>
          
          <h4 class="font-bold mb-2">
            Common Uses
          </h4>
          <ul class="text-sm font-black space-y-1">
            <li>• Email attachments</li>
            <li>• Data URLs in HTML/CSS</li>
            <li>• Storing images in databases</li>
            <li>• API request/response encoding</li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-bold mb-2">
            Encoding Examples
          </h4>
          <div class="space-y-2">
            <div class="bg-brutal-white border-2 border-black p-2">
              <p class="text-xs font-bold mb-1">
                Text: "Hello World"
              </p>
              <p class="text-xs font-mono break-all">
                SGVsbG8gV29ybGQ=
              </p>
            </div>
            <div class="bg-brutal-white border-2 border-black p-2">
              <p class="text-xs font-bold mb-1">
                Empty String
              </p>
              <p class="text-xs font-mono">
                (empty)
              </p>
            </div>
            <div class="bg-brutal-white border-2 border-black p-2">
              <p class="text-xs font-bold mb-1">
                Special Chars: "!@#$%"
              </p>
              <p class="text-xs font-mono break-all">
                IUAjJCM=
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quick Tools -->
    <div class="bg-brutal-pink border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Quick Tools
      </h3>
      
      <div class="grid md:grid-cols-3 gap-4">
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="encodeURL"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🔗
            </div>
            <h4 class="font-black text-sm">
              Encode URL
            </h4>
          </div>
        </button>
        
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="decodeURL"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🔓
            </div>
            <h4 class="font-black text-sm">
              Decode URL
            </h4>
          </div>
        </button>
        
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="clearAll"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🧹
            </div>
            <h4 class="font-black text-sm">
              Clear All
            </h4>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'

const inputType = ref('text')
const textInput = ref('')
const urlInput = ref('')
const selectedFile = ref<File | null>(null)
const operation = ref('encode')
const outputResult = ref('')
const isProcessing = ref(false)

const fileInput = ref<HTMLInputElement>()

// Copy feedback
const { isCopying: copyingOutput, copyWithFeedback: copyOutputFeedback } = useCopyFeedback()

const hasInput = computed(() => {
  switch (inputType.value) {
    case 'text': return textInput.value.length > 0
    case 'file': return selectedFile.value !== null
    case 'url': return urlInput.value.length > 0
    default: return false
  }
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const processBase64 = async () => {
  if (!hasInput.value) return
  
  isProcessing.value = true
  
  try {
    let input = ''
    
    // Get input based on type
    switch (inputType.value) {
      case 'text':
        input = textInput.value
        break
      case 'file':
        if (selectedFile.value) {
          input = await readFileAsText(selectedFile.value)
        }
        break
      case 'url':
        input = urlInput.value
        break
    }
    
    // Process based on operation
    if (operation.value === 'encode') {
      outputResult.value = btoa(input)
    } else {
      try {
        outputResult.value = atob(input)
      } catch (error) {
        outputResult.value = 'Invalid Base64 input'
      }
    }
  } catch (error) {
    outputResult.value = 'Error processing input'
  }
  
  isProcessing.value = false
}

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

const copyOutput = async () => {
  await copyOutputFeedback(outputResult.value, 'Copied!')
}

const downloadDecodedFile = () => {
  if (!outputResult.value) return
  
  const blob = new Blob([outputResult.value], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'decoded_file.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const encodeURL = () => {
  inputType.value = 'url'
  operation.value = 'encode'
  if (urlInput.value) {
    processBase64()
  }
}

const decodeURL = () => {
  inputType.value = 'url'
  operation.value = 'decode'
  if (urlInput.value) {
    processBase64()
  }
}

const clearAll = () => {
  textInput.value = ''
  urlInput.value = ''
  selectedFile.value = null
  outputResult.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
