<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Rotate PDF
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
        
        <!-- Rotation Options -->
        <div class="border-t-2 border-black pt-3">
          <div class="mb-3">
            <label class="font-black mb-2 block">Rotation Angle</label>
            <select
              v-model="file.rotation"
              class="select"
            >
              <option value="90">
                90° clockwise
              </option>
              <option value="180">
                180°
              </option>
              <option value="270">
                270° clockwise (90° counter-clockwise)
              </option>
            </select>
          </div>
          
          <div class="mb-3">
            <label class="font-black mb-2 block">Apply to</label>
            <select
              v-model="file.applyTo"
              class="select"
            >
              <option value="all">
                All pages
              </option>
              <option value="specific">
                Specific pages
              </option>
            </select>
          </div>
          
          <div
            v-if="file.applyTo === 'specific'"
            class="mb-3"
          >
            <label class="font-black mb-2 block">Page Numbers (comma-separated)</label>
            <input 
              v-model="file.pageNumbers"
              type="text"
              placeholder="1, 2, 5, 8"
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
        @click="rotatePDFs"
      >
        <span v-if="isProcessing">Processing...</span>
        <span v-else>Rotate {{ files.length }} PDF{{ files.length > 1 ? 's' : '' }}</span>
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
import { ref } from 'vue'
import { PDFDocument, degrees } from 'pdf-lib'
import { useHead } from '@vueuse/head'

interface FileData {
  file: File
  name: string
  size: number
  pageCount: number
  rotation: number
  applyTo: 'all' | 'specific'
  pageNumbers: string
}

const files = ref<FileData[]>([])
const fileInput = ref<HTMLInputElement>()
const isProcessing = ref(false)
const error = ref('')
const justSucceeded = ref(false)

useHead({
  title: 'Rotate PDF',
  meta: [
    { name: 'description', content: 'Rotate PDF pages clockwise or counter-clockwise.' },
    { property: 'og:title', content: 'Rotate PDF' },
    { property: 'og:description', content: 'Rotate PDF pages clockwise or counter-clockwise.' }
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
        rotation: 90,
        applyTo: 'all',
        pageNumbers: ''
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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const rotatePDFs = async () => {
  if (files.value.length === 0) return
  
  isProcessing.value = true
  error.value = ''
  
  try {
    for (const fileData of files.value) {
      await rotateSinglePDF(fileData)
    }
    // Show success state
    justSucceeded.value = true
    setTimeout(() => { justSucceeded.value = false }, 1200)
  } catch (err) {
    error.value = 'Error rotating PDFs. Please try again.'
    console.error('PDF rotation error:', err)
  } finally {
    isProcessing.value = false
  }
}

const rotateSinglePDF = async (fileData: FileData) => {
  const arrayBuffer = await fileData.file.arrayBuffer()
  const pdf = await PDFDocument.load(arrayBuffer)
  const pageCount = pdf.getPageCount()
  
  let pagesToRotate: number[]
  
  if (fileData.applyTo === 'all') {
    pagesToRotate = Array.from({ length: pageCount }, (_, i) => i)
  } else {
    pagesToRotate = parsePageNumbers(fileData.pageNumbers, pageCount)
  }
  
  for (const pageIndex of pagesToRotate) {
    if (pageIndex < pageCount) {
      const page = pdf.getPage(pageIndex)
      page.setRotation(degrees(fileData.rotation))
    }
  }
  
  const pdfBytes = await pdf.save()
  const filename = `${fileData.name.replace('.pdf', '')}_rotated.pdf`
  downloadBlob(pdfBytes, filename)
}

const parsePageNumbers = (pageNumbers: string, totalPages: number): number[] => {
  if (!pageNumbers.trim()) return []
  
  const pages = pageNumbers.split(',').map(p => p.trim())
  const result: number[] = []
  
  for (const page of pages) {
    const pageNum = parseInt(page)
    if (pageNum >= 1 && pageNum <= totalPages) {
      result.push(pageNum - 1) // Convert to 0-based index
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
