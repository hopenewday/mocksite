<template>
  <div class="card card-brutal-purple p-8">
    <h2 class="subheading-brutal mb-6">
      Image Compressor
    </h2>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Settings Panel -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-brutal-white border-4 border-black p-6">
          <h3 class="font-black text-lg mb-4">
            Compression Settings
          </h3>
          
          <div class="space-y-4">
            <!-- Presets -->
            <div>
              <label class="font-black mb-2 block">Preset Profile</label>
              <select
                v-model="selectedPreset"
                class="select w-full"
                @change="applyPreset"
              >
                <option value="custom">
                  Custom
                </option>
                <option value="web">
                  Web Optimization (Balanced)
                </option>
                <option value="print">
                  Print Quality (High DPI)
                </option>
                <option value="social">
                  Social Media (Standard)
                </option>
              </select>
            </div>

            <!-- Quality Slider -->
            <div>
              <label class="font-black mb-2 block flex justify-between">
                <span>Quality</span>
                <span>{{ (options.quality * 100).toFixed(0) }}%</span>
              </label>
              <input 
                v-model.number="options.quality"
                type="range" 
                min="0.1" 
                max="1" 
                step="0.05"
                class="w-full accent-brutal-purple"
              >
              <p class="text-xs font-bold mt-1 text-gray-600">
                Lower quality = smaller file size
              </p>
            </div>

            <!-- Scaling Mode -->
            <div>
              <label class="font-black mb-2 block">Scaling Mode</label>
              <select
                v-model="scalingMode"
                class="select w-full mb-2"
              >
                <option value="dimensions">
                  Max Dimensions (px)
                </option>
                <option value="percentage">
                  Percentage (%)
                </option>
              </select>

              <div v-if="scalingMode === 'dimensions'">
                <input 
                  v-model.number="options.maxWidthOrHeight"
                  type="number" 
                  placeholder="Auto (Original)"
                  class="input"
                >
                <p class="text-xs font-bold mt-1 text-gray-600">
                  Max width or height in pixels
                </p>
              </div>
              <div v-else>
                <input 
                  v-model.number="scalingPercentage"
                  type="range" 
                  min="10" 
                  max="100" 
                  step="5"
                  class="w-full accent-brutal-purple"
                >
                <div class="text-right font-black text-sm">
                  {{ scalingPercentage }}%
                </div>
              </div>
            </div>

            <!-- Output Format -->
            <div>
              <label class="font-black mb-2 block">Output Format</label>
              <select
                v-model="options.fileType"
                class="select w-full"
              >
                <option value="">
                  Original Format
                </option>
                <option value="image/jpeg">
                  JPEG
                </option>
                <option value="image/png">
                  PNG
                </option>
                <option value="image/webp">
                  WebP
                </option>
              </select>
            </div>

            <!-- Metadata -->
            <div class="flex items-center gap-2">
              <input 
                id="preserveExif" 
                v-model="options.preserveExif"
                type="checkbox"
                class="w-5 h-5 border-2 border-black rounded-none checked:bg-brutal-purple"
              >
              <label
                for="preserveExif"
                class="font-bold cursor-pointer select-none"
              >Preserve Metadata (EXIF)</label>
            </div>
            
            <!-- Re-compress Button (Apply to All) -->
            <button 
              v-if="files.length > 0"
              class="btn-primary btn-primary-cyan w-full mt-4 text-sm"
              :data-state="isCompressingAll ? 'loading' : (justCompressedAll ? 'success' : null)"
              @click="compressAll"
            >
              <span v-if="isCompressingAll">Applying...</span>
              <span v-else>Apply Settings to All</span>
            </button>
          </div>
        </div>

        <!-- Stats Summary -->
        <div
          v-if="files.length > 0"
          class="bg-brutal-yellow border-4 border-black p-6"
        >
          <h3 class="font-black text-lg mb-2">
            Summary
          </h3>
          <div class="flex justify-between font-bold">
            <span>Total Files:</span>
            <span>{{ filesCountDisplay }}</span>
          </div>
          <div class="flex justify-between font-bold text-brutal-green">
            <span>Saved:</span>
            <span>{{ totalSavingsDisplay }}</span>
          </div>
          
          <div class="mt-4 space-y-2">
            <button 
              v-if="hasCompressedFiles"
              class="btn-primary btn-primary-black w-full text-sm"
              @click="downloadAll"
            >
              Download All (ZIP)
            </button>
            <button 
              v-if="files.length > 0"
              class="btn-primary btn-primary-pink w-full text-sm"
              @click="clearAll"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Upload Zone -->
        <div class="border-4 border-dashed border-brutal-gray p-8 text-center bg-brutal-white transition-colors hover:bg-gray-50">
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*"
            multiple
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
              🗜️
            </div>
            <p class="font-black text-xl mb-2">
              Drop images here
            </p>
            <p class="text-sm font-bold text-gray-500">
              Support JPG, PNG, WebP, BMP
            </p>
          </div>
        </div>

        <!-- File List -->
        <div
          v-if="files.length > 0"
          class="space-y-4"
        >
          <div 
            v-for="(file, index) in files" 
            :key="index"
            class="bg-brutal-white border-4 border-black p-4 flex flex-col sm:flex-row gap-4 items-center relative group"
          >
            <!-- Preview -->
            <div
              class="w-20 h-20 flex-shrink-0 border-2 border-black bg-gray-100 overflow-hidden relative cursor-pointer"
              @click="openComparison(index)"
            >
              <img
                :src="file.preview"
                class="w-full h-full object-cover"
              >
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                Compare
              </div>
            </div>

            <!-- Info -->
            <div class="flex-grow min-w-0 w-full sm:w-auto text-center sm:text-left">
              <div
                class="font-black truncate"
                :title="file.original.name"
              >
                {{ file.original.name }}
              </div>
              <div class="text-sm font-bold text-gray-600">
                Original: {{ formatSize(file.original.size) }}
              </div>
              <div
                v-if="file.compressed"
                class="text-sm font-black text-brutal-green"
              >
                Compressed: {{ formatSize(file.compressed.size) }} 
                (-{{ calculateSavings(file.original.size, file.compressed.size) }}%)
              </div>
              <div
                v-if="file.error"
                class="text-sm font-black text-brutal-pink"
              >
                Error: {{ file.error }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-2 w-full sm:w-auto">
              <div class="flex gap-2 justify-center sm:justify-end">
                <button 
                  v-if="file.compressed"
                  class="btn-small bg-brutal-purple border-2 border-black font-bold px-3 py-1 hover:translate-x-1 hover:-translate-y-1 transition-transform text-xs"
                  @click="openComparison(index)"
                >
                  Compare
                </button>
              </div>
             
              <div class="flex gap-2 justify-center sm:justify-end">
                <button 
                  v-if="!file.compressed && !file.processing"
                  class="btn-small bg-brutal-cyan border-2 border-black font-bold px-4 py-1 hover:translate-x-1 hover:-translate-y-1 transition-transform"
                  @click="compressFile(index)"
                >
                  Compress
                </button>
                <div
                  v-else-if="file.processing"
                  class="font-bold text-brutal-purple animate-pulse"
                >
                  Processing...
                </div>
                <button 
                  v-if="file.compressed"
                  class="btn-small bg-brutal-green border-2 border-black font-bold px-4 py-1 hover:translate-x-1 hover:-translate-y-1 transition-transform"
                  @click="downloadSingle(index)"
                >
                  Download
                </button>
                <button 
                  class="text-brutal-pink font-black hover:underline text-sm px-2"
                  @click="removeFile(index)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comparison Modal -->
    <div
      v-if="comparisonFile"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      @click.self="closeComparison"
    >
      <div class="bg-brutal-white border-4 border-black w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div class="flex justify-between items-center p-4 border-b-4 border-black bg-brutal-purple">
          <h3 class="font-black text-xl text-white">
            Before / After Comparison
          </h3>
          <button
            class="text-white font-black hover:text-black text-2xl"
            @click="closeComparison"
          >
            &times;
          </button>
        </div>
        
        <div class="flex-grow overflow-auto p-4 bg-gray-100 flex items-center justify-center">
          <div
            ref="compareContainer" 
            class="relative select-none" 
            @mousemove="handleCompareMove"
            @touchmove="handleCompareMove"
          >
            <!-- After Image (Background) -->
            <img 
              v-if="comparisonFile.compressedPreview" 
              :src="comparisonFile.compressedPreview" 
              class="max-h-[70vh] object-contain block pointer-events-none"
              draggable="false"
            >
              
            <!-- Before Image (Foreground with clip-path) -->
            <div 
              class="absolute inset-0 overflow-hidden"
              :style="{ width: comparePosition + '%' }"
            >
              <img 
                :src="comparisonFile.preview" 
                class="max-h-[70vh] object-contain block w-full h-full object-left-top"
                :style="{ width: compareContainerWidth + 'px', maxWidth: 'none' }"
                draggable="false"
              >
            </div>

            <!-- Slider Handle -->
            <div 
              class="absolute inset-y-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              :style="{ left: comparePosition + '%' }"
            >
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-brutal-cyan border-2 border-black rounded-full flex items-center justify-center font-bold text-xs z-10">
                Example
                <span class="sr-only">Slider</span>
                ↔
              </div>
            </div>
              
            <!-- Labels -->
            <div class="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 text-xs font-bold rounded pointer-events-none">
              Original ({{ formatSize(comparisonFile.original.size) }})
            </div>
            <div class="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 text-xs font-bold rounded pointer-events-none">
              Compressed ({{ formatSize(comparisonFile.compressed?.size || 0) }})
            </div>
          </div>
        </div>

        <div class="p-4 border-t-4 border-black bg-white flex justify-between items-center">
          <div class="text-sm font-bold">
            Savings: <span class="text-brutal-green">{{ calculateSavings(comparisonFile.original.size, comparisonFile.compressed?.size || 0) }}%</span>
          </div>
          <button
            class="btn-primary btn-primary-black py-2 text-sm"
            @click="closeComparison"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onUnmounted, nextTick } from 'vue'
