<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header
      v-if="$route.name === 'font-tools'"
      class="bg-brutal-yellow border-b-4 border-black shadow-brutal p-6"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="font-black text-4xl uppercase text-black">
          Font Tools
        </h1>
        <p class="text-black mt-2 text-lg opacity-80">
          Font identification and conversion tools
        </p>
      </div>
    </header>
    
    <div
      v-if="$route.name === 'font-tools'"
      class="max-w-7xl mx-auto p-6"
    >
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard 
          icon="🔤" 
          title="Font Preview" 
          description="Preview text in different fonts"
          link="/tools/font/preview"
          button-text="Preview"
        />
        
        <ToolCard 
          icon="🔍" 
          title="Font Identifier" 
          description="Identify fonts from images"
          link="/tools/font/identifier"
          button-text="Identify"
        />
        
        <ToolCard 
          icon="🔄" 
          title="Font Converter" 
          description="Convert between font formats"
          link="/tools/font/converter"
          button-text="Convert"
        />
        
        <ToolCard 
          icon="📏" 
          title="Font Size Calculator" 
          description="Calculate responsive font sizes"
          link="/tools/font/size"
          button-text="Calculate"
        />
        
        <ToolCard 
          icon="🎨" 
          title="Font Pairing" 
          description="Find font pairings"
          link="/tools/font/pairing"
          button-text="Find Pairs"
        />
        
        <ToolCard 
          icon="📊" 
          title="Font Metrics" 
          description="Analyze font metrics"
          link="/tools/font/metrics"
          button-text="Analyze"
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
    { name: 'description', content: 'Preview, identify, and convert fonts online.' },
    { property: 'og:title', content: 'Font Tools' },
    { property: 'og:description', content: 'Preview fonts, identify from images, and convert formats.' }
  ]
})
</script>
