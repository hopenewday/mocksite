<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      QR Code Reader
    </h2>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Scanner Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Scan QR Code
        </h3>

        <div class="space-y-4">
          <!-- Camera View -->
          <div class="relative bg-brutal-gray border-4 border-black aspect-video overflow-hidden">
            <video
              ref="videoElement"
              class="w-full h-full object-cover"
              autoplay
              playsinline
              muted
            />
            <canvas
              ref="canvasElement"
              class="hidden"
            />

            <!-- Scan Overlay -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-48 h-48 border-4 border-brutal-yellow bg-brutal-yellow/20 relative">
                <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brutal-cyan" />
                <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brutal-cyan" />
                <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brutal-cyan" />
                <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brutal-cyan" />
                <!-- Scanning animation -->
                <div
                  v-if="isScanning"
                  class="absolute left-0 right-0 h-1 bg-brutal-cyan animate-scan"
                />
              </div>
            </div>

            <!-- Status Indicator -->
            <div class="absolute top-4 right-4 flex items-center gap-2">
              <div
                :class="[
                  'w-3 h-3 rounded-full',
                  isScanning ? 'bg-brutal-lime animate-pulse' : 'bg-brutal-gray'
                ]"
              />
              <span class="text-xs font-black bg-black/50 text-white px-2 py-1">
                {{ isScanning ? 'Scanning...' : 'Camera Off' }}
              </span>
            </div>

            <!-- No camera message -->
            <div
              v-if="!isScanning && !cameraError"
              class="absolute inset-0 flex items-center justify-center bg-brutal-gray"
            >
              <p class="font-black text-brutal-gray text-center">
                Click "Start Camera" to begin scanning
              </p>
            </div>

            <!-- Error message -->
            <div
              v-if="cameraError"
              class="absolute inset-0 flex items-center justify-center bg-brutal-pink/20"
            >
              <p class="font-black text-brutal-pink text-center px-4">
                {{ cameraError }}
              </p>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex gap-2">
            <button
              v-if="!isScanning"
              class="btn-primary btn-primary-cyan flex-1"
              @click="startScanning"
            >
              Start Camera
            </button>

            <button
              v-if="isScanning"
              class="btn-primary btn-primary-pink flex-1"
              @click="stopScanning"
            >
              Stop Camera
            </button>

            <button
              v-if="isScanning && availableCameras.length > 1"
              class="btn-primary btn-primary-yellow px-4"
              @click="switchCamera"
            >
              🔄
            </button>
          </div>

          <!-- File Upload -->
          <div class="border-4 border-dashed border-brutal-gray p-4 text-center">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileUpload"
            >
            <div
              class="cursor-pointer"
              @click="fileInput?.click()"
              @dragover.prevent
              @drop="handleFileDrop"
            >
              <div class="text-2xl mb-2">
                📁
              </div>
              <p class="font-black text-sm">
                Upload QR Code Image
              </p>
              <p class="text-xs font-bold text-brutal-gray mt-1">
                Drop image or click to browse
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="bg-brutal-yellow border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Scan Results
        </h3>

        <div
          v-if="scanResult"
          class="space-y-4"
        >
          <!-- Result Display -->
          <div class="bg-brutal-white border-2 border-black p-4">
            <h4 class="font-bold mb-2">
              Content Type
            </h4>
            <span class="badge badge-cyan">{{ scanResult.type }}</span>
          </div>

          <div class="bg-brutal-white border-2 border-black p-4">
            <h4 class="font-bold mb-2">
              Content
            </h4>
            <div class="p-3 bg-brutal-gray border-2 border-black font-mono text-sm break-all max-h-32 overflow-auto">
              {{ scanResult.content }}
            </div>
          </div>

          <!-- Actions based on content type -->
          <div
            v-if="scanResult.type === 'url'"
            class="space-y-2"
          >
            <button
              class="btn-primary btn-primary-lime w-full"
              @click="openURL"
            >
              🌐 Open URL
            </button>
            <button
              class="btn-primary btn-primary-cyan w-full"
              :class="{ 'animate-copy-bounce': copyingContent }"
              :data-state="copyingContent ? 'success' : null"
              @click="copyContent"
            >
              <span v-if="copyingContent">Copied!</span>
              <span v-else>📋 Copy URL</span>
            </button>
          </div>

          <div
            v-else-if="scanResult.type === 'email'"
            class="space-y-2"
          >
            <button
              class="btn-primary btn-primary-lime w-full"
              @click="sendEmail"
            >
              📧 Send Email
            </button>
            <button
              class="btn-primary btn-primary-cyan w-full"
              :class="{ 'animate-copy-bounce': copyingContent }"
              :data-state="copyingContent ? 'success' : null"
              @click="copyContent"
            >
              <span v-if="copyingContent">Copied!</span>
              <span v-else>📋 Copy Email</span>
            </button>
          </div>

          <div
            v-else-if="scanResult.type === 'phone'"
            class="space-y-2"
          >
            <button
              class="btn-primary btn-primary-lime w-full"
              @click="callPhone"
            >
              📞 Call Number
            </button>
            <button
              class="btn-primary btn-primary-cyan w-full"
              :class="{ 'animate-copy-bounce': copyingContent }"
              :data-state="copyingContent ? 'success' : null"
              @click="copyContent"
            >
              <span v-if="copyingContent">Copied!</span>
              <span v-else>📋 Copy Number</span>
            </button>
          </div>

          <div
            v-else-if="scanResult.type === 'wifi'"
            class="space-y-2"
          >
            <div class="bg-brutal-white border-2 border-black p-3">
              <p class="text-sm font-bold">
                <span class="font-black">Network:</span> {{ wifiDetails.ssid }}
              </p>
              <p class="text-sm font-bold">
                <span class="font-black">Security:</span> {{ wifiDetails.security }}
              </p>
              <p
                v-if="wifiDetails.password"
                class="text-sm font-bold"
              >
                <span class="font-black">Password:</span> {{ showPassword ? wifiDetails.password : '••••••••' }}
                <button
                  class="ml-2 text-xs underline"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </p>
            </div>
            <button
              class="btn-primary btn-primary-cyan w-full"
              :class="{ 'animate-copy-bounce': copyingPassword }"
              :data-state="copyingPassword ? 'success' : null"
              @click="copyWifiPassword"
            >
              <span v-if="copyingPassword">Copied!</span>
              <span v-else>📋 Copy Password</span>
            </button>
          </div>

          <div
            v-else-if="scanResult.type === 'sms'"
            class="space-y-2"
          >
            <button
              class="btn-primary btn-primary-lime w-full"
              @click="sendSMS"
            >
              💬 Send SMS
            </button>
            <button
              class="btn-primary btn-primary-cyan w-full"
              :class="{ 'animate-copy-bounce': copyingContent }"
              :data-state="copyingContent ? 'success' : null"
              @click="copyContent"
            >
              <span v-if="copyingContent">Copied!</span>
              <span v-else>📋 Copy Content</span>
            </button>
          </div>

          <div
            v-else
            class="space-y-2"
          >
            <button
              class="btn-primary btn-primary-cyan w-full"
              :class="{ 'animate-copy-bounce': copyingContent }"
              :data-state="copyingContent ? 'success' : null"
              @click="copyContent"
            >
              <span v-if="copyingContent">Copied!</span>
              <span v-else>📋 Copy Text</span>
            </button>
            <button
              class="btn-primary btn-primary-yellow w-full"
              @click="searchText"
            >
              🔍 Search Online
            </button>
          </div>

          <button
            class="btn-primary btn-primary-pink w-full"
            @click="clearResult"
          >
            Clear Result
          </button>
        </div>

        <div
          v-else
          class="text-center py-8"
        >
          <div class="text-4xl mb-4">
            📷
          </div>
          <p class="font-black text-brutal-gray">
            Scan a QR code to see results
          </p>
          <p class="text-sm font-bold text-brutal-gray mt-2">
            Use camera or upload an image
          </p>
        </div>
      </div>
    </div>

    <!-- History -->
    <div class="bg-brutal-lime border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Scan History
      </h3>

      <div
        v-if="scanHistory.length > 0"
        class="space-y-3"
      >
        <div
          v-for="(item, index) in scanHistory"
          :key="index"
          class="flex items-center justify-between p-3 bg-brutal-white border-2 border-black"
        >
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="text-2xl">{{ getTypeIcon(item.type) }}</span>
            <div class="min-w-0 flex-1">
              <p class="font-black text-sm truncate">
                {{ item.content.substring(0, 50) }}{{ item.content.length > 50 ? '...' : '' }}
              </p>
              <p class="text-xs font-bold text-brutal-gray">
                {{ item.timestamp }}
              </p>
            </div>
          </div>

          <div class="flex gap-2 ml-2">
            <button
              class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
              @click="loadFromHistory(item)"
            >
              View
            </button>
            <button
              class="btn-primary btn-primary-pink px-3 py-1 text-xs"
              @click="removeFromHistory(index)"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center py-4"
      >
        <p class="font-black text-brutal-gray">
          No scan history yet
        </p>
      </div>

      <button
        v-if="scanHistory.length > 0"
        class="btn-primary btn-primary-pink w-full mt-4"
        @click="clearHistory"
      >
        Clear History
      </button>
    </div>

    <!-- Toast notification -->
    <div
      v-if="toast"
      class="fixed bottom-4 right-4 bg-brutal-cyan border-4 border-black p-4 shadow-brutal z-50"
    >
      <p class="font-black">
        {{ toast }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import jsQR from 'jsqr'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'

interface ScanResult {
  type: string
  content: string
  timestamp: string
}

interface WifiDetails {
  ssid: string
  password: string
  security: string
}

const videoElement = ref<HTMLVideoElement>()
const canvasElement = ref<HTMLCanvasElement>()
const fileInput = ref<HTMLInputElement>()
const isScanning = ref(false)
const scanResult = ref<ScanResult | null>(null)
const scanHistory = ref<ScanResult[]>([])
const cameraError = ref('')
const toast = ref('')
const showPassword = ref(false)
const availableCameras = ref<MediaDeviceInfo[]>([])
const currentCameraIndex = ref(0)

// Copy feedback
const { isCopying: copyingContent, copyWithFeedback: copyContentFeedback } = useCopyFeedback()
const { isCopying: copyingPassword, copyWithFeedback: copyPasswordFeedback } = useCopyFeedback()

let stream: MediaStream | null = null
let animationFrameId: number | null = null

const wifiDetails = computed<WifiDetails>(() => {
  if (scanResult.value?.type !== 'wifi') {
    return { ssid: '', password: '', security: '' }
  }

  const content = scanResult.value.content
  const ssidMatch = content.match(/S:([^;]*);/)
  const passwordMatch = content.match(/P:([^;]*);/)
  const securityMatch = content.match(/T:([^;]*);/)

  return {
    ssid: ssidMatch ? ssidMatch[1] : '',
    password: passwordMatch ? passwordMatch[1] : '',
    security: securityMatch ? securityMatch[1] : 'None'
  }
})

const getAvailableCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    availableCameras.value = devices.filter(device => device.kind === 'videoinput')
  } catch (error) {
    console.error('Error getting cameras:', error)
  }
}

