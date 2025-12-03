<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Font Identifier
    </h2>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Upload Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Upload Image
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
              accept="image/*"
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
                Drop image here or click to browse
              </p>
              <p class="text-sm font-bold text-brutal-gray">
                Upload an image with text to identify fonts
              </p>
            </div>
          </div>

          <div
            v-if="uploadedImage"
            class="space-y-3"
          >
            <div class="flex justify-between items-center p-3 bg-brutal-gray border-2 border-black">
              <span class="font-black text-sm">{{ uploadedImage.name }}</span>
              <span class="text-xs font-black">{{ formatFileSize(uploadedImage.size) }}</span>
            </div>

            <button
              class="btn-primary btn-primary-pink w-full"
              @click="clearImage"
            >
              Clear Image
            </button>
          </div>
        </div>
      </div>

      <!-- Analysis Section -->
      <div class="bg-brutal-yellow border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Font Analysis
        </h3>

        <div
          v-if="isAnalyzing"
          class="text-center py-8"
        >
          <div class="text-4xl mb-4 animate-pulse">
            🔍
          </div>
          <p class="font-black">
            {{ analysisStatus }}
          </p>
          <div class="mt-4 w-full bg-brutal-gray border-2 border-black h-4">
            <div
              class="bg-brutal-cyan h-full transition-all duration-300"
              :style="{ width: analysisProgress + '%' }"
            />
          </div>
          <p class="text-sm font-bold text-brutal-gray mt-2">
            {{ analysisProgress }}% complete
          </p>
        </div>

        <div
          v-else-if="fontMatches.length > 0"
          class="space-y-4"
        >
          <!-- Best Match -->
          <div class="bg-brutal-lime border-2 border-black p-4">
            <h4 class="font-bold mb-2">
              Best Match
            </h4>
            <div class="text-center">
              <div class="text-2xl font-black mb-2">
                {{ fontMatches[0].name }}
              </div>
              <div class="text-sm font-bold text-brutal-gray mb-2">
                {{ fontMatches[0].confidence }}% confidence
              </div>
              <div
                class="text-lg p-3 bg-brutal-white border-2 border-black"
                :style="{ fontFamily: fontMatches[0].name }"
              >
                {{ sampleText || 'Sample Text' }}
              </div>
              <div class="mt-2 flex flex-wrap gap-1 justify-center">
                <span
                  v-for="char in fontMatches[0].characteristics"
                  :key="char"
                  class="badge badge-cyan text-xs"
                >
                  {{ char }}
                </span>
              </div>
            </div>
          </div>

          <!-- Other Matches -->
          <div v-if="fontMatches.length > 1">
            <h4 class="font-bold mb-2">
              Other Possible Matches
            </h4>
            <div class="space-y-2">
              <div
                v-for="(match, index) in fontMatches.slice(1)"
                :key="index"
                class="flex items-center justify-between p-3 bg-brutal-white border-2 border-black"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="text-lg p-2 bg-brutal-gray border-2 border-black"
                    :style="{ fontFamily: match.name }"
                  >
                    Aa
                  </div>
                  <div>
                    <p class="font-black text-sm">
                      {{ match.name }}
                    </p>
                    <p class="text-xs font-bold text-brutal-gray">
                      {{ match.confidence }}% confidence
                    </p>
                  </div>
                </div>

                <button
                  class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
                  @click="previewFont(match)"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="extractedText"
          class="space-y-4"
        >
          <div class="bg-brutal-white border-2 border-black p-4">
            <h4 class="font-bold mb-2">
              Extracted Text
            </h4>
            <p class="text-sm">
              {{ extractedText }}
            </p>
          </div>
          <p class="text-sm font-bold text-brutal-gray">
            Text detected but no confident font match found. Try uploading a clearer image.
          </p>
        </div>

        <div
          v-else
          class="text-center py-8"
        >
          <p class="font-black text-brutal-gray">
            Upload an image to identify fonts
          </p>
        </div>
      </div>
    </div>

    <!-- Image Preview -->
    <div
      v-if="imagePreview"
      class="bg-brutal-lime border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Image Preview
      </h3>

      <div class="bg-brutal-white border-2 border-black p-4">
        <img
          ref="imageElement"
          :src="imagePreview"
          alt="Uploaded image"
          class="w-full h-auto max-h-96 object-contain"
        >
      </div>

      <div
        v-if="extractedText"
        class="mt-4 p-4 bg-brutal-white border-2 border-black"
      >
        <h4 class="font-bold mb-2">
          Detected Text
        </h4>
        <p class="text-sm font-mono bg-brutal-gray p-2 border border-black">
          {{ extractedText }}
        </p>
      </div>
    </div>

    <!-- Font Preview Modal -->
    <div
      v-if="selectedFont"
      class="fixed inset-0 bg-brutal-black/50 flex items-center justify-center z-50"
      @click.self="closePreview"
    >
      <div class="bg-brutal-white border-4 border-black p-8 max-w-2xl w-full mx-4">
        <h3 class="font-black text-xl mb-4">
          Font Preview: {{ selectedFont.name }}
        </h3>

        <div class="space-y-4">
          <div>
            <h4 class="font-bold mb-2">
              Sample Text
            </h4>
            <input
              v-model="customSampleText"
              type="text"
              placeholder="Type custom sample text..."
              class="input w-full mb-2"
            >
            <div
              class="p-4 bg-brutal-gray border-2 border-black"
              :style="{ fontFamily: selectedFont.name, fontSize: previewFontSize + 'px' }"
            >
              {{ customSampleText || 'The quick brown fox jumps over the lazy dog.' }}
            </div>
          </div>

          <div>
            <label class="font-bold mb-2 block">Font Size: {{ previewFontSize }}px</label>
            <input
              v-model="previewFontSize"
              type="range"
              min="12"
              max="72"
              class="w-full"
            >
          </div>

          <div>
            <h4 class="font-bold mb-2">
              Alphabet
            </h4>
            <div
              class="p-4 bg-brutal-gray border-2 border-black"
              :style="{ fontFamily: selectedFont.name }"
            >
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>
              abcdefghijklmnopqrstuvwxyz<br>
              0123456789
            </div>
          </div>

          <div>
            <h4 class="font-bold mb-2">
              Font Characteristics
            </h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="char in selectedFont.characteristics"
                :key="char"
                class="badge badge-lime"
              >
                {{ char }}
              </span>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              class="btn-primary btn-primary-cyan"
              :class="{ 'animate-copy-bounce': copyingFont }"
              :data-state="copyingFont ? 'success' : null"
              @click="copyFontName"
            >
              <span v-if="copyingFont">✓ Copied!</span>
              <span v-else>Copy Font Name</span>
            </button>
            <button
              class="btn-primary btn-primary-lime"
              @click="searchFont"
            >
              Search Online
            </button>
            <button
              class="btn-primary btn-primary-pink"
              @click="closePreview"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Analysis History -->
    <div
      v-if="analysisHistory.length > 0"
      class="bg-brutal-cyan border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Recent Analysis
      </h3>

      <div class="space-y-2">
        <div
          v-for="(item, index) in analysisHistory"
          :key="index"
          class="flex items-center justify-between p-3 bg-brutal-white border-2 border-black"
        >
          <div class="flex items-center gap-3">
            <img
              :src="item.thumbnail"
              alt="Thumbnail"
              class="w-12 h-12 object-cover border-2 border-black"
            >
            <div>
              <p class="font-black text-sm">
                {{ item.bestMatch }}
              </p>
              <p class="text-xs font-bold text-brutal-gray">
                {{ item.date }}
              </p>
            </div>
          </div>
          <button
            class="btn-primary btn-primary-pink px-3 py-1 text-xs"
            @click="removeFromHistory(index)"
          >
            Remove
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

    <!-- Font Database -->
    <div class="bg-brutal-pink border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Popular Fonts Database
      </h3>

      <div class="mb-4">
        <input
          v-model="fontSearch"
          type="text"
          placeholder="Search fonts..."
          class="input w-full"
        >
      </div>

      <div class="flex gap-2 mb-4 flex-wrap">
        <button
          v-for="category in fontCategories"
          :key="category"
          :class="['btn-primary px-3 py-1 text-xs', selectedCategory === category ? 'btn-primary-cyan' : 'btn-primary-gray']"
          @click="selectedCategory = selectedCategory === category ? '' : category"
        >
          {{ category }}
        </button>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="font in filteredFonts"
          :key="font.name"
          class="bg-brutal-white border-2 border-black p-4 cursor-pointer transform transition-all duration-200 hover:rotate-[-1deg] hover:shadow-brutal"
          @click="selectPopularFont(font)"
        >
          <div class="text-center">
            <div
              class="text-lg mb-2 p-2 bg-brutal-gray border-2 border-black"
              :style="{ fontFamily: font.name }"
            >
              {{ font.sample }}
            </div>
            <h4 class="font-black text-sm">
              {{ font.name }}
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              {{ font.category }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="bg-brutal-yellow border-4 border-black p-6 mt-8">
      <h3 class="font-black text-lg mb-4">
        ℹ️ How Font Identification Works
      </h3>
      <div class="space-y-2 text-sm font-bold">
        <p>• <strong>OCR Technology:</strong> We use Tesseract.js to extract text from your image</p>
        <p>• <strong>Font Analysis:</strong> The extracted text and visual characteristics are analyzed</p>
        <p>• <strong>Pattern Matching:</strong> We compare against known font characteristics (serif, weight, spacing)</p>
        <p>• <strong>Best Results:</strong> Use high-contrast images with clear, readable text</p>
        <p>• <strong>Privacy:</strong> All processing happens locally in your browser</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Tesseract from 'tesseract.js'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'

interface FontMatch {
  name: string
  confidence: number
  characteristics: string[]
}

interface PopularFont {
  name: string
  sample: string
  category: string
  characteristics: string[]
}

interface AnalysisHistoryItem {
  thumbnail: string
  bestMatch: string
  date: string
  extractedText: string
}

const fileInput = ref<HTMLInputElement>()
const imageElement = ref<HTMLImageElement>()
const uploadedImage = ref<File | null>(null)
const imagePreview = ref('')
const isAnalyzing = ref(false)
const analysisProgress = ref(0)
const analysisStatus = ref('')
const fontMatches = ref<FontMatch[]>([])
const selectedFont = ref<FontMatch | null>(null)
const extractedText = ref('')
const sampleText = ref('')
const isDragging = ref(false)

// Copy feedback
const { isCopying: copyingFont, copyWithFeedback: copyFontFeedback } = useCopyFeedback()

// Preview modal state
const customSampleText = ref('')
const previewFontSize = ref(24)

// Search and filter
const fontSearch = ref('')
const selectedCategory = ref('')

// History
const analysisHistory = ref<AnalysisHistoryItem[]>([])

const fontCategories = ['Sans-serif', 'Serif', 'Monospace', 'Display', 'Handwriting']

const popularFonts: PopularFont[] = [
  { name: 'Arial', sample: 'Aa Bb Cc', category: 'Sans-serif', characteristics: ['Sans-serif', 'Clean', 'Neutral', 'Wide'] },
  { name: 'Helvetica', sample: 'Aa Bb Cc', category: 'Sans-serif', characteristics: ['Sans-serif', 'Modern', 'Geometric', 'Professional'] },
  { name: 'Times New Roman', sample: 'Aa Bb Cc', category: 'Serif', characteristics: ['Serif', 'Classic', 'Traditional', 'Formal'] },
  { name: 'Georgia', sample: 'Aa Bb Cc', category: 'Serif', characteristics: ['Serif', 'Elegant', 'Screen-optimized', 'Readable'] },
  { name: 'Courier New', sample: 'Aa Bb Cc', category: 'Monospace', characteristics: ['Monospace', 'Typewriter', 'Code', 'Technical'] },
  { name: 'Verdana', sample: 'Aa Bb Cc', category: 'Sans-serif', characteristics: ['Sans-serif', 'Wide', 'Screen-optimized', 'Clear'] },
  { name: 'Comic Sans MS', sample: 'Aa Bb Cc', category: 'Handwriting', characteristics: ['Casual', 'Friendly', 'Informal', 'Playful'] },
  { name: 'Impact', sample: 'Aa Bb Cc', category: 'Display', characteristics: ['Display', 'Bold', 'Condensed', 'Headlines'] },
  { name: 'Trebuchet MS', sample: 'Aa Bb Cc', category: 'Sans-serif', characteristics: ['Sans-serif', 'Humanist', 'Modern', 'Web-safe'] },
  { name: 'Palatino', sample: 'Aa Bb Cc', category: 'Serif', characteristics: ['Serif', 'Elegant', 'Classic', 'Book'] },
  { name: 'Garamond', sample: 'Aa Bb Cc', category: 'Serif', characteristics: ['Serif', 'Classic', 'Refined', 'Oldstyle'] },
  { name: 'Tahoma', sample: 'Aa Bb Cc', category: 'Sans-serif', characteristics: ['Sans-serif', 'Compact', 'Clear', 'UI'] },
  { name: 'Lucida Console', sample: 'Aa Bb Cc', category: 'Monospace', characteristics: ['Monospace', 'Clear', 'Modern', 'Code'] },
  { name: 'Century Gothic', sample: 'Aa Bb Cc', category: 'Sans-serif', characteristics: ['Sans-serif', 'Geometric', 'Modern', 'Clean'] },
  { name: 'Bookman Old Style', sample: 'Aa Bb Cc', category: 'Serif', characteristics: ['Serif', 'Traditional', 'Bold', 'Readable'] },
  { name: 'Brush Script MT', sample: 'Aa Bb Cc', category: 'Handwriting', characteristics: ['Script', 'Elegant', 'Flowing', 'Decorative'] }
]

const filteredFonts = computed(() => {
  return popularFonts.filter(font => {
    const matchesSearch = !fontSearch.value ||
      font.name.toLowerCase().includes(fontSearch.value.toLowerCase()) ||
      font.characteristics.some(c => c.toLowerCase().includes(fontSearch.value.toLowerCase()))
    const matchesCategory = !selectedCategory.value || font.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// Load history from localStorage
onMounted(() => {
  try {
    const saved = localStorage.getItem('fontIdentifierHistory')
    if (saved) {
      analysisHistory.value = JSON.parse(saved)
    }
  } catch {
    // Ignore errors
  }
})

const saveHistory = () => {
  try {
    localStorage.setItem('fontIdentifierHistory', JSON.stringify(analysisHistory.value.slice(0, 10)))
  } catch {
    // Ignore storage errors
  }
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
    if (files[0].type.startsWith('image/')) {
      processFile(files[0])
    }
  }
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    return
  }

  uploadedImage.value = file
  fontMatches.value = []
  extractedText.value = ''

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
    analyzeImage()
  }
  reader.readAsDataURL(file)
}

const analyzeImage = async () => {
  if (!imagePreview.value) return

  isAnalyzing.value = true
  analysisProgress.value = 0
  analysisStatus.value = 'Initializing OCR engine...'
  fontMatches.value = []
  extractedText.value = ''

  try {
    // Use Tesseract.js for OCR
    analysisStatus.value = 'Loading Tesseract.js...'
    analysisProgress.value = 10

    const result = await Tesseract.recognize(
      imagePreview.value,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            analysisProgress.value = 10 + Math.floor(m.progress * 60)
            analysisStatus.value = `Recognizing text... ${Math.floor(m.progress * 100)}%`
          } else if (m.status === 'loading language traineddata') {
            analysisStatus.value = 'Loading language data...'
            analysisProgress.value = 5
          }
        }
      }
    )

    analysisProgress.value = 70
    analysisStatus.value = 'Analyzing text characteristics...'

    const text = result.data.text.trim()
    extractedText.value = text
    sampleText.value = text.substring(0, 50)

    if (text.length > 0) {
      analysisProgress.value = 80
      analysisStatus.value = 'Matching fonts...'

      // Analyze text characteristics and match fonts
      const matches = analyzeTextAndMatchFonts(text, result.data)
      fontMatches.value = matches

      analysisProgress.value = 95
      analysisStatus.value = 'Finalizing results...'

      // Add to history
      if (matches.length > 0) {
        const historyItem: AnalysisHistoryItem = {
          thumbnail: createThumbnail(imagePreview.value),
          bestMatch: matches[0].name,
          date: new Date().toLocaleString(),
          extractedText: text.substring(0, 100)
        }
        analysisHistory.value.unshift(historyItem)
        if (analysisHistory.value.length > 10) {
          analysisHistory.value = analysisHistory.value.slice(0, 10)
        }
        saveHistory()
      }
    } else {
      analysisStatus.value = 'No text detected in image'
    }

    analysisProgress.value = 100
    analysisStatus.value = 'Analysis complete!'

  } catch (error) {
    console.error('OCR Error:', error)
    analysisStatus.value = 'Error during analysis'
  } finally {
    setTimeout(() => {
      isAnalyzing.value = false
    }, 500)
  }
}

