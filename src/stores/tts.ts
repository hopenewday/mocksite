import { defineStore } from 'pinia'

type TTSState = {
  enabled: boolean
  speaking: boolean
  voiceURI: string | null
  rate: number
  lastText: string
}

export const useTTSStore = defineStore('tts', {
  state: (): TTSState => ({ enabled: false, speaking: false, voiceURI: null, rate: 1, lastText: '' }),
  actions: {
    toggle() { this.enabled = !this.enabled; if (!this.enabled) this.stop() },
    setRate(r: number) { this.rate = Math.max(0.5, Math.min(2, r)) },
    setVoice(uri: string | null) { this.voiceURI = uri },
    speak(text: string) {
      this.lastText = text
      if (!('speechSynthesis' in window)) return
      window.speechSynthesis.cancel()
      /* eslint-disable no-undef */
      const u = new SpeechSynthesisUtterance(text)
      u.rate = this.rate
      if (this.voiceURI) {
        const v = window.speechSynthesis.getVoices().find(x => x.voiceURI === this.voiceURI)
        if (v) u.voice = v
      }
      u.onstart = () => { this.speaking = true }
      u.onend = () => { this.speaking = false }
      window.speechSynthesis.speak(u)
    },
    pause() { if ('speechSynthesis' in window) window.speechSynthesis.pause() },
    resume() { if ('speechSynthesis' in window) window.speechSynthesis.resume() },
    stop() { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); this.speaking = false } }
  }
})
