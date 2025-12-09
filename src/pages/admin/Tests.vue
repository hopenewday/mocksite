<template>
  <section class="max-w-5xl mx-auto px-4 py-10">
    <h2 class="text-xl font-semibold mb-4">
      Tests
    </h2>
    
    <ErrorBanner 
      v-if="errorMessage" 
      :message="errorMessage" 
      class="mb-6"
    />

    <form
      class="grid sm:grid-cols-2 gap-3 mb-6"
      @submit.prevent="create"
    >
      <input
        v-model="title"
        class="input"
        placeholder="Title"
        :disabled="isLoading"
        required
      >
      <input
        v-model="exam"
        class="input"
        placeholder="Exam"
        :disabled="isLoading"
        required
      >
      <select
        v-model="difficulty"
        class="select"
        :disabled="isLoading"
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
        :disabled="isLoading"
        required
      >
      <select
        v-model="language"
        class="select"
        :disabled="isLoading"
      >
        <option value="en">
          EN
        </option>
        <option value="hi">
          HI
        </option>
      </select>
      <input
        v-model.number="passingScore"
        type="number"
        min="0"
        max="100"
        class="input"
        placeholder="Passing Score (%)"
        :disabled="isLoading"
        required
      >
      <select
        v-model="retakePolicy"
        class="select"
        :disabled="isLoading"
      >
        <option value="no_limit">
          No Limit
        </option>
        <option value="once">
          Once
        </option>
        <option value="thrice">
          Thrice
        </option>
        <option value="cooldown">
          Cooldown
        </option>
      </select>
      <select
        v-model="categoryId"
        class="select"
        :disabled="isLoading"
      >
        <option :value="''">
          No Category
        </option>
        <option
          v-for="c in categories"
          :key="c.id"
          :value="c.id"
        >
          {{ c.name }}
        </option>
      </select>
      <select
        v-model="moduleId"
        class="select"
        :disabled="isLoading"
      >
        <option :value="''">
          No Module
        </option>
        <option
          v-for="m in modules"
          :key="m.id"
          :value="m.id"
        >
          {{ m.name }}
        </option>
      </select>
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

    <div
      v-if="lastCreatedId"
      class="mb-4 text-green-600 font-medium p-3 bg-green-50 border border-green-200 rounded"
    >
      Successfully created Test ID: <span class="font-mono">{{ lastCreatedId }}</span>
    </div>

    <div
      v-if="isLoading && !tests.length"
      class="flex justify-center p-8"
    >
      <LoadingSpinner class="w-8 h-8 text-brutal-black" />
    </div>

    <div
      v-else
      class="grid gap-3"
    >
      <div
        v-if="tests.length === 0"
        class="text-center py-8 text-neutral-500"
      >
        No tests found. Create one to get started.
      </div>
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
          class="btn-secondary text-red-600 hover:bg-red-50 border-red-200"
          :disabled="isLoading"
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
import { createTest, deleteTest } from '@/lib/adminApi'
import ErrorBanner from '@/components/ErrorBanner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const title = ref('')
const exam = ref('')
const difficulty = ref<'easy'|'medium'|'hard'>('easy')
const duration = ref(30)
const language = ref<'en'|'hi'>('en')
const passingScore = ref(40)
const retakePolicy = ref<'no_limit'|'once'|'thrice'|'cooldown'>('no_limit')
const categoryId = ref('')
const moduleId = ref('')
const tests = ref<TestItem[]>([])
const lastCreatedId = ref('')
const categories = ref<Array<{ id: string; name: string }>>([])
const modules = ref<Array<{ id: string; name: string }>>([])

const isLoading = ref(false)
const errorMessage = ref('')

async function fetchTests() {
  errorMessage.value = ''
  try {
    const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false })
    if (error) throw error
    tests.value = data || []
  } catch (err: any) {
    console.error('Error fetching tests:', err)
    errorMessage.value = 'Failed to load tests: ' + (err.message || 'Unknown error')
  }
}

async function fetchTaxonomy() {
  try {
    const [cats, mods] = await Promise.all([
      supabase.from('test_categories').select('id, name').order('name'),
      supabase.from('test_modules').select('id, name').order('name')
    ])
    
    if (cats.error) throw cats.error
    if (mods.error) throw mods.error
    
    categories.value = cats.data || []
    modules.value = mods.data || []
  } catch (err: any) {
    console.error('Error fetching taxonomy:', err)
    // Don't block UI for taxonomy failures, just log it
    // But maybe show a warning if empty?
  }
}

async function create() {
  isLoading.value = true
  errorMessage.value = ''
  lastCreatedId.value = ''
  
  try {
    const res = await createTest({
      title: title.value,
      exam: exam.value,
      difficulty: difficulty.value,
      duration_minutes: duration.value,
      language: language.value
    })
    
    if (!res?.id) throw new Error('Create response missing ID')
    
    lastCreatedId.value = String(res.id)
    
    // Reset form
    title.value = ''
    exam.value = ''
    difficulty.value = 'easy'
    duration.value = 30
    language.value = 'en'
    passingScore.value = 40
    retakePolicy.value = 'no_limit'
    categoryId.value = ''
    moduleId.value = ''
    
    await fetchTests()
  } catch (err: any) {
    console.error('Create test error:', err)
    errorMessage.value = 'Failed to create test: ' + (err.message || 'Server error')
  } finally {
    isLoading.value = false
  }
}

async function remove(id: string) {
  if (!confirm('Are you sure you want to delete this test? This cannot be undone.')) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await deleteTest(id)
    await fetchTests()
  } catch (err: any) {
    console.error('Delete test error:', err)
    errorMessage.value = 'Failed to delete test: ' + (err.message || 'Server error')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => { 
  isLoading.value = true
  await Promise.all([fetchTests(), fetchTaxonomy()])
  isLoading.value = false
})
</script>
