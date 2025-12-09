import { defineStore } from 'pinia'

// Helper to apply dark class to HTML element
const applyDarkMode = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const useSettingsStore = defineStore('settings', {
  state: () => {
    const isDark = localStorage.getItem('dark') === '1'
    // Apply on initial load
    applyDarkMode(isDark)
    return {
      darkMode: isDark,
      locale: localStorage.getItem('locale') || 'en'
    }
  },
  actions: {
    toggleDark() {
      this.darkMode = !this.darkMode
      localStorage.setItem('dark', this.darkMode ? '1' : '0')
      applyDarkMode(this.darkMode)
    },
    setLocale(l: string) {
      this.locale = l
      localStorage.setItem('locale', l)
    }
  }
})