import imageCompression from 'browser-image-compression'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useHead } from '@vueuse/head'
import { useCountUp } from '../../../composables/useCountUp'
import { useMilestones } from '../../../composables/useMilestones'

interface CompressedFile {
  original: File
  compressed: Blob | null
  preview: string
  compressedPreview?: string
  processing: boolean
  error: string | null
}

useHead({
  title: 'Image Compressor',
  meta: [
    { name: 'description', content: 'Compress images to reduce file size without major quality loss.' },
    { property: 'og:title', content: 'Image Compressor' },
    { property: 'og:description', content: 'Compress images to reduce file size without major quality loss.' }
  ]
})

const fileInput = ref<HTMLInputElement>()
const files = ref<CompressedFile[]>([])
const compareContainer = ref<HTMLElement | null>(null)
const compareContainerWidth = ref(0)

// Count-up animations
const filesCountAnimation = useCountUp(0, { duration: 600 })

// Milestones
const { celebrateFirstUse, celebrateLargeOperation, celebrateCompressionSavings } = useMilestones()
const totalSavingsAnimation = useCountUp(0, { duration: 800, suffix: '%' })

const scalingMode = ref<'dimensions' | 'percentage'>('dimensions')
const scalingPercentage = ref(100)
const selectedPreset = ref('custom')

