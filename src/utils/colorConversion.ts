/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clampR = Math.max(0, Math.min(255, r))
  const clampG = Math.max(0, Math.min(255, g))
  const clampB = Math.max(0, Math.min(255, b))
  return `#${((1 << 24) + (clampR << 16) + (clampG << 8) + clampB).toString(16).slice(1)}`
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

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

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
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

/**
 * Convert RGB to CMYK
 */
export function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  r /= 255
  g /= 255
  b /= 255

  const k = 1 - Math.max(r, g, b)
  const c = k === 0 ? 0 : (1 - r - k) / (1 - k) * 100
  const m = k === 0 ? 0 : (1 - g - k) / (1 - k) * 100
  const y = k === 0 ? 0 : (1 - b - k) / (1 - k) * 100

  return {
    c: Math.round(c),
    m: Math.round(m),
    y: Math.round(y),
    k: Math.round(k * 100)
  }
}

/**
 * Get complementary color
 */
export function getComplementary(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b)
}

/**
 * Get analogous colors
 */
export function getAnalogous(hex: string): string[] {
  const hsl = hexToHsl(hex)
  if (!hsl) return [hex]
  
  return [
    hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
    hex,
    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
  ]
}

/**
 * Get triadic colors
 */
export function getTriadic(hex: string): string[] {
  const hsl = hexToHsl(hex)
  if (!hsl) return [hex]
  
  return [
    hex,
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
  ]
}

/**
 * Get tetradic colors
 */
export function getTetradic(hex: string): string[] {
  const hsl = hexToHsl(hex)
  if (!hsl) return [hex]
  
  return [
    hex,
    hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
  ]
}

/**
 * Get monochromatic colors
 */
export function getMonochromatic(hex: string, count = 5): string[] {
  const hsl = hexToHsl(hex)
  if (!hsl) return []
  
  const colors = []
  for (let i = 0; i < count; i++) {
    const lightness = 20 + (i * 60 / (count - 1))
    colors.push(hslToHex(hsl.h, hsl.s, lightness))
  }
  
  return colors
}

/**
 * Get split-complementary colors
 */
export function getSplitComplementary(hex: string): string[] {
  const hsl = hexToHsl(hex)
  if (!hsl) return [hex]
  
  return [
    hex,
    hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)
  ]
}

// Helper functions
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return rgbToHsl(rgb.r, rgb.g, rgb.b)
}

function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}