<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Image Resizer
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
          
          <div class="flex justify-between items-center p-3 bg-brutal-gray border-2 border-black">
            <span class="font-black">Original Size</span>
            <span class="text-sm font-black">{{ originalDimensions.width }} × {{ originalDimensions.height }}</span>
          </div>
          
          <button
            class="btn-primary btn-primary-pink w-full"
            @click="clearImage"
          >
            Clear Image
          </button>
        </div>
      </div>
      
      <!-- Resize Settings -->
      <div class="bg-brutal-yellow border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Resize Settings
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Resize Method</label>
            <select
              v-model="resizeMethod"
              class="select"
            >
              <option value="percentage">
                By Percentage
              </option>
              <option value="dimensions">
                By Dimensions
              </option>
              <option value="fit">
                Fit to Dimensions
              </option>
              <option value="fill">
                Fill to Dimensions
              </option>
            </select>
          </div>
          
          <!-- Percentage Resize -->
          <div v-if="resizeMethod === 'percentage'">
            <label class="font-black mb-2 block">Scale Percentage</label>
            <input 
              v-model.number="scalePercentage"
              type="range"
              min="10"
              max="200"
              class="w-full mb-2"
            >
            <div class="text-center font-black">
              {{ scalePercentage }}%
            </div>
          </div>
          
          <!-- Dimensions Resize -->
          <div v-if="resizeMethod === 'dimensions'">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="font-black mb-2 block">Width (px)</label>
                <input 
                  v-model.number="targetWidth"
                  type="number"
                  min="1"
                  class="input w-full"
                >
              </div>
              <div>
                <label class="font-black mb-2 block">Height (px)</label>
                <input 
                  v-model.number="targetHeight"
                  type="number"
                  min="1"
                  class="input w-full"
                >
              </div>
            </div>
            
            <label class="flex items-center gap-2 mt-2">
              <input
                v-model="maintainAspectRatio"
                type="checkbox"
                class="w-4 h-4"
              >
              <span class="font-black">Maintain Aspect Ratio</span>
            </label>
          </div>
          
          <!-- Fit/Fill Resize -->
          <div v-if="resizeMethod === 'fit' || resizeMethod === 'fill'">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="font-black mb-2 block">Width (px)</label>
                <input 
                  v-model.number="targetWidth"
                  type="number"
                  min="1"
                  class="input w-full"
                >
              </div>
              <div>
                <label class="font-black mb-2 block">Height (px)</label>
                <input 
                  v-model.number="targetHeight"
                  type="number"
                  min="1"
                  class="input w-full"
                >
              </div>
            </div>
          </div>
          
          <div>
            <label class="font-black mb-2 block">Output Format</label>
            <select
              v-model="outputFormat"
              class="select"
            >
              <option value="original">
                Original Format
              </option>
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
              class="w-full mb-2"
            >
            <div class="text-center font-black">
              {{ quality }}%
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Preview Section -->
    <div
      v-if="originalImage"
      class="bg-brutal-lime border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Preview
      </h3>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-bold mb-2">
            Original
          </h4>
          <div class="bg-brutal-white border-2 border-black p-4">
            <img
              :src="imagePreview"
              alt="Original image"
              class="w-full h-auto"
            >
          </div>
        </div>
        
        <div>
          <h4 class="font-bold mb-2">
            Resized
          </h4>
          <div class="bg-brutal-white border-2 border-black p-4">
            <canvas
              ref="previewCanvas"
              class="w-full h-auto"
            />
          </div>
        </div>
      </div>
      
      <div class="flex gap-4 mt-4">
        <button
          class="btn-primary btn-primary-cyan flex-1"
          @click="previewResize"
        >
          Preview Resize
        </button>
        
        <button
          class="btn-primary btn-primary-lime flex-1"
          @click="resizeImage"
        >
          Download Resized Image
        </button>
      </div>
    </div>
    
    <!-- Preset Sizes -->
    <div class="bg-brutal-pink border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Quick Presets
      </h3>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          v-for="preset in presetSizes"
          :key="preset.name"
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="applyPreset(preset)"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              {{ preset.icon }}
            </div>
            <h4 class="font-black text-sm">
              {{ preset.name }}
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              {{ preset.width }} × {{ preset.height }}
            </p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useHead } from '@vueuse/head'

interface PresetSize {
  name: string
  width: number
  height: number
  icon: string
}

useHead({
  title: 'Image Resizer',
  meta: [
    { name: 'description', content: 'Resize images to custom sizes with optional aspect ratio.' },
    { property: 'og:title', content: 'Image Resizer' },
    { property: 'og:description', content: 'Resize images to custom sizes with optional aspect ratio.' }
  ]
})

const originalImage = ref<File | null>(null)
const imagePreview = ref('')
const originalDimensions = ref({ width: 0, height: 0 })

