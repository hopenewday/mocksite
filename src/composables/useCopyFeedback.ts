import { ref } from 'vue'

export function useCopyFeedback() {
  const isCopying = ref(false)
  const showTooltip = ref(false)
  const tooltipText = ref('Copy to clipboard')

  const copyWithFeedback = async (text: string, customMessage = 'Copied!') => {
    if (!text || isCopying.value) return false

    isCopying.value = true
    tooltipText.value = customMessage

    try {
      await navigator.clipboard.writeText(text)
      showTooltip.value = true
      
      // Reset after 1200ms
      setTimeout(() => {
        isCopying.value = false
        showTooltip.value = false
        tooltipText.value = 'Copy to clipboard'
      }, 1200)
      
      return true
    } catch (error) {
      console.error('Failed to copy:', error)
      tooltipText.value = 'Failed to copy'
      showTooltip.value = true
      
      setTimeout(() => {
        isCopying.value = false
        showTooltip.value = false
        tooltipText.value = 'Copy to clipboard'
      }, 1200)
      
      return false
    }
  }

  return {
    isCopying,
    showTooltip,
    tooltipText,
    copyWithFeedback
  }
}
