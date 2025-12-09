<template>
  <section class="max-w-4xl mx-auto px-4 py-10">
    <h2 class="text-xl font-semibold mb-4">
      Analytics
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
      class="grid sm:grid-cols-2 gap-6"
    >
      <div class="border rounded p-4">
        Avg Score: {{ avgScore }}
      </div>
      <div class="border rounded p-4">
        Attempts: {{ attempts }}
      </div>
      <div class="border rounded p-4 sm:col-span-2">
        <div class="font-medium mb-2">
          Avg by difficulty
        </div>
        <ul
          v-if="byDifficulty.length"
          class="space-y-1"
        >
          <li
            v-for="g in byDifficulty"
            :key="g.difficulty"
          >
            {{ g.difficulty }}: {{ g.avg }} ({{ g.count }})
          </li>
        </ul>
        <div
          v-else
          class="text-gray-500 italic"
        >
          No data available.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
import ErrorBanner from '@/components/ErrorBanner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const avgScore = ref(0)
const attempts = ref(0)
const byDifficulty = ref<{ difficulty: 'easy'|'medium'|'hard'; count: number; avg: number }[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    
    const uid = userData?.user?.id
    if (!uid) { 
      attempts.value = 0; 
      avgScore.value = 0; 
      return 
    }
    
    const { data, error: attemptsError } = await supabase.from('user_attempts').select('score, test_id').eq('user_id', uid)
    if (attemptsError) throw attemptsError
    
    type AttemptRow = { score: number | null; test_id: string }
    const attemptsRows = ((data || []) as AttemptRow[])
    const scores = attemptsRows.map((x) => x.score || 0)
    
    attempts.value = scores.length
    avgScore.value = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    
    const ids = Array.from(new Set(attemptsRows.map(a => a.test_id)))
    if (ids.length) {
      const { data: tests, error: testsError } = await supabase.from('tests').select('id, difficulty').in('id', ids)
      if (testsError) throw testsError
      
      const diffMap = new Map<string, 'easy'|'medium'|'hard'>()
      for (const t of tests || []) diffMap.set(t.id, t.difficulty)
      
      const groups: Record<'easy'|'medium'|'hard', { total: number; count: number }> = {
        easy: { total: 0, count: 0 },
        medium: { total: 0, count: 0 },
        hard: { total: 0, count: 0 }
      }
      
      for (const a of attemptsRows) {
        const d = diffMap.get(a.test_id) || 'easy'
        groups[d].total += (a.score || 0)
        groups[d].count += 1
      }
      
      byDifficulty.value = (['easy','medium','hard'] as const).map((d) => ({ 
        difficulty: d, 
        count: groups[d].count, 
        avg: groups[d].count ? Math.round(groups[d].total / groups[d].count) : 0 
      }))
    }
  } catch (err: any) {
    console.error('Analytics load error:', err)
    errorMessage.value = 'Failed to load analytics: ' + (err.message || 'Unknown error')
  } finally {
    isLoading.value = false
  }
})
</script>
