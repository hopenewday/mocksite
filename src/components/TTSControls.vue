<template>
  <div
    class="flex items-center gap-2"
    role="group"
    aria-label="Text to speech controls"
  >
    <button
      class="btn-secondary"
      :aria-pressed="enabled"
      @click="toggle"
    >
      {{ enabled ? 'TTS: On' : 'TTS: Off' }}
    </button>
    <select
      v-model="voiceURI"
      class="select w-48"
      :disabled="!enabled"
      aria-label="Voice"
    >
      <option :value="null">
        Default Voice
      </option>
      <option
        v-for="v in voices"
        :key="v.voiceURI"
        :value="v.voiceURI"
      >
        {{ v.name }}
      </option>
    </select>
    <label class="flex items-center gap-2">
      <span class="text-sm">Rate</span>
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        :disabled="!enabled"
        :value="rate"
        aria-label="Speech rate"
        @input="onRate"
      >
    </label>
    <button
      class="btn-secondary"
      :disabled="!enabled"
      @click="pause"
    >
      Pause
    </button>
    <button
      class="btn-secondary"
      :disabled="!enabled"
      @click="resume"
    >
      Resume
    </button>
    <button
      class="btn-secondary"
      :disabled="!enabled"
      @click="stop"
    >
      Stop
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useTTSStore } from '@/stores/tts'

// Type definition for SpeechSynthesisVoice
interface SpeechSynthesisVoice {
  name: string
  lang: string
  localService: boolean
  voiceURI: string
  default: boolean
}

const tts = useTTSStore()
const enabled = ref(tts.enabled)
const rate = ref(tts.rate)
const voiceURI = ref<string | null>(tts.voiceURI)
const voices = ref<SpeechSynthesisVoice[]>([])

function toggle() { tts.toggle(); enabled.value = tts.enabled }
function pause() { tts.pause() }
function resume() { tts.resume() }
function stop() { tts.stop() }
function onRate(e: Event) { const v = Number((e.target as HTMLInputElement).value); tts.setRate(v); rate.value = tts.rate }

watch(voiceURI, (v) => tts.setVoice(v))

onMounted(() => {
  if (!('speechSynthesis' in window)) return
  const load = () => { voices.value = window.speechSynthesis.getVoices() }
  load()
  window.speechSynthesis.onvoiceschanged = load
})
</script>
