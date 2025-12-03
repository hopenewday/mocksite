<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Color Format Converter
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Input Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Input Color
        </h3>
        
        <div class="space-y-4">
          <!-- Color Picker -->
          <div>
            <label class="font-black mb-2 block">Select Color</label>
            <div class="flex gap-2">
              <input 
                v-model="inputColor"
                type="color"
                class="w-20 h-12 border-2 border-black cursor-pointer"
              >
              <input 
                v-model="inputColor"
                type="text"
                placeholder="#000000"
                class="input flex-1"
              >
            </div>
          </div>
          
          <!-- Format Input -->
          <div>
            <label class="font-black mb-2 block">Or Enter Color Value</label>
            <textarea 
              v-model="formatInput"
              placeholder="Enter color in any format (HEX, RGB, HSL, etc.)"
              class="input w-full h-20 resize-none"
            />
          </div>
          
          <button
            class="btn-primary btn-primary-cyan w-full"
            @click="parseAndConvert"
          >
            Convert Color
          </button>
        </div>
      </div>
      
      <!-- Output Section -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Converted Formats
        </h3>
        
        <div
          v-if="convertedColor"
          class="space-y-3"
        >
          <!-- HEX -->
          <div class="bg-brutal-white border-2 border-black p-3">
            <div class="flex justify-between items-center mb-2">
              <span class="font-black">HEX</span>
              <button
                class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
                @click="copyFormat(convertedColor.hex)"
              >
                Copy
              </button>
            </div>
            <div class="font-mono text-sm bg-brutal-gray p-2 border-2 border-black">
              {{ convertedColor.hex }}
            </div>
          </div>
          
          <!-- RGB -->
          <div class="bg-brutal-white border-2 border-black p-3">
            <div class="flex justify-between items-center mb-2">
              <span class="font-black">RGB</span>
              <button
                class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
                @click="copyFormat(convertedColor.rgb)"
              >
                Copy
              </button>
            </div>
            <div class="font-mono text-sm bg-brutal-gray p-2 border-2 border-black">
              {{ convertedColor.rgb }}
            </div>
          </div>
          
          <!-- RGBA -->
          <div class="bg-brutal-white border-2 border-black p-3">
            <div class="flex justify-between items-center mb-2">
              <span class="font-black">RGBA</span>
              <button
                class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
                @click="copyFormat(convertedColor.rgba)"
              >
                Copy
              </button>
            </div>
            <div class="font-mono text-sm bg-brutal-gray p-2 border-2 border-black">
              {{ convertedColor.rgba }}
            </div>
          </div>
          
          <!-- HSL -->
          <div class="bg-brutal-white border-2 border-black p-3">
            <div class="flex justify-between items-center mb-2">
              <span class="font-black">HSL</span>
              <button
                class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
                @click="copyFormat(convertedColor.hsl)"
              >
                Copy
              </button>
            </div>
            <div class="font-mono text-sm bg-brutal-gray p-2 border-2 border-black">
              {{ convertedColor.hsl }}
            </div>
          </div>
          
          <!-- HSLA -->
          <div class="bg-brutal-white border-2 border-black p-3">
            <div class="flex justify-between items-center mb-2">
              <span class="font-black">HSLA</span>
              <button
                class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
                @click="copyFormat(convertedColor.hsla)"
              >
                Copy
              </button>
            </div>
            <div class="font-mono text-sm bg-brutal-gray p-2 border-2 border-black">
              {{ convertedColor.hsla }}
            </div>
          </div>
        </div>
        
        <div
          v-else
          class="text-center py-8"
        >
          <p class="font-black text-brutal-gray">
            Enter a color to see conversions
          </p>
        </div>
      </div>
    </div>
    
    <!-- Color Preview -->
    <div
      v-if="convertedColor"
      class="bg-brutal-lime border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Color Preview
      </h3>
      
      <div class="grid md:grid-cols-3 gap-4">
        <!-- Solid Preview -->
        <div>
          <h4 class="font-bold mb-2">
            Solid
          </h4>
          <div 
            class="w-full h-24 border-4 border-black"
            :style="{ backgroundColor: convertedColor.hex }"
          />
        </div>
        
        <!-- With Transparency -->
        <div>
          <h4 class="font-bold mb-2">
            With Transparency
          </h4>
          <div class="relative">
            <div class="absolute inset-0 bg-brutal-gray border-4 border-black">
              <div class="grid grid-cols-4 grid-rows-4 h-full">
                <div class="bg-brutal-white" />
                <div class="bg-brutal-gray" />
                <div class="bg-brutal-white" />
                <div class="bg-brutal-gray" />
                <div class="bg-brutal-gray" />
                <div class="bg-brutal-white" />
                <div class="bg-brutal-gray" />
                <div class="bg-brutal-white" />
                <div class="bg-brutal-white" />
                <div class="bg-brutal-gray" />
                <div class="bg-brutal-white" />
                <div class="bg-brutal-gray" />
                <div class="bg-brutal-gray" />
                <div class="bg-brutal-white" />
                <div class="bg-brutal-gray" />
                <div class="bg-brutal-white" />
              </div>
            </div>
            <div 
              class="relative w-full h-24 border-4 border-black"
              :style="{ backgroundColor: convertedColor.rgba }"
            />
          </div>
        </div>
        
        <!-- Text Preview -->
        <div>
          <h4 class="font-bold mb-2">
            Text Preview
          </h4>
          <div class="space-y-2">
            <div 
              class="p-3 border-2 border-black text-center font-black"
              :style="{ backgroundColor: convertedColor.hex, color: getContrastColor(convertedColor.hex) }"
            >
              Sample Text
            </div>
            <div 
              class="p-3 border-2 border-black text-center font-black"
              :style="{ color: convertedColor.hex, backgroundColor: getContrastColor(convertedColor.hex) }"
            >
              Sample Text
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Conversion History -->
    <div class="bg-brutal-pink border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Conversion History
      </h3>
      
      <div class="space-y-3">
        <div 
          v-for="(item, index) in conversionHistory"
          :key="index"
          class="flex items-center justify-between p-3 bg-brutal-white border-2 border-black"
        >
          <div class="flex items-center gap-3">
            <div 
              class="w-8 h-8 border-2 border-black"
              :style="{ backgroundColor: item.hex }"
            />
            <div>
              <p class="font-black text-sm">
                {{ item.hex }}
              </p>
              <p class="text-xs font-bold text-brutal-gray">
                {{ item.timestamp }}
              </p>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button 
              class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
              @click="loadFromHistory(item)"
            >
              Load
            </button>
            <button 
              class="btn-primary btn-primary-pink px-3 py-1 text-xs"
              @click="removeFromHistory(index)"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      
      <button 
        v-if="conversionHistory.length > 0"
        class="btn-primary btn-primary-pink w-full mt-4"
        @click="clearHistory"
      >
        Clear History
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface ConvertedColor {
  hex: string
  rgb: string
  rgba: string
  hsl: string
  hsla: string
}

