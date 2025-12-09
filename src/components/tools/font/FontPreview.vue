<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">
      Font Preview
    </h2>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Font Selection -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Font Settings
        </h3>

        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Font Family</label>
            <select
              v-model="fontFamily"
              class="select"
            >
              <option value="Arial">
                Arial
              </option>
              <option value="Helvetica">
                Helvetica
              </option>
              <option value="Times New Roman">
                Times New Roman
              </option>
              <option value="Georgia">
                Georgia
              </option>
              <option value="Courier New">
                Courier New
              </option>
              <option value="Verdana">
                Verdana
              </option>
              <option value="Comic Sans MS">
                Comic Sans MS
              </option>
              <option value="Impact">
                Impact
              </option>
              <option value="Trebuchet MS">
                Trebuchet MS
              </option>
              <option value="Palatino">
                Palatino
              </option>
              <option value="Garamond">
                Garamond
              </option>
              <option value="Bookman">
                Bookman
              </option>
            </select>
          </div>

          <div>
            <label class="font-black mb-2 block">Font Size</label>
            <div class="flex gap-2">
              <input
                v-model.number="fontSize"
                type="range"
                min="12"
                max="72"
                class="flex-1"
              >
              <input
                v-model.number="fontSize"
                type="number"
                min="12"
                max="72"
                class="input w-20"
              >
            </div>
            <div class="text-center text-sm font-bold">
              {{ fontSize }}px
            </div>
          </div>

          <div>
            <label class="font-black mb-2 block">Font Weight</label>
            <select
              v-model="fontWeight"
              class="select"
            >
              <option value="100">
                Thin (100)
              </option>
              <option value="200">
                Extra Light (200)
              </option>
              <option value="300">
                Light (300)
              </option>
              <option value="400">
                Normal (400)
              </option>
              <option value="500">
                Medium (500)
              </option>
              <option value="600">
                Semi Bold (600)
              </option>
              <option value="700">
                Bold (700)
              </option>
              <option value="800">
                Extra Bold (800)
              </option>
              <option value="900">
                Black (900)
              </option>
            </select>
          </div>

          <div>
            <label class="font-black mb-2 block">Font Style</label>
            <select
              v-model="fontStyle"
              class="select"
            >
              <option value="normal">
                Normal
              </option>
              <option value="italic">
                Italic
              </option>
              <option value="oblique">
                Oblique
              </option>
            </select>
          </div>

          <div>
            <label class="font-black mb-2 block">Text Decoration</label>
            <div class="flex gap-2">
              <label class="flex items-center gap-1">
                <input
                  v-model="textDecoration.underline"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Underline</span>
              </label>
              <label class="flex items-center gap-1">
                <input
                  v-model="textDecoration.overline"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Overline</span>
              </label>
              <label class="flex items-center gap-1">
                <input
                  v-model="textDecoration.lineThrough"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Line-through</span>
              </label>
            </div>
          </div>

          <div>
            <label class="font-black mb-2 block">Text Transform</label>
            <select
              v-model="textTransform"
              class="select"
            >
              <option value="none">
                None
              </option>
              <option value="uppercase">
                Uppercase
              </option>
              <option value="lowercase">
                Lowercase
              </option>
              <option value="capitalize">
                Capitalize
              </option>
            </select>
          </div>

          <div>
            <label class="font-black mb-2 block">Letter Spacing</label>
            <input
              v-model.number="letterSpacing"
              type="range"
              min="-2"
              max="10"
              step="0.5"
              class="w-full"
            >
            <div class="text-center text-sm font-bold">
              {{ letterSpacing }}px
            </div>
          </div>

          <div>
            <label class="font-black mb-2 block">Line Height</label>
            <input
              v-model.number="lineHeight"
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              class="w-full"
            >
            <div class="text-center text-sm font-bold">
              {{ lineHeight }}
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Live Preview
        </h3>

        <div class="space-y-4">
          <!-- Sample Text -->
          <div class="bg-brutal-white border-2 border-black p-4">
            <div :style="fontStyles">
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>

          <!-- Alphabet -->
          <div class="bg-brutal-white border-2 border-black p-4">
            <div :style="fontStyles">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>
              abcdefghijklmnopqrstuvwxyz<br>
              0123456789<br>
              !@#$%^&*()_+-=[]{}|;':",./&lt;&gt;?
            </div>
          </div>

          <!-- Custom Text -->
          <div>
            <label class="font-black mb-2 block">Custom Text</label>
            <textarea
              v-model="customText"
              placeholder="Enter your own text to preview..."
              class="input w-full h-24 resize-none mb-2"
            />
            <div class="bg-brutal-white border-2 border-black p-4">
              <div :style="fontStyles">
                {{ customText || 'Your custom text will appear here...' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Font Comparison -->
    <div class="bg-brutal-yellow border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Font Comparison
      </h3>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="font in comparisonFonts"
          :key="font.name"
          class="bg-brutal-white border-2 border-black p-4"
        >
          <h4 class="font-bold mb-2">
            {{ font.name }}
          </h4>
          <div :style="{ fontFamily: font.name, fontSize: '16px' }">
            The quick brown fox jumps over the lazy dog.
          </div>
        </div>
      </div>
    </div>

    <!-- CSS Code -->
    <div class="bg-brutal-pink border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        CSS Code
      </h3>

      <div class="bg-brutal-white border-2 border-black p-4">
        <pre class="font-mono text-sm">{{ cssCode }}</pre>
      </div>

      <div class="flex gap-2 mt-4">
        <button
          class="btn-primary btn-primary-cyan"
          :class="{ 'animate-copy-bounce': copyingCSS }"
          :data-state="copyingCSS ? 'success' : null"
          @click="copyCSS"
        >
          <span v-if="copyingCSS">✓ Copied!</span>
          <span v-else>Copy CSS</span>
        </button>
        <button
          class="btn-primary btn-primary-lime"
          @click="downloadCSS"
        >
          Download CSS
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'

const fontFamily = ref('Arial')
const fontSize = ref(24)
const fontWeight = ref('400')
const fontStyle = ref('normal')
const textTransform = ref('none')
const letterSpacing = ref(0)
const lineHeight = ref(1.5)
const customText = ref('')

// Copy feedback
const { isCopying: copyingCSS, copyWithFeedback: copyCSSFeedback } = useCopyFeedback()

const textDecoration = ref({
  underline: false,
  overline: false,
  lineThrough: false
})

const comparisonFonts = [
  { name: 'Arial' },
  { name: 'Helvetica' },
  { name: 'Times New Roman' },
  { name: 'Georgia' },
  { name: 'Courier New' },
  { name: 'Verdana' }
]

const fontStyles = computed(() => {
  const decorations = []
  if (textDecoration.value.underline) decorations.push('underline')
  if (textDecoration.value.overline) decorations.push('overline')
  if (textDecoration.value.lineThrough) decorations.push('line-through')

  return {
    fontFamily: fontFamily.value,
    fontSize: `${fontSize.value}px`,
    fontWeight: fontWeight.value,
    fontStyle: fontStyle.value,
    textTransform: textTransform.value,
    letterSpacing: `${letterSpacing.value}px`,
    lineHeight: lineHeight.value,
    textDecoration: decorations.length > 0 ? decorations.join(' ') : 'none'
  }
})

const cssCode = computed(() => {
  const decorations = []
  if (textDecoration.value.underline) decorations.push('underline')
  if (textDecoration.value.overline) decorations.push('overline')
  if (textDecoration.value.lineThrough) decorations.push('line-through')

  return `.custom-font {
  font-family: "${fontFamily.value}";
  font-size: ${fontSize.value}px;
  font-weight: ${fontWeight.value};
  font-style: ${fontStyle.value};
  text-transform: ${textTransform.value};
  letter-spacing: ${letterSpacing.value}px;
  line-height: ${lineHeight.value};
  text-decoration: ${decorations.length > 0 ? decorations.join(' ') : 'none'};
}`
})

const copyCSS = async () => {
  await copyCSSFeedback(cssCode.value, 'CSS copied!')
}

const downloadCSS = () => {
  const blob = new Blob([cssCode.value], { type: 'text/css' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'font-styles.css'
  a.click()
  URL.revokeObjectURL(url)
}
</script>
