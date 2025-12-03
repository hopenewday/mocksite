<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Image Cropper
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Upload Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Upload Image
        </h3>
        
        <div class="border-4 border-dashed border-brutal-gray p-8 text-center mb-4">
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          >
          <div 
            class="cursor-pointer"
            @click="fileInput?.click()"
            @dragover.prevent
            @drop="handleDrop"
          >
            <div class="text-4xl mb-4">
              📁
            </div>
            <p class="font-black mb-2">
              Drop image here or click to browse
            </p>
            <p class="text-sm font-bold text-brutal-gray">
              Supports JPG, PNG, GIF, BMP
            </p>
          </div>
        </div>
        
        <div
          v-if="originalImage"
          class="space-y-4"
        >
          <div class="flex justify-between items-center p-3 bg-brutal-gray border-2 border-black">
            <span class="font-black">{{ originalImage.name }}</span>
            <span class="text-sm font-black">{{ formatFileSize(originalImage.size) }}</span>
          </div>
          
          <button
            class="btn-primary btn-primary-pink w-full"
            @click="clearImage"
          >
            Clear Image
          </button>
        </div>
      </div>
      
      <!-- Crop Settings -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Crop Settings
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Aspect Ratio</label>
            <select
              v-model="aspectRatio"
              class="select"
            >
              <option value="free">
                Free
              </option>
              <option value="1:1">
                Square (1:1)
              </option>
              <option value="4:3">
                Standard (4:3)
              </option>
              <option value="16:9">
                Widescreen (16:9)
              </option>
              <option value="3:2">
                Photo (3:2)
              </option>
            </select>
          </div>
          
          <div>
            <label class="font-black mb-2 block">Output Size</label>
            <select
              v-model="outputSize"
              class="select"
            >
              <option value="original">
                Original
              </option>
              <option value="small">
                Small (800px)
              </option>
              <option value="medium">
                Medium (1200px)
              </option>
              <option value="large">
                Large (1920px)
              </option>
              <option value="custom">
                Custom
              </option>
            </select>
          </div>
          
          <div
            v-if="outputSize === 'custom'"
            class="space-y-2"
          >
            <input 
              v-model.number="customWidth"
              type="number"
              placeholder="Width (px)"
              class="input w-full"
            >
            <input 
              v-model.number="customHeight"
              type="number"
              placeholder="Height (px)"
              class="input w-full"
            >
          </div>
          
          <div>
            <label class="font-black mb-2 block">Format</label>
            <select
              v-model="outputFormat"
              class="select"
            >
              <option value="png">
                PNG
              </option>
              <option value="jpeg">
                JPEG
              </option>
              <option value="webp">
                WebP
              </option>
            </select>
          </div>
          
          <div v-if="outputFormat === 'jpeg'">
            <label class="font-black mb-2 block">Quality (1-100)</label>
            <input 
              v-model.number="quality"
              type="range"
              min="1"
              max="100"
              class="w-full"
            >
            <div class="text-center font-black">
              {{ quality }}%
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Image Editor -->
    <div
      v-if="originalImage"
      class="bg-brutal-lime border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Crop Image
      </h3>
      
      <div class="relative bg-brutal-white border-2 border-black p-4 mb-4">
        <div class="relative overflow-hidden">
          <img 
            ref="imageElement"
            :src="imagePreview"
            alt="Image to crop"
            class="max-w-full h-auto"
            @load="initializeCropper"
          >
          
          <!-- Crop Overlay -->
          <div 
            v-if="cropArea.active"
            class="absolute border-2 border-brutal-cyan bg-brutal-cyan/20"
            :style="cropAreaStyle"
            @mousedown="startCrop"
          >
            <!-- Resize Handles -->
            <div class="absolute -top-1 -left-1 w-3 h-3 bg-brutal-cyan border-2 border-black cursor-nw-resize" />
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-brutal-cyan border-2 border-black cursor-ne-resize" />
            <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-brutal-cyan border-2 border-black cursor-sw-resize" />
            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-brutal-cyan border-2 border-black cursor-se-resize" />
          </div>
        </div>
      </div>
      
      <div class="flex gap-4">
        <button 
          :disabled="!cropArea.active"
          class="btn-primary btn-primary-cyan flex-1 disabled:opacity-50"
          @click="cropImage"
        >
          Crop Image
        </button>
        
        <button
          class="btn-primary btn-primary-pink"
          @click="resetCrop"
        >
          Reset
        </button>
      </div>
    </div>
    
    <!-- Cropped Result -->
    <div
      v-if="croppedImage"
      class="bg-brutal-pink border-4 border-black p-6"
    >
      <h3 class="font-black text-lg mb-4">
        Cropped Image
      </h3>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-brutal-white border-2 border-black p-4">
          <img
            :src="croppedImage"
            alt="Cropped image"
            class="w-full h-auto"
          >
        </div>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
            <span class="font-black">Dimensions</span>
            <span class="font-black">{{ croppedDimensions.width }} × {{ croppedDimensions.height }}</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
            <span class="font-black">File Size</span>
            <span class="font-black">{{ croppedFileSize }}</span>
          </div>
          
          <button
            class="btn-primary btn-primary-lime w-full"
            @click="downloadCroppedImage"
          >
            Download Image
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'

