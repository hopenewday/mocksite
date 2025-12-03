<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">
      PDF to Text Converter
    </h2>

    <div class="bg-brutal-yellow border-4 border-black p-4 mb-6">
      <p class="font-black text-sm">
        ⚠️ Note: This tool extracts text content from PDF files. Complex formatting,
        images, and tables may not be preserved. For full Word document conversion,
        consider using Adobe Acrobat or Microsoft Word's built-in PDF import feature.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Upload Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Upload PDF File
        </h3>

        <div class="space-y-4">
          <div
            class="border-4 border-dashed border-brutal-gray p-8 text-center"
            @dragover.prevent
            @drop="handleDrop"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".pdf"
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
                Drop PDF file here or click to browse
              </p>
              <p class="text-sm font-bold text-brutal-gray">
                Supports PDF files
              </p>
            </div>
          </div>

          <div
            v-if="uploadedFile"
            class="space-y-3"
          >
            <div class="flex justify-between items-center p-3 bg-brutal-gray border-2 border-black">
              <div class="flex items-center gap-2">
                <span class="text-2xl">📄</span>
                <span class="font-black text-sm truncate">{{ uploadedFile.name }}</span>
              </div>
              <span class="text-xs font-black">{{ formatFileSize(uploadedFile.size) }}</span>
            </div>

            <div
              v-if="pdfInfo"
              class="p-3 bg-brutal-lime/20 border-2 border-brutal-lime"
            >
              <p class="font-black text-sm text-green-700">
                ✓ PDF loaded: {{ pdfInfo.numPages }} page(s)
              </p>
            </div>

            <div
              v-if="error"
              class="p-3 bg-brutal-pink/20 border-2 border-brutal-pink"
            >
              <p class="font-black text-sm text-brutal-pink">
                {{ error }}
              </p>
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

      <!-- Options Section -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Extraction Options
        </h3>

        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Output Format</label>
            <select
              v-model="outputFormat"
              class="select"
            >
              <option value="txt">
                Plain Text (.txt)
              </option>
              <option value="rtf">
                Rich Text Format (.rtf)
              </option>
              <option value="html">
                HTML (.html)
              </option>
            </select>
          </div>

          <div>
            <label class="font-black mb-2 block">Page Range</label>
            <select
              v-model="pageRange"
              class="select"
            >
              <option value="all">
                All Pages
              </option>
              <option value="custom">
                Custom Range
              </option>
            </select>
          </div>

          <div v-if="pageRange === 'custom'">
            <label class="font-black mb-2 block">Pages (e.g., 1-5, 8, 10-12)</label>
            <input
              v-model="customPages"
              type="text"
              placeholder="1-5, 8, 10-12"
              class="input w-full"
            >
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input
                v-model="options.preserveLineBreaks"
                type="checkbox"
                class="w-4 h-4"
              >
              <span class="font-bold">Preserve line breaks</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="options.addPageNumbers"
                type="checkbox"
                class="w-4 h-4"
              >
              <span class="font-bold">Add page markers</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="options.cleanWhitespace"
                type="checkbox"
                class="w-4 h-4"
              >
              <span class="font-bold">Clean extra whitespace</span>
            </label>
          </div>

          <button
            :disabled="!pdfInfo || isExtracting"
            class="btn-primary btn-primary-lime w-full disabled:opacity-50"
            @click="extractText"
          >
            {{ isExtracting ? 'Extracting...' : 'Extract Text' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Progress -->
    <div
      v-if="isExtracting"
      class="bg-brutal-yellow border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Extracting Text...
      </h3>

      <div class="bg-brutal-white border-2 border-black p-4">
        <div class="flex justify-between items-center mb-2">
          <span class="font-black text-sm">Progress</span>
          <span class="font-black text-sm">{{ progressText }}</span>
        </div>
        <div class="w-full bg-brutal-gray border-2 border-black h-4">
          <div
            class="bg-brutal-cyan h-full transition-all duration-300"
            :style="{ width: progress + '%' }"
          />
        </div>
      </div>
    </div>

    <!-- Extracted Text Preview -->
    <div
      v-if="extractedText"
      class="bg-brutal-white border-4 border-black p-6 mb-8"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-black text-lg">
          Extracted Text Preview
        </h3>
        <span class="text-sm font-bold text-brutal-gray">
          {{ extractedText.length.toLocaleString() }} characters
        </span>
      </div>

      <div class="bg-brutal-gray border-2 border-black p-4 max-h-64 overflow-auto mb-4">
        <pre class="whitespace-pre-wrap text-sm font-mono">{{ previewText }}</pre>
      </div>

      <div class="flex gap-2">
        <button
          class="btn-primary btn-primary-cyan flex-1"
          @click="downloadText"
        >
          Download {{ outputFormat.toUpperCase() }}
        </button>
        <button
          class="btn-primary btn-primary-lime flex-1"
          :class="{ 'animate-copy-bounce': copyingText }"
          :data-state="copyingText ? 'success' : null"
          @click="copyToClipboard"
        >
          <span v-if="copyingText">✓ Copied!</span>
          <span v-else>Copy to Clipboard</span>
        </button>
        <button
          class="btn-primary btn-primary-pink"
          @click="clearExtractedText"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Tips -->
    <div class="bg-brutal-pink border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Tips for Better Results
      </h3>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-brutal-white border-2 border-black p-4">
          <h4 class="font-black mb-2">
            ✅ Works best with:
          </h4>
          <ul class="text-sm font-bold space-y-1">
            <li>• Text-based PDFs (not scanned images)</li>
            <li>• Simple document layouts</li>
            <li>• Standard fonts</li>
            <li>• PDFs created from Word or text editors</li>
          </ul>
        </div>

        <div class="bg-brutal-white border-2 border-black p-4">
          <h4 class="font-black mb-2">
            ⚠️ May have issues with:
          </h4>
          <ul class="text-sm font-bold space-y-1">
            <li>• Scanned documents (use OCR instead)</li>
            <li>• Complex multi-column layouts</li>
            <li>• Tables and forms</li>
            <li>• Password-protected PDFs</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <div
      v-if="toast"
      class="fixed bottom-4 right-4 bg-brutal-cyan border-4 border-black p-4 shadow-brutal z-50"
    >
      <p class="font-black">
        {{ toast }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'

interface PDFInfo {
  numPages: number
}

const fileInput = ref<HTMLInputElement>()
const uploadedFile = ref<File | null>(null)
const pdfInfo = ref<PDFInfo | null>(null)
const extractedText = ref('')
const isExtracting = ref(false)
const error = ref('')
const progress = ref(0)
const progressText = ref('')
const toast = ref('')

// Copy feedback
const { isCopying: copyingText, copyWithFeedback: copyTextFeedback } = useCopyFeedback()

const outputFormat = ref('txt')
const pageRange = ref('all')
const customPages = ref('')

const options = ref({
  preserveLineBreaks: true,
  addPageNumbers: true,
  cleanWhitespace: true
})

let pdfjsLib: any = null

const previewText = computed(() => {
  if (!extractedText.value) return ''
  return extractedText.value.length > 5000
    ? extractedText.value.substring(0, 5000) + '\n\n... (truncated for preview)'
    : extractedText.value
})

const loadPDFJS = async () => {
  if (pdfjsLib) return pdfjsLib

  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) {
      pdfjsLib = (window as any).pdfjsLib
      resolve(pdfjsLib)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.onload = () => {
      pdfjsLib = (window as any).pdfjsLib
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      resolve(pdfjsLib)
    }
    script.onerror = () => reject(new Error('Failed to load PDF.js'))
    document.head.appendChild(script)
  })
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    await loadPDF(target.files[0])
  }
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    await loadPDF(event.dataTransfer.files[0])
  }
}