const startScanning = async () => {
  cameraError.value = ''

  try {
    await getAvailableCameras()

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: currentCameraIndex.value === 0 ? 'environment' : 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }

    // If specific camera is selected
    if (availableCameras.value.length > 0 && availableCameras.value[currentCameraIndex.value]) {
      constraints.video = {
        deviceId: { exact: availableCameras.value[currentCameraIndex.value].deviceId },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }

    stream = await navigator.mediaDevices.getUserMedia(constraints)

    if (videoElement.value) {
      videoElement.value.srcObject = stream
      await videoElement.value.play()
      isScanning.value = true
      requestAnimationFrame(scanFrame)
    }
  } catch (error: any) {
    console.error('Error accessing camera:', error)
    if (error.name === 'NotAllowedError') {
      cameraError.value = 'Camera access denied. Please allow camera permissions.'
    } else if (error.name === 'NotFoundError') {
      cameraError.value = 'No camera found on this device.'
    } else {
      cameraError.value = 'Unable to access camera. Please try again.'
    }
  }
}

const stopScanning = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  if (videoElement.value) {
    videoElement.value.srcObject = null
  }

  isScanning.value = false
}

const switchCamera = async () => {
  if (availableCameras.value.length <= 1) return

  stopScanning()
  currentCameraIndex.value = (currentCameraIndex.value + 1) % availableCameras.value.length
  await startScanning()
}