interface CropArea {
  active: boolean
  x: number
  y: number
  width: number
  height: number
}

useHead({
  title: 'Image Cropper',
  meta: [
    { name: 'description', content: 'Crop images to exact dimensions and aspect ratios.' },
    { property: 'og:title', content: 'Image Cropper' },
    { property: 'og:description', content: 'Crop images to exact dimensions and aspect ratios.' }
  ]
})

const originalImage = ref<File | null>(null)
const imagePreview = ref('')
const croppedImage = ref('')
const croppedDimensions = ref({ width: 0, height: 0 })
const croppedFileSize = ref('')

const aspectRatio = ref('free')
const outputSize = ref('original')
const customWidth = ref(800)
const customHeight = ref(600)
const outputFormat = ref('png')
const quality = ref(90)

const cropArea = ref<CropArea>({
  active: false,
  x: 50,
  y: 50,
  width: 200,
  height: 200
})

const fileInput = ref<HTMLInputElement>()
const imageElement = ref<HTMLImageElement>()

const cropAreaStyle = computed(() => {
  if (!cropArea.value.active) return {}
  
  return {
    left: `${cropArea.value.x}px`,
    top: `${cropArea.value.y}px`,
    width: `${cropArea.value.width}px`,
    height: `${cropArea.value.height}px`
  }
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    loadImage(target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    loadImage(event.dataTransfer.files[0])
  }
}

const loadImage = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }
  
  originalImage.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  originalImage.value = null
  imagePreview.value = ''
  croppedImage.value = ''
  cropArea.value.active = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const initializeCropper = () => {
  if (!imageElement.value) return
  
  const img = imageElement.value
  cropArea.value = {
    active: true,
    x: 50,
    y: 50,
    width: Math.min(img.width - 100, 200),
    height: Math.min(img.height - 100, 200)
  }
  
  // Apply aspect ratio if selected
  if (aspectRatio.value !== 'free') {
    applyAspectRatio()
  }
}

const applyAspectRatio = () => {
  const ratios: Record<string, number> = {
    '1:1': 1,
    '4:3': 4/3,
    '16:9': 16/9,
    '3:2': 3/2
  }
  
  const ratio = ratios[aspectRatio.value]
  if (ratio) {
    cropArea.value.height = cropArea.value.width / ratio
  }
}

const startCrop = () => {
  // Simplified crop interaction - in a real implementation, you'd handle drag and resize
  console.log('Crop interaction started')
}

const cropImage = () => {
  if (!imageElement.value || !cropArea.value.active) return
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return
  
  // Set canvas size based on output settings
  let targetWidth = cropArea.value.width
  let targetHeight = cropArea.value.height
  
  if (outputSize.value === 'small') {
    targetWidth = 800
    targetHeight = 800 * (cropArea.value.height / cropArea.value.width)
  } else if (outputSize.value === 'medium') {
    targetWidth = 1200
    targetHeight = 1200 * (cropArea.value.height / cropArea.value.width)
  } else if (outputSize.value === 'large') {
    targetWidth = 1920
    targetHeight = 1920 * (cropArea.value.height / cropArea.value.width)
  } else if (outputSize.value === 'custom') {
    targetWidth = customWidth.value
    targetHeight = customHeight.value
  }
  
  canvas.width = targetWidth
  canvas.height = targetHeight
  
  // Draw cropped portion
  ctx.drawImage(
    imageElement.value,
    cropArea.value.x,
    cropArea.value.y,
    cropArea.value.width,
    cropArea.value.height,
    0,
    0,
    targetWidth,
    targetHeight
  )
  
  // Convert to blob
  canvas.toBlob((blob) => {
    if (blob) {
      croppedImage.value = URL.createObjectURL(blob)
      croppedDimensions.value = { width: targetWidth, height: targetHeight }
      croppedFileSize.value = formatFileSize(blob.size)
    }
  }, `image/${outputFormat.value}`, quality.value / 100)
}

const resetCrop = () => {
  if (imageElement.value) {
    initializeCropper()
  }
}

const downloadCroppedImage = () => {
  if (!croppedImage.value) return
  
  const a = document.createElement('a')
  a.href = croppedImage.value
  a.download = `cropped_image.${outputFormat.value}`
  a.click()
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
