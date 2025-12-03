import { gsap } from 'gsap'
import { useReducedMotion } from './useReducedMotion'

export function useConfetti() {
  const { prefersReducedMotion } = useReducedMotion()

  const triggerConfetti = (containerId = 'gsap-confetti', particleCount = 60) => {
    // Respect user's motion preferences
    if (prefersReducedMotion.value) return

    const container = document.getElementById(containerId)
    if (!container) return

    const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444']

    for (let i = 0; i < particleCount; i++) {
      const dot = document.createElement('div')
      dot.style.position = 'absolute'
      dot.style.width = '8px'
      dot.style.height = '8px'
      dot.style.borderRadius = '50%'
      dot.style.background = colors[i % colors.length]
      dot.style.pointerEvents = 'none'
      container.appendChild(dot)

      gsap.set(dot, { x: window.innerWidth / 2, y: 0 })
      gsap.to(dot, {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        duration: 2 + Math.random(),
        ease: 'power2.in',
        rotate: Math.random() * 360
      })
    }

    // Cleanup after animation
    setTimeout(() => {
      container.innerHTML = ''
    }, 4000)
  }

  return {
    triggerConfetti
  }
}
