<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">
      Convert to PDF
    </h2>

    <div class="mb-6">
      <label class="font-black mb-2 block">Conversion Type</label>
      <select
        v-model="conversionType"
        class="select"
      >
        <option value="images">
          Images to PDF
        </option>
        <option value="text">
          Text to PDF
        </option>
        <option value="html">
          HTML to PDF
        </option>
      </select>
    </div>

    <!-- Image to PDF -->
    <div
      v-if="conversionType === 'images'"
      class="space-y-4 mb-6"
    >
      <div
        v-for="(file, index) in files"
        :key="index"
        class="bg-brutal-white border-4 border-black p-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">🖼️</span>
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

      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-brutal-white border-4 border-black p-4">
          <label class="font-black mb-2 block">Page Size</label>
          <select
            v-model="pageSize"
            class="select"
          >
            <option value="a4">
              A4 (210 × 297 mm)
            </option>
            <option value="letter">
              Letter (8.5 × 11 in)
            </option>
            <option value="legal">
              Legal (8.5 × 14 in)
            </option>
            <option value="fit">
              Fit to Image
            </option>
          </select>
        </div>

        <div class="bg-brutal-white border-4 border-black p-4">
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
            <option value="auto">
              Auto (based on image)
            </option>
          </select>
        </div>
      </div>

      <div class="bg-brutal-white border-4 border-black p-4">
        <label class="font-black mb-2 block">Image Options</label>
        <div class="space-y-2">
          <label class="flex items-center gap-2">
            <input
              v-model="imageOptions.centerImages"
              type="checkbox"
              class="w-4 h-4"
            >
            <span class="font-bold">Center images on page</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              v-model="imageOptions.fitToPage"
              type="checkbox"
              class="w-4 h-4"
            >
            <span class="font-bold">Fit images to page (maintain aspect ratio)</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              v-model="imageOptions.addMargins"
              type="checkbox"
              class="w-4 h-4"
            >
            <span class="font-bold">Add margins (20px)</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Text to PDF -->
    <div
      v-if="conversionType === 'text'"
      class="space-y-4 mb-6"
    >
      <div class="bg-brutal-white border-4 border-black p-4">
        <label class="font-black mb-2 block">Enter Text or Upload Document</label>
        <textarea
          v-model="textContent"
          placeholder="Enter your text here..."
          class="input w-full h-48 resize-none mb-4 font-mono"
        />

        <div class="border-4 border-dashed border-brutal-gray p-4 text-center">
          <input
            ref="textFileInput"
            type="file"
            accept=".txt"
            class="hidden"
            @change="handleTextFileSelect"
          >
          <div
            class="cursor-pointer"
            @click="textFileInput?.click()"
          >
            <div class="text-2xl mb-2">
              📄
            </div>
            <p class="font-black text-sm">
              Upload Text File (.txt)
            </p>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-brutal-white border-4 border-black p-4">
          <label class="font-black mb-2 block">Font Size</label>
          <select
            v-model="textOptions.fontSize"
            class="select"
          >
            <option :value="10">
              Small (10pt)
            </option>
            <option :value="12">
              Normal (12pt)
            </option>
            <option :value="14">
              Medium (14pt)
            </option>
            <option :value="16">
              Large (16pt)
            </option>
            <option :value="18">
              Extra Large (18pt)
            </option>
          </select>
        </div>

        <div class="bg-brutal-white border-4 border-black p-4">
          <label class="font-black mb-2 block">Line Spacing</label>
          <select
            v-model="textOptions.lineSpacing"
            class="select"
          >
            <option :value="1">
              Single
            </option>
            <option :value="1.5">
              1.5 Lines
            </option>
            <option :value="2">
              Double
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- HTML to PDF -->
    <div
      v-if="conversionType === 'html'"
      class="space-y-4 mb-6"
    >
      <div class="bg-brutal-white border-4 border-black p-4">
        <label class="font-black mb-2 block">HTML Content</label>
        <textarea
          v-model="htmlContent"
          placeholder="<h1>Your HTML Content</h1>&#10;<p>Paragraph text here...</p>"
          class="input w-full h-48 resize-none mb-4 font-mono text-sm"
        />

        <div class="border-4 border-dashed border-brutal-gray p-4 text-center">
          <input
            ref="htmlFileInput"
            type="file"
            accept=".html,.htm"
            class="hidden"
            @change="handleHtmlFileSelect"
          >
          <div
            class="cursor-pointer"
            @click="htmlFileInput?.click()"
          >
            <div class="text-2xl mb-2">
              🌐
            </div>
            <p class="font-black text-sm">
              Upload HTML File
            </p>
          </div>
        </div>
      </div>

      <!-- HTML Preview -->
      <div
        v-if="htmlContent"
        class="bg-brutal-white border-4 border-black p-4"
      >
        <label class="font-black mb-2 block">Preview</label>
        <div
          class="border-2 border-brutal-gray p-4 bg-white max-h-48 overflow-auto"
          v-html="sanitizedHtml"
        />
      </div>
    </div>

    <!-- File Drop Zone for Images -->
    <div
      v-if="conversionType === 'images'"
      class="border-4 border-dashed border-brutal-gray p-8 text-center mb-6"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
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
          Drop image files here or click to browse
        </p>
        <p class="text-sm font-bold text-brutal-gray">
          Supports JPG, PNG, GIF, BMP, WebP
        </p>
      </div>
    </div>

    <div class="flex gap-4">
      <button
        :disabled="!canConvert || isProcessing"
        class="btn-primary btn-primary-cyan flex-1 disabled:opacity-50"
        @click="convertToPDF"
      >
        <span v-if="isProcessing">Converting... {{ progressText }}</span>
        <span v-else>Convert to PDF</span>
      </button>

      <button
        :disabled="files.length === 0 && !textContent && !htmlContent"
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

    <div
      v-if="successMessage"
      class="mt-4 p-4 bg-brutal-lime/20 border-4 border-brutal-lime"
    >
      <p class="font-black text-green-700">
        {{ successMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

interface FileData {
  file: File
  name: string
  size: number
  dataUrl: string
  width: number
  height: number
}

useHead({
  title: 'Convert to PDF',
  meta: [
    { name: 'description', content: 'Convert images and documents to PDF.' },
    { property: 'og:title', content: 'Convert to PDF' },
    { property: 'og:description', content: 'Convert images and documents to PDF.' }
  ]
})

const conversionType = ref('images')
const files = ref<FileData[]>([])
const textContent = ref('')
const htmlContent = ref('')
const pageSize = ref('a4')
const orientation = ref('portrait')
const fileInput = ref<HTMLInputElement>()
const textFileInput = ref<HTMLInputElement>()
const htmlFileInput = ref<HTMLInputElement>()
const isProcessing = ref(false)
const error = ref('')
const successMessage = ref('')
const progressText = ref('')

const imageOptions = ref({
  centerImages: true,
  fitToPage: true,
  addMargins: true
})

const textOptions = ref({
  fontSize: 12,
  lineSpacing: 1.5
})

// Page dimensions in points (72 points = 1 inch)
const pageDimensions = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
  legal: { width: 612, height: 1008 }
}

const canConvert = computed(() => {
  switch (conversionType.value) {
    case 'images':
      return files.value.length > 0
    case 'text':
      return textContent.value.trim().length > 0
    case 'html':
      return htmlContent.value.trim().length > 0
    default:
      return false
  }
})

const sanitizedHtml = computed(() => {
  // Basic sanitization - remove script tags
  return htmlContent.value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
})

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    await addFiles(Array.from(target.files))
  }
}

const handleTextFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      textContent.value = e.target?.result as string
    }
    reader.readAsText(file)
  }
}

const handleHtmlFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      htmlContent.value = e.target?.result as string
    }
    reader.readAsText(file)
  }
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files) {
    await addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = async (newFiles: File[]) => {
  error.value = ''
  successMessage.value = ''

  const imageFiles = newFiles.filter(file => file.type.startsWith('image/'))
  if (imageFiles.length !== newFiles.length) {
    error.value = 'Only image files are supported'
    setTimeout(() => error.value = '', 3000)
  }

  for (const file of imageFiles) {
    try {
      const dataUrl = await readFileAsDataURL(file)
      const dimensions = await getImageDimensions(dataUrl)

      files.value.push({
        file,
        name: file.name,
        size: file.size,
        dataUrl,
        width: dimensions.width,
        height: dimensions.height
      })
    } catch (err) {
      console.error(`Error loading ${file.name}:`, err)
    }
  }
}

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.onerror = reject
    img.src = dataUrl
  })
}

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
  textContent.value = ''
  htmlContent.value = ''
  error.value = ''
  successMessage.value = ''
  if (fileInput.value) fileInput.value.value = ''
  if (textFileInput.value) textFileInput.value.value = ''
  if (htmlFileInput.value) htmlFileInput.value.value = ''
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const convertToPDF = async () => {
  if (!canConvert.value) return

  isProcessing.value = true
  error.value = ''
  successMessage.value = ''

  try {
    switch (conversionType.value) {
      case 'images':
        await convertImagesToPDF()
        break
      case 'text':
        await convertTextToPDF()
        break
      case 'html':
        await convertHtmlToPDF()
        break
    }
    successMessage.value = 'PDF created successfully!'
  } catch (err) {
    error.value = 'Error converting to PDF. Please try again.'
    console.error('PDF conversion error:', err)
  } finally {
    isProcessing.value = false
    progressText.value = ''
  }
}

