<template>
  <section class="max-w-5xl mx-auto px-4 py-10">
    <h2 class="text-2xl font-semibold mb-6">
      My Assessments
    </h2>
    <div
      ref="list"
      class="space-y-4"
    >
      <div
        v-for="a in attempts"
        :key="a.id"
        class="card p-5"
      >
        <ScoreCard
          :title="a.test_title || 'Assessment'"
          :percent="a.score"
          :correct="Math.round((a.score/100)*a.total)"
          :incorrect="a.total - Math.round((a.score/100)*a.total)"
          :unanswered="a.unanswered"
          correct-label="Correct"
          incorrect-label="Incorrect"
          unanswered-label="Unanswered"
        />
        <div class="mt-3 flex gap-2">
          <router-link
            :to="{ name: 'results', params: { attemptId: a.id } }"
            class="btn-primary"
          >
            View Details
          </router-link>
        </div>
      </div>
      <div
        ref="sentinel"
        class="h-10"
      />
    </div>
    <div
      v-if="loading"
      class="mt-4"
    >
      <LoadingSpinner />
    </div>
    <div
      v-if="error"
      class="mt-4"
    >
      <ErrorBanner :message="error" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import ScoreCard from '@/components/ScoreCard.vue'

const limit = 10
let offset = 0
interface AttemptSummary { id: string; score: number; test_title?: string; total: number; unanswered: number }
const attempts = ref<AttemptSummary[]>([])
const loading = ref(false)
const error = ref('')
const sentinel = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)

async function loadMore() {
  if (loading.value) return
  loading.value = true
  try {
    const { data: userData } = await supabase.auth.getUser()
    const uid = userData?.user?.id
    if (!uid) { attempts.value = []; offset = 0; return }
    const { data } = await supabase
      .from('user_attempts')
      .select('id, score, test_id, completed_at, answers')
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1)
      .eq('user_id', uid as string)
    const rows = data || []
    for (const r of rows) {
      const { data: test } = await supabase.from('tests').select('title').eq('id', r.test_id).single()
      const { data: qs } = await supabase.from('questions').select('id').eq('test_id', r.test_id)
      const total = (qs || []).length
      const unanswered = (r.answers || []).filter((x: { option_index: number | null }) => x.option_index === null).length
      attempts.value.push({ id: r.id, score: r.score, test_title: test?.title, total, unanswered })
    }
    offset += rows.length
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to load assessments'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMore()
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) loadMore()
    }
  })
  if (sentinel.value) io.observe(sentinel.value)
})
</script>