const loadPDF = async (file: File) => {
  if (file.type !== 'application/pdf') {
    error.value = 'Please upload a PDF file'
    return
  }

  error.value = ''
  extractedText.value = ''
  uploadedFile.value = file

  try {
    const lib = await loadPDFJS()
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise

    pdfInfo.value = {
      numPages: pdf.numPages
    }
  } catch (err: any) {
    console.error('Error loading PDF:', err)
    error.value = err.message || 'Failed to load PDF. The file may be corrupted or password-protected.'
    pdfInfo.value = null
  }
}

const clearFile = () => {
  uploadedFile.value = null
  pdfInfo.value = null
  extractedText.value = ''
  error.value = ''
  progress.value = 0
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const clearExtractedText = () => {
  extractedText.value = ''
}

const parsePageRange = (numPages: number): number[] => {
  if (pageRange.value === 'all') {
    return Array.from({ length: numPages }, (_, i) => i + 1)
  }

  const pages: number[] = []
  const parts = customPages.value.split(',').map(p => p.trim())

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim()))
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= Math.min(end, numPages); i++) {
          if (i >= 1 && !pages.includes(i)) {
            pages.push(i)
          }
        }
      }
    } else {
      const pageNum = parseInt(part)
      if (pageNum >= 1 && pageNum <= numPages && !pages.includes(pageNum)) {
        pages.push(pageNum)
      }
    }
  }

  return pages.sort((a, b) => a - b)
}

