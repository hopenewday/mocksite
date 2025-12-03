<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Favicon Generator
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Generate favicons and app icons in multiple sizes from your image.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Upload Section -->
        <div class="space-y-6">
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Upload Image
            </h2>
            
            <div 
              class="border-4 border-dashed border-black p-8 text-center cursor-pointer hover:bg-brutal-lime transition-colors"
              :class="{ 'bg-brutal-lime': isDragging }"
              @drop.prevent="handleDrop"
              @dragover.prevent
              @dragenter.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @click="triggerFileInput"
            >
              <div v-if="!uploadedImage">
                <div class="text-4xl mb-4">
                  📁
                </div>
                <p class="font-black mb-2">
                  Drop an image here or click to browse
                </p>
                <p class="text-sm text-gray-600">
                  Supports PNG, JPG, SVG, WebP
                </p>
              </div>
              <div v-else>
                <img
                  :src="uploadedImage"
                  alt="Uploaded"
                  class="max-w-32 max-h-32 mx-auto mb-2"
                >
                <p class="font-black">
                  {{ fileName }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ formatFileSize(fileSize) }}
                </p>
              </div>
            </div>
            
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            >
            
            <div
              v-if="error"
              class="mt-4 p-3 bg-red-100 border-4 border-red-500 text-red-800"
            >
              <p class="font-black">
                Error: {{ error }}
              </p>
            </div>
          </div>

          <!-- Generation Options -->
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Generation Options
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="font-black block mb-2">Background Color</label>
                <div class="flex gap-2">
                  <input 
                    v-model="backgroundColor" 
                    type="color"
                    class="w-12 h-12 border-4 border-black"
                  >
                  <button 
                    class="btn-primary btn-primary-yellow"
                    @click="backgroundColor = '#ffffff'"
                  >
                    White
                  </button>
                  <button 
                    class="btn-primary btn-primary-lime"
                    @click="backgroundColor = 'transparent'"
                  >
                    Transparent
                  </button>
                </div>
              </div>
              
              <div>
                <label class="font-black block mb-2">Output Format</label>
                <select
                  v-model="outputFormat"
                  class="input-brutal w-full"
                >
                  <option value="png">
                    PNG (Recommended)
                  </option>
                  <option value="ico">
                    ICO (Favicon)
                  </option>
                </select>
              </div>
              
              <div class="p-3 bg-brutal-yellow border-2 border-black">
                <h3 class="font-black mb-2">
                  Sizes to Generate
                </h3>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="generateSizes"
                      type="checkbox"
                      value="16"
                    >
                    <span>16x16 (Favicon)</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="generateSizes"
                      type="checkbox"
                      value="32"
                    >
                    <span>32x32 (Favicon)</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="generateSizes"
                      type="checkbox"
                      value="48"
                    >
                    <span>48x48</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="generateSizes"
                      type="checkbox"
                      value="64"
                    >
                    <span>64x64</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="generateSizes"
                      type="checkbox"
                      value="128"
                    >
                    <span>128x128</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="generateSizes"
                      type="checkbox"
                      value="180"
                    >
                    <span>180x180 (Apple Touch)</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="generateSizes"
                      type="checkbox"
                      value="192"
                    >
                    <span>192x192 (Android)</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="generateSizes"
                      type="checkbox"
                      value="512"
                    >
                    <span>512x512 (Android)</span>
                  </label>
                </div>
              </div>
              
              <button 
                class="btn-primary btn-primary-yellow w-full"
                :disabled="!uploadedImage || generateSizes.length === 0"
                @click="generateFavicons"
              >
                Generate Favicons
              </button>
            </div>
          </div>
        </div>

        <!-- Preview & Download -->
        <div class="space-y-6">
          <!-- Generated Icons -->
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Generated Icons
            </h2>
            
            <div v-if="generatedIcons.length > 0">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div 
                  v-for="icon in generatedIcons" 
                  :key="icon.size"
                  class="border-4 border-black p-3 bg-white"
                >
                  <div class="text-center">
                    <img
                      :src="icon.url"
                      :alt="`${icon.size}x${icon.size}`"
                      class="w-16 h-16 mx-auto mb-2"
                    >
                    <div class="font-black text-sm">
                      {{ icon.size }}x{{ icon.size }}
                    </div>
                    <div class="text-xs text-gray-600">
                      {{ formatFileSize(icon.size) }}
                    </div>
                  </div>
                  <button 
                    class="btn-primary btn-primary-lime w-full mt-2 text-xs"
                    @click="downloadIcon(icon)"
                  >
                    Download
                  </button>
                </div>
              </div>
              
              <div class="mt-4 flex gap-2">
                <button 
                  class="btn-primary btn-primary-pink flex-1"
                  :disabled="generatedIcons.length === 0"
                  @click="downloadAll"
                >
                  Download All as ZIP
                </button>
                <button 
                  class="btn-primary btn-primary-yellow flex-1"
                  :disabled="generatedIcons.length === 0"
                  @click="copyHTMLCode"
                >
                  Copy HTML Code
                </button>
              </div>
            </div>
            
            <div
              v-else
              class="text-center py-8 text-gray-600"
            >
              <div class="text-4xl mb-4">
                🎨
              </div>
              <p>Upload an image and generate icons</p>
            </div>
          </div>

          <!-- HTML Code Preview -->
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              HTML Code
            </h2>
            
            <div
              v-if="htmlCode"
              class="space-y-4"
            >
              <textarea 
                :value="htmlCode" 
                readonly 
                rows="8" 
                class="input-brutal w-full font-mono text-sm"
              />
              
              <div class="p-3 bg-brutal-lime border-2 border-black">
                <p class="text-sm font-black">
                  📝 Add this code to the &lt;head&gt; section of your HTML
                </p>
              </div>
            </div>
            
            <div
              v-else
              class="text-center py-8 text-gray-600"
            >
              <p>HTML code will appear here after generation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'