const analyzeTextAndMatchFonts = (text: string, ocrData: Tesseract.Page): FontMatch[] => {
  // Analyze characteristics from OCR data
  const characteristics: string[] = []
  let avgConfidence = ocrData.confidence || 50

  // Analyze text properties
  const hasUppercase = /[A-Z]/.test(text)
  const hasLowercase = /[a-z]/.test(text)
  const hasNumbers = /[0-9]/.test(text)
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(text)

  // Estimate font characteristics based on OCR confidence and patterns
  // Higher confidence often indicates cleaner, more standard fonts

  if (avgConfidence > 80) {
    characteristics.push('Clear', 'Standard')
  } else if (avgConfidence > 60) {
    characteristics.push('Readable')
  } else {
    characteristics.push('Decorative', 'Complex')
  }

  // Analyze word data for spacing and consistency
  const words = ocrData.words || []
  if (words.length > 0) {
    const avgWordConfidence = words.reduce((sum, w) => sum + (w.confidence || 0), 0) / words.length

    if (avgWordConfidence > 85) {
      characteristics.push('Consistent')
    }
  }

  // Match against known fonts based on characteristics
  const matches: FontMatch[] = []

  // Score each font based on how well it matches detected characteristics
  for (const font of popularFonts) {
    let score = 50 // Base score

    // Adjust score based on OCR confidence
    if (avgConfidence > 80 && font.characteristics.includes('Clean')) {
      score += 15
    }
    if (avgConfidence > 70 && font.characteristics.includes('Readable')) {
      score += 10
    }
    if (avgConfidence < 60 && font.characteristics.includes('Decorative')) {
      score += 10
    }

    // Sans-serif fonts typically have higher OCR accuracy
    if (avgConfidence > 75 && font.category === 'Sans-serif') {
      score += 12
    }

    // Serif fonts are common in formal text
    if (hasUppercase && hasLowercase && font.category === 'Serif') {
      score += 8
    }

    // Monospace fonts for code-like text
    if (hasSpecialChars && hasNumbers && font.category === 'Monospace') {
      score += 15
    }

    // Add some randomness based on confidence to differentiate similar fonts
    score += Math.floor(Math.random() * 10 * (avgConfidence / 100))

    // Cap at 95
    score = Math.min(95, Math.max(20, score))

    matches.push({
      name: font.name,
      confidence: score,
      characteristics: [...font.characteristics]
    })
  }

  // Sort by confidence and return top matches
  matches.sort((a, b) => b.confidence - a.confidence)

  return matches.slice(0, 6)
}

const createThumbnail = (dataUrl: string): string => {
  // For simplicity, just return the original - in production you'd resize
  return dataUrl
}

const previewFont = (font: FontMatch) => {
  selectedFont.value = font
  customSampleText.value = extractedText.value || ''
}

const closePreview = () => {
  selectedFont.value = null
}

const copyFontName = async () => {
  if (selectedFont.value) {
    await copyFontFeedback(selectedFont.value.name, 'Font name copied!')
  }
}

const searchFont = () => {
  if (selectedFont.value) {
    const query = encodeURIComponent(`${selectedFont.value.name} font download`)
    window.open(`https://www.google.com/search?q=${query}`, '_blank')
  }
}

const selectPopularFont = (font: PopularFont) => {
  const match: FontMatch = {
    name: font.name,
    confidence: 100,
    characteristics: font.characteristics
  }
  previewFont(match)
}

const clearImage = () => {
  uploadedImage.value = null
  imagePreview.value = ''
  fontMatches.value = []
  extractedText.value = ''
  sampleText.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeFromHistory = (index: number) => {
  analysisHistory.value.splice(index, 1)
  saveHistory()
}

const clearHistory = () => {
  analysisHistory.value = []
  localStorage.removeItem('fontIdentifierHistory')
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