const convertImagesToPDF = async () => {
  const pdf = await PDFDocument.create()
  const margin = imageOptions.value.addMargins ? 20 : 0

  for (let i = 0; i < files.value.length; i++) {
    const fileData = files.value[i]
    progressText.value = `Image ${i + 1}/${files.value.length}`

    try {
      // Fetch image bytes
      const response = await fetch(fileData.dataUrl)
      const imageBytes = await response.arrayBuffer()

      // Determine image type and embed accordingly
      let image
      const mimeType = fileData.file.type.toLowerCase()

      if (mimeType === 'image/png') {
        image = await pdf.embedPng(imageBytes)
      } else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
        image = await pdf.embedJpg(imageBytes)
      } else {
        // For other formats (gif, bmp, webp), convert to PNG using canvas
        const pngDataUrl = await convertImageToPng(fileData.dataUrl)
        const pngResponse = await fetch(pngDataUrl)
        const pngBytes = await pngResponse.arrayBuffer()
        image = await pdf.embedPng(pngBytes)
      }

      // Calculate page and image dimensions
      let pageWidth: number
      let pageHeight: number

      if (pageSize.value === 'fit') {
        // Fit page to image
        pageWidth = image.width + (margin * 2)
        pageHeight = image.height + (margin * 2)
      } else {
        const dims = pageDimensions[pageSize.value as keyof typeof pageDimensions]
        if (orientation.value === 'landscape') {
          pageWidth = dims.height
          pageHeight = dims.width
        } else if (orientation.value === 'auto') {
          // Auto orientation based on image aspect ratio
          const imageAspect = image.width / image.height
          if (imageAspect > 1) {
            pageWidth = dims.height
            pageHeight = dims.width
          } else {
            pageWidth = dims.width
            pageHeight = dims.height
          }
        } else {
          pageWidth = dims.width
          pageHeight = dims.height
        }
      }

      const page = pdf.addPage([pageWidth, pageHeight])

      // Calculate image position and size
      let drawWidth = image.width
      let drawHeight = image.height
      let x = margin
      let y = margin

      const availableWidth = pageWidth - (margin * 2)
      const availableHeight = pageHeight - (margin * 2)

      if (imageOptions.value.fitToPage && pageSize.value !== 'fit') {
        // Scale image to fit within available space while maintaining aspect ratio
        const scaleX = availableWidth / image.width
        const scaleY = availableHeight / image.height
        const scale = Math.min(scaleX, scaleY, 1) // Don't upscale

        drawWidth = image.width * scale
        drawHeight = image.height * scale
      }

      if (imageOptions.value.centerImages) {
        x = (pageWidth - drawWidth) / 2
        y = (pageHeight - drawHeight) / 2
      }

      page.drawImage(image, {
        x,
        y,
        width: drawWidth,
        height: drawHeight
      })
    } catch (err) {
      console.error(`Error processing ${fileData.name}:`, err)
      throw new Error(`Failed to process image: ${fileData.name}`)
    }
  }

  const pdfBytes = await pdf.save()
  downloadBlob(pdfBytes, 'converted_images.pdf')
}