const resizeMethod = ref('percentage')
const scalePercentage = ref(100)
const targetWidth = ref(800)
const targetHeight = ref(600)
const maintainAspectRatio = ref(true)
const outputFormat = ref('original')
const quality = ref(90)

const fileInput = ref<HTMLInputElement>()
const previewCanvas = ref<HTMLCanvasElement>()

const presetSizes: PresetSize[] = [
  { name: 'Instagram Square', width: 1080, height: 1080, icon: '📱' },
  { name: 'Instagram Story', width: 1080, height: 1920, icon: '📱' },
  { name: 'Facebook Cover', width: 1200, height: 630, icon: '📘' },
  { name: 'Twitter Header', width: 1500, height: 500, icon: '🐦' },
  { name: 'YouTube Thumbnail', width: 1280, height: 720, icon: '📺' },
  { name: 'Website Banner', width: 1920, height: 1080, icon: '🌐' },
  { name: 'Small Thumbnail', width: 150, height: 150, icon: '🖼️' },
  { name: 'Medium Preview', width: 400, height: 300, icon: '📷' }
]

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
    
    // Get original dimensions
    const img = new Image()
    img.onload = () => {
      originalDimensions.value = { width: img.width, height: img.height }
      targetWidth.value = img.width
      targetHeight.value = img.height
    }
    img.src = imagePreview.value
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  originalImage.value = null
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const applyPreset = (preset: PresetSize) => {
  resizeMethod.value = 'dimensions'
  targetWidth.value = preset.width
  targetHeight.value = preset.height
  maintainAspectRatio.value = false
}

const previewResize = () => {
  if (!originalImage.value || !previewCanvas.value) return
  
  const img = new Image()
  img.onload = () => {
    const canvas = previewCanvas.value!
    const ctx = canvas.getContext('2d')!
    
    const newDimensions = calculateNewDimensions(img.width, img.height)
    
    canvas.width = newDimensions.width
    canvas.height = newDimensions.height
    
    ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height)
  }
  img.src = imagePreview.value
}

const resizeImage = () => {
  if (!originalImage.value) return
  
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    const newDimensions = calculateNewDimensions(img.width, img.height)
    
    canvas.width = newDimensions.width
    canvas.height = newDimensions.height
    
    ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height)
    
    // Determine output format
    const format = outputFormat.value === 'original' ? originalImage.value!.type.split('/')[1] : outputFormat.value
    
    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `resized_image.${format}`)
      }
    }, `image/${format}`, quality.value / 100)
  }
  img.src = imagePreview.value
}

const calculateNewDimensions = (originalWidth: number, originalHeight: number) => {
  let newWidth = originalWidth
  let newHeight = originalHeight
  
  switch (resizeMethod.value) {
    case 'percentage':
      newWidth = Math.round(originalWidth * (scalePercentage.value / 100))
      newHeight = Math.round(originalHeight * (scalePercentage.value / 100))
      break
      
    case 'dimensions':
      newWidth = targetWidth.value
      newHeight = targetHeight.value
      
      if (maintainAspectRatio.value) {
        const aspectRatio = originalWidth / originalHeight
        if (targetWidth.value / targetHeight.value > aspectRatio) {
          newWidth = Math.round(targetHeight.value * aspectRatio)
        } else {
          newHeight = Math.round(targetWidth.value / aspectRatio)
        }
      }
      break
      
    case 'fit':
      const aspectRatio = originalWidth / originalHeight
      const targetAspectRatio = targetWidth.value / targetHeight.value
      
      if (aspectRatio > targetAspectRatio) {
        newWidth = targetWidth.value
        newHeight = Math.round(targetWidth.value / aspectRatio)
      } else {
        newHeight = targetHeight.value
        newWidth = Math.round(targetHeight.value * aspectRatio)
      }
      break
      
    case 'fill':
      const fillAspectRatio = originalWidth / originalHeight
      const fillTargetAspectRatio = targetWidth.value / targetHeight.value
      
      if (fillAspectRatio > fillTargetAspectRatio) {
        newHeight = targetHeight.value
        newWidth = Math.round(targetHeight.value * fillAspectRatio)
      } else {
        newWidth = targetWidth.value
        newHeight = Math.round(targetWidth.value / fillAspectRatio)
      }
      break
  }
  
  return { width: newWidth, height: newHeight }
}

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Watch for aspect ratio changes
watch(maintainAspectRatio, () => {
  if (maintainAspectRatio.value && originalDimensions.value.width > 0) {
    const aspectRatio = originalDimensions.value.width / originalDimensions.value.height
    targetHeight.value = Math.round(targetWidth.value / aspectRatio)
  }
})

watch(targetWidth, () => {
  if (maintainAspectRatio.value && originalDimensions.value.width > 0) {
    const aspectRatio = originalDimensions.value.width / originalDimensions.value.height
    targetHeight.value = Math.round(targetWidth.value / aspectRatio)
  }
})
</script>
