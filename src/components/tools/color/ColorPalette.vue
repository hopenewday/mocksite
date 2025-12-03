<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Color Palette Generator
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Base Color Input -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Base Color
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Select Base Color</label>
            <div class="flex gap-2">
              <input 
                v-model="baseColor"
                type="color"
                class="w-20 h-12 border-2 border-black cursor-pointer"
              >
              <input 
                v-model="baseColor"
                type="text"
                placeholder="#000000"
                class="input flex-1"
              >
            </div>
          </div>
          
          <div>
            <label class="font-black mb-2 block">Palette Type</label>
            <select
              v-model="paletteType"
              class="select"
            >
              <option value="monochromatic">
                Monochromatic
              </option>
              <option value="analogous">
                Analogous
              </option>
              <option value="complementary">
                Complementary
              </option>
              <option value="triadic">
                Triadic
              </option>
              <option value="tetradic">
                Tetradic
              </option>
              <option value="split-complementary">
                Split Complementary
              </option>
            </select>
          </div>
          
          <div>
            <label class="font-black mb-2 block">Number of Colors</label>
            <input 
              v-model.number="colorCount"
              type="range"
              min="3"
              max="12"
              class="w-full mb-2"
            >
            <div class="text-center font-black">
              {{ colorCount }}
            </div>
          </div>
          
          <button
            class="btn-primary btn-primary-lime w-full"
            @click="generatePalette"
          >
            Generate Palette
          </button>
        </div>
      </div>
      
      <!-- Generated Palette -->
      <div class="bg-brutal-yellow border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Generated Palette
        </h3>
        
        <div
          v-if="generatedPalette.length > 0"
          class="space-y-4"
        >
          <div class="grid grid-cols-3 gap-2">
            <div 
              v-for="(color, index) in generatedPalette"
              :key="index"
              class="aspect-square border-2 border-black cursor-pointer transform transition-all duration-200 hover:scale-110"
              :style="{ backgroundColor: color }"
              :title="color"
              @click="selectColor(color)"
            />
          </div>
          
          <div class="text-center">
            <p class="font-black text-sm mb-2">
              {{ paletteType }} Palette
            </p>
            <p class="text-xs font-bold text-brutal-gray">
              {{ colorCount }} colors
            </p>
          </div>
        </div>
        
        <div
          v-else
          class="text-center py-8"
        >
          <p class="font-black text-brutal-gray">
            Generate a palette to see colors
          </p>
        </div>
      </div>
    </div>
    
    <!-- Color Details -->
    <div
      v-if="generatedPalette.length > 0"
      class="bg-brutal-lime border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Color Details
      </h3>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="(color, index) in generatedPalette"
          :key="index"
          class="bg-brutal-white border-2 border-black p-4"
        >
          <div class="flex items-center gap-3 mb-3">
            <div 
              class="w-12 h-12 border-2 border-black"
              :style="{ backgroundColor: color }"
            />
            <div>
              <p class="font-black text-sm">
                {{ color }}
              </p>
              <p class="text-xs font-bold text-brutal-gray">
                Color {{ index + 1 }}
              </p>
            </div>
          </div>
          
          <div class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="font-bold">RGB:</span>
              <span class="font-black">{{ hexToRgb(color) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">HSL:</span>
              <span class="font-black">{{ hexToHsl(color) }}</span>
            </div>
          </div>
          
          <button 
            class="btn-primary btn-primary-cyan w-full mt-3 text-xs"
            @click="copyColor(color)"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
    
    <!-- Preset Palettes -->
    <div class="bg-brutal-pink border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Preset Palettes
      </h3>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="palette in presetPalettes"
          :key="palette.name"
          class="bg-brutal-white border-2 border-black p-4 cursor-pointer transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="applyPreset(palette)"
        >
          <h4 class="font-black text-sm mb-2">
            {{ palette.name }}
          </h4>
          <div class="grid grid-cols-6 gap-1 mb-2">
            <div 
              v-for="color in palette.colors"
              :key="color"
              class="aspect-square border border-black"
              :style="{ backgroundColor: color }"
              :title="color"
            />
          </div>
          <p class="text-xs font-bold text-brutal-gray">
            {{ palette.description }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Export Options -->
    <div
      v-if="generatedPalette.length > 0"
      class="bg-brutal-cyan border-4 border-black p-6"
    >
      <h3 class="font-black text-lg mb-4">
        Export Palette
      </h3>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          class="btn-primary btn-primary-cyan"
          @click="exportAsCSS"
        >
          Export as CSS
        </button>
        
        <button
          class="btn-primary btn-primary-lime"
          @click="exportAsJSON"
        >
          Export as JSON
        </button>
        
        <button
          class="btn-primary btn-primary-yellow"
          @click="exportAsSCSS"
        >
          Export as SCSS
        </button>
        
        <button
          class="btn-primary btn-primary-pink"
          @click="exportAsURL"
        >
          Export as URL
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface PresetPalette {
  name: string
  description: string
  colors: string[]
}

const baseColor = ref('#3B82F6')
const paletteType = ref('monochromatic')
const colorCount = ref(6)
const generatedPalette = ref<string[]>([])

const presetPalettes: PresetPalette[] = [
  {
    name: 'Ocean Blues',
    description: 'Calming blue tones',
    colors: ['#0077BE', '#00A8E8', '#00C9FF', '#00E5FF', '#7FDBFF', '#B4E7FF']
  },
  {
    name: 'Sunset',
    description: 'Warm sunset colors',
    colors: ['#FF6B6B', '#FF8E53', '#FFB347', '#FFD93D', '#FCE38A', '#F38181']
  },
  {
    name: 'Forest',
    description: 'Natural green tones',
    colors: ['#2D5016', '#3A5F0B', '#4C7C0F', '#6FA321', '#8BC34A', '#A8D5A8']
  },
  {
    name: 'Royal Purple',
    description: 'Elegant purple shades',
    colors: ['#4A148C', '#6A1B9A', '#7B1FA2', '#8E24AA', '#9C27B0', '#AB47BC']
  },
  {
    name: 'Monochrome',
    description: 'Classic grayscale',
    colors: ['#212121', '#424242', '#616161', '#757575', '#9E9E9E', '#BDBDBD']
  },
  {
    name: 'Coral Reef',
    description: 'Vibrant tropical colors',
    colors: ['#FF6F61', '#FF8A65', '#FFAB91', '#FFCCBC', '#FBE9E7', '#FFEBEE']
  }
]

const generatePalette = () => {
  switch (paletteType.value) {
    case 'monochromatic':
      generatedPalette.value = generateMonochromatic(baseColor.value, colorCount.value)
      break
    case 'analogous':
      generatedPalette.value = generateAnalogous(baseColor.value, colorCount.value)
      break
    case 'complementary':
      generatedPalette.value = generateComplementary(baseColor.value, colorCount.value)
      break
    case 'triadic':
      generatedPalette.value = generateTriadic(baseColor.value, colorCount.value)
      break
    case 'tetradic':
      generatedPalette.value = generateTetradic(baseColor.value, colorCount.value)
      break
    case 'split-complementary':
      generatedPalette.value = generateSplitComplementary(baseColor.value, colorCount.value)
      break
  }
}

const generateMonochromatic = (base: string, count: number): string[] => {
  const rgb = hexToRgbObject(base)
  const colors = []
  
  for (let i = 0; i < count; i++) {
    const factor = 0.2 + (i * 0.6 / (count - 1))
    const newRgb = {
      r: Math.round(rgb.r * factor),
      g: Math.round(rgb.g * factor),
      b: Math.round(rgb.b * factor)
    }
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
  }
  
  return colors
}

const generateAnalogous = (base: string, count: number): string[] => {
  const hsl = hexToHslObject(base)
  const colors = []
  
  for (let i = 0; i < count; i++) {
    const hue = (hsl.h + (i - Math.floor(count / 2)) * 30 + 360) % 360
    const rgb = hslToRgb(hue, hsl.s, hsl.l)
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }
  
  return colors
}

const generateComplementary = (base: string, count: number): string[] => {
  const hsl = hexToHslObject(base)
  const colors = []
  
  for (let i = 0; i < count; i++) {
    const hue = i % 2 === 0 ? hsl.h : (hsl.h + 180) % 360
    const lightness = hsl.l + (i - Math.floor(count / 2)) * 10
    const rgb = hslToRgb(hue, hsl.s, Math.max(0, Math.min(100, lightness)))
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }
  
  return colors
}

const generateTriadic = (base: string, count: number): string[] => {
  const hsl = hexToHslObject(base)
  const colors = []
  
  for (let i = 0; i < count; i++) {
    const hue = (hsl.h + (i * 120)) % 360
    const rgb = hslToRgb(hue, hsl.s, hsl.l)
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }
  
  return colors.slice(0, count)
}

const generateTetradic = (base: string, count: number): string[] => {
  const hsl = hexToHslObject(base)
  const colors = []
  
  for (let i = 0; i < count; i++) {
    const hue = (hsl.h + (i * 90)) % 360
    const rgb = hslToRgb(hue, hsl.s, hsl.l)
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }
  
  return colors.slice(0, count)
}

const generateSplitComplementary = (base: string, count: number): string[] => {
  const hsl = hexToHslObject(base)
  const colors = []
  
  for (let i = 0; i < count; i++) {
    let hue
    if (i === 0) {
      hue = hsl.h
    } else if (i % 2 === 1) {
      hue = (hsl.h + 150) % 360
    } else {
      hue = (hsl.h + 210) % 360
    }
    
    const rgb = hslToRgb(hue, hsl.s, hsl.l)
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }
  
  return colors.slice(0, count)
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

const hexToHslObject = (hex: string) => {
  const rgb = hexToRgbObject(hex)
  return rgbToHsl(rgb.r, rgb.g, rgb.b)
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

const hexToRgb = (hex: string) => {
  const rgb = hexToRgbObject(hex)
  return `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const hexToHsl = (hex: string) => {
  const hsl = hexToHslObject(hex)
  return `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`
}

const selectColor = (color: string) => {
  baseColor.value = color
  generatePalette()
}

const copyColor = async (color: string) => {
  try {
    await navigator.clipboard.writeText(color)
  } catch (error) {
    console.error('Failed to copy color:', error)
  }
}

const applyPreset = (palette: PresetPalette) => {
  baseColor.value = palette.colors[0]
  generatedPalette.value = palette.colors
}

const exportAsCSS = () => {
  let css = ':root {\n'
  generatedPalette.value.forEach((color, index) => {
    css += `  --color-${index + 1}: ${color};\n`
  })
  css += '}'
  
  downloadFile(css, 'palette.css', 'text/css')
}

const exportAsJSON = () => {
  const json = JSON.stringify({
    name: `${paletteType.value} Palette`,
    colors: generatedPalette.value,
    baseColor: baseColor.value,
    type: paletteType.value
  }, null, 2)
  
  downloadFile(json, 'palette.json', 'application/json')
}

const exportAsSCSS = () => {
  let scss = '$colors: (\n'
  generatedPalette.value.forEach((color, index) => {
    scss += `  'color-${index + 1}': ${color},\n`
  })
  scss += ');'
  
  downloadFile(scss, 'palette.scss', 'text/x-scss')
}

const exportAsURL = () => {
  const params = new URLSearchParams({
    colors: generatedPalette.value.join(','),
    base: baseColor.value,
    type: paletteType.value
  })
  
  const url = `${window.location.origin}/palette?${params.toString()}`
  navigator.clipboard.writeText(url)
}

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>
