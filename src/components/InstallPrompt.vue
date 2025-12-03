<template>
  <button
    v-if="canInstall"
    class="px-3 py-1 rounded border"
    @click="install"
  >
    Install App
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
interface BeforeInstallPromptEvent extends Event { prompt: () => Promise<unknown> }
const deferred = ref<BeforeInstallPromptEvent | null>(null)
const canInstall = ref(false)
onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferred.value = e
    canInstall.value = true
  })
})
async function install() {
  if (!deferred.value) return
  await deferred.value.prompt()
  deferred.value = null
  canInstall.value = false
}
</script>
