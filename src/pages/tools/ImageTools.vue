<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header
      v-if="$route.name === 'image-tools'"
      class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Image Tools
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Professional image editing and conversion tools
        </p>
      </div>
    </header>
    
    <div
      v-if="$route.name === 'image-tools'"
      class="max-w-7xl mx-auto p-6"
    >
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard 
          icon="🔄" 
          title="Image Converter" 
          description="Convert between image formats"
          link="/tools/image/converter"
          button-text="Convert"
        />
        
        <ToolCard 
          icon="✂️" 
          title="Image Cropper" 
          description="Crop and resize images"
          link="/tools/image/cropper"
          button-text="Crop"
        />
        
        <ToolCard 
          icon="📏" 
          title="Image Resizer" 
          description="Resize images to specific dimensions"
          link="/tools/image/resizer"
          button-text="Resize"
        />
        
        <ToolCard 
          icon="🗜️" 
          title="Image Compressor" 
          description="Compress images to reduce file size"
          link="/tools/image/compress"
          button-text="Compress"
        />

        <ToolCard 
          icon="🔖" 
          title="Favicon Generator" 
          description="Generate favicons and app icons"
          link="/tools/image/favicon-generator"
          button-text="Generate"
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
    { name: 'description', content: 'Convert, crop, resize, and compress images online.' },
    { property: 'og:title', content: 'Image Tools' },
    { property: 'og:description', content: 'Convert, crop, resize, and compress images.' }
  ]
})
</script>
