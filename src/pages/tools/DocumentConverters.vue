<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header
      v-if="$route.name === 'document-converters'"
      class="bg-brutal-lime border-b-4 border-black shadow-brutal p-6"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="font-black text-4xl uppercase text-black">
          Document Converters
        </h1>
        <p class="text-black mt-2 text-lg opacity-80">
          Convert between document formats
        </p>
      </div>
    </header>
    
    <div
      v-if="$route.name === 'document-converters'"
      class="max-w-7xl mx-auto p-6"
    >
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard 
          icon="📄" 
          title="Word to PDF" 
          description="Convert DOC/DOCX to PDF"
          link="/tools/document/word-to-pdf"
          button-text="Convert"
        />
        
        <ToolCard 
          icon="📊" 
          title="Excel to PDF" 
          description="Convert XLS/XLSX to PDF"
          link="/tools/document/excel-to-pdf"
          button-text="Convert"
        />
        
        <ToolCard 
          icon="📝" 
          title="PDF to Word" 
          description="Convert PDF to DOC/DOCX"
          link="/tools/document/pdf-to-word"
          button-text="Convert"
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
    { name: 'description', content: 'Convert Word and Excel to PDF, and PDF to Word — free, fast, and secure.' },
    { property: 'og:title', content: 'Document Converters' },
    { property: 'og:description', content: 'Convert Word and Excel to PDF, and PDF to Word.' }
  ]
})
</script>