const scanFrame = () => {
  if (!isScanning.value || !videoElement.value || !canvasElement.value) return

  const video = videoElement.value
  const canvas = canvasElement.value
  const context = canvas.getContext('2d', { willReadFrequently: true })

  if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
    animationFrameId = requestAnimationFrame(scanFrame)
    return
  }

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  context.drawImage(video, 0, 0, canvas.width, canvas.height)

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert'
  })

  if (code) {
    processQRResult(code.data)
    // Continue scanning but with a delay to prevent repeated scans
    setTimeout(() => {
      if (isScanning.value) {
        animationFrameId = requestAnimationFrame(scanFrame)
      }
    }, 2000)
  } else {
    animationFrameId = requestAnimationFrame(scanFrame)
  }
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    await scanImageFile(target.files[0])
    target.value = '' // Reset input
  }
}

const handleFileDrop = async (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0]
    if (file.type.startsWith('image/')) {
      await scanImageFile(file)
    } else {
      showToast('Please drop an image file')
    }
  }
}

const scanImageFile = async (file: File) => {
  const img = new Image()
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) return

  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    context.drawImage(img, 0, 0)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth'
    })

    if (code) {
      processQRResult(code.data)
    } else {
      showToast('No QR code found in image')
    }

    URL.revokeObjectURL(img.src)
  }

  img.onerror = () => {
    showToast('Failed to load image')
    URL.revokeObjectURL(img.src)
  }

  img.src = URL.createObjectURL(file)
}

