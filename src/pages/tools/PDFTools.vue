<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header
      v-if="$route.name === 'pdf-tools'"
      class="bg-brutal-pink border-b-4 border-black shadow-brutal p-6"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="font-black text-4xl uppercase text-black">
          PDF Tools
        </h1>
        <p class="text-black mt-2 text-lg opacity-80">
          Professional PDF manipulation tools
        </p>
      </div>
    </header>
    
    <div
      v-if="$route.name === 'pdf-tools'"
      class="max-w-7xl mx-auto p-6"
    >
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard 
          icon="📋" 
          title="Merge PDFs" 
          description="Combine multiple PDFs into one"
          link="/tools/pdf/merge"
          button-text="Merge PDFs"
        />
        
        <ToolCard 
          icon="✂️" 
          title="Split PDF" 
          description="Extract pages from PDFs"
          link="/tools/pdf/split"
          button-text="Split PDF"
        />
        
        <ToolCard 
          icon="🔄" 
          title="Rotate PDF" 
          description="Rotate PDF pages"
          link="/tools/pdf/rotate"
          button-text="Rotate PDF"
        />
        
        <ToolCard 
          icon="🗜️" 
          title="Compress PDF" 
          description="Reduce PDF file size"
          link="/tools/pdf/compress"
          button-text="Compress PDF"
        />
        
        <ToolCard 
          icon="📄" 
          title="Convert to PDF" 
          description="Convert images, Word, Excel to PDF"
          link="/tools/pdf/convert"
          button-text="Convert to PDF"
        />
        
        <ToolCard 
          icon="🖼️" 
          title="PDF to Images" 
          description="Convert PDF pages to images"
          link="/tools/pdf/to-images"
          button-text="PDF to Images"
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
    { name: 'description', content: 'Merge, split, rotate, compress, and convert PDFs. Free online PDF tools.' },
    { property: 'og:title', content: 'PDF Tools' },
    { property: 'og:description', content: 'Merge, split, rotate, compress, and convert PDFs.' }
  ]
})
</script>
