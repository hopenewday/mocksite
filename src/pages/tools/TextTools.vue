<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header
      v-if="$route.name === 'text-tools'"
      class="bg-brutal-lime border-b-4 border-black shadow-brutal p-6"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="font-black text-4xl uppercase text-black">
          Text Tools
        </h1>
        <p class="text-black mt-2 text-lg opacity-80">
          Professional text processing and analysis tools
        </p>
      </div>
    </header>
    
    <div
      v-if="$route.name === 'text-tools'"
      class="max-w-7xl mx-auto p-6"
    >
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard 
          icon="📊" 
          title="Word Counter" 
          description="Count words, characters, and paragraphs"
          link="/tools/text/word-counter"
          button-text="Count"
        />
        
        <ToolCard 
          icon="🔤" 
          title="Case Converter" 
          description="Convert text between different cases"
          link="/tools/text/case-converter"
          button-text="Convert"
        />
        
        <ToolCard 
          icon="🔍" 
          title="Text Diff Tool" 
          description="Compare two text blocks"
          link="/tools/text/diff-tool"
          button-text="Compare"
        />

        <ToolCard 
          icon="🧱" 
          title="Lorem Ipsum" 
          description="Generate placeholder text"
          link="/tools/text/lorem-ipsum"
          button-text="Generate"
        />

        <ToolCard 
          icon="{}" 
          title="JSON Formatter" 
          description="Format, validate, and minify JSON"
          link="/tools/text/json-formatter"
          button-text="Format"
        />

        <ToolCard 
          icon="↔️" 
          title="CSV ⇄ JSON" 
          description="Convert CSV and JSON"
          link="/tools/text/csv-to-json"
          button-text="Convert"
        />

        <ToolCard 
          icon="📝" 
          title="Markdown Converter" 
          description="Convert Markdown to HTML"
          link="/tools/text/markdown-converter"
          button-text="Convert"
        />

        <ToolCard 
          icon="🧹" 
          title="Text Cleaner" 
          description="Clean and normalize text"
          link="/tools/text/text-cleaner"
          button-text="Clean"
        />

        <ToolCard 
          icon="♻️" 
          title="Duplicate Remover" 
          description="Remove duplicate lines"
          link="/tools/text/duplicate-remover"
          button-text="Remove"
        />

        <ToolCard 
          icon="📏" 
          title="Line Counter" 
          description="Count and deduplicate lines"
          link="/tools/text/line-counter"
          button-text="Count"
        />

        <ToolCard 
          icon="🔊" 
          title="Text to Speech" 
          description="Speak text aloud"
          link="/tools/text/text-to-speech"
          button-text="Speak"
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
    { name: 'description', content: 'Word counter, case converter, and text diff tool.' },
    { property: 'og:title', content: 'Text Tools' },
    { property: 'og:description', content: 'Word counter, case converter, and text diff.' }
  ]
})
</script>
