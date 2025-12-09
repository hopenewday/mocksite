<template>
  <section class="max-w-4xl mx-auto px-4 py-10">
    <h2 class="text-xl font-semibold mb-4">
      Questions
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

    <form
      class="space-y-3"
      @submit.prevent="create"
    >
      <input
        v-model="testId"
        class="input"
        placeholder="Test ID"
        :disabled="isLoading"
        required
      >
      <select
        v-model="type"
        class="select"
        :disabled="isLoading"
      >
        <option value="mcq">
          Multiple Choice
        </option>
        <option value="tf">
          True/False
        </option>
        <option value="fib">
          Fill in the Blank
        </option>
        <option value="match">
          Matching
        </option>
      </select>
      <textarea
        v-model="contentEn"
        class="textarea"
        placeholder="Content EN"
        :disabled="isLoading"
      />
      <textarea
        v-model="contentHi"
        class="textarea"
        placeholder="Content HI"
        :disabled="isLoading"
      />
      <input
        v-model="topic"
        class="input"
        placeholder="Topic"
        :disabled="isLoading"
      >
      <input
        v-model="section"
        class="input"
        placeholder="Section"
        :disabled="isLoading"
      >
      <textarea
        v-model="optionsRaw"
        class="textarea"
        placeholder="Options comma separated"
        :disabled="isLoading"
      />
      <input
        v-model.number="correct"
        type="number"
        min="0"
        class="input"
        placeholder="Correct index"
        :disabled="isLoading"
      >
      <textarea
        v-model="expEn"
        class="textarea"
        placeholder="Explanation EN"
        :disabled="isLoading"
      />
      <textarea
        v-model="expHi"
        class="textarea"
        placeholder="Explanation HI"
        :disabled="isLoading"
      />
      <button 
        class="btn-primary flex items-center justify-center gap-2"
        :disabled="isLoading"
      >
        <LoadingSpinner
          v-if="isLoading"
          class="w-4 h-4"
        />
        <span>{{ isLoading ? 'Creating...' : 'Create' }}</span>
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/supabase/client'
import ErrorBanner from '@/components/ErrorBanner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const testId = ref('')
const type = ref<'mcq'|'tf'|'fib'|'match'>('mcq')
const contentEn = ref('')
const contentHi = ref('')
const topic = ref('')
const section = ref('')
const optionsRaw = ref('')
const correct = ref(0)
const expEn = ref('')
const expHi = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function create() {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { error } = await supabase.from('questions').insert({
      test_id: testId.value,
      type: type.value,
      content_en: { text: contentEn.value },
      content_hi: { text: contentHi.value },
      topic: topic.value || null,
      section: section.value || null,
      options: optionsRaw.value.split(',').map(x => x.trim()),
      correct_answer: correct.value,
      explanation_en: expEn.value,
      explanation_hi: expHi.value
    })
    
    if (error) throw error

    await supabase.from('admin_audit_logs').insert({ 
      action: 'create_question', 
      meta: { test_id: testId.value, type: type.value } 
    }).catch(err => console.error('Audit log failed', err))

    successMessage.value = 'Question created successfully!'
    
    // Clear form
    contentEn.value = ''
    contentHi.value = ''
    optionsRaw.value = ''
    expEn.value = ''
    expHi.value = ''
  } catch (err: any) {
    console.error('Create question error:', err)
    errorMessage.value = 'Failed to create question: ' + (err.message || 'Unknown error')
  } finally {
    isLoading.value = false
  }
}
</script>
