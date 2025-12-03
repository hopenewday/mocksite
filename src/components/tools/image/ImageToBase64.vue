<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">Image to Base64</h2>
    
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Upload -->
      <div class="space-y-6">
        <div
          class="border-4 border-dashed border-black p-8 bg-brutal-yellow text-center cursor-pointer hover:bg-brutal-cyan transition"
          @drop.prevent="handleDrop"
          @dragover.prevent
          @click="triggerFileInput"
        >
          <input ref="fileInput" type="file" accept="image/*" hidden @change="handleFileSelect">
          <div class="text-4xl mb-2">📤</div>
          <div class="font-black text-lg mb-2">Drag & Drop Image</div>
          <div class="text-sm font-bold text-brutal-gray">or click to browse</div>
        </div>

        <div v-if="imagePreview" class="border-4 border-black p-4">
          <img :src="imagePreview" :alt="fileName" class="w-full max-h-64 object-cover">
          <div class="text-xs font-bold text-brutal-gray mt-2">{{ fileName }}</div>
          <div class="text-xs font-bold text-brutal-gray">{{ fileSize }}</div>
        </div>

        <button v-if="imagePreview" class="btn-primary btn-primary-pink w-full" @click="clearImage">Clear Image</button>
      </div>

      <!-- Output -->
      <div class="space-y-4">
        <h3 class="font-black text-lg">Base64 Output</h3>
        
        <div>
          <label class="font-black block mb-2 text-sm">Format</label>
          <select v-model="outputFormat" class="input w-full">
            <option value="base64">Base64 String</option>
            <option value="dataurl">Data URL</option>
            <option value="css">CSS Background</option>
            <option value="html">HTML Img Tag</option>
          </select>
        </div>

        <div class="bg-brutal-white border-4 border-black p-4">
          <textarea
            :value="output"
            readonly
            class="input w-full h-64 bg-brutal-gray font-mono text-xs resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button class="btn-primary btn-primary-cyan" :class="{ 'animate-copy-bounce': copying }" @click="copyOutput">
            {{ copying ? 'Copied!' : 'Copy' }}
          </button>
          <button v-if="output" class="btn-primary btn-primary-lime" @click="downloadAsFile">Download</button>
        </div>

        <div v-if="imagePreview" class="bg-brutal-yellow border-4 border-black p-4">
          <div class="text-xs font-bold text-brutal-gray mb-2">File Info</div>
          <div class="text-sm font-bold">Size: {{ (base64Output.length / 1024).toFixed(2) }} KB</div>
          <div class="text-sm font-bold">Format: {{ mimeType }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'

useHead({
  title: 'Image to Base64',
  meta: [
    { name: 'description', content: 'Convert images to Base64, Data URLs, and CSS snippets.' },
    { property: 'og:title', content: 'Image to Base64' },
    { property: 'og:description', content: 'Convert images to Base64, Data URLs, and CSS snippets.' }
  ]
})

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

const fileInput = ref<HTMLInputElement>()
const imagePreview = ref('')
const fileName = ref('')
const fileSize = ref('')
const mimeType = ref('')
const base64Output = ref('')
const outputFormat = ref('base64')

const output = computed(() => {
  if (!base64Output.value) return ''
  
  switch (outputFormat.value) {
    case 'base64':
      return base64Output.value
    case 'dataurl':
      return `data:${mimeType.value};base64,${base64Output.value}`
    case 'css':
      return `background-image: url('data:${mimeType.value};base64,${base64Output.value}');`
    case 'html':
      return `<img src="data:${mimeType.value};base64,${base64Output.value}" alt="image" />`
    default:
      return base64Output.value
  }
})

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    processFile(input.files[0])
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer?.files?.length) {
    processFile(event.dataTransfer.files[0])
  }
}

function processFile(file: File) {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  fileName.value = file.name
  fileSize.value = `${(file.size / 1024).toFixed(2)} KB`
  mimeType.value = file.type

  const reader = new FileReader()
  
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    imagePreview.value = dataUrl
    // Extract base64 from data URL
    base64Output.value = dataUrl.split(',')[1]
  }
  
  reader.readAsDataURL(file)
}

function clearImage() {
  imagePreview.value = ''
  fileName.value = ''
  fileSize.value = ''
  base64Output.value = ''
  mimeType.value = ''
}

function copyOutput() {
  if (output.value) {
    copyWithFeedback(output.value)
  }
}

function downloadAsFile() {
  if (!base64Output.value) return
  
  const binary = atob(base64Output.value)
  const array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }
  
  const blob = new Blob([array], { type: mimeType.value })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName.value || 'image'
  link.click()
  URL.revokeObjectURL(url)
}
</script>
