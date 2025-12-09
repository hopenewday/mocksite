<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header
      v-if="$route.name === 'color-tools'"
      class="bg-brutal-pink border-b-4 border-black shadow-brutal p-6"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="font-black text-4xl uppercase text-black">
          Color Tools
        </h1>
        <p class="text-black mt-2 text-lg opacity-80">
          Professional color tools and utilities
        </p>
      </div>
    </header>
    
    <div
      v-if="$route.name === 'color-tools'"
      class="max-w-7xl mx-auto p-6"
    >
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard 
          icon="🎨" 
          title="Color Picker" 
          description="Pick and explore colors"
          link="/tools/color/picker"
          button-text="Pick Color"
        />
        
        <ToolCard 
          icon="🎭" 
          title="Color Palette" 
          description="Generate color palettes"
          link="/tools/color/palette"
          button-text="Generate"
        />
        
        <ToolCard 
          icon="🔄" 
          title="Color Converter" 
          description="Convert between color formats"
          link="/tools/color/converter"
          button-text="Convert"
        />

        <ToolCard 
          icon="🧵" 
          title="Gradient Generator" 
          description="Create CSS gradients"
          link="/tools/color/gradient"
          button-text="Create"
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
    { name: 'description', content: 'Color picker, palette generator, and color converter tools.' },
    { property: 'og:title', content: 'Color Tools' },
    { property: 'og:description', content: 'Pick colors, create palettes, and convert formats.' }
  ]
})
</script>
