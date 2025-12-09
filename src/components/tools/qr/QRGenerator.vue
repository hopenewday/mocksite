<template>
  <div class="card card-brutal-purple p-8">
    <h2 class="subheading-brutal mb-6">
      QR Code Generator
    </h2>

    <div class="space-y-6">
      <!-- Content Input -->
      <div>
        <label class="font-black mb-2 block">Content</label>
        <div class="space-y-2">
          <select
            v-model="contentType"
            class="select"
          >
            <option value="text">
              Plain Text
            </option>
            <option value="url">
              URL
            </option>
            <option value="email">
              Email
            </option>
            <option value="phone">
              Phone
            </option>
            <option value="wifi">
              WiFi
            </option>
            <option value="sms">
              SMS
            </option>
          </select>

          <!-- URL Input -->
          <input
            v-if="contentType === 'url'"
            v-model="content.url"
            type="url"
            placeholder="https://example.com"
            class="input w-full"
          >

          <!-- Plain Text Input -->
          <textarea
            v-else-if="contentType === 'text'"
            v-model="content.text"
            placeholder="Enter your text here..."
            class="input w-full h-32 resize-none"
          />

          <!-- Email Input -->
          <div
            v-else-if="contentType === 'email'"
            class="space-y-2"
          >
            <input
              v-model="content.email"
              type="email"
              placeholder="email@example.com"
              class="input w-full"
            >
            <input
              v-model="content.subject"
              type="text"
              placeholder="Subject (optional)"
              class="input w-full"
            >
            <textarea
              v-model="content.body"
              placeholder="Message (optional)"
              class="input w-full h-24 resize-none"
            />
          </div>

          <!-- Phone Input -->
          <input
            v-else-if="contentType === 'phone'"
            v-model="content.phone"
            type="tel"
            placeholder="+1234567890"
            class="input w-full"
          >

          <!-- WiFi Input -->
          <div
            v-else-if="contentType === 'wifi'"
            class="space-y-2"
          >
            <input
              v-model="content.ssid"
              type="text"
              placeholder="Network Name (SSID)"
              class="input w-full"
            >
            <input
              v-model="content.password"
              type="password"
              placeholder="Password"
              class="input w-full"
            >
            <select
              v-model="content.encryption"
              class="select"
            >
              <option value="WPA">
                WPA/WPA2
              </option>
              <option value="WEP">
                WEP
              </option>
              <option value="nopass">
                No Password
              </option>
            </select>
          </div>

          <!-- SMS Input -->
          <div
            v-else-if="contentType === 'sms'"
            class="space-y-2"
          >
            <input
              v-model="content.phone"
              type="tel"
              placeholder="+1234567890"
              class="input w-full"
            >
            <textarea
              v-model="content.message"
              placeholder="SMS Message"
              class="input w-full h-24 resize-none"
            />
          </div>
        </div>
      </div>

      <!-- QR Code Options -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          QR Code Options
        </h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="font-black mb-2 block">Size</label>
            <select
              v-model="options.size"
              class="select"
            >
              <option :value="128">
                Small (128px)
              </option>
              <option :value="256">
                Medium (256px)
              </option>
              <option :value="512">
                Large (512px)
              </option>
              <option :value="1024">
                Extra Large (1024px)
              </option>
            </select>
          </div>

          <div>
            <label class="font-black mb-2 block">Error Correction</label>
            <select
              v-model="options.errorCorrection"
              class="select"
            >
              <option value="L">
                Low (7%)
              </option>
              <option value="M">
                Medium (15%)
              </option>
              <option value="Q">
                Quartile (25%)
              </option>
              <option value="H">
                High (30%)
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <button
        :disabled="!hasContent || isGenerating"
        class="btn-primary btn-primary-cyan w-full disabled:opacity-50"
        @click="generateQR"
      >
        <span v-if="isGenerating">Generating...</span>
        <span v-else>Generate QR Code</span>
      </button>

      <!-- QR Code Display -->
      <div
        v-if="qrCodeDataUrl"
        class="bg-brutal-yellow border-4 border-black p-6 text-center"
      >
        <h3 class="font-black text-lg mb-4">
          Your QR Code
        </h3>
        <div class="inline-block p-4 bg-white border-4 border-black">
          <img
            :src="qrCodeDataUrl"
            :alt="'QR Code for ' + contentType"
            class="max-w-full"
          >
        </div>

        <div class="mt-4 flex gap-4 justify-center">
          <button
            class="btn-primary btn-primary-pink"
            @click="downloadQR"
          >
            Download PNG
          </button>

          <button
            class="btn-primary btn-primary-lime"
            :class="{ 'animate-copy-bounce': copyingImage }"
            :data-state="copyingImage ? 'success' : null"
            @click="copyToClipboard"
          >
            <span v-if="copyingImage">Copied!</span>
            <span v-else>Copy Image</span>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="p-4 bg-brutal-pink/20 border-4 border-brutal-pink"
      >
        <p class="font-black text-brutal-pink">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import QRCode from 'qrcode'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'