interface HistoryItem extends ConvertedColor {
  timestamp: string
}

const inputColor = ref('#3B82F6')
const formatInput = ref('')
const convertedColor = ref<ConvertedColor | null>(null)
const conversionHistory = ref<HistoryItem[]>([])

// Watch for color picker changes
watch(inputColor, (newColor) => {
  if (newColor) {
    convertColor(newColor)
  }
})

const parseAndConvert = () => {
  if (formatInput.value) {
    const parsed = parseColor(formatInput.value)
    if (parsed) {
      inputColor.value = parsed
      convertColor(parsed)
    } else {
      alert('Invalid color format')
    }
  }
}

const parseColor = (input: string): string | null => {
  input = input.trim()
  
  // HEX format
  if (input.startsWith('#')) {
    return input
  }
  
  // RGB format
  const rgbMatch = input.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1])
    const g = parseInt(rgbMatch[2])
    const b = parseInt(rgbMatch[3])
    return rgbToHex(r, g, b)
  }
  
  // RGBA format
  const rgbaMatch = input.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/i)
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1])
    const g = parseInt(rgbaMatch[2])
    const b = parseInt(rgbaMatch[3])
    return rgbToHex(r, g, b)
  }
  
  // HSL format
  const hslMatch = input.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/i)
  if (hslMatch) {
    const h = parseInt(hslMatch[1])
    const s = parseInt(hslMatch[2])
    const l = parseInt(hslMatch[3])
    const rgb = hslToRgb(h, s, l)
    return rgbToHex(rgb.r, rgb.g, rgb.b)
  }
  
  // HSLA format
  const hslaMatch = input.match(/hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([\d.]+)\)/i)
  if (hslaMatch) {
    const h = parseInt(hslaMatch[1])
    const s = parseInt(hslaMatch[2])
    const l = parseInt(hslaMatch[3])
    const rgb = hslToRgb(h, s, l)
    return rgbToHex(rgb.r, rgb.g, rgb.b)
  }
  
  // Named colors (basic set)
  const namedColors: Record<string, string> = {
    'red': '#FF0000',
    'green': '#008000',
    'blue': '#0000FF',
    'yellow': '#FFFF00',
    'cyan': '#00FFFF',
    'magenta': '#FF00FF',
    'white': '#FFFFFF',
    'black': '#000000',
    'gray': '#808080',
    'grey': '#808080',
    'orange': '#FFA500',
    'purple': '#800080',
    'pink': '#FFC0CB',
    'brown': '#A52A2A'
  }
  
  const lowerInput = input.toLowerCase()
  if (namedColors[lowerInput]) {
    return namedColors[lowerInput]
  }
  
  return null
}

