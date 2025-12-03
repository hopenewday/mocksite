import { createI18n } from 'vue-i18n'
import en from '@/i18n/en.json'
import hi from '@/i18n/hi.json'

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: { en, hi }
})