<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Markdown to HTML Converter
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Convert Markdown to HTML with live preview and syntax highlighting.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Input Panel -->
        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <div class="flex items-center justify-between mb-4">
            <label class="font-black">Markdown Input</label>
            <div class="text-sm font-black">
              {{ input.length }} characters
            </div>
          </div>
          
          <textarea 
            v-model="input" 
            rows="20" 
            class="input-brutal w-full font-mono text-sm"
            placeholder="Enter your Markdown here..."
            @input="updatePreview"
          />

          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button
              class="btn-primary btn-primary-yellow"
              :disabled="!output"
              :class="{ 'animate-copy-bounce': copyingOutput }"
              @click="copyHTML"
            >
              Copy HTML
            </button>
            <button
              class="btn-primary btn-primary-lime"
              :disabled="!output"
              @click="downloadHTML"
            >
              Download HTML
            </button>
            <button
              class="btn-primary btn-primary-pink"
              @click="loadSample"
            >
              Load Sample
            </button>
            <button
              class="btn-primary btn-primary-white"
              @click="clearAll"
            >
              Clear
            </button>
          </div>

          <div
            v-if="error"
            class="mt-3 p-3 bg-red-100 border-4 border-red-500 text-red-800"
          >
            <p class="font-black">
              Error: {{ error }}
            </p>
          </div>
        </div>

        <!-- Preview Panel -->
        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <div class="flex items-center justify-between mb-4">
            <label class="font-black">HTML Preview</label>
            <div class="text-sm font-black">
              {{ output.length }} characters
            </div>
          </div>
          
          <div class="border-4 border-black bg-white h-96 overflow-auto p-4">
            <div
              class="prose prose-sm max-w-none"
              v-html="output"
            />
          </div>

          <div class="mt-4 p-2 bg-brutal-lime border-2 border-black text-center">
            <p class="font-black">
              Live preview updates as you type
            </p>
          </div>
        </div>
      </div>

      <!-- HTML Output -->
      <div class="mt-6 card-brutal-white dark:card-brutal-black border-4 border-black p-4">
        <label class="font-black block mb-2">Generated HTML</label>
        <textarea 
          :value="output" 
          readonly 
          rows="8" 
          class="input-brutal w-full font-mono text-sm"
          placeholder="Generated HTML will appear here..."
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { saveAs } from 'file-saver'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import Prism from 'prismjs'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/themes/prism.css'

useHead({
  title: 'Markdown to HTML Converter - Free Online Tool',
  meta: [
    { name: 'description', content: 'Convert Markdown to HTML with live preview and syntax highlighting. Free online Markdown converter.' },
    { property: 'og:title', content: 'Markdown to HTML Converter' },
    { property: 'og:description', content: 'Convert Markdown to HTML with live preview and syntax highlighting.' }
  ]
})

const input = ref('')
const output = ref('')
const error = ref('')

const { copyWithFeedback, isCopying: copyingOutput } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

const sanitizeHTML = (html: string) => html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '').replace(/on[a-z]+\s*=\s*"[^"]*"/gi, '')

marked.use(
  markedHighlight({
    langPrefix: 'language-',
    highlight(code, lang) {
      try {
        const language = (lang && Prism.languages[lang]) ? lang : 'javascript'
        return Prism.highlight(code, Prism.languages[language], language)
      } catch {
        return code
      }
    }
  })
)

const convertMarkdown = () => {
  error.value = ''
  output.value = ''
  
  const trimmedInput = input.value.trim()
  if (!trimmedInput) {
    return
  }

  try {
    const html = marked.parse(trimmedInput)
    output.value = sanitizeHTML(String(html))
    celebrateFirstUse('markdown-converter')
  } catch (e: any) {
    error.value = e.message || 'Conversion failed'
  }
}

// Debounce timer
let timeoutId: ReturnType<typeof setTimeout> | null = null

const updatePreview = () => {
  // Debounced update for better performance
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(() => {
    convertMarkdown()
  }, 300)
}


const copyHTML = async () => {
  if (!output.value) return
  await copyWithFeedback(output.value)
}

const downloadHTML = () => {
  if (!output.value) return
  
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Markdown</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px; 
            margin: 0 auto; 
            padding: 2rem;
            line-height: 1.6;
        }
        pre { 
            background: #f4f4f4; 
            padding: 1rem; 
            border-radius: 5px;
            overflow-x: auto;
        }
        code { 
            background: #f4f4f4; 
            padding: 0.2rem 0.4rem; 
            border-radius: 3px;
        }
        blockquote { 
            border-left: 4px solid #ddd;
            margin: 0;
            padding-left: 1rem;
            color: #666;
        }
        table { 
            border-collapse: collapse;
            width: 100%;
        }
        th, td { 
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th { 
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
${output.value}
</body>
</html>`

  const blob = new Blob([htmlTemplate], { type: 'text/html' })
  saveAs(blob, 'converted.html')
}

const loadSample = () => {
  input.value = `# Markdown Sample

This is a **bold** text and this is *italic*.

## Code Block
\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

## Lists
- Item 1
- Item 2
  - Nested item
  - Another nested

## Links
[OpenAI](https://openai.com)

## Table
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

> This is a blockquote

**Done!**`
  
  convertMarkdown()
}

const clearAll = () => {
  input.value = ''
  output.value = ''
  error.value = ''
}

// Watch for input changes
watch(input, () => {
  updatePreview()
})

// Initial conversion
convertMarkdown()
</script>

<style scoped>

/* Use minimal scoped rules; rely on template utility classes */
:deep(.prose) { max-width: none; }
:deep(.prose h1) { font-weight: 700; margin-bottom: 1rem; font-size: 1.5rem; }
:deep(.prose h2) { font-weight: 700; margin-bottom: 0.75rem; margin-top: 1.5rem; font-size: 1.25rem; }
:deep(.prose h3) { font-weight: 700; margin-bottom: 0.5rem; margin-top: 1rem; font-size: 1.125rem; }
:deep(.prose code) { background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875rem; }
:deep(.prose pre) { background-color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
:deep(.prose pre code) { background: transparent; padding: 0; }
:deep(.prose blockquote) { border-left: 4px solid #d1d5db; padding-left: 1rem; font-style: italic; color: #4b5563; }
:deep(.prose table) { border-collapse: collapse; border: 1px solid #d1d5db; }
:deep(.prose th), :deep(.prose td) { border: 1px solid #d1d5db; padding: 0.25rem 0.75rem; }
:deep(.prose th) { background-color: #f3f4f6; font-weight: 700; }
</style>
