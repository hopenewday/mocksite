import { ref, watch, onMounted, onUnmounted } from 'vue'

interface CountUpOptions {
  duration?: number
  startValue?: number
  decimalPlaces?: number
  separator?: string
  prefix?: string
  suffix?: string
  easing?: (t: number) => number
}

export function useCountUp(targetValue: number, options: CountUpOptions = {}) {
  const {
    duration = 1000,
    startValue = 0,
    decimalPlaces = 0,
    separator = ',',
    prefix = '',
    suffix = '',
    easing = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // easeInOutQuad
  } = options

  const currentValue = ref(startValue)
  const displayValue = ref(`${prefix}${startValue}${suffix}`)
  let animationId: number | null = null
  let startTime: number | null = null

  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(decimalPlaces)
    const parts = fixed.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    return parts.join('.')
  }

  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / duration, 1)
    
    const easedProgress = easing(progress)
    const newValue = startValue + (targetValue - startValue) * easedProgress
    
    currentValue.value = newValue
    displayValue.value = `${prefix}${formatNumber(newValue)}${suffix}`

    if (progress < 1) {
      animationId = requestAnimationFrame(animate)
    }
  }

  const start = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    startTime = null
    currentValue.value = startValue
    displayValue.value = `${prefix}${formatNumber(startValue)}${suffix}`
    animationId = requestAnimationFrame(animate)
  }

  const setValue = (value: number) => {
    targetValue = value
    start()
  }

  const stop = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  onMounted(() => {
    start()
  })

  onUnmounted(() => {
    stop()
  })

  return {
    currentValue,
    displayValue,
    start,
    stop,
    setValue
  }
}