const options = reactive({
  maxSizeMB: 1,
  maxWidthOrHeight: undefined as number | undefined,
  useWebWorker: true,
  quality: 0.8,
  fileType: '', // empty means preserve original
  preserveExif: false
})

// Comparison State
const comparisonFile = ref<CompressedFile | null>(null)
const comparePosition = ref(50)

// Success morph states
const isCompressingAll = ref(false)
const justCompressedAll = ref(false)

// Presets Configuration
const presets = {
  web: { quality: 0.8, maxWidthOrHeight: 1920, fileType: 'image/webp', preserveExif: false, scalingMode: 'dimensions' },
  print: { quality: 1.0, maxWidthOrHeight: undefined, fileType: 'image/jpeg', preserveExif: true, scalingMode: 'dimensions' },
  social: { quality: 0.9, maxWidthOrHeight: 1080, fileType: 'image/jpeg', preserveExif: false, scalingMode: 'dimensions' },
  custom: {} // Will not overwrite manually
}

// Watchers
watch(scalingMode, () => {
  if (selectedPreset.value !== 'custom') selectedPreset.value = 'custom'
})

watch(() => options.quality, () => {
   if (selectedPreset.value !== 'custom') selectedPreset.value = 'custom'
})

watch(comparisonFile, async (newVal) => {
  if (newVal) {
    await nextTick()
    if (compareContainer.value) {
      // Get the width of the image inside the container to ensure overlay matches
      // We'll grab the first img child
      const img = compareContainer.value.querySelector('img')
      if (img) {
         compareContainerWidth.value = img.offsetWidth
      }
    }
  }
})

