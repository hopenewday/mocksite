<template>
  <section class="max-w-3xl mx-auto px-4 py-10">
    <h2 class="text-xl font-semibold mb-6">
      Bulk CSV Upload
    </h2>

    <ErrorBanner 
      v-if="errorMessage" 
      :message="errorMessage" 
      class="mb-6"
    />
    
    <div
      v-if="successMessage"
      class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg"
    >
      {{ successMessage }}
    </div>

    <input
      type="file"
      accept=".csv"
      class="input"
      :disabled="isLoading"
      @change="onFile"
    >
    <div
      v-if="isValidating"
      class="mt-4"
    >
      <LoadingSpinner class="w-4 h-4 inline-block mr-2" /> Validating CSV...
    </div>
    <div
      v-else-if="count > 0"
      class="mt-4"
    >
      <span class="font-medium text-green-600">{{ count }} rows ready to upload</span>
    </div>
    
    <button
      class="mt-4 btn-primary flex items-center justify-center gap-2"
      :disabled="isLoading || count === 0"
      @click="uploadAndLog"
    >
      <LoadingSpinner
        v-if="isLoading"
        class="w-4 h-4"
      />
      <span>{{ isLoading ? 'Uploading...' : 'Upload' }}</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import Papa from 'papaparse'
import { ref } from 'vue'
import { QuestionCSVSchema } from '@/lib/validation'
import type { QuestionCSVRow } from '@/lib/validation'
import { uploadCSV } from '@/lib/api'
import { supabase } from '@/supabase/client'
import ErrorBanner from '@/components/ErrorBanner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const rows = ref<QuestionCSVRow[]>([])
const count = ref(0)
const isLoading = ref(false)
const isValidating = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function onFile(e: Event) {
  errorMessage.value = ''
  successMessage.value = ''
  rows.value = []
  count.value = 0
  
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  isValidating.value = true
  
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (res) => {
      isValidating.value = false
      try {
        if (res.errors && res.errors.length > 0) {
          throw new Error(`CSV Parsing Error: ${res.errors[0].message} on line ${res.errors[0].row}`)
        }
        
        const valid = res.data.map((x: Record<string, unknown>, index) => {
          try {
            return QuestionCSVSchema.parse({
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
            })
          } catch (z_err: any) {
            throw new Error(`Row ${index + 1} validation invalid: ${z_err.message}`)
          }
        })
        rows.value = valid
        count.value = valid.length
      } catch (err: any) {
        console.error('CSV validation error:', err)
        errorMessage.value = err.message
        rows.value = []
        count.value = 0
      }
    },
    error: (err) => {
      isValidating.value = false
      console.error('Papa parse error:', err)
      errorMessage.value = 'Failed to read file: ' + err.message
    }
  })
}

async function onUploadedLog() { 
  await supabase.from('admin_audit_logs').insert({ 
    action: 'bulk_upload', 
    meta: { count: count.value } 
  }) 
}

async function uploadAndLog() { 
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    await uploadCSV(rows.value)
    await onUploadedLog()
    successMessage.value = `Successfully uploaded ${count.value} questions!`
    rows.value = []
    count.value = 0
  } catch (err: any) {
    console.error('Upload error:', err)
    errorMessage.value = 'Upload failed: ' + (err.message || 'Server error')
  } finally {
    isLoading.value = false
  }
}
</script>
