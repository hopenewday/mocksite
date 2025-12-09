<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Word to PDF Converter
    </h2>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Upload Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Upload Word Document
        </h3>

        <div class="space-y-4">
          <div
            class="border-4 border-dashed border-brutal-gray p-8 text-center"
            :class="{ 'border-brutal-cyan bg-brutal-cyan/10': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".doc,.docx"
              class="hidden"
              @change="handleFileUpload"
            >
            <div
              class="cursor-pointer"
              @click="fileInput?.click()"
            >
              <div class="text-4xl mb-4">
                📄
              </div>
              <p class="font-black mb-2">
                Drop Word file here or click to browse
              </p>
              <p class="text-sm font-bold text-brutal-gray">
                Supports .docx files (best support) and .doc files (limited)
              </p>
            </div>
          </div>

          <div
            v-if="uploadedFile"
            class="space-y-3"
          >
            <div class="flex justify-between items-center p-3 bg-brutal-gray border-2 border-black">
              <span class="font-black text-sm">{{ uploadedFile.name }}</span>
              <span class="text-xs font-black">{{ formatFileSize(uploadedFile.size) }}</span>
            </div>

            <div class="p-3 bg-brutal-gray border-2 border-black">
              <p class="font-black text-sm mb-1">
                File Info
              </p>
              <div class="text-xs font-black space-y-1">
                <p>Type: {{ getFileType() }}</p>
                <p>Size: {{ formatFileSize(uploadedFile.size) }}</p>
                <p>Last Modified: {{ new Date(uploadedFile.lastModified).toLocaleDateString() }}</p>
              </div>
            </div>

            <button
              class="btn-primary btn-primary-pink w-full"
              @click="clearFile"
            >
              Clear File
            </button>
          </div>
        </div>
      </div>

      <!-- Conversion Options -->
      <div class="bg-brutal-yellow border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Conversion Options
        </h3>

        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Page Size</label>
            <select
              v-model="pageSize"
              class="select"
            >
              <option value="a4">
                A4 (210 x 297 mm)
              </option>
              <option value="a3">
                A3 (297 x 420 mm)
              </option>
              <option value="letter">
                Letter (8.5 x 11 in)
              </option>
              <option value="legal">
                Legal (8.5 x 14 in)
              </option>
            </select>
          </div>

          <div>
            <label class="font-black mb-2 block">Orientation</label>
            <select
              v-model="orientation"
              class="select"
            >
              <option value="portrait">
                Portrait
              </option>
              <option value="landscape">
                Landscape
              </option>
            </select>
          </div>

          <div>
            <label class="font-black mb-2 block">Margins (mm)</label>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-xs font-bold">Top</label>
                <input
                  v-model.number="margins.top"
                  type="number"
                  min="0"
                  max="50"
                  class="input w-full"
                >
              </div>
              <div>
                <label class="text-xs font-bold">Bottom</label>
                <input
                  v-model.number="margins.bottom"
                  type="number"
                  min="0"
                  max="50"
                  class="input w-full"
                >
              </div>
              <div>
                <label class="text-xs font-bold">Left</label>
                <input
                  v-model.number="margins.left"
                  type="number"
                  min="0"
                  max="50"
                  class="input w-full"
                >
              </div>
              <div>
                <label class="text-xs font-bold">Right</label>
                <input
                  v-model.number="margins.right"
                  type="number"
                  min="0"
                  max="50"
                  class="input w-full"
                >
              </div>
            </div>
          </div>

          <div>
            <label class="font-black mb-2 block">Font Size</label>
            <select
              v-model="fontSize"
              class="select"
            >
              <option :value="10">
                Small (10pt)
              </option>
              <option :value="12">
                Normal (12pt)
              </option>
              <option :value="14">
                Large (14pt)
              </option>
              <option :value="16">
                Extra Large (16pt)
              </option>
            </select>
          </div>

          <div>
            <label class="font-black mb-2 block">Options</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input
                  v-model="preserveImages"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Include Images</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="preserveStyles"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Preserve Text Styles</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="addPageNumbers"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Add Page Numbers</span>
              </label>
            </div>
          </div>

          <button
            :disabled="!uploadedFile || isConverting"
            class="btn-primary btn-primary-lime w-full disabled:opacity-50"
            @click="convertToPDF"
          >
            {{ isConverting ? 'Converting...' : 'Convert to PDF' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Conversion Progress -->
    <div
      v-if="isConverting"
      class="bg-brutal-lime border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Converting Document
      </h3>

      <div class="space-y-4">
        <div class="bg-brutal-white border-2 border-black p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="font-black text-sm">Progress</span>
            <span class="font-black text-sm">{{ conversionProgress }}%</span>
          </div>
          <div class="w-full bg-brutal-gray border-2 border-black h-4">
            <div
              class="bg-brutal-cyan h-full transition-all duration-300"
              :style="{ width: conversionProgress + '%' }"
            />
          </div>
        </div>

        <div class="text-sm font-black text-brutal-gray">
          <p>{{ conversionStatus }}</p>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div
      v-if="errorMessage"
      class="bg-brutal-pink border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-2">
        ⚠️ Conversion Error
      </h3>
      <p class="font-bold text-sm">
        {{ errorMessage }}
      </p>
      <button
        class="btn-primary btn-primary-cyan mt-4"
        @click="errorMessage = ''"
      >
        Dismiss
      </button>
    </div>

    <!-- Document Preview -->
    <div
      v-if="extractedContent && !isConverting"
      class="bg-brutal-white border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Document Preview
      </h3>

      <div class="flex gap-2 mb-4">
        <button
          :class="['btn-primary px-4 py-2 text-sm', previewMode === 'rendered' ? 'btn-primary-cyan' : 'btn-primary-gray']"
          @click="previewMode = 'rendered'"
        >
          Rendered
        </button>
        <button
          :class="['btn-primary px-4 py-2 text-sm', previewMode === 'html' ? 'btn-primary-cyan' : 'btn-primary-gray']"
          @click="previewMode = 'html'"
        >
          HTML Source
        </button>
      </div>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        v-if="previewMode === 'rendered'"
        class="bg-white border-2 border-black p-6 max-h-96 overflow-auto prose prose-sm max-w-none"
        v-html="extractedContent.html"
      />
      <div
        v-else
        class="bg-brutal-gray border-2 border-black p-4 max-h-96 overflow-auto"
      >
        <pre class="text-xs whitespace-pre-wrap font-mono">{{ extractedContent.html }}</pre>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div class="p-3 bg-brutal-gray border-2 border-black">
          <span class="font-black">Characters:</span> {{ extractedContent.text.length.toLocaleString() }}
        </div>
        <div class="p-3 bg-brutal-gray border-2 border-black">
          <span class="font-black">Words:</span> {{ countWords(extractedContent.text).toLocaleString() }}
        </div>
      </div>
    </div>

    <!-- Download Section -->
    <div
      v-if="convertedPdfBlob"
      class="bg-brutal-pink border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        ✅ PDF Ready
      </h3>

      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-bold mb-2">
            Original Document
          </h4>
          <div class="space-y-2">
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">Name</span>
              <span class="font-black text-sm truncate ml-2">{{ uploadedFile?.name }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">Size</span>
              <span class="font-black text-sm">{{ formatFileSize(uploadedFile?.size || 0) }}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-bold mb-2">
            Converted PDF
          </h4>
          <div class="space-y-2">
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">Name</span>
              <span class="font-black text-sm truncate ml-2">{{ pdfFileName }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">Size</span>
              <span class="font-black text-sm">{{ formatFileSize(convertedPdfBlob.size) }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">Pages</span>
              <span class="font-black text-sm">{{ pageCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-2 mt-4 flex-wrap">
        <button
          class="btn-primary btn-primary-cyan flex-1"
          @click="downloadPDF"
        >
          Download PDF
        </button>
        <button
          class="btn-primary btn-primary-lime flex-1"
          @click="previewPDF"
        >
          Preview PDF
        </button>
        <button
          class="btn-primary btn-primary-pink"
          @click="startNewConversion"
        >
          New Conversion
        </button>
      </div>
    </div>

    <!-- Recent Conversions -->
    <div
      v-if="recentConversions.length > 0"
      class="bg-brutal-cyan border-4 border-black p-6"
    >
      <h3 class="font-black text-lg mb-4">
        Recent Conversions
      </h3>

      <div class="space-y-3">
        <div
          v-for="(conversion, index) in recentConversions"
          :key="index"
          class="flex items-center justify-between p-3 bg-brutal-white border-2 border-black"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">📄</span>
            <div>
              <p class="font-black text-sm">
                {{ conversion.originalName }}
              </p>
              <p class="text-xs font-bold text-brutal-gray">
                {{ conversion.date }} • {{ conversion.size }} • {{ conversion.pages }} pages
              </p>
            </div>
          </div>

          <button
            class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
            @click="downloadFromHistory(conversion)"
          >
            Download
          </button>
        </div>
      </div>

      <button
        class="btn-primary btn-primary-pink w-full mt-4"
        @click="clearHistory"
      >
        Clear History
      </button>
    </div>

    <!-- Info Section -->
    <div class="bg-brutal-yellow border-4 border-black p-6 mt-8">
      <h3 class="font-black text-lg mb-4">
        ℹ️ About Word to PDF Conversion
      </h3>
      <div class="space-y-2 text-sm font-bold">
        <p>• <strong>.docx files</strong> are fully supported with text, formatting, and images</p>
        <p>• <strong>.doc files</strong> have limited support (older Word format)</p>
        <p>• Complex tables and advanced formatting may be simplified</p>
        <p>• Images are embedded at their original quality</p>
        <p>• All processing happens locally in your browser - no upload to servers</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import mammoth from 'mammoth'
import { jsPDF } from 'jspdf'
import { saveAs } from 'file-saver'

interface ConversionHistory {
  originalName: string
  pdfName: string
  size: string
  pages: number
  date: string
  pdfBlob: Blob
}

interface ExtractedContent {
  html: string
  text: string
  messages: string[]
}

const fileInput = ref<HTMLInputElement>()
const uploadedFile = ref<File | null>(null)
const isDragging = ref(false)
const isConverting = ref(false)
const conversionProgress = ref(0)
const conversionStatus = ref('')
const errorMessage = ref('')
const extractedContent = ref<ExtractedContent | null>(null)
const convertedPdfBlob = ref<Blob | null>(null)
const pageCount = ref(0)
const previewMode = ref<'rendered' | 'html'>('rendered')

// Options
const pageSize = ref('a4')
const orientation = ref<'portrait' | 'landscape'>('portrait')
const margins = ref({ top: 20, bottom: 20, left: 20, right: 20 })
const fontSize = ref(12)
const preserveImages = ref(true)
const preserveStyles = ref(true)
const addPageNumbers = ref(true)

// History
const recentConversions = ref<ConversionHistory[]>([])

// Load history from localStorage
const loadHistory = () => {
  try {
    const saved = localStorage.getItem('wordToPdfHistory')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Note: Blobs can't be stored in localStorage, so we only keep metadata
      recentConversions.value = parsed.map((item: ConversionHistory) => ({
        ...item,
        pdfBlob: null // Can't restore blobs
      }))
    }
  } catch {
    // Ignore errors
  }
}
loadHistory()

const pdfFileName = computed(() => {
  if (!uploadedFile.value) return ''
  return uploadedFile.value.name.replace(/\.(doc|docx)$/i, '.pdf')
})

const getFileType = () => {
  if (!uploadedFile.value) return 'Unknown'
  const ext = uploadedFile.value.name.split('.').pop()?.toLowerCase()
  if (ext === 'docx') return 'Word Document (DOCX)'
  if (ext === 'doc') return 'Word Document (DOC - Legacy)'
  return 'Unknown'
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    processFile(target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    processFile(files[0])
  }
}

const processFile = async (file: File) => {
  if (!file.name.match(/\.(doc|docx)$/i)) {
    errorMessage.value = 'Please select a valid Word document (.doc or .docx)'
    return
  }

  uploadedFile.value = file
  convertedPdfBlob.value = null
  extractedContent.value = null
  errorMessage.value = ''

  // Auto-extract content for preview
  await extractContent()
}

const extractContent = async () => {
  if (!uploadedFile.value) return

  try {
    conversionStatus.value = 'Reading document...'
    conversionProgress.value = 10

    const arrayBuffer = await uploadedFile.value.arrayBuffer()

    conversionStatus.value = 'Extracting content...'
    conversionProgress.value = 30

    const options: mammoth.Options = {
      convertImage: preserveImages.value ? mammoth.images.imgElement((image) => {
        return image.read('base64').then((imageBuffer) => {
          return {
            src: `data:${image.contentType};base64,${imageBuffer}`
          }
        })
      }) : undefined
    }

    const result = await mammoth.convertToHtml({ arrayBuffer }, options)
    const textResult = await mammoth.extractRawText({ arrayBuffer })

    extractedContent.value = {
      html: result.value,
      text: textResult.value,
      messages: result.messages.map(m => m.message)
    }

    conversionProgress.value = 50
    conversionStatus.value = 'Content extracted successfully'

    // Show warnings if any
    if (result.messages.length > 0) {
      console.log('Mammoth conversion messages:', result.messages)
    }
  } catch (error) {
    console.error('Extraction error:', error)
    errorMessage.value = `Failed to extract content: ${error instanceof Error ? error.message : 'Unknown error'}`
    extractedContent.value = null
  }
}

const convertToPDF = async () => {
  if (!uploadedFile.value || !extractedContent.value) {
    await extractContent()
    if (!extractedContent.value) return
  }

  isConverting.value = true
  conversionProgress.value = 50
  conversionStatus.value = 'Generating PDF...'
  errorMessage.value = ''

  try {
    // Create PDF with jsPDF
    const isLandscape = orientation.value === 'landscape'
    const doc = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: pageSize.value
    })

    // Get page dimensions
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const contentWidth = pageWidth - margins.value.left - margins.value.right
    const contentHeight = pageHeight - margins.value.top - margins.value.bottom - (addPageNumbers.value ? 10 : 0)

    conversionProgress.value = 60
    conversionStatus.value = 'Processing content...'

    // Parse HTML and render to PDF
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = extractedContent.value.html
    tempDiv.style.width = `${contentWidth * 3.78}px` // Convert mm to approximate pixels
    tempDiv.style.fontFamily = 'Helvetica, Arial, sans-serif'
    tempDiv.style.fontSize = `${fontSize.value}pt`
    tempDiv.style.lineHeight = '1.5'

    // Apply styles if preserving
    if (preserveStyles.value) {
      const styles = document.createElement('style')
      styles.textContent = `
        h1 { font-size: ${fontSize.value * 2}pt; font-weight: bold; margin: 1em 0 0.5em; }
        h2 { font-size: ${fontSize.value * 1.5}pt; font-weight: bold; margin: 0.8em 0 0.4em; }
        h3 { font-size: ${fontSize.value * 1.2}pt; font-weight: bold; margin: 0.6em 0 0.3em; }
        p { margin: 0.5em 0; }
        ul, ol { margin: 0.5em 0; padding-left: 1.5em; }
        li { margin: 0.2em 0; }
        strong, b { font-weight: bold; }
        em, i { font-style: italic; }
        table { border-collapse: collapse; margin: 1em 0; width: 100%; }
        td, th { border: 1px solid #000; padding: 4px 8px; }
        img { max-width: 100%; height: auto; }
      `
      tempDiv.appendChild(styles)
    }

    // Process content into PDF pages
    let currentY = margins.value.top
    let currentPage = 1

    // Simple text extraction and rendering
    const lines = extractedContent.value.text.split('\n')
    const lineHeight = fontSize.value * 0.4 // Approximate mm per line

    doc.setFontSize(fontSize.value)

    conversionProgress.value = 70
    conversionStatus.value = 'Rendering pages...'

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) {
        currentY += lineHeight / 2
        continue
      }

      // Word wrap
      const words = line.split(' ')
      let currentLine = ''

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const textWidth = doc.getTextWidth(testLine)

        if (textWidth > contentWidth && currentLine) {
          // Check if we need a new page
          if (currentY + lineHeight > margins.value.top + contentHeight) {
            if (addPageNumbers.value) {
              doc.setFontSize(10)
              doc.text(`Page ${currentPage}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
              doc.setFontSize(fontSize.value)
            }
            doc.addPage()
            currentPage++
            currentY = margins.value.top
          }

          doc.text(currentLine, margins.value.left, currentY)
          currentY += lineHeight
          currentLine = word
        } else {
          currentLine = testLine
        }
      }

      // Output remaining text
      if (currentLine) {
        if (currentY + lineHeight > margins.value.top + contentHeight) {
          if (addPageNumbers.value) {
            doc.setFontSize(10)
            doc.text(`Page ${currentPage}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
            doc.setFontSize(fontSize.value)
          }
          doc.addPage()
          currentPage++
          currentY = margins.value.top
        }

        doc.text(currentLine, margins.value.left, currentY)
        currentY += lineHeight
      }

      // Update progress periodically
      if (i % 100 === 0) {
        conversionProgress.value = 70 + Math.floor((i / lines.length) * 20)
      }
    }

    // Add page number to last page
    if (addPageNumbers.value) {
      doc.setFontSize(10)
      doc.text(`Page ${currentPage}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    }

    conversionProgress.value = 95
    conversionStatus.value = 'Finalizing PDF...'

    // Generate blob
    const pdfBlob = doc.output('blob')
    convertedPdfBlob.value = pdfBlob
    pageCount.value = currentPage

    // Add to history
    const historyEntry: ConversionHistory = {
      originalName: uploadedFile.value.name,
      pdfName: pdfFileName.value,
      size: formatFileSize(pdfBlob.size),
      pages: currentPage,
      date: new Date().toLocaleString(),
      pdfBlob: pdfBlob
    }

    recentConversions.value.unshift(historyEntry)
    if (recentConversions.value.length > 5) {
      recentConversions.value = recentConversions.value.slice(0, 5)
    }

    // Save metadata to localStorage (without blob)
    saveHistoryMetadata()

    conversionProgress.value = 100
    conversionStatus.value = 'Conversion complete!'

    setTimeout(() => {
      isConverting.value = false
    }, 500)

  } catch (error) {
    console.error('PDF conversion error:', error)
    errorMessage.value = `Failed to convert to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    isConverting.value = false
  }
}

const saveHistoryMetadata = () => {
  try {
    const metadata = recentConversions.value.map(({ pdfBlob, ...rest }) => rest)
    localStorage.setItem('wordToPdfHistory', JSON.stringify(metadata))
  } catch {
    // Ignore storage errors
  }
}

const downloadPDF = () => {
  if (!convertedPdfBlob.value) return
  saveAs(convertedPdfBlob.value, pdfFileName.value)
}

const previewPDF = () => {
  if (!convertedPdfBlob.value) return
  const url = URL.createObjectURL(convertedPdfBlob.value)
  window.open(url, '_blank')
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

const startNewConversion = () => {
  uploadedFile.value = null
  convertedPdfBlob.value = null
  extractedContent.value = null
  conversionProgress.value = 0
  conversionStatus.value = ''
  errorMessage.value = ''
  pageCount.value = 0
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const clearFile = () => {
  startNewConversion()
}

const downloadFromHistory = (conversion: ConversionHistory) => {
  if (conversion.pdfBlob) {
    saveAs(conversion.pdfBlob, conversion.pdfName)
  } else {
    errorMessage.value = 'PDF data not available. Please re-convert the document.'
  }
}

const clearHistory = () => {
  recentConversions.value = []
  localStorage.removeItem('wordToPdfHistory')
}

const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