useHead({
  title: 'QR Code Generator',
  meta: [
    { name: 'description', content: 'Generate QR codes for text, URLs, WiFi, email, phone and more.' },
    { property: 'og:title', content: 'QR Code Generator' },
    { property: 'og:description', content: 'Generate QR codes for text, URLs, WiFi, email, phone and more.' }
  ]
})

const contentType = ref('text')
const isGenerating = ref(false)
const qrCodeDataUrl = ref('')
const error = ref('')

// Copy feedback
const { isCopying: copyingImage, copyWithFeedback: copyImageFeedback } = useCopyFeedback()

const content = ref({
  text: '',
  url: '',
  email: '',
  subject: '',
  body: '',
  phone: '',
  ssid: '',
  password: '',
  encryption: 'WPA',
  message: ''
})

const options = ref({
  size: 256,
  errorCorrection: 'M'
})

const hasContent = computed(() => {
  switch (contentType.value) {
    case 'text':
      return content.value.text.trim() !== ''
    case 'url':
      return content.value.url.trim() !== ''
    case 'email':
      return content.value.email.trim() !== ''
    case 'phone':
      return content.value.phone.trim() !== ''
    case 'wifi':
      return content.value.ssid.trim() !== ''
    case 'sms':
      return content.value.phone.trim() !== ''
    default:
      return false
  }
})

const formatContent = (): string => {
  switch (contentType.value) {
    case 'text':
      return content.value.text
    case 'url':
      return content.value.url
    case 'email': {
      let email = `mailto:${content.value.email}`
      if (content.value.subject || content.value.body) {
        email += '?'
        const params: string[] = []
        if (content.value.subject) params.push(`subject=${encodeURIComponent(content.value.subject)}`)
        if (content.value.body) params.push(`body=${encodeURIComponent(content.value.body)}`)
        email += params.join('&')
      }
      return email
    }
    case 'phone':
      return `tel:${content.value.phone}`
    case 'wifi': {
      const wifi = `WIFI:T:${content.value.encryption};S:${content.value.ssid};P:${content.value.password};;`
      return wifi
    }
    case 'sms':
      return `sms:${content.value.phone}?body=${encodeURIComponent(content.value.message)}`
    default:
      return ''
  }
}

const generateQR = async () => {
  if (!hasContent.value) return

  isGenerating.value = true
  error.value = ''

  try {
    const qrData = formatContent()
    qrCodeDataUrl.value = await QRCode.toDataURL(qrData, {
      width: options.value.size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: options.value.errorCorrection
    })
  } catch (err) {
    error.value = 'Failed to generate QR code. Please try again.'
    console.error('QR generation error:', err)
  } finally {
    isGenerating.value = false
  }
}

const downloadQR = () => {
  if (!qrCodeDataUrl.value) return

  const link = document.createElement('a')
  link.download = `qr-code-${contentType.value}-${Date.now()}.png`
  link.href = qrCodeDataUrl.value
  link.click()
}

const copyToClipboard = async () => {
  if (!qrCodeDataUrl.value) return

  try {
    const blob = await (await fetch(qrCodeDataUrl.value)).blob()
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
    await copyImageFeedback('', 'Image copied!')
  } catch (err) {
    error.value = 'Failed to copy to clipboard'
    console.error('Clipboard error:', err)
  }
}
</script>
