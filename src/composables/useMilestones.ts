import { ref, onMounted } from 'vue'
import { useConfetti } from './useConfetti'

interface MilestoneState {
  firstUse: Record<string, boolean>
  confettiEnabled: boolean
}

const STORAGE_KEY = 'app-milestones'

export function useMilestones() {
  const { triggerConfetti } = useConfetti()
  const milestoneState = ref<MilestoneState>({
    firstUse: {},
    confettiEnabled: true
  })

  // Load milestone state from localStorage
  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        milestoneState.value = JSON.parse(stored)
      } catch (error) {
        console.error('Failed to load milestone state:', error)
      }
    }
  })

  const saveMilestoneState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(milestoneState.value))
  }

  const checkFirstUse = (toolName: string): boolean => {
    return !milestoneState.value.firstUse[toolName]
  }

  const markFirstUse = (toolName: string) => {
    if (!milestoneState.value.firstUse[toolName]) {
      milestoneState.value.firstUse[toolName] = true
      saveMilestoneState()
    }
  }

  const celebrateFirstUse = (toolName: string) => {
    if (checkFirstUse(toolName) && milestoneState.value.confettiEnabled) {
      markFirstUse(toolName)
      triggerConfetti()
    }
  }

  const celebrateLargeOperation = (fileCount: number, threshold = 10) => {
    if (fileCount >= threshold && milestoneState.value.confettiEnabled) {
      triggerConfetti()
    }
  }

  const celebrateCompressionSavings = (savingsPercent: number, threshold = 50) => {
    if (savingsPercent >= threshold && milestoneState.value.confettiEnabled) {
      triggerConfetti()
    }
  }

  const celebrateComplexOperation = () => {
    if (milestoneState.value.confettiEnabled) {
      triggerConfetti()
    }
  }

  const toggleConfetti = (enabled: boolean) => {
    milestoneState.value.confettiEnabled = enabled
    saveMilestoneState()
  }

  const resetMilestones = () => {
    milestoneState.value.firstUse = {}
    saveMilestoneState()
  }

  return {
    milestoneState,
    checkFirstUse,
    markFirstUse,
    celebrateFirstUse,
    celebrateLargeOperation,
    celebrateCompressionSavings,
    celebrateComplexOperation,
    toggleConfetti,
    resetMilestones
  }
}
