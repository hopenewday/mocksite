<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">Citation Generator</h2>
    
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- Style & Type Selection -->
      <div class="bg-brutal-white border-4 border-black p-6 space-y-4">
        <div>
          <label class="font-black block mb-2">Citation Style</label>
          <select v-model="style" class="input w-full">
            <option value="APA">APA</option>
            <option value="MLA">MLA</option>
            <option value="Chicago">Chicago</option>
            <option value="Harvard">Harvard</option>
          </select>
        </div>

        <div>
          <label class="font-black block mb-2">Source Type</label>
          <select v-model="sourceType" class="input w-full">
            <option value="book">Book</option>
            <option value="website">Website</option>
            <option value="journal">Journal</option>
            <option value="video">Video</option>
          </select>
        </div>

        <button class="btn-primary btn-primary-lime w-full" @click="generateCitation">Generate Citation</button>

        <div class="grid grid-cols-2 gap-2">
          <button class="btn-primary btn-primary-cyan" :class="{ 'animate-copy-bounce': copying }" @click="copyCitation">
            {{ copying ? 'Copied!' : 'Copy' }}
          </button>
          <button class="btn-primary btn-primary-pink" @click="clearForm">Clear</button>
        </div>

        <button class="btn-primary btn-primary-yellow w-full text-sm" @click="addToBib">+ Add to Bibliography</button>
      </div>

      <!-- Dynamic Form -->
      <div class="md:col-span-2 bg-brutal-yellow border-4 border-black p-6">
        <h3 class="font-black mb-4">Source Details</h3>
        <div class="space-y-3">
          <input v-model="form.author" type="text" placeholder="Author(s)" class="input w-full">
          <input v-model="form.title" type="text" placeholder="Title" class="input w-full">
          <input v-model="form.year" type="number" placeholder="Year" class="input w-full">
          
          <template v-if="sourceType === 'book'">
            <input v-model="form.publisher" type="text" placeholder="Publisher" class="input w-full">
            <input v-model="form.city" type="text" placeholder="City of Publication" class="input w-full">
          </template>
          
          <template v-if="sourceType === 'website'">
            <input v-model="form.url" type="url" placeholder="URL" class="input w-full">
            <input v-model="form.accessDate" type="date" placeholder="Access Date" class="input w-full">
          </template>
          
          <template v-if="sourceType === 'journal'">
            <input v-model="form.journal" type="text" placeholder="Journal Name" class="input w-full">
            <input v-model="form.volume" type="text" placeholder="Volume" class="input w-full">
            <input v-model="form.issue" type="text" placeholder="Issue" class="input w-full">
            <input v-model="form.pages" type="text" placeholder="Pages" class="input w-full">
          </template>
        </div>
      </div>
    </div>

    <!-- Generated Citation -->
    <div v-if="generatedCitation" class="bg-brutal-cyan border-4 border-black p-6 mb-6">
      <div class="text-sm font-bold text-brutal-gray mb-2">Generated Citation</div>
      <div class="font-bold italic p-4 bg-brutal-white border-2 border-black">{{ generatedCitation }}</div>
    </div>

    <!-- Bibliography -->
    <div class="bg-brutal-pink border-4 border-black p-6">
      <h3 class="font-black mb-4">Bibliography</h3>
      <div class="space-y-2 max-h-64 overflow-y-auto">
        <div v-for="(cit, idx) in bibliography" :key="idx" class="bg-brutal-white border-2 border-black p-3 italic text-sm">
          <div>{{ cit }}</div>
          <button class="text-xs btn-small btn-primary-pink mt-2" @click="removeCitation(idx)">Remove</button>
        </div>
        <div v-if="bibliography.length === 0" class="text-sm font-bold text-brutal-gray py-4">No citations yet.</div>
      </div>
      <button v-if="bibliography.length > 0" class="btn-primary btn-primary-cyan w-full mt-4 text-sm" @click="copyBibliography">
        Copy All Citations
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'

useHead({
  title: 'Citation Generator',
  meta: [
    { name: 'description', content: 'Generate citations in APA, MLA, Chicago, and Harvard styles.' },
    { property: 'og:title', content: 'Citation Generator' },
    { property: 'og:description', content: 'Generate citations in APA, MLA, Chicago, and Harvard styles.' }
  ]
})

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

const style = ref('APA')
const sourceType = ref('book')
const generatedCitation = ref('')
const bibliography = ref<string[]>([])

const form = ref({
  author: '',
  title: '',
  year: new Date().getFullYear(),
  publisher: '',
  city: '',
  url: '',
  accessDate: '',
  journal: '',
  volume: '',
  issue: '',
  pages: ''
})

const citationTemplates: Record<string, Record<string, string>> = {
  APA: {
    book: '{author} ({year}). {title}. {publisher}.',
    website: '{author} ({year}). {title}. Retrieved from {url}',
    journal: '{author} ({year}). {title}. {journal}, {volume}({issue}), {pages}.',
    video: '{author} ({year}). {title} [Video]. Retrieved from {url}'
  },
  MLA: {
    book: '{author}. {title}. {publisher}, {year}.',
    website: '{author}. "{title}." Web. {year}.',
    journal: '{author}. "{title}." {journal} {volume}.{issue} ({year}): {pages}.',
    video: '{author}. {title}. Web video. {year}. {url}'
  },
  Chicago: {
    book: '{author}. {title}. {publisher}, {year}.',
    website: '{author}. Accessed {accessDate}. {url}.',
    journal: '{author}. "{title}." {journal} {volume}, no. {issue} ({year}): {pages}.',
    video: '{author}. {title}. Video. {year}. {url}'
  },
  Harvard: {
    book: '{author}, {year}. {title}. {city}: {publisher}.',
    website: '{author}, {year}. {title}. Available at: {url}',
    journal: '{author}, {year}. {title}. {journal}, {volume}({issue}), pp.{pages}.',
    video: '{author}, {year}. {title}. Available at: {url}'
  }
}

function generateCitation() {
  const template = citationTemplates[style.value]?.[sourceType.value] || ''
  let citation = template
  
  Object.entries(form.value).forEach(([key, value]) => {
    citation = citation.replace(`{${key}}`, String(value))
  })
  
  generatedCitation.value = citation
}

function addToBib() {
  if (generatedCitation.value) {
    bibliography.value.push(generatedCitation.value)
    generatedCitation.value = ''
  }
}

function removeCitation(idx: number) {
  bibliography.value.splice(idx, 1)
}

function clearForm() {
  form.value = {
    author: '',
    title: '',
    year: new Date().getFullYear(),
    publisher: '',
    city: '',
    url: '',
    accessDate: '',
    journal: '',
    volume: '',
    issue: '',
    pages: ''
  }
  generatedCitation.value = ''
}

function copyCitation() {
  if (generatedCitation.value) {
    copyWithFeedback(generatedCitation.value)
  }
}

function copyBibliography() {
  const text = bibliography.value.join('\n\n')
  copyWithFeedback(text)
}
</script>
