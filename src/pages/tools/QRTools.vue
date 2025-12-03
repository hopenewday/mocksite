<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header
      v-if="$route.name === 'qr-tools'"
      class="bg-brutal-purple border-b-4 border-black shadow-brutal p-6"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          QR Code Tools
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Generate and read QR codes
        </p>
      </div>
    </header>
    
    <div
      v-if="$route.name === 'qr-tools'"
      class="max-w-7xl mx-auto p-6"
    >
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard 
          icon="📱" 
          title="QR Generator" 
          description="Generate QR codes from text, URLs, etc."
          link="/tools/qr/generator"
          button-text="Generate"
        />
        
        <ToolCard 
          icon="📷" 
          title="QR Reader" 
          description="Scan and read QR codes from images"
          link="/tools/qr/reader"
          button-text="Scan"
        />
      </div>
      
      <!-- Tool Preview Section -->
    </div>
    <RouterView
      v-else
      v-slot="{ Component }"
    >
      <Transition
        name="route-fade"
        mode="out-in"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import ToolCard from '@/components/common/ToolCard.vue'
import { useHead } from '@vueuse/head'

useHead({
  meta: [
    { name: 'description', content: 'Generate and read QR codes online.' },
    { property: 'og:title', content: 'QR Code Tools' },
    { property: 'og:description', content: 'Create and scan QR codes.' }
  ]
})
</script>