const extractText = async () => {
  if (!uploadedFile.value || !pdfInfo.value) return

  isExtracting.value = true
  error.value = ''
  progress.value = 0
  extractedText.value = ''

  try {
    const lib = await loadPDFJS()
    const arrayBuffer = await uploadedFile.value.arrayBuffer()
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise

    const pagesToExtract = parsePageRange(pdf.numPages)
    const textParts: string[] = []

    for (let i = 0; i < pagesToExtract.length; i++) {
      const pageNum = pagesToExtract[i]
      progressText.value = `Page ${i + 1} of ${pagesToExtract.length}`
      progress.value = Math.round(((i + 1) / pagesToExtract.length) * 100)

      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      let pageText = ''
      let lastY: number | null = null

      for (const item of textContent.items) {
        const textItem = item as any
        if (textItem.str) {
          // Detect new lines based on Y position change
          if (lastY !== null && options.value.preserveLineBreaks) {
            const yDiff = Math.abs(lastY - textItem.transform[5])
            if (yDiff > 5) {
              pageText += '\n'
            } else if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
              pageText += ' '
            }
          }
          pageText += textItem.str
          lastY = textItem.transform[5]
        }
      }

      // Clean whitespace if option enabled
      if (options.value.cleanWhitespace) {
        pageText = pageText
          .replace(/[ \t]+/g, ' ')
          .replace(/\n{3,}/g, '\n\n')
          .trim()
      }

      if (options.value.addPageNumbers) {
        textParts.push(`--- Page ${pageNum} ---\n\n${pageText}`)
      } else {
        textParts.push(pageText)
      }
    }

    extractedText.value = textParts.join('\n\n')

    if (!extractedText.value.trim()) {
      error.value = 'No text could be extracted. The PDF may contain only images or scanned content.'
    } else {
      showToast('Text extracted successfully!')
    }
  } catch (err: any) {
    console.error('Extraction error:', err)
    error.value = 'Failed to extract text: ' + (err.message || 'Unknown error')
  } finally {
    isExtracting.value = false
    progress.value = 0
    progressText.value = ''
  }
}

const downloadText = () => {
  if (!extractedText.value) return

  let content = extractedText.value
  let mimeType = 'text/plain'
  let extension = 'txt'

  if (outputFormat.value === 'rtf') {
    content = convertToRTF(extractedText.value)
    mimeType = 'application/rtf'
    extension = 'rtf'
  } else if (outputFormat.value === 'html') {
    content = convertToHTML(extractedText.value)
    mimeType = 'text/html'
    extension = 'html'
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${uploadedFile.value?.name.replace('.pdf', '')}_extracted.${extension}`
  a.click()
  URL.revokeObjectURL(url)
}

const convertToRTF = (text: string): string => {
  // Simple RTF conversion
  const escaped = text
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\n/g, '\\par\n')

  return `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Arial;}}
{\\colortbl;\\red0\\green0\\blue0;}
\\f0\\fs24
${escaped}
}`
}

const convertToHTML = (text: string): string => {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Extracted Text - ${uploadedFile.value?.name || 'Document'}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
    }
    p { margin-bottom: 1em; }
  </style>
</head>
<body>
  <p>${escaped}</p>
</body>
</html>`
}

const copyToClipboard = async () => {
  if (!extractedText.value) return
  await copyTextFeedback(extractedText.value, 'Copied!')
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const showToast = (message: string) => {
  toast.value = message
  setTimeout(() => {
    toast.value = ''
  }, 3000)
}
</script>
