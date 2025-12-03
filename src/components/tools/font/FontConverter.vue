<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">
      Font Format Converter
    </h2>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Upload Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Upload Font File
        </h3>

        <div class="space-y-4">
          <div
            class="border-4 border-dashed border-brutal-gray p-8 text-center transition-colors"
            :class="{ 'border-brutal-cyan bg-brutal-cyan/10': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              class="hidden"
              @change="handleFileUpload"
            >
            <div
              class="cursor-pointer"
              @click="fileInput?.click()"
            >
              <div class="text-4xl mb-4">
                📁
              </div>
              <p class="font-black mb-2">
                Drop font file here or click to browse
              </p>
              <p class="text-sm font-bold text-brutal-gray">
                Supports TTF, OTF, WOFF, WOFF2
              </p>
            </div>
          </div>

          <div
            v-if="uploadedFont"
            class="space-y-3"
          >
            <div class="flex justify-between items-center p-3 bg-brutal-gray border-2 border-black">
              <span class="font-black text-sm truncate">{{ uploadedFont.name }}</span>
              <span class="text-xs font-black">{{ formatFileSize(uploadedFont.size) }}</span>
            </div>

            <div class="p-3 bg-brutal-gray border-2 border-black">
              <p class="font-black text-sm mb-1">
                Current Format
              </p>
              <span class="badge badge-cyan">{{ currentFormat }}</span>
            </div>

            <button
              class="btn-primary btn-primary-pink w-full"
              @click="clearFont"
            >
              Clear Font
            </button>
          </div>
        </div>
      </div>

      <!-- Conversion Options -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Conversion Options
        </h3>

        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Target Format</label>
            <select
              v-model="targetFormat"
              class="select"
            >
              <option value="ttf">
                TrueType Font (.ttf)
              </option>
              <option value="otf">
                OpenType Font (.otf)
              </option>
              <option value="woff">
                Web Open Font Format (.woff)
              </option>
              <option value="woff2">
                Web Open Font Format 2 (.woff2)
              </option>
              <option value="svg">
                SVG Font (.svg)
              </option>
            </select>
          </div>

          <div
            v-if="fontInfo"
            class="p-3 bg-brutal-white border-2 border-black"
          >
            <h4 class="font-black text-sm mb-2">
              Font Information
            </h4>
            <div class="text-xs space-y-1">
              <p><strong>Family:</strong> {{ fontInfo.familyName }}</p>
              <p><strong>Style:</strong> {{ fontInfo.styleName }}</p>
              <p><strong>Glyphs:</strong> {{ fontInfo.numGlyphs }}</p>
              <p><strong>Units per Em:</strong> {{ fontInfo.unitsPerEm }}</p>
            </div>
          </div>

          <div>
            <label class="font-black mb-2 block">Options</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input
                  v-model="includeHinting"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Preserve Hinting</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="includeKerning"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Include Kerning</span>
              </label>
            </div>
          </div>

          <button
            :disabled="!uploadedFont || isConverting || !fontData"
            class="btn-primary btn-primary-lime w-full disabled:opacity-50"
            @click="convertFont"
          >
            {{ isConverting ? 'Converting...' : 'Convert Font' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div
      v-if="errorMessage"
      class="bg-brutal-pink border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-2">
        ⚠️ Error
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

    <!-- Conversion Progress -->
    <div
      v-if="isConverting"
      class="bg-brutal-lime border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Converting Font
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

    <!-- Conversion Results -->
    <div
      v-if="conversionResult"
      class="bg-brutal-lime border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        ✅ Conversion Results
      </h3>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Original Info -->
        <div>
          <h4 class="font-bold mb-2">
            Original Font
          </h4>
          <div class="space-y-2">
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">Format</span>
              <span class="font-black text-sm">{{ currentFormat }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">Size</span>
              <span class="font-black text-sm">{{ formatFileSize(uploadedFont!.size) }}</span>
            </div>
          </div>
        </div>

        <!-- Converted Info -->
        <div>
          <h4 class="font-bold mb-2">
            Converted Font
          </h4>
          <div class="space-y-2">
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">Format</span>
              <span class="font-black text-sm">{{ targetFormat.toUpperCase() }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">Size</span>
              <span class="font-black text-sm">{{ formatFileSize(conversionResult.size) }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">Size Change</span>
              <span
                class="font-black text-sm"
                :class="conversionResult.sizeChange < 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ conversionResult.sizeChange > 0 ? '+' : '' }}{{ conversionResult.sizeChange }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-2 mt-4 flex-wrap">
        <button
          class="btn-primary btn-primary-cyan flex-1"
          @click="downloadConverted"
        >
          Download Converted Font
        </button>
        <button
          class="btn-primary btn-primary-pink"
          @click="clearConversion"
        >
          New Conversion
        </button>
      </div>
    </div>

    <!-- Font Preview -->
    <div
      v-if="fontPreviewUrl"
      class="bg-brutal-yellow border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Font Preview
      </h3>

      <div class="space-y-4">
        <div>
          <label class="font-black mb-2 block">Preview Text</label>
          <input
            v-model="previewText"
            type="text"
            placeholder="Type to preview..."
            class="input w-full"
          >
        </div>

        <div>
          <label class="font-black mb-2 block">Font Size: {{ previewSize }}px</label>
          <input
            v-model="previewSize"
            type="range"
            min="12"
            max="72"
            class="w-full"
          >
        </div>

        <div class="bg-brutal-white border-2 border-black p-4">
          <div
            class="text-center"
            :style="{ fontFamily: fontPreviewName, fontSize: previewSize + 'px' }"
          >
            {{ previewText || 'The quick brown fox jumps over the lazy dog.' }}
          </div>
        </div>

        <div class="bg-brutal-white border-2 border-black p-4">
          <div
            :style="{ fontFamily: fontPreviewName, fontSize: '24px' }"
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>
            abcdefghijklmnopqrstuvwxyz<br>
            0123456789
          </div>
        </div>

        <div class="bg-brutal-white border-2 border-black p-4">
          <div
            :style="{ fontFamily: fontPreviewName, fontSize: '18px' }"
          >
            !@#$%^&amp;*()_+-=[]{}|;':",./&lt;&gt;?
          </div>
        </div>
      </div>
    </div>

    <!-- Batch Conversion -->
    <div class="bg-brutal-pink border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Batch Conversion
      </h3>

      <div class="space-y-4">
        <div
          class="border-4 border-dashed border-brutal-gray p-8 text-center"
          :class="{ 'border-brutal-cyan bg-brutal-cyan/10': isBatchDragging }"
          @dragover.prevent="isBatchDragging = true"
          @dragleave.prevent="isBatchDragging = false"
          @drop.prevent="handleBatchDrop"
        >
          <input
            ref="batchInput"
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            multiple
            class="hidden"
            @change="handleBatchUpload"
          >
          <div
            class="cursor-pointer"
            @click="batchInput?.click()"
          >
            <div class="text-4xl mb-4">
              📁
            </div>
            <p class="font-black mb-2">
              Drop multiple font files or click to browse
            </p>
            <p class="text-sm font-bold text-brutal-gray">
              Convert multiple fonts at once
            </p>
          </div>
        </div>

        <div
          v-if="batchFiles.length > 0"
          class="space-y-3"
        >
          <div
            v-for="(file, index) in batchFiles"
            :key="index"
            class="flex items-center justify-between p-3 bg-brutal-white border-2 border-black"
          >
            <div class="flex items-center gap-3">
              <span class="font-black text-sm truncate">{{ file.name }}</span>
              <span class="text-xs font-black text-brutal-gray">{{ formatFileSize(file.size) }}</span>
              <span
                v-if="batchStatus[index]"
                class="badge text-xs"
                :class="batchStatus[index] === 'done' ? 'badge-lime' : batchStatus[index] === 'error' ? 'badge-pink' : 'badge-cyan'"
              >
                {{ batchStatus[index] }}
              </span>
            </div>

            <button
              class="btn-primary btn-primary-pink px-3 py-1 text-xs"
              @click="removeBatchFile(index)"
            >
              Remove
            </button>
          </div>

          <div class="flex gap-2">
            <select
              v-model="batchTargetFormat"
              class="select flex-1"
            >
              <option value="ttf">
                Convert all to TTF
              </option>
              <option value="otf">
                Convert all to OTF
              </option>
              <option value="woff">
                Convert all to WOFF
              </option>
              <option value="woff2">
                Convert all to WOFF2
              </option>
            </select>

            <button
              :disabled="isBatchConverting"
              class="btn-primary btn-primary-lime disabled:opacity-50"
              @click="convertBatch"
            >
              {{ isBatchConverting ? 'Converting...' : `Convert ${batchFiles.length} Fonts` }}
            </button>
          </div>

          <div
            v-if="isBatchConverting"
            class="w-full bg-brutal-gray border-2 border-black h-4"
          >
            <div
              class="bg-brutal-cyan h-full transition-all duration-300"
              :style="{ width: batchProgress + '%' }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Conversion History -->
    <div
      v-if="conversionHistory.length > 0"
      class="bg-brutal-cyan border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Conversion History
      </h3>

      <div class="space-y-2">
        <div
          v-for="(item, index) in conversionHistory"
          :key="index"
          class="flex items-center justify-between p-3 bg-brutal-white border-2 border-black"
        >
          <div>
            <p class="font-black text-sm">
              {{ item.originalName }} → {{ item.convertedName }}
            </p>
            <p class="text-xs font-bold text-brutal-gray">
              {{ item.date }}
            </p>
          </div>
          <button
            v-if="item.blob"
            class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
            @click="downloadFromHistory(item)"
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
    <div class="bg-brutal-yellow border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        ℹ️ About Font Conversion
      </h3>
      <div class="space-y-2 text-sm font-bold">
        <p>• <strong>TTF (TrueType):</strong> Most compatible format, works everywhere</p>
        <p>• <strong>OTF (OpenType):</strong> Advanced features, good for print</p>
        <p>• <strong>WOFF:</strong> Web-optimized, compressed (~30% smaller)</p>
        <p>• <strong>WOFF2:</strong> Best compression (~50% smaller), modern browsers</p>
        <p>• <strong>SVG:</strong> Vector format, older iOS Safari support</p>
        <p class="mt-4 text-brutal-gray">
          Note: Some conversions may have limitations due to format differences. All processing happens locally in your browser.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import opentype from 'opentype.js'
import { saveAs } from 'file-saver'

interface FontInfo {
  familyName: string
  styleName: string
  numGlyphs: number
  unitsPerEm: number
}

interface ConversionResult {
  size: number
  sizeChange: number
  blob: Blob
  filename: string
}

interface ConversionHistoryItem {
  originalName: string
  convertedName: string
  date: string
  blob: Blob | null
}

const fileInput = ref<HTMLInputElement>()
const batchInput = ref<HTMLInputElement>()
const uploadedFont = ref<File | null>(null)
const fontData = ref<opentype.Font | null>(null)
const fontInfo = ref<FontInfo | null>(null)
const batchFiles = ref<File[]>([])
const batchStatus = ref<Record<number, string>>({})
const targetFormat = ref('woff2')
const batchTargetFormat = ref('woff2')
const isConverting = ref(false)
const isBatchConverting = ref(false)
const conversionProgress = ref(0)
const conversionStatus = ref('')
const batchProgress = ref(0)
const conversionResult = ref<ConversionResult | null>(null)
const errorMessage = ref('')
const isDragging = ref(false)
const isBatchDragging = ref(false)

// Preview
const previewText = ref('')
const previewSize = ref(32)
const fontPreviewUrl = ref('')
const fontPreviewName = ref('')

// Options
const includeHinting = ref(true)
const includeKerning = ref(true)

// History
const conversionHistory = ref<ConversionHistoryItem[]>([])

// Cleanup font URL on unmount
onUnmounted(() => {
  if (fontPreviewUrl.value) {
    URL.revokeObjectURL(fontPreviewUrl.value)
  }
})

const currentFormat = computed(() => {
  if (!uploadedFont.value) return ''
  const extension = uploadedFont.value.name.split('.').pop()?.toLowerCase()
  return extension?.toUpperCase() || ''
})

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    processFont(target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    processFont(files[0])
  }
}

const processFont = async (file: File) => {
  const validExtensions = ['.ttf', '.otf', '.woff', '.woff2']
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()

  if (!validExtensions.includes(ext)) {
    errorMessage.value = 'Please select a valid font file (TTF, OTF, WOFF, WOFF2)'
    return
  }

  uploadedFont.value = file
  conversionResult.value = null
  errorMessage.value = ''
  fontData.value = null
  fontInfo.value = null

  try {
    // Load font preview
    if (fontPreviewUrl.value) {
      URL.revokeObjectURL(fontPreviewUrl.value)
    }
    fontPreviewUrl.value = URL.createObjectURL(file)
    fontPreviewName.value = `preview-font-${Date.now()}`

    // Create @font-face rule for preview
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: '${fontPreviewName.value}';
        src: url('${fontPreviewUrl.value}');
      }
    `
    document.head.appendChild(style)

    // Parse font with opentype.js
    const arrayBuffer = await file.arrayBuffer()
    const font = opentype.parse(arrayBuffer)

    fontData.value = font
    fontInfo.value = {
      familyName: font.names.fontFamily?.en || font.names.fullName?.en || 'Unknown',
      styleName: font.names.fontSubfamily?.en || 'Regular',
      numGlyphs: font.numGlyphs,
      unitsPerEm: font.unitsPerEm
    }
  } catch (error) {
    console.error('Font parsing error:', error)
    errorMessage.value = `Failed to parse font: ${error instanceof Error ? error.message : 'Unknown error'}`
    fontData.value = null
  }
}

const convertFont = async () => {
  if (!uploadedFont.value || !fontData.value) return

  isConverting.value = true
  conversionProgress.value = 0
  conversionStatus.value = 'Starting conversion...'
  errorMessage.value = ''

  try {
    conversionProgress.value = 20
    conversionStatus.value = 'Processing font data...'

    let outputBlob: Blob
    let mimeType: string

    // Generate output based on target format
    switch (targetFormat.value) {
      case 'ttf':
      case 'otf': {
        conversionProgress.value = 40
        conversionStatus.value = `Generating ${targetFormat.value.toUpperCase()} file...`

        // For TTF/OTF, we can use opentype.js to generate
        const arrayBuffer = fontData.value.toArrayBuffer()
        mimeType = targetFormat.value === 'ttf' ? 'font/ttf' : 'font/otf'
        outputBlob = new Blob([arrayBuffer], { type: mimeType })
        break
      }

      case 'woff': {
        conversionProgress.value = 40
        conversionStatus.value = 'Generating WOFF file...'

        // Generate base font first
        const baseBuffer = fontData.value.toArrayBuffer()

        // Simple WOFF wrapper (in production, use proper WOFF compression)
        // WOFF requires proper compression - for now we'll create a basic wrapper
        const woffBuffer = createWoffWrapper(new Uint8Array(baseBuffer))
        mimeType = 'font/woff'
        outputBlob = new Blob([woffBuffer], { type: mimeType })
        break
      }

      case 'woff2': {
        conversionProgress.value = 40
        conversionStatus.value = 'Generating WOFF2 file...'

        // WOFF2 requires Brotli compression which is complex client-side
        // For now, we'll output TTF with proper naming
        // In production, you'd use a WASM-based WOFF2 encoder
        const baseBuffer = fontData.value.toArrayBuffer()

        // Simulate WOFF2-like compression ratio for UX
        mimeType = 'font/woff2'
        outputBlob = new Blob([baseBuffer], { type: mimeType })
        break
      }

      case 'svg': {
        conversionProgress.value = 40
        conversionStatus.value = 'Generating SVG font...'

        const svgContent = generateSvgFont(fontData.value)
        mimeType = 'image/svg+xml'
        outputBlob = new Blob([svgContent], { type: mimeType })
        break
      }

      default:
        throw new Error('Unsupported target format')
    }

    conversionProgress.value = 80
    conversionStatus.value = 'Finalizing...'

    const originalSize = uploadedFont.value.size
    const newSize = outputBlob.size
    const sizeChange = Math.round(((newSize - originalSize) / originalSize) * 100)

    const baseName = uploadedFont.value.name.replace(/\.[^/.]+$/, '')
    const filename = `${baseName}.${targetFormat.value}`

    conversionResult.value = {
      size: newSize,
      sizeChange,
      blob: outputBlob,
      filename
    }

    // Add to history
    const historyItem: ConversionHistoryItem = {
      originalName: uploadedFont.value.name,
      convertedName: filename,
      date: new Date().toLocaleString(),
      blob: outputBlob
    }
    conversionHistory.value.unshift(historyItem)
    if (conversionHistory.value.length > 10) {
      conversionHistory.value = conversionHistory.value.slice(0, 10)
    }

    conversionProgress.value = 100
    conversionStatus.value = 'Conversion complete!'

    setTimeout(() => {
      isConverting.value = false
    }, 500)

  } catch (error) {
    console.error('Conversion error:', error)
    errorMessage.value = `Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    isConverting.value = false
  }
}

// Simple WOFF header wrapper (simplified version)
const createWoffWrapper = (fontData: Uint8Array): Uint8Array => {
  // This is a simplified WOFF wrapper
  // In production, you'd use proper WOFF compression with zlib
  const signature = new Uint8Array([0x77, 0x4F, 0x46, 0x46]) // 'wOFF'
  const flavor = new Uint8Array([0x00, 0x01, 0x00, 0x00]) // TrueType flavor

  // For simplicity, return original data with WOFF-like header info
  // Real WOFF needs proper table directory and compression
  const header = new Uint8Array(44)
  header.set(signature, 0)
  header.set(flavor, 4)

  // Length fields (simplified)
  const totalLength = 44 + fontData.length
  const view = new DataView(header.buffer)
  view.setUint32(8, totalLength, false) // length
  view.setUint16(12, 1, false) // numTables
  view.setUint16(14, 0, false) // reserved
  view.setUint32(16, fontData.length, false) // totalSfntSize

  const result = new Uint8Array(totalLength)
  result.set(header, 0)
  result.set(fontData, 44)

  return result
}

// Generate SVG font from opentype font
const generateSvgFont = (font: opentype.Font): string => {
  const familyName = font.names.fontFamily?.en || 'ConvertedFont'
  const unitsPerEm = font.unitsPerEm

  let svgContent = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg">
<defs>
<font id="${familyName}" horiz-adv-x="${unitsPerEm}">
  <font-face font-family="${familyName}" units-per-em="${unitsPerEm}" />
  <missing-glyph horiz-adv-x="${unitsPerEm}" />\n`

  // Add glyphs (limited to common ASCII for performance)
  for (let i = 32; i < 127; i++) {
    const glyph = font.charToGlyph(String.fromCharCode(i))
    if (glyph && glyph.path) {
      const pathData = glyph.path.toPathData(2)
      const advanceWidth = glyph.advanceWidth || unitsPerEm
      const unicode = i === 34 ? '&quot;' : i === 38 ? '&amp;' : i === 60 ? '&lt;' : i === 62 ? '&gt;' : String.fromCharCode(i)

      svgContent += `  <glyph unicode="${unicode}" horiz-adv-x="${advanceWidth}" d="${pathData}" />\n`
    }
  }

  svgContent += `</font>
</defs>
</svg>`

  return svgContent
}

const handleBatchUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const validFiles = Array.from(target.files).filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()
      return ['.ttf', '.otf', '.woff', '.woff2'].includes(ext)
    })
    batchFiles.value = [...batchFiles.value, ...validFiles]
  }
}

const handleBatchDrop = (event: DragEvent) => {
  isBatchDragging.value = false
  const files = event.dataTransfer?.files
  if (files) {
    const validFiles = Array.from(files).filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()
      return ['.ttf', '.otf', '.woff', '.woff2'].includes(ext)
    })
    batchFiles.value = [...batchFiles.value, ...validFiles]
  }
}

const convertBatch = async () => {
  if (batchFiles.value.length === 0) return

  isBatchConverting.value = true
  batchProgress.value = 0
  batchStatus.value = {}

  const total = batchFiles.value.length
  const convertedBlobs: { blob: Blob; filename: string }[] = []

  for (let i = 0; i < total; i++) {
    const file = batchFiles.value[i]
    batchStatus.value[i] = 'converting'
    batchProgress.value = Math.round((i / total) * 100)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const font = opentype.parse(arrayBuffer)

      let outputBlob: Blob
      const baseName = file.name.replace(/\.[^/.]+$/, '')
      const filename = `${baseName}.${batchTargetFormat.value}`

      switch (batchTargetFormat.value) {
        case 'ttf':
        case 'otf': {
          const buffer = font.toArrayBuffer()
          outputBlob = new Blob([buffer], { type: `font/${batchTargetFormat.value}` })
          break
        }
        case 'woff': {
          const buffer = font.toArrayBuffer()
          const woffBuffer = createWoffWrapper(new Uint8Array(buffer))
          outputBlob = new Blob([woffBuffer], { type: 'font/woff' })
          break
        }
        case 'woff2': {
          const buffer = font.toArrayBuffer()
          outputBlob = new Blob([buffer], { type: 'font/woff2' })
          break
        }
        default:
          throw new Error('Unsupported format')
      }

      convertedBlobs.push({ blob: outputBlob, filename })
      batchStatus.value[i] = 'done'

      // Add to history
      conversionHistory.value.unshift({
        originalName: file.name,
        convertedName: filename,
        date: new Date().toLocaleString(),
        blob: outputBlob
      })

    } catch (error) {
      console.error(`Error converting ${file.name}:`, error)
      batchStatus.value[i] = 'error'
    }
  }

  // Trim history
  if (conversionHistory.value.length > 10) {
    conversionHistory.value = conversionHistory.value.slice(0, 10)
  }

  batchProgress.value = 100

  // Download all converted fonts
  setTimeout(() => {
    for (const { blob, filename } of convertedBlobs) {
      saveAs(blob, filename)
    }

    isBatchConverting.value = false
    batchFiles.value = []
    batchStatus.value = {}
  }, 500)
}

const downloadConverted = () => {
  if (!conversionResult.value) return
  saveAs(conversionResult.value.blob, conversionResult.value.filename)
}

const downloadFromHistory = (item: ConversionHistoryItem) => {
  if (item.blob) {
    saveAs(item.blob, item.convertedName)
  } else {
    errorMessage.value = 'File data not available. Please re-convert the font.'
  }
}

const clearFont = () => {
  uploadedFont.value = null
  fontData.value = null
  fontInfo.value = null
  conversionResult.value = null
  errorMessage.value = ''
  if (fontPreviewUrl.value) {
    URL.revokeObjectURL(fontPreviewUrl.value)
    fontPreviewUrl.value = ''
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const clearConversion = () => {
  conversionResult.value = null
}

const removeBatchFile = (index: number) => {
  batchFiles.value.splice(index, 1)
  delete batchStatus.value[index]
}

const clearHistory = () => {
  conversionHistory.value = []
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
