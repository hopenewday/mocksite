<template>
  <section class="max-w-4xl mx-auto px-4 py-10">
    <h2 class="text-xl font-semibold mb-4">
      Analytics
    </h2>
    <div class="grid sm:grid-cols-2 gap-6">
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
        <ul class="space-y-1">
          <li
            v-for="g in byDifficulty"
            :key="g.difficulty"
          >
            {{ g.difficulty }}: {{ g.avg }} ({{ g.count }})
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
const avgScore = ref(0)
const attempts = ref(0)
const byDifficulty = ref<{ difficulty: 'easy'|'medium'|'hard'; count: number; avg: number }[]>([])
onMounted(async () => {
  const { data: userData } = await supabase.auth.getUser()
  const uid = userData?.user?.id
  if (!uid) { attempts.value = 0; avgScore.value = 0; return }
  const { data } = await supabase.from('user_attempts').select('score, test_id').eq('user_id', uid)
  type AttemptRow = { score: number | null; test_id: string }
  const attemptsRows = ((data || []) as AttemptRow[])
  const scores = attemptsRows.map((x) => x.score || 0)
  attempts.value = scores.length
  avgScore.value = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const ids = Array.from(new Set(attemptsRows.map(a => a.test_id)))
  if (ids.length) {
    const { data: tests } = await supabase.from('tests').select('id, difficulty').in('id', ids)
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
    byDifficulty.value = (['easy','medium','hard'] as const).map((d) => ({ difficulty: d, count: groups[d].count, avg: groups[d].count ? Math.round(groups[d].total / groups[d].count) : 0 }))
  }
})
</script>