const convertColor = (hex: string) => {
  const rgb = hexToRgbObject(hex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  
  convertedColor.value = {
    hex: hex.toUpperCase(),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`
  }
  
  addToHistory(convertedColor.value)
}

const hexToRgbObject = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
}

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

const hslToRgb = (h: number, s: number, l: number) => {
  h /= 360
  s /= 100
  l /= 100
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

const getContrastColor = (hex: string) => {
  const rgb = hexToRgbObject(hex)
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

const copyFormat = async (format: string) => {
  try {
    await navigator.clipboard.writeText(format)
  } catch (error) {
    console.error('Failed to copy format:', error)
  }
}

const addToHistory = (color: ConvertedColor) => {
  const historyItem: HistoryItem = {
    ...color,
    timestamp: new Date().toLocaleString()
  }
  
  // Remove duplicates
  conversionHistory.value = conversionHistory.value.filter(
    item => item.hex !== color.hex
  )
  
  conversionHistory.value.unshift(historyItem)
  
  // Keep only last 20 items
  if (conversionHistory.value.length > 20) {
    conversionHistory.value = conversionHistory.value.slice(0, 20)
  }
  
  // Save to localStorage
  localStorage.setItem('colorConversionHistory', JSON.stringify(conversionHistory.value))
}

const loadFromHistory = (item: HistoryItem) => {
  inputColor.value = item.hex
  convertedColor.value = item
}

const removeFromHistory = (index: number) => {
  conversionHistory.value.splice(index, 1)
  localStorage.setItem('colorConversionHistory', JSON.stringify(conversionHistory.value))
}

const clearHistory = () => {
  conversionHistory.value = []
  localStorage.setItem('colorConversionHistory', JSON.stringify(conversionHistory.value))
}

// Load history from localStorage
const loadHistory = () => {
  const saved = localStorage.getItem('colorConversionHistory')
  if (saved) {
    conversionHistory.value = JSON.parse(saved)
  }
}

loadHistory()

// Initialize with default color
convertColor(inputColor.value)
</script>
