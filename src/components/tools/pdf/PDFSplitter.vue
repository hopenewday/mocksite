<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Split PDF
    </h2>
    
    <div class="space-y-4 mb-6">
      <div 
        v-for="(file, index) in files" 
        :key="index"
        class="bg-brutal-white border-4 border-black p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="text-2xl">📄</span>
            <div>
              <span class="font-black">{{ file.name }}</span>
              <div class="text-sm font-bold text-brutal-gray">
                {{ formatFileSize(file.size) }} • {{ file.pageCount }} pages
              </div>
            </div>
          </div>
          <button
            class="btn-primary btn-primary-pink px-3 py-1 text-sm"
            @click="removeFile(index)"
          >
            Remove
          </button>
        </div>
        
        <!-- Split Options -->
        <div class="border-t-2 border-black pt-3">
          <div class="mb-3">
            <label class="font-black mb-2 block">Split Method</label>
            <select
              v-model="file.splitMethod"
              class="select"
            >
              <option value="single">
                Split into single pages
              </option>
              <option value="range">
                Split by page ranges
              </option>
              <option value="every">
                Split every N pages
              </option>
            </select>
          </div>
          
          <div
            v-if="file.splitMethod === 'range'"
            class="mb-3"
          >
            <label class="font-black mb-2 block">Page Ranges (e.g., 1-5, 6-10, 11-15)</label>
            <input 
              v-model="file.pageRanges"
              type="text"
              placeholder="1-5, 6-10, 11-15"
              class="input w-full"
            >
          </div>
          
          <div
            v-if="file.splitMethod === 'every'"
            class="mb-3"
          >
            <label class="font-black mb-2 block">Split Every N Pages</label>
            <input 
              v-model.number="file.splitEvery"
              type="number"
              min="1"
              :max="file.pageCount"
              class="input w-full"
            >
          </div>
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
        :disabled="files.length === 0 || isProcessing"
        class="btn-primary btn-primary-cyan flex-1 disabled:opacity-50"
        :data-state="isProcessing ? 'loading' : (justSucceeded ? 'success' : null)"
        @click="splitPDFs"
      >
        <span v-if="isProcessing">Processing...</span>
        <span v-else>Split {{ filesCountDisplay }} PDF{{ files.length > 1 ? 's' : '' }}</span>
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

interface FileData {
  file: File
  name: string
  size: number
  pageCount: number
  splitMethod: 'single' | 'range' | 'every'
  pageRanges: string
  splitEvery: number
}

const files = ref<FileData[]>([])
const fileInput = ref<HTMLInputElement>()
const isProcessing = ref(false)
const error = ref('')
const justSucceeded = ref(false)

// Count-up animation
const filesCountAnimation = useCountUp(0, { duration: 600 })

useHead({
  title: 'Split PDF',
  meta: [
    { name: 'description', content: 'Split a PDF into individual pages or custom page ranges.' },
    { property: 'og:title', content: 'Split PDF' },
    { property: 'og:description', content: 'Split a PDF into individual pages or custom page ranges.' }
  ]
})

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    await addFiles(Array.from(target.files))
  }
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files) {
    await addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = async (newFiles: File[]) => {
  const pdfFiles = newFiles.filter(file => file.type === 'application/pdf')
  if (pdfFiles.length !== newFiles.length) {
    error.value = 'Only PDF files are supported'
    setTimeout(() => error.value = '', 3000)
  }
  
  for (const file of pdfFiles) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pageCount = pdf.getPageCount()
      
      files.value.push({
        file,
        name: file.name,
        size: file.size,
        pageCount,
        splitMethod: 'single',
        pageRanges: '',
        splitEvery: 1
      })
    } catch (err) {
      error.value = `Error reading ${file.name}`
      setTimeout(() => error.value = '', 3000)
    }
  }
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

const clearAll = () => {
  files.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Update count-up animation when files change
watch(() => files.value.length, (newValue) => filesCountAnimation.setValue(newValue))

// Display value for template
const filesCountDisplay = computed(() => filesCountAnimation.displayValue.value)

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const splitPDFs = async () => {
  if (files.value.length === 0) return
  
  isProcessing.value = true
  error.value = ''
  
  try {
    for (const fileData of files.value) {
      await splitSinglePDF(fileData)
    }
    justSucceeded.value = true
    setTimeout(() => { justSucceeded.value = false }, 1200)
  } catch (err) {
    error.value = 'Error splitting PDFs. Please try again.'
    console.error('PDF split error:', err)
  } finally {
    isProcessing.value = false
  }
}

const splitSinglePDF = async (fileData: FileData) => {
  const arrayBuffer = await fileData.file.arrayBuffer()
  const pdf = await PDFDocument.load(arrayBuffer)
  const pageCount = pdf.getPageCount()
  
  if (fileData.splitMethod === 'single') {
    // Split into single pages
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create()
      const [page] = await newPdf.copyPages(pdf, [i])
      newPdf.addPage(page)
      
      const pdfBytes = await newPdf.save()
      const filename = `${fileData.name.replace('.pdf', '')}_page_${i + 1}.pdf`
      downloadBlob(pdfBytes, filename)
    }
  } else if (fileData.splitMethod === 'range') {
    // Split by page ranges
    const ranges = parsePageRanges(fileData.pageRanges, pageCount)
    
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i]
      const newPdf = await PDFDocument.create()
      const pages = await newPdf.copyPages(pdf, range)
      pages.forEach(page => newPdf.addPage(page))
      
      const pdfBytes = await newPdf.save()
      const filename = `${fileData.name.replace('.pdf', '')}_part_${i + 1}.pdf`
      downloadBlob(pdfBytes, filename)
    }
  } else if (fileData.splitMethod === 'every') {
    // Split every N pages
    const splitEvery = fileData.splitEvery
    let part = 1
    
    for (let i = 0; i < pageCount; i += splitEvery) {
      const endIndex = Math.min(i + splitEvery, pageCount)
      const pageIndices = Array.from({ length: endIndex - i }, (_, j) => i + j)
      
      const newPdf = await PDFDocument.create()
      const pages = await newPdf.copyPages(pdf, pageIndices)
      pages.forEach(page => newPdf.addPage(page))
      
      const pdfBytes = await newPdf.save()
      const filename = `${fileData.name.replace('.pdf', '')}_part_${part}.pdf`
      downloadBlob(pdfBytes, filename)
      part++
    }
  }
}

const parsePageRanges = (ranges: string, totalPages: number): number[][] => {
  const result: number[][] = []
  
  if (!ranges.trim()) {
    // Default: split in half
    const mid = Math.ceil(totalPages / 2)
    result.push(Array.from({ length: mid }, (_, i) => i))
    result.push(Array.from({ length: totalPages - mid }, (_, i) => mid + i))
    return result
  }
  
  const parts = ranges.split(',').map(part => part.trim())
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim()))
      if (start >= 1 && end <= totalPages && start <= end) {
        result.push(Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i))
      }
    } else {
      const page = parseInt(part)
      if (page >= 1 && page <= totalPages) {
        result.push([page - 1])
      }
    }
  }
  
  return result
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