// Computed
const hasCompressedFiles = computed(() => files.value.some(f => f.compressed))

const totalSavings = computed(() => {
  let originalTotal = 0
  let compressedTotal = 0
  
  files.value.forEach(f => {
    if (f.compressed) {
      originalTotal += f.original.size
      compressedTotal += f.compressed.size
    }
  })
  
  if (originalTotal === 0) return 0
  const savings = ((originalTotal - compressedTotal) / originalTotal) * 100
  return savings
})

const totalSavingsSize = computed(() => {
  let originalTotal = 0
  let compressedTotal = 0
  
  files.value.forEach(f => {
    if (f.compressed) {
      originalTotal += f.original.size
      compressedTotal += f.compressed.size
    }
  })
  
  return originalTotal - compressedTotal
})

// Update count-up animations when values change
watch(() => files.value.length, (newValue) => filesCountAnimation.setValue(newValue))
watch(totalSavings, (newValue) => totalSavingsAnimation.setValue(newValue))

// Display values for template
const filesCountDisplay = computed(() => filesCountAnimation.displayValue.value)
const totalSavingsDisplay = computed(() => {
  const percentage = totalSavingsAnimation.displayValue.value
  const size = formatSize(totalSavingsSize.value)
  return `${percentage} (${size})`
})

// Methods
const applyPreset = () => {
  const presetKey = selectedPreset.value as 'web' | 'print' | 'social' | 'custom'
  if (presetKey === 'custom') return

  const preset = presets[presetKey] as {
    quality: number
    maxWidthOrHeight?: number
    fileType: string
    preserveExif?: boolean
    scalingMode: 'dimensions' | 'percentage'
  }

  options.quality = preset.quality
  options.maxWidthOrHeight = preset.maxWidthOrHeight
  options.fileType = preset.fileType
  options.preserveExif = !!preset.preserveExif
  scalingMode.value = preset.scalingMode
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const calculateSavings = (original: number, compressed: number) => {
  if (original === 0) return '0'
  return (((original - compressed) / original) * 100).toFixed(1)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
  // Reset input
  if (target.value) target.value = ''
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (newFiles: File[]) => {
  const imageFiles = newFiles.filter(f => f.type.startsWith('image/'))
  
  imageFiles.forEach(file => {
    files.value.push({
      original: file,
      compressed: null,
      preview: URL.createObjectURL(file),
      processing: false,
      error: null
    })
    // Auto compress on add with current settings
    compressFile(files.value.length - 1)
  })
}

const getImageDimensions = (file: File): Promise<{width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

const compressAll = () => {
  isCompressingAll.value = true
  justCompressedAll.value = false
  
  // Celebrate large operations
  if (files.value.length >= 10) {
    celebrateLargeOperation(files.value.length)
  }
  
  files.value.forEach((_, index) => compressFile(index))
  
  // Show success state after all files are processed
  setTimeout(() => {
    isCompressingAll.value = false
    justCompressedAll.value = true
    setTimeout(() => { justCompressedAll.value = false }, 1200)
  }, 1000) // Give time for compression to complete
}

const compressFile = async (index: number) => {
  const fileItem = files.value[index]
  if (!fileItem) return

  fileItem.processing = true
  fileItem.error = null
  
  // Clean up previous preview if exists
  if (fileItem.compressedPreview) {
    URL.revokeObjectURL(fileItem.compressedPreview)
    fileItem.compressedPreview = undefined
  }

  try {
    let widthOrHeight = options.maxWidthOrHeight

    // Handle Percentage Scaling
    if (scalingMode.value === 'percentage' && scalingPercentage.value < 100) {
      const dims = await getImageDimensions(fileItem.original)
      const scale = scalingPercentage.value / 100
      // We need to determine which dimension is larger to set maxWidthOrHeight correctly effectively
      // actually browser-image-compression takes maxWidthOrHeight and maintains aspect ratio. 
      // If we want to scale down by percentage, we can just set maxWidthOrHeight to max(width, height) * percentage
      widthOrHeight = Math.max(dims.width, dims.height) * scale
    }

    const compressionConfig = {
      maxSizeMB: options.maxSizeMB, // Note: this is a soft limit, quality is primary if maxSizeMB is large
      maxWidthOrHeight: widthOrHeight || undefined,
      useWebWorker: options.useWebWorker,
      initialQuality: options.quality,
      fileType: options.fileType || undefined,
      preserveExif: options.preserveExif
    }

    const compressedBlob = await imageCompression(fileItem.original, compressionConfig)
    fileItem.compressed = compressedBlob
    fileItem.compressedPreview = URL.createObjectURL(compressedBlob)
    
    // Celebrate milestones
    celebrateFirstUse('image-compressor')
    
    // Calculate compression savings
    const originalSize = fileItem.original.size
    const compressedSize = compressedBlob.size
    const savingsPercent = ((originalSize - compressedSize) / originalSize) * 100
    
    if (savingsPercent >= 50) {
      celebrateCompressionSavings(savingsPercent)
    }
    
  } catch (error) {
    console.error('Compression failed:', error)
    fileItem.error = 'Compression failed'
  } finally {
    fileItem.processing = false
  }
}

const downloadSingle = (index: number) => {
  const fileItem = files.value[index]
  if (!fileItem?.compressed) return

  const ext = options.fileType ? 
    (options.fileType === 'image/jpeg' ? 'jpg' : options.fileType.split('/')[1]) : 
    fileItem.original.name.split('.').pop()
    
  const name = fileItem.original.name.substring(0, fileItem.original.name.lastIndexOf('.'))
  saveAs(fileItem.compressed, `${name}_compressed.${ext}`)
}

const downloadAll = async () => {
  const zip = new JSZip()
  let count = 0

  files.value.forEach(file => {
    if (file.compressed) {
      const ext = options.fileType ? 
        (options.fileType === 'image/jpeg' ? 'jpg' : options.fileType.split('/')[1]) : 
        file.original.name.split('.').pop()
      
      const name = file.original.name.substring(0, file.original.name.lastIndexOf('.'))
      zip.file(`${name}_compressed.${ext}`, file.compressed)
      count++
    }
  })

  if (count === 0) return

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'compressed_images.zip')
}

const removeFile = (index: number) => {
  const file = files.value[index]
  URL.revokeObjectURL(file.preview)
  if (file.compressedPreview) URL.revokeObjectURL(file.compressedPreview)
  files.value.splice(index, 1)
}

const clearAll = () => {
  files.value.forEach(f => {
    URL.revokeObjectURL(f.preview)
    if (f.compressedPreview) URL.revokeObjectURL(f.compressedPreview)
  })
  files.value = []
}

// Comparison Logic
const openComparison = (index: number) => {
  if (files.value[index].compressed) {
    comparisonFile.value = files.value[index]
    comparePosition.value = 50
  }
}

const closeComparison = () => {
  comparisonFile.value = null
}

const handleCompareMove = (e: MouseEvent | TouchEvent) => {
  if (!compareContainer.value) return
  
  const rect = compareContainer.value.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
  
  let pos = ((clientX - rect.left) / rect.width) * 100
  pos = Math.max(0, Math.min(100, pos))
  
  comparePosition.value = pos
}

onUnmounted(() => {
  clearAll()
})
</script>

<style scoped>
.btn-small {
  @apply uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all;
}
</style>
