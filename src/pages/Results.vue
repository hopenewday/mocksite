<template>
  <section class="max-w-4xl mx-auto px-4 py-12 text-center">
    <ScoreCard
      :title="t('results.title')"
      :percent="percent"
      :correct="correct"
      :incorrect="incorrect"
      :unanswered="unanswered"
      :correct-label="t('results.correct')"
      :incorrect-label="t('results.incorrect')"
      :unanswered-label="t('results.unanswered')"
    />
    <div class="mt-8 flex items-center justify-center">
      <BarChart
        :values="blockValues"
        :width="360"
        :height="120"
      />
    </div>
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="p-4 border rounded">
        {{ t('results.correct') }}: {{ correct }}
      </div>
      <div class="p-4 border rounded">
        {{ t('results.incorrect') }}: {{ incorrect }}
      </div>
      <div class="p-4 border rounded">
        {{ t('results.unanswered') }}: {{ unanswered }}
      </div>
    </div>
    <router-link
      to="/tests"
      class="btn-primary"
    >
      {{ t('nav.tests') }}
    </router-link>
    <div class="mt-8 space-y-6 text-left">
      <div
        v-for="q in visibleQuestions"
        :key="q.id"
        class="card p-5"
      >
        <div class="font-medium mb-2">
          {{ locale === 'hi' ? q.content_hi?.text || q.content_hi : q.content_en?.text || q.content_en }}
        </div>
        <div class="text-sm mb-2">
          Your answer: {{ (answerFor(q)?.text ?? '').trim() || (answerFor(q)?.option_index != null ? q.options[answerFor(q).option_index] : '—') }}
        </div>
        <div
          class="text-sm"
          :class="(answerFor(q)?.option_index === q.correct_answer) ? 'text-green-600' : 'text-red-600'"
        >
          Correct: {{ q.options[q.correct_answer] }}
        </div>
        <div class="mt-2 text-neutral-700 dark:text-neutral-300">
          {{ locale === 'hi' ? q.explanation_hi : q.explanation_en }}
        </div>
      </div>
      <div
        ref="sentinel"
        class="h-10"
      />
      <div
        v-if="loading"
        class="mt-4"
        aria-live="polite"
      >
        <LoadingSpinner />
      </div>
      <div
        v-if="error"
        class="mt-4"
        aria-live="polite"
      >
        <ErrorBanner :message="error" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/supabase/client'
import ScoreCard from '@/components/ScoreCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import BarChart from '@/components/BarChart.vue'
import { useSettingsStore } from '@/stores/settings'
import { useConfetti } from '@/composables/useConfetti'

const { t } = useI18n()
const settings = useSettingsStore()
const route = useRoute()
const { triggerConfetti } = useConfetti()
const percent = ref(0)
const correct = ref(0)
const incorrect = ref(0)
const unanswered = ref(0)
type Content = string | { text?: string } | null
type StoredAnswer = { question_id: string; option_index: number | null; marked?: boolean; text?: string | null }
type QuestionRow = { id: string; content_en: Content; content_hi: Content; options: string[]; correct_answer: number; explanation_en?: string; explanation_hi?: string }
const questions = ref<QuestionRow[]>([])
const visibleQuestions = ref<QuestionRow[]>([])
const sentinel = ref<HTMLElement | null>(null)
const loading = ref(false)
const error = ref('')
const chunk = 8
const answers = ref<StoredAnswer[]>([])
const answersById = ref<Map<string, StoredAnswer>>(new Map())
function answerFor(q: QuestionRow) { return answersById.value.get(q.id) }
const blockValues = computed(() => {
  const size = 5
  const blocks: number[] = []
  for (let i = 0; i < visibleQuestions.value.length; i += size) {
    const slice = visibleQuestions.value.slice(i, i + size)
    let correct = 0
    for (const q of slice) {
      const a = answersById.value.get(q.id)
      if (a && a.option_index === q.correct_answer) correct++
    }
    const val = slice.length ? correct / slice.length : 0
    blocks.push(val)
  }
  return blocks
})
const locale = computed(() => settings.locale)

onMounted(async () => {
  const id = route.params.attemptId as string
  
  // Try to get from Supabase first, then fallback to localStorage
  let attempt = null
  try {
    const { data } = await supabase.from('user_attempts').select('*').eq('id', id).single()
    attempt = data
  } catch (error) {
    console.warn('Failed to fetch from Supabase, trying localStorage:', error)
  }
  
  // Fallback to localStorage if Supabase fails or data not found
  if (!attempt) {
    const stored = localStorage.getItem(`results:${id}`)
    if (stored) {
      attempt = JSON.parse(stored)
      // Use the questions stored with the attempt
      questions.value = attempt.questions || []
      answers.value = attempt.answers || []
      answersById.value = new Map(answers.value.map((a) => [a.question_id, a]))
      const total = questions.value.length
      const sc = attempt.score || 0
      correct.value = Math.round((sc / 100) * total)
      incorrect.value = total - correct.value
      unanswered.value = answers.value.filter((a) => a.option_index === null).length
      
      gsap.fromTo('#score', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' })
      gsap.to(percent, { value: sc, duration: 1, onUpdate: () => { percent.value = Math.round(percent.value as unknown as number) } })
      if (sc >= 90) triggerConfetti()
      return
    }
  }
  
  // Original Supabase flow
  if (!attempt) return
  answers.value = (attempt.answers || []) as StoredAnswer[]
  answersById.value = new Map(answers.value.map((a) => [a.question_id, a]))
  await fetchRange(attempt.test_id, 0, chunk)
  const total = questions.value.length
  const sc = attempt.score || 0
  correct.value = Math.round((sc / 100) * total)
  incorrect.value = total - correct.value
  unanswered.value = answers.value.filter((a) => a.option_index === null).length
  gsap.fromTo('#score', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' })
  gsap.to(percent, { value: sc, duration: 1, onUpdate: () => { percent.value = Math.round(percent.value as unknown as number) } })
  if (sc >= 90) triggerConfetti()
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) loadMore()
    }
  })
  if (sentinel.value) io.observe(sentinel.value)
})


let offset = 0
let testIdRef = ''

async function loadMore() {
  if (loading.value) return
  loading.value = true
  try {
    await fetchRange(testIdRef, offset, chunk)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to load more questions'
  } finally {
    loading.value = false
  }
}

async function fetchRange(testId: string, start: number, count: number) {
  testIdRef = testId
  const end = start + count - 1
  const { data, error: qErr } = await supabase.from('questions').select('*').eq('test_id', testId).range(start, end)
  if (qErr) throw qErr
  const rows = data || []
  questions.value = [...questions.value, ...rows]
  visibleQuestions.value = questions.value
  offset += rows.length
}
</script>
 
