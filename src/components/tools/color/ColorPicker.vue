<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">
      Color Picker
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Color Input Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Select Color
        </h3>
        
        <div class="space-y-4">
          <!-- Color Picker Input -->
          <div>
            <label class="font-black mb-2 block">Choose Color</label>
            <div class="flex gap-2">
              <input 
                v-model="hexColor"
                type="color"
                class="w-20 h-12 border-2 border-black cursor-pointer"
              >
              <input 
                v-model="hexColor"
                type="text"
                placeholder="#000000"
                class="input flex-1"
              >
            </div>
          </div>
          
          <!-- RGB Sliders -->
          <div>
            <label class="font-black mb-2 block">RGB Values</label>
            
            <div class="space-y-3">
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="font-black text-sm">Red</span>
                  <span class="font-black text-sm">{{ rgbValues.r }}</span>
                </div>
                <input 
                  v-model.number="rgbValues.r"
                  type="range"
                  min="0"
                  max="255"
                  class="w-full"
                >
              </div>
              
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="font-black text-sm">Green</span>
                  <span class="font-black text-sm">{{ rgbValues.g }}</span>
                </div>
                <input 
                  v-model.number="rgbValues.g"
                  type="range"
                  min="0"
                  max="255"
                  class="w-full"
                >
              </div>
              
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="font-black text-sm">Blue</span>
                  <span class="font-black text-sm">{{ rgbValues.b }}</span>
                </div>
                <input 
                  v-model.number="rgbValues.b"
                  type="range"
                  min="0"
                  max="255"
                  class="w-full"
                >
              </div>
            </div>
          </div>
          
          <!-- HSL Values -->
          <div>
            <label class="font-black mb-2 block">HSL Values</label>
            
            <div class="space-y-3">
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="font-black text-sm">Hue</span>
                  <span class="font-black text-sm">{{ hslValues.h }}°</span>
                </div>
                <input 
                  v-model.number="hslValues.h"
                  type="range"
                  min="0"
                  max="360"
                  class="w-full"
                >
              </div>
              
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="font-black text-sm">Saturation</span>
                  <span class="font-black text-sm">{{ hslValues.s }}%</span>
                </div>
                <input 
                  v-model.number="hslValues.s"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full"
                >
              </div>
              
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="font-black text-sm">Lightness</span>
                  <span class="font-black text-sm">{{ hslValues.l }}%</span>
                </div>
                <input 
                  v-model.number="hslValues.l"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Color Preview Section -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Color Preview
        </h3>
        
        <div class="space-y-4">
          <!-- Large Preview -->
          <div 
            class="w-full h-32 border-4 border-black"
            :style="{ backgroundColor: hexColor }"
          />
          
          <!-- Color Values -->
          <div class="space-y-2">
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">HEX</span>
              <div class="flex items-center gap-2">
                <span class="font-black text-sm">{{ hexColor }}</span>
                <button
                  class="btn-primary btn-primary-cyan px-2 py-1 text-xs"
                  @click="copyToClipboard(hexColor)"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">RGB</span>
              <div class="flex items-center gap-2">
                <span class="font-black text-sm">{{ rgbString }}</span>
                <button
                  class="btn-primary btn-primary-cyan px-2 py-1 text-xs"
                  @click="copyToClipboard(rgbString)"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">HSL</span>
              <div class="flex items-center gap-2">
                <span class="font-black text-sm">{{ hslString }}</span>
                <button
                  class="btn-primary btn-primary-cyan px-2 py-1 text-xs"
                  @click="copyToClipboard(hslString)"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Color Palette -->
    <div class="bg-brutal-yellow border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Quick Color Palette
      </h3>
      
      <div class="grid grid-cols-8 md:grid-cols-12 gap-2">
        <div 
          v-for="color in presetColors"
          :key="color"
          class="aspect-square border-2 border-black cursor-pointer transform transition-all duration-200 hover:scale-110"
          :style="{ backgroundColor: color }"
          :title="color"
          @click="selectColor(color)"
        />
      </div>
    </div>
    
    <!-- Color Variations -->
    <div class="bg-brutal-pink border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Color Variations
      </h3>
      
      <div class="space-y-4">
        <!-- Lighter Shades -->
        <div>
          <h4 class="font-bold mb-2">
            Lighter Shades
          </h4>
          <div class="flex gap-2">
            <div 
              v-for="shade in lighterShades"
              :key="shade"
              class="w-16 h-16 border-2 border-black cursor-pointer transform transition-all duration-200 hover:scale-110"
              :style="{ backgroundColor: shade }"
              :title="shade"
              @click="selectColor(shade)"
            />
          </div>
        </div>
        
        <!-- Darker Shades -->
        <div>
          <h4 class="font-bold mb-2">
            Darker Shades
          </h4>
          <div class="flex gap-2">
            <div 
              v-for="shade in darkerShades"
              :key="shade"
              class="w-16 h-16 border-2 border-black cursor-pointer transform transition-all duration-200 hover:scale-110"
              :style="{ backgroundColor: shade }"
              :title="shade"
              @click="selectColor(shade)"
            />
          </div>
        </div>
        
        <!-- Complementary Colors -->
        <div>
          <h4 class="font-bold mb-2">
            Complementary Colors
          </h4>
          <div class="flex gap-2">
            <div 
              v-for="color in complementaryColors"
              :key="color"
              class="w-16 h-16 border-2 border-black cursor-pointer transform transition-all duration-200 hover:scale-110"
              :style="{ backgroundColor: color }"
              :title="color"
              @click="selectColor(color)"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Saved Colors -->
    <div class="bg-brutal-lime border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Saved Colors
      </h3>
      
      <div class="space-y-3">
        <div 
          v-for="(color, index) in savedColors"
          :key="index"
          class="flex items-center justify-between p-3 bg-brutal-white border-2 border-black"
        >
          <div class="flex items-center gap-3">
            <div 
              class="w-8 h-8 border-2 border-black"
              :style="{ backgroundColor: color }"
            />
            <span class="font-black text-sm">{{ color }}</span>
          </div>
          
          <div class="flex gap-2">
            <button 
              class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
              @click="selectColor(color)"
            >
              Use
            </button>
            <button 
              class="btn-primary btn-primary-pink px-3 py-1 text-xs"
              @click="removeSavedColor(index)"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      
      <div class="flex gap-2 mt-4">
        <button
          class="btn-primary btn-primary-cyan flex-1"
          @click="saveCurrentColor"
        >
          Save Current Color
        </button>
        <button
          class="btn-primary btn-primary-pink"
          @click="clearSavedColors"
        >
          Clear All
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'