useHead({
  title: 'Favicon Generator - Free Online Tool',
  meta: [
    { name: 'description', content: 'Generate favicons and app icons in multiple sizes from your image. Free online favicon generator.' },
    { property: 'og:title', content: 'Favicon Generator' },
    { property: 'og:description', content: 'Generate favicons and app icons in multiple sizes from your image.' }
  ]
})

const fileInput = ref<HTMLInputElement>()
const uploadedImage = ref('')
const fileName = ref('')
const fileSize = ref(0)
const isDragging = ref(false)
const error = ref('')
const backgroundColor = ref('#ffffff')
const outputFormat = ref('png')
const generateSizes = ref(['16', '32', '180', '192', '512'])
const generatedIcons = ref<Array<{ size: number; url: string; blob: Blob }>>([])
const htmlCode = ref('')

const { copyWithFeedback } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file: File) => {
  error.value = ''
  
  if (!file.type.startsWith('image/')) {
    error.value = 'Please select a valid image file'
    return
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    error.value = 'File size must be less than 10MB'
    return
  }
  
  fileName.value = file.name
  fileSize.value = file.size
  
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const generateFavicons = async () => {
  if (!uploadedImage.value || generateSizes.value.length === 0) return
  
  error.value = ''
  generatedIcons.value = []
  htmlCode.value = ''
  
  try {
    const img = new Image()
    img.onload = () => {
      generateIconsFromImage(img)
    }
    img.onerror = () => {
      error.value = 'Failed to load image'
    }
    img.src = uploadedImage.value
  } catch (e: any) {
    error.value = e.message || 'Failed to generate icons'
  }
}

const generateIconsFromImage = (img: HTMLImageElement) => {
  const promises = generateSizes.value.map(size => 
    generateIcon(img, parseInt(size))
  )
  
  Promise.all(promises).then(icons => {
    generatedIcons.value = icons.filter(Boolean) as Array<{ size: number; url: string; blob: Blob }>
    generateHTMLCode()
    celebrateFirstUse('favicon-generator')
  })
}

const generateIcon = (img: HTMLImageElement, size: number): Promise<{ size: number; url: string; blob: Blob } | null> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      resolve(null)
      return
    }
    
    canvas.width = size
    canvas.height = size
    
    // Clear canvas and set background
    ctx.clearRect(0, 0, size, size)
    if (backgroundColor.value !== 'transparent') {
      ctx.fillStyle = backgroundColor.value
      ctx.fillRect(0, 0, size, size)
    }
    
    // Calculate aspect ratio and centering
    const imgAspect = img.width / img.height
    const canvasAspect = size / size
    
    let drawWidth = size
    let drawHeight = size
    let x = 0
    let y = 0
    
    if (imgAspect > canvasAspect) {
      // Image is wider
      drawHeight = size
      drawWidth = size * imgAspect
      x = (size - drawWidth) / 2
    } else {
      // Image is taller
      drawWidth = size
      drawHeight = size / imgAspect
      y = (size - drawHeight) / 2
    }
    
    // Draw image
    ctx.drawImage(img, x, y, drawWidth, drawHeight)
    
    // Convert to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null)
        return
      }
      
      const url = URL.createObjectURL(blob)
      resolve({
        size,
        url,
        blob
      })
    }, 'image/png')
  })
}

const downloadIcon = (icon: { size: number; url: string; blob: Blob }) => {
  const extension = outputFormat.value === 'ico' ? 'ico' : 'png'
  saveAs(icon.blob, `favicon-${icon.size}x${icon.size}.${extension}`)
}

const downloadAll = async () => {
  if (generatedIcons.value.length === 0) return
  
  const zip = new JSZip()
  
  generatedIcons.value.forEach(icon => {
    const extension = outputFormat.value === 'ico' && icon.size === 16 ? 'ico' : 'png'
    const fileName = `favicon-${icon.size}x${icon.size}.${extension}`
    zip.file(fileName, icon.blob)
  })
  
  // Add HTML code
  if (htmlCode.value) {
    zip.file('favicon-code.html', htmlCode.value)
  }
  
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'favicons.zip')
}

const generateHTMLCode = () => {
  const code = generatedIcons.value.map(icon => {
    const size = icon.size
    const rel = size === 16 || size === 32 ? 'icon' : 
                size === 180 ? 'apple-touch-icon' : 
                size === 192 || size === 512 ? 'manifest' : 'shortcut icon'
    
    return `<link rel="${rel}" sizes="${size}x${size}" href="/favicon-${size}x${size}.png">`
  }).join('\n  ')
  
  htmlCode.value = `<!-- Favicon Code -->
<!-- Add these lines to the <head> section of your HTML -->
  ${code}

<!-- For Android/Progressive Web App -->
<link rel="manifest" href="/site.webmanifest">`
}

const copyHTMLCode = async () => {
  if (!htmlCode.value) return
  await copyWithFeedback(htmlCode.value)
}
</script>

<style scoped>
.input-brutal {
  width: 100%;
  padding: 0.75rem;
  border: 4px solid black;
  background-color: white;
  color: black;
}

.dark .input-brutal {
  background-color: #1a1a1a;
  color: white;
}

.btn-primary {
  padding: 0.5rem 1rem;
  border: 4px solid black;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
  font-weight: 900;
}

.btn-primary-yellow {
  background-color: #ffff00;
}

.btn-primary-lime {
  background-color: #00ff00;
}

.btn-primary-pink {
  background-color: #ff0099;
}

.card-brutal-white {
  background-color: white;
}

.card-brutal-black {
  background-color: #1a1a1a;
}
</style>
