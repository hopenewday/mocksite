<template>
  <section class="max-w-4xl mx-auto px-4 py-10">
    <h2 class="text-xl font-semibold mb-4">
      Questions
    </h2>
    <form
      class="space-y-3"
      @submit.prevent="create"
    >
      <input
        v-model="testId"
        class="input"
        placeholder="Test ID"
      >
      <select
        v-model="type"
        class="select"
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
      />
      <textarea
        v-model="contentHi"
        class="textarea"
        placeholder="Content HI"
      />
      <input
        v-model="topic"
        class="input"
        placeholder="Topic"
      >
      <input
        v-model="section"
        class="input"
        placeholder="Section"
      >
      <textarea
        v-model="optionsRaw"
        class="textarea"
        placeholder="Options comma separated"
      />
      <input
        v-model.number="correct"
        type="number"
        min="0"
        class="input"
        placeholder="Correct index"
      >
      <textarea
        v-model="expEn"
        class="textarea"
        placeholder="Explanation EN"
      />
      <textarea
        v-model="expHi"
        class="textarea"
        placeholder="Explanation HI"
      />
      <button class="btn-primary">
        Create
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/supabase/client'
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
async function create() {
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
}
</script>
