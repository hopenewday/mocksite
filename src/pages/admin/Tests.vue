<template>
  <section class="max-w-5xl mx-auto px-4 py-10">
    <h2 class="text-xl font-semibold mb-4">
      Tests
    </h2>
    <form
      class="grid sm:grid-cols-2 gap-3 mb-6"
      @submit.prevent="create"
    >
      <input
        v-model="title"
        class="input"
        placeholder="Title"
      >
      <input
        v-model="exam"
        class="input"
        placeholder="Exam"
      >
      <select
        v-model="difficulty"
        class="select"
      >
        <option value="easy">
          Easy
        </option>
        <option value="medium">
          Medium
        </option>
        <option value="hard">
          Hard
        </option>
      </select>
      <input
        v-model.number="duration"
        type="number"
        min="1"
        class="input"
        placeholder="Duration (min)"
      >
      <select
        v-model="language"
        class="select"
      >
        <option value="en">
          EN
        </option>
        <option value="hi">
          HI
        </option>
      </select>
      <button class="btn-primary">
        Create
      </button>
    </form>
    <div class="grid gap-3">
      <div
        v-for="t in tests"
        :key="t.id"
        class="card p-5 flex items-center gap-3"
      >
        <div class="flex-1">
          <div class="font-semibold">
            {{ t.title }}
          </div>
          <div class="text-sm text-neutral-600">
            {{ t.exam }} • {{ t.difficulty }} • {{ t.duration_minutes }}m • {{ t.language }}
          </div>
        </div>
        <button
          class="btn-secondary"
          @click="remove(t.id)"
        >
          Delete
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
import type { TestItem } from '@/stores/tests'

const title = ref('')
const exam = ref('')
const difficulty = ref<'easy'|'medium'|'hard'>('easy')
const duration = ref(30)
const language = ref<'en'|'hi'>('en')
const tests = ref<TestItem[]>([])

async function fetchTests() {
  const { data } = await supabase.from('tests').select('*').order('created_at', { ascending: false })
  tests.value = data || []
}

async function create() {
  const { error } = await supabase.from('tests').insert({
    title: title.value,
    exam: exam.value,
    difficulty: difficulty.value,
    duration_minutes: duration.value,
    language: language.value
  })
  if (error) throw error
  title.value = ''
  exam.value = ''
  difficulty.value = 'easy'
  duration.value = 30
  language.value = 'en'
  await fetchTests()
}

async function remove(id: string) {
  const { error } = await supabase.from('tests').delete().eq('id', id)
  if (error) throw error
  await fetchTests()
}

onMounted(fetchTests)
</script>
