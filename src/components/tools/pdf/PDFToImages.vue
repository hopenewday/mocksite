<template>
  <div class="card card-brutal-purple p-8">
    <h2 class="subheading-brutal mb-6">
      PDF to Images
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

        <!-- Conversion Options -->
        <div class="border-t-2 border-black pt-3">
          <div class="mb-3">
            <label class="font-black mb-2 block">Image Format</label>
            <select
              v-model="file.imageFormat"
              class="select"
            >
              <option value="png">
                PNG (Higher quality)
              </option>
              <option value="jpeg">
                JPEG (Smaller size)
              </option>
              <option value="webp">
                WebP (Modern format)
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="font-black mb-2 block">Quality</label>
            <select
              v-model="file.quality"
              class="select"
            >
              <option value="high">
                High (2x scale)
              </option>
              <option value="medium">
                Medium (1.5x scale)
              </option>
              <option value="low">
                Low (1x scale)
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="font-black mb-2 block">Pages to Convert</label>
            <select
              v-model="file.pagesToConvert"
              class="select"
            >
              <option value="all">
                All pages
              </option>
              <option value="first">
                First page only
              </option>
              <option value="specific">
                Specific pages
              </option>
            </select>
          </div>

          <div
            v-if="file.pagesToConvert === 'specific'"
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
        @click="convertPDFsToImages"
      >
        <span v-if="isProcessing">Converting... {{ progressText }}</span>
        <span v-else>Convert to Images</span>
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

    <!-- Preview Section -->
    <div
      v-if="previewImages.length > 0"
      class="mt-8"
    >
      <h3 class="font-black text-lg mb-4">
        Converted Images ({{ previewImages.length }})
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(preview, index) in previewImages"
          :key="index"
          class="bg-brutal-white border-2 border-black p-2"
        >
          <img
            :src="preview.url"
            :alt="preview.name"
            class="w-full h-auto mb-2"
          >
          <p class="text-xs font-black text-center truncate">
            {{ preview.name }}
          </p>
          <button
            class="btn-primary btn-primary-lime w-full mt-2 text-xs py-1"
            @click="downloadSingleImage(preview)"
          >
            Download
          </button>
        </div>
      </div>

      <button
        v-if="previewImages.length > 1"
        class="btn-primary btn-primary-cyan w-full mt-4"
        @click="downloadAllImages"
      >
        Download All Images
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import { PDFDocument } from 'pdf-lib'

interface FileData {
  file: File
  name: string
  size: number
  pageCount: number
  imageFormat: 'png' | 'jpeg' | 'webp'
  quality: 'high' | 'medium' | 'low'
  pagesToConvert: 'all' | 'first' | 'specific'
  pageNumbers: string
}

interface PreviewImage {
  name: string
  url: string
  blob: Blob
}

useHead({
  title: 'PDF to Images',
  meta: [
    { name: 'description', content: 'Convert PDF pages to PNG, JPEG, or WebP images.' },
    { property: 'og:title', content: 'PDF to Images' },
    { property: 'og:description', content: 'Convert PDF pages to PNG, JPEG, or WebP images.' }
  ]
})

const files = ref<FileData[]>([])
const fileInput = ref<HTMLInputElement>()
const isProcessing = ref(false)
const error = ref('')
const previewImages = ref<PreviewImage[]>([])
const progressText = ref('')

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
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pageCount = pdfDoc.getPageCount()

      files.value.push({
        file,
        name: file.name,
        size: file.size,
        pageCount,
        imageFormat: 'png',
        quality: 'medium',
        pagesToConvert: 'all',
        pageNumbers: '',
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
  previewImages.value = []
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

const getScaleFromQuality = (quality: string): number => {
  switch (quality) {
    case 'high': return 2.0
    case 'medium': return 1.5
    case 'low': return 1.0
    default: return 1.5
  }
}

const convertPDFsToImages = async () => {
  if (files.value.length === 0) return

  isProcessing.value = true
  error.value = ''
  previewImages.value = []

  try {
    // Load PDF.js dynamically
    const pdfjsLib = await loadPDFJS()

    for (const fileData of files.value) {
      await convertPDFToImages(fileData, pdfjsLib)
    }
  } catch (err) {
    error.value = 'Error converting PDFs to images. Please try again.'
    console.error('PDF to images conversion error:', err)
  } finally {
    isProcessing.value = false
    progressText.value = ''
  }
}

const loadPDFJS = async () => {
  // Check if PDF.js is already loaded
  if ((window as any).pdfjsLib) {
    return (window as any).pdfjsLib
  }

  // Load PDF.js from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      resolve(pdfjsLib)
    }
    script.onerror = () => reject(new Error('Failed to load PDF.js'))
    document.head.appendChild(script)
  })
}

const convertPDFToImages = async (fileData: FileData, pdfjsLib: any) => {
  const arrayBuffer = await fileData.file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pageCount = pdf.numPages

  let pagesToConvert: number[]

  switch (fileData.pagesToConvert) {
    case 'all':
      pagesToConvert = Array.from({ length: pageCount }, (_, i) => i + 1)
      break
    case 'first':
      pagesToConvert = [1]
      break
    case 'specific':
      pagesToConvert = parsePageNumbers(fileData.pageNumbers, pageCount)
      break
    default:
      pagesToConvert = Array.from({ length: pageCount }, (_, i) => i + 1)
  }

  const scale = getScaleFromQuality(fileData.quality)

  for (let i = 0; i < pagesToConvert.length; i++) {
    const pageNum = pagesToConvert[i]
    progressText.value = `Page ${i + 1}/${pagesToConvert.length}`

    if (pageNum >= 1 && pageNum <= pageCount) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale })

      // Create canvas
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) continue

      canvas.width = viewport.width
      canvas.height = viewport.height

      // Render page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise

      // Convert canvas to blob
      const mimeType = `image/${fileData.imageFormat === 'jpeg' ? 'jpeg' : fileData.imageFormat}`
      const quality = fileData.imageFormat === 'jpeg' ? 0.92 : undefined

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to create blob'))
        }, mimeType, quality)
      })

      const filename = `${fileData.name.replace('.pdf', '')}_page_${pageNum}.${fileData.imageFormat}`
      const url = URL.createObjectURL(blob)

      previewImages.value.push({
        name: filename,
        url: url,
        blob: blob
      })
    }
  }
}

const parsePageNumbers = (pageNumbers: string, totalPages: number): number[] => {
  if (!pageNumbers.trim()) return [1]

  const pages = pageNumbers.split(',').map(p => p.trim())
  const result: number[] = []

  for (const page of pages) {
    if (page.includes('-')) {
      // Handle range like "1-5"
      const [start, end] = page.split('-').map(n => parseInt(n.trim()))
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end && i <= totalPages; i++) {
          if (i >= 1 && !result.includes(i)) {
            result.push(i)
          }
        }
      }
    } else {
      const pageNum = parseInt(page)
      if (pageNum >= 1 && pageNum <= totalPages && !result.includes(pageNum)) {
        result.push(pageNum)
      }
    }
  }

  return result.sort((a, b) => a - b)
}

const downloadSingleImage = (preview: PreviewImage) => {
  const a = document.createElement('a')
  a.href = preview.url
  a.download = preview.name
  a.click()
}

const downloadAllImages = async () => {
  for (const preview of previewImages.value) {
    downloadSingleImage(preview)
    // Small delay to prevent browser blocking multiple downloads
    await new Promise(resolve => setTimeout(resolve, 200))
  }
}
</script>
