<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Gradient Generator
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Create beautiful CSS gradients with color stops, angle control, and presets.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Preview -->
        <div class="lg:col-span-2 space-y-6">
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Gradient Preview
            </h2>
            
            <div 
              class="w-full h-64 border-4 border-black mb-4"
              :style="{ background: gradientCSS }"
            />

            <div class="p-3 bg-brutal-yellow border-2 border-black">
              <label class="font-black block mb-2">CSS Code</label>
              <textarea 
                :value="gradientCSS" 
                readonly 
                rows="3" 
                class="input-brutal w-full font-mono text-sm"
              />
              <div class="mt-2 flex gap-2">
                <button 
                  class="btn-primary btn-primary-lime text-sm"
                  :class="{ 'animate-copy-bounce': copyingCSS }"
                  @click="copyCSS"
                >
                  Copy CSS
                </button>
                <button
                  class="btn-primary btn-primary-pink text-sm"
                  @click="randomGradient"
                >
                  Random Gradient
                </button>
              </div>
            </div>
          </div>

          <!-- Presets -->
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Popular Presets
            </h2>
            
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div 
                v-for="preset in presets" 
                :key="preset.name"
                class="border-4 border-black cursor-pointer hover:shadow-brutal-lg transition-all"
                :class="{ 'ring-4 ring-brutal-cyan': selectedPreset === preset.name }"
                @click="loadPreset(preset)"
              >
                <div 
                  class="h-16"
                  :style="{ background: preset.gradient }"
                />
                <div class="p-2 bg-white border-t-4 border-black">
                  <div class="font-black text-sm">
                    {{ preset.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="space-y-6">
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Gradient Type
            </h2>
            
            <div class="flex gap-2">
              <button 
                class="btn-primary flex-1"
                :class="gradientType === 'linear' ? 'bg-brutal-cyan' : 'bg-brutal-white'"
                @click="gradientType = 'linear'"
              >
                Linear
              </button>
              <button 
                class="btn-primary flex-1"
                :class="gradientType === 'radial' ? 'bg-brutal-cyan' : 'bg-brutal-white'"
                @click="gradientType = 'radial'"
              >
                Radial
              </button>
            </div>

            <div
              v-if="gradientType === 'linear'"
              class="mt-4"
            >
              <label class="font-black block mb-2">Angle: {{ angle }}°</label>
              <input 
                v-model.number="angle" 
                type="range" 
                min="0" 
                max="360" 
                step="1"
                class="w-full"
              >
              <div class="flex justify-between text-xs mt-1">
                <span>0°</span>
                <span>90°</span>
                <span>180°</span>
                <span>270°</span>
                <span>360°</span>
              </div>
            </div>
          </div>

          <!-- Color Stops -->
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="subheading-brutal">
                Color Stops
              </h2>
              <button 
                class="btn-primary btn-primary-yellow text-sm"
                :disabled="colorStops.length >= 6"
                @click="addColorStop"
              >
                Add Color
              </button>
            </div>

            <div class="space-y-3">
              <div 
                v-for="(stop, index) in colorStops" 
                :key="index"
                class="border-2 border-black p-3 bg-white"
              >
                <div class="flex items-center gap-3">
                  <input 
                    v-model="stop.color" 
                    type="color"
                    class="w-12 h-12 border-2 border-black"
                  >
                  <div class="flex-1">
                    <input 
                      v-model="stop.color" 
                      type="text"
                      class="input-brutal w-full text-sm font-mono"
                      placeholder="#000000"
                    >
                  </div>
                  <button 
                    class="btn-primary btn-primary-pink text-xs"
                    :disabled="colorStops.length <= 2"
                    @click="removeColorStop(index)"
                  >
                    ×
                  </button>
                </div>
                
                <div class="mt-3">
                  <label class="font-black block mb-1 text-sm">Position: {{ stop.position }}%</label>
                  <input 
                    v-model.number="stop.position" 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="1"
                    class="w-full"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Export Options -->
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Export Options
            </h2>
            
            <div class="space-y-3">
              <button 
                class="btn-primary btn-primary-lime w-full"
                :class="{ 'animate-copy-bounce': copyingCSS }"
                @click="copyCSS"
              >
                Copy CSS
              </button>
              
              <button
                class="btn-primary btn-primary-pink w-full"
                @click="downloadCSS"
              >
                Download CSS
              </button>
              
              <button
                class="btn-primary btn-primary-yellow w-full"
                @click="copyAsBackground"
              >
                Copy as Background Property
              </button>
            </div>

            <div class="mt-4 p-3 bg-brutal-lime border-2 border-black">
              <p class="text-sm font-black">
                Tip: Use this gradient as CSS background-image
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { saveAs } from 'file-saver'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'

useHead({
  title: 'Gradient Generator - Free Online Tool',
  meta: [
    { name: 'description', content: 'Create beautiful CSS gradients with color stops, angle control, and presets. Free online gradient generator.' },
    { property: 'og:title', content: 'Gradient Generator' },
    { property: 'og:description', content: 'Create beautiful CSS gradients with color stops, angle control, and presets.' }
  ]
})

const gradientType = ref<'linear' | 'radial'>('linear')
const angle = ref(45)
const colorStops = ref([
  { color: '#ff6b6b', position: 0 },
  { color: '#4ecdc4', position: 100 }
])

const selectedPreset = ref('')

const presets = [
  { name: 'Sunset', gradient: 'linear-gradient(45deg, #ff6b6b, #feca57)' },
  { name: 'Ocean', gradient: 'linear-gradient(45deg, #667eea, #764ba2)' },
  { name: 'Forest', gradient: 'linear-gradient(45deg, #56ab2f, #a8e6cf)' },
  { name: 'Fire', gradient: 'linear-gradient(45deg, #ff4500, #ff6347)' },
  { name: 'Purple Rain', gradient: 'linear-gradient(45deg, #667eea, #764ba2)' },
  { name: 'Tropical', gradient: 'linear-gradient(45deg, #00c9ff, #92fe9d)' },
  { name: 'Candy', gradient: 'linear-gradient(45deg, #ff9a9e, #fecfef)' },
  { name: 'Midnight', gradient: 'linear-gradient(45deg, #232526, #414345)' },
  { name: 'Rose Gold', gradient: 'linear-gradient(45deg, #ffecd2, #fcb69f)' },
  { name: 'Sky', gradient: 'linear-gradient(45deg, #a8edea, #fed6e3)' },
  { name: 'Aurora', gradient: 'linear-gradient(45deg, #d299c2, #fef9d7)' },
  { name: 'Rainbow', gradient: 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff)' }
]

const { copyWithFeedback, isCopying: copyingCSS } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

const gradientCSS = computed(() => {
  if (gradientType.value === 'linear') {
    const stops = colorStops.value
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ')
    return `linear-gradient(${angle.value}deg, ${stops})`
  } else {
    const stops = colorStops.value
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ')
    return `radial-gradient(circle, ${stops})`
  }
})

const addColorStop = () => {
  if (colorStops.value.length >= 6) return
  
  const lastStop = colorStops.value[colorStops.value.length - 1]
  const newPosition = Math.min(lastStop.position + 20, 100)
  const newColor = generateRandomColor()
  
  colorStops.value.push({
    color: newColor,
    position: newPosition
  })
  
  // Sort by position
  colorStops.value.sort((a, b) => a.position - b.position)
}

const removeColorStop = (index: number) => {
  if (colorStops.value.length <= 2) return
  colorStops.value.splice(index, 1)
}

const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

const loadPreset = (preset: typeof presets[0]) => {
  // Parse the preset gradient (simple parsing for common patterns)
  const gradient = preset.gradient
  if (gradient.includes('linear-gradient')) {
    gradientType.value = 'linear'
    const angleMatch = gradient.match(/linear-gradient\((\d+)deg/)
    if (angleMatch) {
      angle.value = parseInt(angleMatch[1])
    }
    
    // Extract colors (simplified)
    const colorMatches = gradient.match(/#[0-9a-fA-F]{6}/g) || []
    colorStops.value = colorMatches.map((color, index) => ({
      color,
      position: (index / (colorMatches.length - 1)) * 100
    }))
  } else if (gradient.includes('radial-gradient')) {
    gradientType.value = 'radial'
    const colorMatches = gradient.match(/#[0-9a-fA-F]{6}/g) || []
    colorStops.value = colorMatches.map((color, index) => ({
      color,
      position: (index / (colorMatches.length - 1)) * 100
    }))
  }
  
  selectedPreset.value = preset.name
  celebrateFirstUse('gradient-generator')
}

const randomGradient = () => {
  gradientType.value = Math.random() > 0.5 ? 'linear' : 'radial'
  angle.value = Math.floor(Math.random() * 360)
  
  const numStops = Math.floor(Math.random() * 3) + 2 // 2-4 stops
  colorStops.value = []
  
  for (let i = 0; i < numStops; i++) {
    colorStops.value.push({
      color: generateRandomColor(),
      position: (i / (numStops - 1)) * 100
    })
  }
  
  selectedPreset.value = ''
}

const copyCSS = async () => {
  await copyWithFeedback(gradientCSS.value)
}

const copyAsBackground = async () => {
  const backgroundCSS = `background: ${gradientCSS.value};`
  await copyWithFeedback(backgroundCSS)
}

const downloadCSS = () => {
  const cssContent = `/* Generated by Gradient Generator */
.gradient {
  background: ${gradientCSS.value};
}`
  const blob = new Blob([cssContent], { type: 'text/css' })
  saveAs(blob, 'gradient.css')
}
</script>

<style scoped>
.input-brutal { @apply w-full p-2 border-4 border-black bg-white dark:bg-brutal-black text-black dark:text-white; }
.btn-primary { @apply px-3 py-2 border-4 border-black shadow-brutal font-black text-center; }
.btn-primary-yellow { @apply bg-brutal-yellow; }
.btn-primary-lime { @apply bg-brutal-lime; }
.btn-primary-pink { @apply bg-brutal-pink; }
.card-brutal-white { @apply bg-brutal-white; }
.card-brutal-black { @apply bg-brutal-black; }
</style>
