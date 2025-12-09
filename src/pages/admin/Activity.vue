<template>
  <section class="max-w-6xl mx-auto px-4 py-10">
    <h2 class="text-xl font-semibold mb-4">
      Activity Monitoring
    </h2>
    
    <ErrorBanner 
      v-if="errorMessage" 
      :message="errorMessage" 
      class="mb-6"
    />

    <div
      v-if="isLoading"
      class="flex justify-center p-8"
    >
      <LoadingSpinner class="w-8 h-8 text-brutal-black" />
    </div>

    <div
      v-else
      class="grid gap-6"
    >
      <div class="border rounded p-4">
        <div class="font-medium mb-2">
          Recent Admin Actions
        </div>
        <ul
          v-if="logs.length"
          class="space-y-2"
        >
          <li
            v-for="log in logs"
            :key="log.id"
          >
            {{ log.created_at }} • {{ log.action }} • {{ log.user_id }}
          </li>
        </ul>
        <div
          v-else
          class="text-gray-500 italic"
        >
          No recent activity logs found.
        </div>
      </div>
      <div class="border rounded p-4">
        <div class="font-medium mb-2">
          Actions by Type
        </div>
        <BarChart
          v-if="labels.length"
          :labels="labels"
          :values="values"
        />
        <div
          v-else
          class="text-gray-500 italic"
        >
          No chart data available.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
import BarChart from '@/components/BarChart.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const logs = ref<{ id: string; user_id: string; action: string; created_at: string }[]>([])
const labels = ref<string[]>([])
const values = ref<number[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

async function fetchLogs() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data, error } = await supabase.from('admin_audit_logs').select('id, user_id, action, created_at').order('created_at', { ascending: false }).range(0, 49)
    if (error) throw error
    
    const arr = (data || []) as any[]
    logs.value = arr
    
    const counts: Record<string, number> = {}
    arr.forEach(x => { counts[x.action] = (counts[x.action] || 0) + 1 })
    labels.value = Object.keys(counts)
    values.value = Object.values(counts)
  } catch (err: any) {
    console.error('Activity logs error:', err)
    errorMessage.value = 'Failed to load activity logs: ' + (err.message || 'Unknown error')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchLogs)
</script>
