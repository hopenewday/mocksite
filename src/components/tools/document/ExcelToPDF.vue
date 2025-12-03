<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Excel/CSV to PDF Converter
    </h2>

    <div class="bg-brutal-lime border-4 border-black p-4 mb-6">
      <p class="font-black text-sm">
        📊 Supports CSV files with full parsing. Excel files (.xlsx, .xls) will be converted
        using basic table rendering. For best results with Excel files, export to CSV first.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Upload Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Upload File
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
              accept=".csv,.xls,.xlsx"
              class="hidden"
              @change="handleFileUpload"
            >
            <div
              class="cursor-pointer"
              @click="fileInput?.click()"
            >
              <div class="text-4xl mb-4">
                📊
              </div>
              <p class="font-black mb-2">
                Drop file here or click to browse
              </p>
              <p class="text-sm font-bold text-brutal-gray">
                Supports .csv, .xls, and .xlsx files
              </p>
            </div>
          </div>

          <div
            v-if="uploadedFile"
            class="space-y-3"
          >
            <div class="flex justify-between items-center p-3 bg-brutal-gray border-2 border-black">
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ getFileIcon() }}</span>
                <span class="font-black text-sm truncate">{{ uploadedFile.name }}</span>
              </div>
              <span class="text-xs font-black">{{ formatFileSize(uploadedFile.size) }}</span>
            </div>

            <div
              v-if="parseError"
              class="p-3 bg-brutal-pink/20 border-2 border-brutal-pink"
            >
              <p class="font-black text-sm text-brutal-pink">
                {{ parseError }}
              </p>
            </div>

            <div
              v-if="parsedData.length > 0"
              class="p-3 bg-brutal-lime/20 border-2 border-brutal-lime"
            >
              <p class="font-black text-sm text-green-700">
                ✓ Parsed {{ parsedData.length }} rows, {{ columnCount }} columns
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

      <!-- Conversion Options -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          PDF Options
        </h3>

        <div class="space-y-4">
          <div>
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
                Landscape (recommended for wide tables)
              </option>
            </select>
          </div>

          <div>
            <label class="font-black mb-2 block">Font Size</label>
            <select
              v-model="fontSize"
              class="select"
            >
              <option :value="8">
                Small (8pt)
              </option>
              <option :value="10">
                Normal (10pt)
              </option>
              <option :value="12">
                Large (12pt)
              </option>
            </select>
          </div>

          <div>
            <label class="font-black mb-2 block">Table Style</label>
            <select
              v-model="tableStyle"
              class="select"
            >
              <option value="bordered">
                Bordered
              </option>
              <option value="striped">
                Striped Rows
              </option>
              <option value="minimal">
                Minimal
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input
                v-model="options.includeHeader"
                type="checkbox"
                class="w-4 h-4"
              >
              <span class="font-bold">First row is header</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="options.autoFitColumns"
                type="checkbox"
                class="w-4 h-4"
              >
              <span class="font-bold">Auto-fit column widths</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="options.wrapText"
                type="checkbox"
                class="w-4 h-4"
              >
              <span class="font-bold">Wrap long text</span>
            </label>
          </div>

          <button
            :disabled="parsedData.length === 0 || isConverting"
            class="btn-primary btn-primary-lime w-full disabled:opacity-50"
            @click="convertToPDF"
          >
            {{ isConverting ? 'Converting...' : 'Convert to PDF' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Data Preview -->
    <div
      v-if="parsedData.length > 0"
      class="bg-brutal-white border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Data Preview (first 10 rows)
      </h3>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead v-if="options.includeHeader && parsedData.length > 0">
            <tr>
              <th
                v-for="(cell, cellIndex) in parsedData[0]"
                :key="cellIndex"
                class="border-2 border-black bg-brutal-cyan p-2 text-left font-black text-sm"
              >
                {{ cell || `Column ${cellIndex + 1}` }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in previewData"
              :key="rowIndex"
              :class="rowIndex % 2 === 0 ? 'bg-brutal-gray/20' : ''"
            >
              <td
                v-for="(cell, cellIndex) in row"
                :key="cellIndex"
                class="border border-black p-2 text-sm"
              >
                {{ truncateCell(cell) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p
        v-if="parsedData.length > 11"
        class="text-sm font-bold text-brutal-gray mt-2"
      >
        ... and {{ parsedData.length - 11 }} more rows
      </p>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="bg-brutal-lime/20 border-4 border-brutal-lime p-4"
    >
      <p class="font-black text-green-700">
        {{ successMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Papa from 'papaparse'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const fileInput = ref<HTMLInputElement>()
const uploadedFile = ref<File | null>(null)
const parsedData = ref<string[][]>([])
const parseError = ref('')
const isConverting = ref(false)
const successMessage = ref('')

const pageSize = ref('a4')
const orientation = ref('landscape')
const fontSize = ref(10)
const tableStyle = ref('bordered')

const options = ref({
  includeHeader: true,
  autoFitColumns: true,
  wrapText: false
})

const columnCount = computed(() => {
  if (parsedData.value.length === 0) return 0
  return Math.max(...parsedData.value.map(row => row.length))
})

const previewData = computed(() => {
  const startIndex = options.value.includeHeader ? 1 : 0
  return parsedData.value.slice(startIndex, startIndex + 10)
})

const getFileIcon = () => {
  if (!uploadedFile.value) return '📄'
  const ext = uploadedFile.value.name.split('.').pop()?.toLowerCase()
  if (ext === 'csv') return '📝'
  return '📊'
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    processFile(target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

const processFile = async (file: File) => {
  parseError.value = ''
  successMessage.value = ''
  parsedData.value = []

  const ext = file.name.split('.').pop()?.toLowerCase()

  if (!['csv', 'xls', 'xlsx'].includes(ext || '')) {
    parseError.value = 'Unsupported file format. Please use CSV, XLS, or XLSX.'
    return
  }

  uploadedFile.value = file

  if (ext === 'csv') {
    await parseCSV(file)
  } else {
    // For Excel files, we'll show a message about CSV conversion
    parseError.value = 'Excel files (.xls, .xlsx) require conversion. For best results, please export your Excel file to CSV format first, then upload the CSV file.'
  }
}

const parseCSV = async (file: File) => {
  return new Promise<void>((resolve) => {
    Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          parseError.value = `Parse error: ${results.errors[0].message}`
        } else {
          parsedData.value = results.data as string[][]
          // Remove empty rows
          parsedData.value = parsedData.value.filter(row =>
            row.some(cell => cell && cell.toString().trim() !== '')
          )
        }
        resolve()
      },
      error: (error) => {
        parseError.value = `Failed to parse file: ${error.message}`
        resolve()
      }
    })
  })
}

const clearFile = () => {
  uploadedFile.value = null
  parsedData.value = []
  parseError.value = ''
  successMessage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const truncateCell = (cell: string | undefined): string => {
  if (!cell) return ''
  const str = cell.toString()
  return str.length > 50 ? str.substring(0, 47) + '...' : str
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const convertToPDF = async () => {
  if (parsedData.value.length === 0) return

  isConverting.value = true
  successMessage.value = ''

  try {
    const pdf = await PDFDocument.create()
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)

    // Page dimensions
    const pageDimensions = {
      a4: { width: 595.28, height: 841.89 },
      letter: { width: 612, height: 792 },
      legal: { width: 612, height: 1008 }
    }

    const dims = pageDimensions[pageSize.value as keyof typeof pageDimensions]
    const pageWidth = orientation.value === 'landscape' ? dims.height : dims.width
    const pageHeight = orientation.value === 'landscape' ? dims.width : dims.height

    const margin = 40
    const cellPadding = 4
    const rowHeight = fontSize.value + (cellPadding * 2) + 4

    // Calculate column widths
    const availableWidth = pageWidth - (margin * 2)
    const numCols = columnCount.value
    const colWidth = availableWidth / numCols

    // Calculate rows per page
    const headerHeight = options.value.includeHeader ? rowHeight : 0
    const availableHeight = pageHeight - (margin * 2) - headerHeight
    const rowsPerPage = Math.floor(availableHeight / rowHeight)

    const dataStartIndex = options.value.includeHeader ? 1 : 0
    const dataRows = parsedData.value.slice(dataStartIndex)
    const headerRow = options.value.includeHeader ? parsedData.value[0] : null

    let currentRowIndex = 0

    while (currentRowIndex < dataRows.length) {
      const page = pdf.addPage([pageWidth, pageHeight])
      let y = pageHeight - margin

      // Draw header if enabled
      if (headerRow) {
        y -= rowHeight

        // Header background
        if (tableStyle.value !== 'minimal') {
          page.drawRectangle({
            x: margin,
            y: y,
            width: availableWidth,
            height: rowHeight,
            color: rgb(0.2, 0.6, 0.8)
          })
        }

        // Header cells
        for (let col = 0; col < numCols; col++) {
          const cellX = margin + (col * colWidth)
          const cellText = (headerRow[col] || '').toString().substring(0, 30)

          // Cell border
          if (tableStyle.value === 'bordered') {
            page.drawRectangle({
              x: cellX,
              y: y,
              width: colWidth,
              height: rowHeight,
              borderColor: rgb(0, 0, 0),
              borderWidth: 1
            })
          }

          // Cell text
          page.drawText(cellText, {
            x: cellX + cellPadding,
            y: y + cellPadding + 2,
            size: fontSize.value,
            font: boldFont,
            color: tableStyle.value !== 'minimal' ? rgb(1, 1, 1) : rgb(0, 0, 0)
          })
        }
      }

      // Draw data rows
      const rowsToDraw = Math.min(rowsPerPage, dataRows.length - currentRowIndex)

      for (let i = 0; i < rowsToDraw; i++) {
        const row = dataRows[currentRowIndex + i]
        y -= rowHeight

        // Row background for striped style
        if (tableStyle.value === 'striped' && i % 2 === 0) {
          page.drawRectangle({
            x: margin,
            y: y,
            width: availableWidth,
            height: rowHeight,
            color: rgb(0.95, 0.95, 0.95)
          })
        }

        // Draw cells
        for (let col = 0; col < numCols; col++) {
          const cellX = margin + (col * colWidth)
          const cellValue = row[col] || ''
          const cellText = cellValue.toString().substring(0, 40)

          // Cell border
          if (tableStyle.value === 'bordered') {
            page.drawRectangle({
              x: cellX,
              y: y,
              width: colWidth,
              height: rowHeight,
              borderColor: rgb(0, 0, 0),
              borderWidth: 0.5
            })
          }

          // Cell text
          page.drawText(cellText, {
            x: cellX + cellPadding,
            y: y + cellPadding + 2,
            size: fontSize.value,
            font: font,
            color: rgb(0, 0, 0)
          })
        }
      }

      // Bottom border for minimal style
      if (tableStyle.value === 'minimal') {
        page.drawLine({
          start: { x: margin, y: y },
          end: { x: margin + availableWidth, y: y },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8)
        })
      }

      currentRowIndex += rowsToDraw
    }

    // Save and download
    const pdfBytes = await pdf.save()
    downloadBlob(pdfBytes, `${uploadedFile.value?.name.replace(/\.[^/.]+$/, '')}_converted.pdf`)

    successMessage.value = `PDF created successfully with ${pdf.getPageCount()} page(s)!`
  } catch (error) {
    console.error('PDF conversion error:', error)
    parseError.value = 'Failed to convert to PDF. Please try again.'
  } finally {
    isConverting.value = false
  }
}

const downloadBlob = (bytes: Uint8Array, filename: string) => {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>