const convertImageToPng = (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = dataUrl
  })
}

const convertTextToPDF = async () => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)

  const dims = pageDimensions[pageSize.value as keyof typeof pageDimensions] || pageDimensions.a4
  const pageWidth = orientation.value === 'landscape' ? dims.height : dims.width
  const pageHeight = orientation.value === 'landscape' ? dims.width : dims.height

  const fontSize = textOptions.value.fontSize
  const lineHeight = fontSize * textOptions.value.lineSpacing
  const margin = 50
  const maxWidth = pageWidth - (margin * 2)
  const maxLinesPerPage = Math.floor((pageHeight - (margin * 2)) / lineHeight)

  // Split text into lines
  const paragraphs = textContent.value.split('\n')
  const allLines: string[] = []

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      allLines.push('')
      continue
    }

    // Word wrap
    const words = paragraph.split(' ')
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const textWidth = font.widthOfTextAtSize(testLine, fontSize)

      if (textWidth > maxWidth && currentLine) {
        allLines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }

    if (currentLine) {
      allLines.push(currentLine)
    }
  }

  // Create pages
  let currentLineIndex = 0

  while (currentLineIndex < allLines.length) {
    const page = pdf.addPage([pageWidth, pageHeight])
    let y = pageHeight - margin

    for (let i = 0; i < maxLinesPerPage && currentLineIndex < allLines.length; i++) {
      const line = allLines[currentLineIndex]

      if (line.trim()) {
        page.drawText(line, {
          x: margin,
          y: y - fontSize,
          size: fontSize,
          font,
          color: rgb(0, 0, 0)
        })
      }

      y -= lineHeight
      currentLineIndex++
    }

    progressText.value = `Page ${pdf.getPageCount()}`
  }

  const pdfBytes = await pdf.save()
  downloadBlob(pdfBytes, 'converted_text.pdf')
}

const convertHtmlToPDF = async () => {
  // Create a temporary container with the HTML content
  const container = document.createElement('div')
  container.innerHTML = sanitizedHtml.value
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 595px;
    padding: 50px;
    background: white;
    font-family: Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
  `
  document.body.appendChild(container)

  try {
    // Use html2canvas to render HTML to canvas
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    // Create PDF
    const pdf = await PDFDocument.create()
    const pngDataUrl = canvas.toDataURL('image/png')
    const pngResponse = await fetch(pngDataUrl)
    const pngBytes = await pngResponse.arrayBuffer()
    const image = await pdf.embedPng(pngBytes)

    // Calculate dimensions
    const dims = pageDimensions.a4
    const pageWidth = dims.width
    const pageHeight = dims.height
    const margin = 0

    // Scale image to fit page width
    const scale = (pageWidth - margin * 2) / image.width
    const scaledHeight = image.height * scale

    // Handle multi-page if content is taller than one page
    const availableHeight = pageHeight - margin * 2
    const totalPages = Math.ceil(scaledHeight / availableHeight)

    for (let i = 0; i < totalPages; i++) {
      const page = pdf.addPage([pageWidth, pageHeight])

      // Calculate the portion of the image to draw
      const sourceY = i * (image.height / totalPages)
      const sourceHeight = image.height / totalPages

      page.drawImage(image, {
        x: margin,
        y: pageHeight - margin - availableHeight,
        width: pageWidth - margin * 2,
        height: availableHeight
      })

      progressText.value = `Page ${i + 1}/${totalPages}`
    }

    const pdfBytes = await pdf.save()
    downloadBlob(pdfBytes, 'converted_html.pdf')
  } finally {
    document.body.removeChild(container)
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
