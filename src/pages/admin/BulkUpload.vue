<template>
  <section class="max-w-3xl mx-auto px-4 py-10">
    <h2 class="text-xl font-semibold mb-6">
      Bulk CSV Upload
    </h2>
    <input
      type="file"
      accept=".csv"
      class="input"
      @change="onFile"
    >
    <div class="mt-4">
      {{ count }} rows ready
    </div>
    <button
      class="mt-4 btn-primary"
      @click="upload"
    >
      Upload
    </button>
  </section>
</template>

<script setup lang="ts">
import Papa from 'papaparse'
import { ref } from 'vue'
import { QuestionCSVSchema } from '@/lib/validation'
import type { QuestionCSVRow } from '@/lib/validation'
import { uploadCSV } from '@/lib/api'
const rows = ref<QuestionCSVRow[]>([])
const count = ref(0)
function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (res) => {
      const valid = res.data.map((x: Record<string, unknown>) => QuestionCSVSchema.parse({
        test_id: x.test_id,
        type: x.type || 'mcq',
        content_en: x.content_en,
        content_hi: x.content_hi,
        options: x.options,
        correct_answer: Number(x.correct_answer),
        topic: x.topic,
        section: x.section,
        explanation_en: x.explanation_en,
        explanation_hi: x.explanation_hi
      }))
      rows.value = valid
      count.value = valid.length
    }
  })
}
async function upload() { await uploadCSV(rows.value) }
</script>
