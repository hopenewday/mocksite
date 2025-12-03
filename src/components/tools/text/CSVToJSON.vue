<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          CSV ↔ JSON Converter
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Convert between CSV and JSON with custom delimiter, headers, preview, copy, and download.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <label class="font-black">Mode:</label>
            <label class="inline-flex items-center gap-2">
              <input
                v-model="mode"
                type="radio"
                value="csv-to-json"
              >
              <span>CSV → JSON</span>
            </label>
            <label class="inline-flex items-center gap-2">
              <input
                v-model="mode"
                type="radio"
                value="json-to-csv"
              >
              <span>JSON → CSV</span>
            </label>
          </div>

          <div
            v-if="mode === 'csv-to-json'"
            class="mb-3"
          >
            <label class="font-black block mb-1">Delimiter</label>
            <select
              v-model="delimiter"
              class="input-brutal w-full"
            >
              <option value=",">
                Comma ,
              </option>
              <option value=";">
                Semicolon ;
              </option>
              <option value="\t">
                Tab \t
              </option>
              <option value="|">
                Pipe |
              </option>
            </select>
          </div>

          <div
            v-if="mode === 'csv-to-json'"
            class="flex items-center gap-2 mb-3"
          >
            <input
              id="headerRow"
              v-model="headerRow"
              type="checkbox"
            >
            <label
              for="headerRow"
              class="font-black"
            >First row is header</label>
          </div>

          <label class="font-black block mb-2">Input</label>
          <textarea
            v-model="input"
            rows="10"
            class="input-brutal w-full"
            placeholder="Paste your CSV or JSON here"
          />

          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button
              class="btn-primary btn-primary-yellow"
              @click="convert"
            >
              Convert
            </button>
            <button
              class="btn-primary btn-primary-lime"
              :class="{ 'animate-copy-bounce': copyingOutput }"
              @click="copyOutput"
            >
              Copy Output
            </button>
            <button
              class="btn-primary btn-primary-pink"
              :disabled="!output"
              @click="downloadOutput"
            >
              Download
            </button>
            <span
              v-if="justConverted"
              class="font-black text-brutal-pink"
            >Converted!</span>
          </div>
        </div>

        <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4">
          <label class="font-black block mb-2">Output</label>
          <textarea
            :value="output"
            readonly
            rows="10"
            class="input-brutal w-full"
            placeholder="Your converted result appears here"
          />

          <div
            v-if="mode === 'csv-to-json' && previewRows.length"
            class="mt-4 grid grid-cols-2 gap-3"
          >
            <div class="col-span-2">
              <h3 class="heading-brutal text-2xl">
                Preview
              </h3>
            </div>
            <div class="col-span-2 overflow-auto border-4 border-black">
              <table class="min-w-full text-sm">
                <thead>
                  <tr>
                    <th
                      v-for="(col, idx) in previewColumns"
                      :key="idx"
                      class="border-2 border-black px-2 py-1 bg-brutal-yellow"
                    >
                      {{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, rIdx) in previewRows"
                    :key="rIdx"
                  >
                    <td
                      v-for="(col, cIdx) in previewColumns"
                      :key="cIdx"
                      class="border-2 border-black px-2 py-1"
                    >
                      {{ row[col] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <p class="font-black">
                Rows: {{ rowCount }}
              </p>
            </div>
            <div>
              <p class="font-black">
                Columns: {{ columnCount }}
              </p>
            </div>
          </div>

          <div
            v-if="error"
            class="mt-4"
          >
            <p class="font-black text-brutal-pink">
              {{ error }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

 <script setup lang="ts">
 import { ref, computed } from 'vue'
 import { useHead } from '@vueuse/head'
 import Papa from 'papaparse'
 import { saveAs } from 'file-saver'
 import { useCopyFeedback } from '../../../composables/useCopyFeedback'
 import { useMilestones } from '../../../composables/useMilestones'

 useHead({
   title: 'CSV to JSON Converter',
   meta: [
     { name: 'description', content: 'Convert CSV to JSON and JSON to CSV with custom delimiter, headers, preview, copy, and download.' },
     { property: 'og:title', content: 'CSV ↔ JSON Converter' },
     { property: 'og:description', content: 'Convert CSV to JSON and JSON to CSV with custom delimiter, headers, preview, copy, and download.' }
   ]
 })

 const mode = ref<'csv-to-json' | 'json-to-csv'>('csv-to-json')
 const delimiter = ref<string>(',')
 const headerRow = ref<boolean>(true)
 const input = ref<string>('')
 const output = ref<string>('')
 const error = ref<string>('')
 const justConverted = ref<boolean>(false)

 const previewRows = ref<Array<Record<string, any>>>([])
 const previewColumns = computed<string[]>(() => {
   if (!previewRows.value.length) return []
   return Object.keys(previewRows.value[0] || {})
 })
 const rowCount = computed(() => previewRows.value.length)
 const columnCount = computed(() => previewColumns.value.length)

 const { celebrateFirstUse } = useMilestones()
 const { isCopying: copyingOutput, copyWithFeedback } = useCopyFeedback()

 const convert = () => {
   error.value = ''
   justConverted.value = false
   previewRows.value = []

   try {
     if (mode.value === 'csv-to-json') {
       const parsed = Papa.parse(input.value, {
         header: headerRow.value,
         delimiter: delimiter.value,
         skipEmptyLines: true
       })
       if (parsed.errors.length) {
         error.value = parsed.errors[0].message
         return
       }
       const data = headerRow.value ? parsed.data as Array<Record<string, any>> : (parsed.data as any[])
       output.value = JSON.stringify(data, null, 2)
       if (headerRow.value) previewRows.value = data.slice(0, 10)
       justConverted.value = true
       celebrateFirstUse('csv-to-json')
     } else {
       const json = JSON.parse(input.value)
       const arr = Array.isArray(json) ? json : [json]
       const csv = Papa.unparse(arr, { delimiter: delimiter.value })
       output.value = csv
       justConverted.value = true
       celebrateFirstUse('csv-to-json')
     }
   } catch (e: any) {
     error.value = e?.message || 'Conversion failed. Please check your input.'
   }
 }

 const copyOutput = async () => {
   if (!output.value) return
   await copyWithFeedback(output.value)
 }

 const downloadOutput = () => {
   if (!output.value) return
   const blob = new Blob([output.value], { type: mode.value === 'csv-to-json' ? 'application/json' : 'text/csv' })
   const filename = mode.value === 'csv-to-json' ? 'converted.json' : 'converted.csv'
   saveAs(blob, filename)
 }
 </script>

 <style scoped>
 .input-brutal { @apply w-full p-3 border-4 border-black bg-white dark:bg-brutal-black text-black dark:text-white; }
 .btn-primary { @apply px-4 py-2 border-4 border-black shadow-brutal font-black; }
 .btn-primary-yellow { @apply bg-brutal-yellow; }
 .btn-primary-lime { @apply bg-brutal-lime; }
 .btn-primary-pink { @apply bg-brutal-pink; }
 .card-brutal-white { @apply bg-brutal-white; }
 .card-brutal-black { @apply bg-brutal-black; }
 </style>