const hexColor = ref('#3B82F6')
const rgbValues = ref({ r: 59, g: 130, b: 246 })
const hslValues = ref({ h: 217, s: 91, l: 60 })
const savedColors = ref<string[]>([])

// Copy feedback
const { isCopying: copyingColor, copyWithFeedback: copyColorFeedback } = useCopyFeedback()

const presetColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080',
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E2', '#F8B739', '#52D681', '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9'
]

const rgbString = computed(() => {
  return `rgb(${rgbValues.value.r}, ${rgbValues.value.g}, ${rgbValues.value.b})`
})

const hslString = computed(() => {
  return `hsl(${hslValues.value.h}, ${hslValues.value.s}%, ${hslValues.value.l}%)`
})

const lighterShades = computed(() => {
  return generateShades(hexColor.value, 'lighter')
})

const darkerShades = computed(() => {
  return generateShades(hexColor.value, 'darker')
})

const complementaryColors = computed(() => {
  return generateComplementaryColors(hexColor.value)
})

// Watch for hex color changes
watch(hexColor, (newHex) => {
  const rgb = hexToRgb(newHex)
  if (rgb) {
    rgbValues.value = rgb
    hslValues.value = rgbToHsl(rgb.r, rgb.g, rgb.b)
  }
})

// Watch for RGB changes
watch(rgbValues, (newRgb) => {
  hexColor.value = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
  hslValues.value = rgbToHsl(newRgb.r, newRgb.g, newRgb.b)
}, { deep: true })

// Watch for HSL changes
watch(hslValues, (newHsl) => {
  const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
  rgbValues.value = rgb
  hexColor.value = rgbToHex(rgb.r, rgb.g, rgb.b)
}, { deep: true })

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
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

const generateShades = (hex: string, type: 'lighter' | 'darker') => {
  const rgb = hexToRgb(hex)
  if (!rgb) return []
  
  const shades = []
  
  for (let i = 1; i <= 5; i++) {
    const multiplier = type === 'lighter' ? 1 + (i * 0.1) : 1 - (i * 0.1)
    const newRgb = {
      r: Math.min(255, Math.max(0, Math.round(rgb.r * multiplier))),
      g: Math.min(255, Math.max(0, Math.round(rgb.g * multiplier))),
      b: Math.min(255, Math.max(0, Math.round(rgb.b * multiplier)))
    }
    shades.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
  }
  
  return type === 'lighter' ? shades.reverse() : shades
}

const generateComplementaryColors = (hex: string) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return []
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  
  // Complementary color (opposite on color wheel)
  const compHue = (hsl.h + 180) % 360
  const compRgb = hslToRgb(compHue, hsl.s, hsl.l)
  const complementary = rgbToHex(compRgb.r, compRgb.g, compRgb.b)
  
  // Triadic colors
  const triadic1Hue = (hsl.h + 120) % 360
  const triadic1Rgb = hslToRgb(triadic1Hue, hsl.s, hsl.l)
  const triadic1 = rgbToHex(triadic1Rgb.r, triadic1Rgb.g, triadic1Rgb.b)
  
  const triadic2Hue = (hsl.h + 240) % 360
  const triadic2Rgb = hslToRgb(triadic2Hue, hsl.s, hsl.l)
  const triadic2 = rgbToHex(triadic2Rgb.r, triadic2Rgb.g, triadic2Rgb.b)
  
  return [hex, complementary, triadic1, triadic2]
}

const selectColor = (color: string) => {
  hexColor.value = color
}

const copyToClipboard = async (text: string) => {
  await copyColorFeedback(text, 'Copied!')
}

const saveCurrentColor = () => {
  if (!savedColors.value.includes(hexColor.value)) {
    savedColors.value.push(hexColor.value)
    if (savedColors.value.length > 20) {
      savedColors.value = savedColors.value.slice(0, 20)
    }
    localStorage.setItem('savedColors', JSON.stringify(savedColors.value))
  }
}

const removeSavedColor = (index: number) => {
  savedColors.value.splice(index, 1)
  localStorage.setItem('savedColors', JSON.stringify(savedColors.value))
}

const clearSavedColors = () => {
  savedColors.value = []
  localStorage.setItem('savedColors', JSON.stringify(savedColors.value))
}

// Load saved colors on mount
const loadSavedColors = () => {
  const saved = localStorage.getItem('savedColors')
  if (saved) {
    savedColors.value = JSON.parse(saved)
  }
}

loadSavedColors()
</script>
