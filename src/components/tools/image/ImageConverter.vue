<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">
      Image Format Converter
    </h2>
    
    <div class="space-y-6">
      <!-- Upload Section -->
      <div>
        <label class="font-black mb-2 block">Upload Image</label>
        <div class="border-4 border-dashed border-brutal-gray p-8 text-center">
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*"
            class="hidden"
            @change="handleImageSelect"
          >
          <div 
            class="cursor-pointer"
            @click="fileInput?.click()"
            @dragover.prevent
            @drop="handleDrop"
          >
            <div
              v-if="!previewImage"
              class="text-4xl mb-4"
            >
              📷
            </div>
            <img
              v-else
              :src="previewImage"
              class="w-32 h-32 mx-auto border-4 border-black object-cover"
            >
            <p class="font-black mt-4">
              {{ selectedImage ? selectedImage.name : 'Click or drop image here' }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Format Selection -->
      <div>
        <label class="font-black mb-2 block">Convert To</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label 
            v-for="format in formats" 
            :key="format.value"
            class="cursor-pointer"
          >
            <input 
              v-model="targetFormat" 
              type="radio" 
              :value="format.value"
              class="hidden"
            >
            <div 
              :class="[
                'border-4 p-4 text-center font-black transition-all',
                targetFormat === format.value 
                  ? 'border-brutal-cyan bg-brutal-cyan/20' 
                  : 'border-black bg-brutal-white'
              ]"
            >
              <div class="text-2xl mb-2">{{ format.icon }}</div>
              <div>{{ format.label }}</div>
            </div>
          </label>
        </div>
      </div>
      
      <!-- Quality Settings (for JPG) -->
      <div v-if="targetFormat === 'jpg'">
        <label class="font-black mb-2 block">Quality ({{ quality }}%)</label>
        <input 
          v-model="quality"
          type="range" 
          min="10" 
          max="100" 
          step="10"
          class="w-full"
        >
      </div>
      
      <!-- Convert Button -->
      <button 
        :disabled="!selectedImage || isProcessing"
        class="btn-primary btn-primary-cyan w-full disabled:opacity-50"
        @click="convertImage"
      >
        <span v-if="isProcessing">Converting...</span>
        <span v-else>Convert to {{ targetFormat.toUpperCase() }}</span>
      </button>
      
      <!-- Error Message -->
      <div
        v-if="error"
        class="p-4 bg-brutal-pink/20 border-4 border-brutal-pink"
      >
        <p class="font-black text-brutal-pink">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { saveAs } from 'file-saver'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Image Converter',
  meta: [
    { name: 'description', content: 'Convert images between PNG, JPG, WebP, and GIF formats.' },
    { property: 'og:title', content: 'Image Converter' },
    { property: 'og:description', content: 'Convert images between PNG, JPG, WebP, and GIF formats.' }
  ]
})

const selectedImage = ref<File | null>(null)
const previewImage = ref<string>('')
const targetFormat = ref('png')
const quality = ref(90)
const isProcessing = ref(false)
const error = ref('')
const fileInput = ref<HTMLInputElement>()

const formats = [
  { value: 'png', label: 'PNG', icon: '🖼️' },
  { value: 'jpg', label: 'JPG', icon: '📸' },
  { value: 'webp', label: 'WebP', icon: '🌐' },
  { value: 'gif', label: 'GIF', icon: '🎬' }
]

const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    setImage(file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0]
    if (file.type.startsWith('image/')) {
      setImage(file)
    } else {
      error.value = 'Please drop an image file'
      setTimeout(() => error.value = '', 3000)
    }
  }
}

const setImage = (file: File) => {
  selectedImage.value = file
  previewImage.value = URL.createObjectURL(file)
  error.value = ''
}

const convertImage = async () => {
  if (!selectedImage.value) return
  
  isProcessing.value = true
  error.value = ''
  
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      // Handle transparent background for JPG
      if (targetFormat.value === 'jpg' && ctx) {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      ctx?.drawImage(img, 0, 0)
      
      let mimeType = `image/${targetFormat.value}`
      if (targetFormat.value === 'jpg') mimeType = 'image/jpeg'
      
      canvas.toBlob((blob) => {
        if (blob) {
          const originalName = selectedImage.value?.name || 'image'
          const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName
          const fileName = `${baseName}.${targetFormat.value}`
          
          saveAs(blob, fileName)
        } else {
          error.value = 'Conversion failed. Please try again.'
        }
        isProcessing.value = false
      }, mimeType, targetFormat.value === 'jpg' ? quality.value / 100 : undefined)
    }
    
    img.onerror = () => {
      error.value = 'Failed to load image. Please try another file.'
      isProcessing.value = false
    }
    
    img.src = previewImage.value
  } catch (err) {
    error.value = 'An error occurred during conversion.'
    console.error('Image conversion error:', err)
    isProcessing.value = false
  }
}
</script>