const processQRResult = (content: string) => {
  const type = detectContentType(content)
  const result: ScanResult = {
    type,
    content,
    timestamp: new Date().toLocaleString()
  }

  scanResult.value = result
  showPassword.value = false

  // Add to history if not duplicate
  const isDuplicate = scanHistory.value.some(
    item => item.content === content && item.type === type
  )

  if (!isDuplicate) {
    scanHistory.value.unshift(result)
    if (scanHistory.value.length > 20) {
      scanHistory.value = scanHistory.value.slice(0, 20)
    }
    saveHistory()
  }

  showToast('QR Code scanned successfully!')
}

const detectContentType = (content: string): string => {
  if (content.startsWith('http://') || content.startsWith('https://')) return 'url'
  if (content.startsWith('mailto:')) return 'email'
  if (content.startsWith('tel:')) return 'phone'
  if (content.startsWith('WIFI:') || content.startsWith('wifi:')) return 'wifi'
  if (content.startsWith('sms:') || content.startsWith('SMS:')) return 'sms'
  if (content.startsWith('geo:')) return 'location'
  if (content.startsWith('BEGIN:VCARD')) return 'contact'
  if (content.startsWith('BEGIN:VEVENT')) return 'event'
  return 'text'
}

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    url: '🌐',
    email: '📧',
    phone: '📞',
    wifi: '📶',
    sms: '💬',
    location: '📍',
    contact: '👤',
    event: '📅',
    text: '📝'
  }
  return icons[type] || '📱'
}

const openURL = () => {
  if (scanResult.value?.content) {
    window.open(scanResult.value.content, '_blank', 'noopener,noreferrer')
  }
}

const copyContent = async () => {
  if (scanResult.value?.content) {
    await copyContentFeedback(scanResult.value.content, 'Copied!')
  }
}

const copyWifiPassword = async () => {
  if (wifiDetails.value.password) {
    await copyPasswordFeedback(wifiDetails.value.password, 'Password copied!')
  }
}

const sendEmail = () => {
  if (scanResult.value?.content) {
    window.location.href = scanResult.value.content
  }
}

const callPhone = () => {
  if (scanResult.value?.content) {
    window.location.href = scanResult.value.content
  }
}

const sendSMS = () => {
  if (scanResult.value?.content) {
    window.location.href = scanResult.value.content
  }
}

const searchText = () => {
  if (scanResult.value?.content) {
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(scanResult.value.content)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }
}

const clearResult = () => {
  scanResult.value = null
  showPassword.value = false
}

const loadFromHistory = (item: ScanResult) => {
  scanResult.value = { ...item }
  showPassword.value = false
}

const removeFromHistory = (index: number) => {
  scanHistory.value.splice(index, 1)
  saveHistory()
}

const clearHistory = () => {
  scanHistory.value = []
  saveHistory()
}

const saveHistory = () => {
  localStorage.setItem('qrScanHistory', JSON.stringify(scanHistory.value))
}

const loadHistory = () => {
  const saved = localStorage.getItem('qrScanHistory')
  if (saved) {
    try {
      scanHistory.value = JSON.parse(saved)
    } catch (error) {
      scanHistory.value = []
    }
  }
}

const showToast = (message: string) => {
  toast.value = message
  setTimeout(() => {
    toast.value = ''
  }, 3000)
}

onMounted(() => {
  loadHistory()
})

onUnmounted(() => {
  stopScanning()
})
</script>

<style scoped>
@keyframes scan {
  0% {
    top: 0;
  }
  50% {
    top: calc(100% - 4px);
  }
  100% {
    top: 0;
  }
}

.animate-scan {
  animation: scan 2s ease-in-out infinite;
}
</style>
