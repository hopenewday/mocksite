<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header
      v-if="$route.name === 'tools'"
      class="bg-brutal-pink border-b-4 border-black shadow-brutal p-6"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Tools Suite
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Professional tools for productivity and creativity
        </p>
      </div>
    </header>
    
    <div
      v-if="$route.name === 'tools'"
      class="max-w-7xl mx-auto p-6"
    >
      <!-- Desktop Grid -->
      <div
        v-if="$route.name === 'tools'"
        class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
      >
        <ToolCard 
          icon="📋" 
          title="PDF Tools" 
          description="Merge, split, rotate, compress PDFs"
          link="/tools/pdf"
        />
        
        <ToolCard 
          icon="🖼️" 
          title="Image Tools" 
          description="Convert, crop, resize images"
          link="/tools/image"
        />
        
        <ToolCard 
          icon="🧮" 
          title="Calculator Suite" 
          description="Percentage, BMI, scientific calculators"
          link="/tools/calculator"
        />
        
        <ToolCard 
          icon="📝" 
          title="Text Tools" 
          description="Word counter, case converter, diff tool"
          link="/tools/text"
        />
        
        <ToolCard 
          icon="📅" 
          title="Date & Time" 
          description="Age calculator, date difference"
          link="/tools/datetime"
        />
        
        <ToolCard 
          icon="📱" 
          title="QR Code Tools" 
          description="Generate and read QR codes"
          link="/tools/qr"
        />
        
        <ToolCard 
          icon="🎨" 
          title="Color Tools" 
          description="Color picker, palette, converter"
          link="/tools/color"
        />
        
        <ToolCard 
          icon="🔤" 
          title="Font Tools" 
          description="Font preview, identifier, converter"
          link="/tools/font"
        />
        
        <ToolCard 
          icon="📄" 
          title="Document Converters" 
          description="Convert between document formats"
          link="/tools/document"
        />
        
        <ToolCard 
          icon="🛠️" 
          title="Misc Tools" 
          description="Various utility tools"
          link="/tools/misc"
        />
      </div>
      
      <!-- Mobile List -->
      <div
        v-if="$route.name === 'tools'"
        class="md:hidden space-y-4"
      >
        <MobileToolCard 
          icon="📋" 
          title="PDF Tools" 
          description="Merge, split, rotate, compress PDFs"
          link="/tools/pdf"
        />
        
        <MobileToolCard 
          icon="🖼️" 
          title="Image Tools" 
          description="Convert, crop, resize images"
          link="/tools/image"
        />
        
        <MobileToolCard 
          icon="🧮" 
          title="Calculator Suite" 
          description="Percentage, BMI, scientific calculators"
          link="/tools/calculator"
        />
        
        <MobileToolCard 
          icon="📝" 
          title="Text Tools" 
          description="Word counter, case converter, diff tool"
          link="/tools/text"
        />
        
        <MobileToolCard 
          icon="📅" 
          title="Date & Time" 
          description="Age calculator, date difference"
          link="/tools/datetime"
        />
        
        <MobileToolCard 
          icon="📱" 
          title="QR Code Tools" 
          description="Generate and read QR codes"
          link="/tools/qr"
        />
        
        <MobileToolCard 
          icon="🎨" 
          title="Color Tools" 
          description="Color picker, palette, converter"
          link="/tools/color"
        />
        
        <MobileToolCard 
          icon="🔤" 
          title="Font Tools" 
          description="Font preview, identifier, converter"
          link="/tools/font"
        />
        
        <MobileToolCard 
          icon="📄" 
          title="Document Converters" 
          description="Convert between document formats"
          link="/tools/document"
        />
        
        <MobileToolCard 
          icon="🛠️" 
          title="Misc Tools" 
          description="Various utility tools"
          link="/tools/misc"
        />
      </div>
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
import MobileToolCard from '@/components/common/MobileToolCard.vue'
import { useHead } from '@vueuse/head'

useHead({
  meta: [
    { name: 'description', content: 'All-in-one online tools suite: PDF, image, text, color, fonts, QR, calculators, and document converters.' },
    { property: 'og:title', content: 'Tools Suite' },
    { property: 'og:description', content: 'Professional tools for productivity and creativity.' }
  ]
})
</script>
