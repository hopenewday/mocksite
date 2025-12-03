import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    darkMode: localStorage.getItem('dark') === '1',
    locale: localStorage.getItem('locale') || 'en'
  }),
  actions: {
    toggleDark() {
      this.darkMode = !this.darkMode
      localStorage.setItem('dark', this.darkMode ? '1' : '0')
    },
    setLocale(l: string) {
      this.locale = l
      localStorage.setItem('locale', l)
    }
  }
})