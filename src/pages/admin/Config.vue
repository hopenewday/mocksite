<template>
  <section class="max-w-6xl mx-auto px-4 py-10">
    <h2 class="text-xl font-semibold mb-4">
      System Configuration
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
      class="grid sm:grid-cols-3 gap-3 mb-6"
      @submit.prevent="save"
    >
      <input
        v-model="key"
        class="input"
        placeholder="Key"
        :disabled="isLoading"
      >
      <input
        v-model="value"
        class="input"
        placeholder="JSON Value"
        :disabled="isLoading"
      >
      <button 
        class="btn-primary flex items-center justify-center gap-2"
        :disabled="isLoading"
      >
        <LoadingSpinner
          v-if="isLoading"
          class="w-4 h-4"
        />
        <span>Save</span>
      </button>
    </form>

    <div
      v-if="isLoading && !configs.length"
      class="flex justify-center p-8"
    >
      <LoadingSpinner class="w-8 h-8 text-brutal-black" />
    </div>

    <div
      v-else
      class="grid gap-3"
    >
      <div
        v-if="configs.length === 0"
        class="text-center py-8 text-neutral-500"
      >
        No configurations found.
      </div>
      <div
        v-for="c in configs"
        :key="c.key"
        class="card p-5 grid sm:grid-cols-3 gap-3 items-center"
      >
        <div class="font-semibold">
          {{ c.key }}
        </div>
        <div class="text-sm">
          {{ c.value }}
        </div>
        <div class="flex gap-2">
          <button
            class="btn-secondary"
            :disabled="isLoading"
            @click="edit(c)"
          >
            Edit
          </button>
          <button
            class="btn-secondary"
            :disabled="isLoading"
            @click="history(c.key)"
          >
            History
          </button>
        </div>
      </div>
    </div>
    
    <div
      v-if="hist.length"
      class="mt-6 border rounded p-4"
    >
      <div class="font-medium mb-2">
        Version History
      </div>
      <ul class="space-y-1">
        <li
          v-for="h in hist"
          :key="h.version"
        >
          v{{ h.version }} • {{ h.updated_at }} • {{ h.value }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
import ErrorBanner from '@/components/ErrorBanner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const key = ref('')
const value = ref('')
const configs = ref<{ key: string; value: string }[]>([])
const hist = ref<{ version: number; value: string; updated_at: string }[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function load() {
  errorMessage.value = ''
  try {
    const { data, error } = await supabase.from('configs').select('key, value')
    if (error) throw error
    configs.value = (data || []).map((x: any) => ({ key: x.key, value: JSON.stringify(x.value) }))
  } catch (err: any) {
    console.error('Config load error:', err)
    errorMessage.value = 'Failed to load configs: ' + (err.message || 'Unknown error')
  }
}

async function save() {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const parsed = JSON.parse(value.value)
    const { error } = await supabase.rpc('upsert_config', { p_key: key.value, p_value: parsed })
    if (error) throw error
    
    key.value = ''
    value.value = ''
    successMessage.value = 'Configuration saved successfully!'
    await load()
  } catch (err: any) {
    console.error('Config save error:', err)
    errorMessage.value = 'Failed to save config: ' + (err.message || 'Invalid JSON?')
  } finally {
    isLoading.value = false
  }
}

function edit(c: { key: string; value: string }) { 
  key.value = c.key; 
  value.value = c.value 
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function history(k: string) {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data, error } = await supabase.from('configs_history').select('version, value, updated_at').eq('key', k).order('version', { ascending: false }).range(0, 9)
    if (error) throw error
    hist.value = (data || []).map((x: any) => ({ version: x.version, value: JSON.stringify(x.value), updated_at: x.updated_at }))
  } catch (err: any) {
    console.error('History load error:', err)
    errorMessage.value = 'Failed to load history: ' + (err.message || 'Unknown error')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  await load()
  isLoading.value = false
})
</script>
