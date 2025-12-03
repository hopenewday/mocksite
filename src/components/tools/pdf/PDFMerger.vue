<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">
      Merge PDF Files
    </h2>
    
    <div class="space-y-4 mb-6">
      <div 
        v-for="(file, index) in files" 
        :key="index"
        class="bg-brutal-white border-4 border-black p-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">📄</span>
          <div>
            <span class="font-black">{{ file.name }}</span>
            <div class="text-sm font-bold text-brutal-gray">
              {{ formatFileSize(file.size) }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button 
            :disabled="index === 0"
            class="btn-primary btn-primary-cyan px-3 py-1 text-sm disabled:opacity-50"
            @click="moveFileUp(index)"
          >
            ↑
          </button>
          <button 
            :disabled="index === files.length - 1"
            class="btn-primary btn-primary-cyan px-3 py-1 text-sm disabled:opacity-50"
            @click="moveFileDown(index)"
          >
            ↓
          </button>
          <button
            class="btn-primary btn-primary-pink px-3 py-1 text-sm"
            @click="removeFile(index)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
    
    <div class="border-4 border-dashed border-brutal-gray p-8 text-center mb-6">
      <input 
        ref="fileInput"
        type="file" 
        multiple 
        accept=".pdf"
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
          Drop PDF files here or click to browse
        </p>
        <p class="text-sm font-bold text-brutal-gray">
          Supports multiple PDF files
        </p>
      </div>
    </div>
    
    <div class="flex gap-4">
      <button 
        :disabled="files.length < 2 || isProcessing"
        class="btn-primary btn-primary-cyan flex-1 disabled:opacity-50"
        :data-state="isProcessing ? 'loading' : (justSucceeded ? 'success' : null)"
        @click="mergePDFs"
      >
        <span v-if="isProcessing">Processing...</span>
        <span v-else>Merge {{ filesCountDisplay }} PDFs</span>
      </button>
      
      <button 
        :disabled="files.length === 0"
        class="btn-primary btn-primary-pink px-6 disabled:opacity-50"
        @click="clearAll"
      >
        Clear All
      </button>
    </div>
    
    <div
      v-if="error"
      class="mt-4 p-4 bg-brutal-pink/20 border-4 border-brutal-pink"
    >
      <p class="font-black text-brutal-pink">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { PDFDocument } from 'pdf-lib'
import { useHead } from '@vueuse/head'
import { useCountUp } from '../../../composables/useCountUp'
import { useMilestones } from '../../../composables/useMilestones'

const files = ref<File[]>([])
const fileInput = ref<HTMLInputElement>()
const isProcessing = ref(false)
const error = ref('')
const justSucceeded = ref(false)

// Count-up animation
const filesCountAnimation = useCountUp(0, { duration: 600 })

// Milestones
const { celebrateFirstUse, celebrateLargeOperation } = useMilestones()

useHead({
  title: 'Merge PDFs',
  meta: [
    { name: 'description', content: 'Merge multiple PDF files into a single PDF online.' },
    { property: 'og:title', content: 'Merge PDFs' },
    { property: 'og:description', content: 'Merge multiple PDF files into a single PDF online.' }
  ]
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (newFiles: File[]) => {
  const pdfFiles = newFiles.filter(file => file.type === 'application/pdf')
  if (pdfFiles.length !== newFiles.length) {
    error.value = 'Only PDF files are supported'
    setTimeout(() => error.value = '', 3000)
  }
  files.value = [...files.value, ...pdfFiles]
}

// Update count-up animation when files change
watch(() => files.value.length, (newValue) => filesCountAnimation.setValue(newValue))

// Display value for template
const filesCountDisplay = computed(() => filesCountAnimation.displayValue.value)

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

const moveFileUp = (index: number) => {
  if (index > 0) {
    const temp = files.value[index]
    files.value[index] = files.value[index - 1]
    files.value[index - 1] = temp
  }
}

const moveFileDown = (index: number) => {
  if (index < files.value.length - 1) {
    const temp = files.value[index]
    files.value[index] = files.value[index + 1]
    files.value[index + 1] = temp
  }
}

const clearAll = () => {
  files.value = []
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

const mergePDFs = async () => {
  if (files.value.length < 2) return
  
  isProcessing.value = true
  error.value = ''
  
  try {
    const mergedPdf = await PDFDocument.create()
    
    for (const file of files.value) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach(page => mergedPdf.addPage(page))
    }
    
    const mergedPdfBytes = await mergedPdf.save()
    downloadBlob(mergedPdfBytes, 'merged.pdf')
    
    // Celebrate milestones
    celebrateFirstUse('pdf-merger')
    if (files.value.length >= 10) {
      celebrateLargeOperation(files.value.length)
    }
    
    justSucceeded.value = true
    setTimeout(() => { justSucceeded.value = false }, 1200)
  } catch (err) {
    error.value = 'Error merging PDFs. Please try again.'
    console.error('PDF merge error:', err)
  } finally {
    isProcessing.value = false
  }
}

const downloadBlob = (bytes: Uint8Array, filename: string) => {
  const ab = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(ab).set(bytes)
  const blob = new Blob([ab], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>
