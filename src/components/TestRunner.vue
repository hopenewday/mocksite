<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black flex flex-col h-screen overflow-hidden">
    <!-- Top Header -->
    <header class="bg-brutal-yellow dark:bg-brutal-black border-b-4 border-black dark:border-brutal-white h-20 shrink-0 flex items-center justify-between px-4 lg:px-6 z-20 shadow-brutal-sm">
      <div class="flex items-center gap-4">
        <div class="bg-brutal-pink border-4 border-black shadow-brutal px-4 py-2 transform rotate-[-1deg]">
          <span class="font-black text-lg uppercase">TestRunner</span>
        </div>
        <div class="h-8 w-1 bg-brutal-cyan border-2 border-black shadow-brutal-sm mx-2" />
        <div class="bg-brutal-cyan border-2 border-black px-3 py-1 font-bold text-sm uppercase">
          {{ route.params.id }}
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="bg-brutal-white dark:bg-brutal-black border-4 border-black shadow-brutal px-4 py-2">
          <div class="text-xs font-black uppercase text-brutal-gray">
            {{ t('test.timeLeft') }}
          </div>
          <div
            class="text-2xl font-mono font-black leading-none"
            :class="{ 'text-brutal-red': remainingMs < 300000 }"
          >
            {{ minutes }}:{{ seconds }}
          </div>
        </div>
        <button
          class="btn-primary btn-primary-pink px-6 py-3 text-sm font-black uppercase"
          @click="submit"
        >
          {{ t('actions.submit') }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- Question Area (Left/Center) -->
      <main class="flex-1 flex flex-col overflow-hidden relative z-10">
        <!-- Subject Tabs -->
        <div class="bg-brutal-white dark:bg-brutal-black border-b-4 border-black dark:border-brutal-white px-4 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-hide shrink-0">
          <button 
            class="px-6 py-4 font-black text-lg border-b-4 border-brutal-lime bg-brutal-lime/20 transition-colors whitespace-nowrap transform rotate-[-0.5deg]"
          >
            General Awareness
          </button>
          <!-- Placeholder for other sections -->
          <button 
            class="px-6 py-4 font-black text-lg border-b-4 border-transparent text-brutal-gray opacity-50 cursor-not-allowed"
            disabled
          >
            Reasoning
          </button>
        </div>

        <!-- Question Header -->
        <div class="bg-brutal-cyan/20 border-b-4 border-black dark:border-brutal-white px-4 lg:px-8 py-4 flex items-center justify-between shrink-0">
          <div class="bg-brutal-white border-4 border-black shadow-brutal px-4 py-2 transform rotate-[-1deg]">
            <span class="font-black text-xl">Question {{ attempt.currentIndex + 1 }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="badge badge-lime font-black">+1.0 Mark</span>
            <span class="badge badge-pink font-black">-0.25 Mark</span>
          </div>
        </div>

        <!-- Question Body (Scrollable) -->
        <div class="flex-1 overflow-y-auto p-4 lg:p-8">
          <div class="max-w-3xl mx-auto">
            <transition
              name="fade"
              mode="out-in"
            >
              <div
                :key="current?.id"
                class="animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <!-- Question Text -->
                <div class="bg-brutal-white dark:bg-brutal-black border-4 border-black shadow-brutal p-8 mb-8 transform rotate-[0.5deg]">
                  <p class="text-xl lg:text-2xl font-black text-black dark:text-brutal-white leading-relaxed">
                    {{ content }}
                  </p>
                </div>

                <!-- Options -->
                <div class="space-y-4">
                  <template v-if="!current || current.type === 'mcq' || current.type === 'tf'">
                    <label
                      v-for="(opt, idx) in options"
                      :key="idx"
                      class="group relative flex items-start p-6 border-4 cursor-pointer transition-all duration-200 transform"
                      :class="[
                        answerIndex === idx 
                          ? 'border-brutal-lime bg-brutal-lime/20 shadow-brutal-lg rotate-[-1deg]' 
                          : 'border-black bg-brutal-white dark:bg-brutal-black hover:border-brutal-cyan hover:shadow-brutal hover:rotate-[-0.5deg]'
                      ]"
                    >
                      <div class="flex items-center h-8">
                        <input
                          type="radio"
                          :name="'q' + current?.id"
                          :checked="answerIndex === idx"
                          class="w-6 h-6 text-brutal-cyan border-4 border-black focus:ring-4 focus:ring-brutal-yellow/50"
                          @change="select(idx)"
                        >
                      </div>
                      <div class="ml-4 text-lg font-black text-black dark:text-brutal-white w-full">
                        {{ opt }}
                      </div>
                      <!-- Selection Indicator -->
                      <div 
                        v-if="answerIndex === idx"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-brutal-lime"
                      >
                        <svg
                          class="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </label>
                  </template>
                  
                  <template v-else-if="current.type === 'fib'">
                    <div class="relative">
                      <input
                        type="text"
                        class="w-full px-6 py-4 border-4 border-black bg-brutal-white dark:bg-brutal-black focus:border-brutal-cyan focus:ring-4 focus:ring-brutal-cyan/50 transition-colors text-lg font-black"
                        :value="fibText"
                        placeholder="Type your answer here..."
                        @input="onFibInput($event)"
                      >
                    </div>
                  </template>
                  
                  <template v-else-if="current.type === 'match'">
                    <div class="bg-brutal-yellow border-4 border-black shadow-brutal p-6">
                      <h3 class="font-black text-lg mb-4">
                        Match the following items:
                      </h3>
                      
                      <div class="grid md:grid-cols-2 gap-8">
                        <!-- Column A -->
                        <div>
                          <h4 class="font-bold mb-3">
                            Column A
                          </h4>
                          <div class="space-y-3">
                            <div 
                              v-for="(item, index) in current.columnA"
                              :key="index"
                              class="bg-brutal-white border-2 border-black p-3 cursor-pointer transform transition-all duration-200 hover:rotate-[-1deg]"
                              :class="{ 'ring-4 ring-brutal-cyan': selectedMatchA === index }"
                              @click="selectMatchA(index)"
                            >
                              <div class="font-black text-sm">
                                {{ index + 1 }}. {{ item }}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Column B -->
                        <div>
                          <h4 class="font-bold mb-3">
                            Column B
                          </h4>
                          <div class="space-y-3">
                            <div 
                              v-for="(item, index) in current.columnB"
                              :key="index"
                              class="bg-brutal-white border-2 border-black p-3 cursor-pointer transform transition-all duration-200 hover:rotate-[-1deg]"
                              :class="{ 'ring-4 ring-brutal-pink': selectedMatchB === index }"
                              @click="selectMatchB(index)"
                            >
                              <div class="font-black text-sm">
                                {{ String.fromCharCode(65 + index) }}. {{ item }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Matched Pairs -->
                      <div
                        v-if="matchedPairs.length > 0"
                        class="mt-6"
                      >
                        <h4 class="font-bold mb-3">
                          Your Matches:
                        </h4>
                        <div class="flex flex-wrap gap-2">
                          <div 
                            v-for="(pair, index) in matchedPairs"
                            :key="index"
                            class="bg-brutal-cyan text-white px-3 py-1 border-2 border-black font-black text-sm"
                          >
                            {{ pair.a + 1 }} ↔ {{ String.fromCharCode(65 + pair.b) }}
                            <button 
                              class="ml-2 text-white hover:text-brutal-pink"
                              @click="removeMatch(index)"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Match Button -->
                      <div class="mt-6 text-center">
                        <button 
                          v-if="selectedMatchA !== null && selectedMatchB !== null"
                          class="btn-primary btn-primary-lime px-6 py-2 font-black"
                          @click="addMatch"
                        >
                          Match {{ selectedMatchA + 1 }} with {{ String.fromCharCode(65 + selectedMatchB) }}
                        </button>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Bottom Action Bar -->
        <div class="bg-brutal-white dark:bg-brutal-black border-t-4 border-black dark:border-brutal-white p-4 flex flex-wrap gap-4 items-center justify-between shrink-0 z-20">
          <div class="flex gap-4">
            <button 
              class="btn-secondary px-6 py-3 font-black uppercase"
              @click="toggleMark"
            >
              {{ marked ? t('test.unmark') : t('test.mark') }}
            </button>
            <button 
              v-if="answerIndex !== null || fibText"
              class="btn-secondary px-6 py-3 font-black uppercase"
              @click="clearResponse"
            >
              {{ t('actions.clear') }}
            </button>
          </div>
          
          <div class="flex gap-4 ml-auto">
            <button 
              class="btn-secondary px-6 py-3 font-black uppercase"
              :disabled="attempt.currentIndex === 0"
              @click="prev"
            >
              {{ t('test.prev') }}
            </button>
            <button 
              class="btn-primary btn-primary-cyan px-8 py-3 font-black uppercase"
              @click="saveAndNext"
            >
              {{ t('actions.saveNext') }}
            </button>
          </div>
        </div>
      </main>

      <!-- Right Sidebar (Palette) -->
      <aside class="w-80 bg-brutal-white dark:bg-brutal-black border-l-4 border-black dark:border-brutal-white flex flex-col shrink-0 hidden xl:flex z-20">
        <!-- User Profile / Info -->
        <div class="p-4 border-b-4 border-black dark:border-brutal-white flex items-center gap-3">
          <div class="w-12 h-12 bg-brutal-yellow border-4 border-black shadow-brutal flex items-center justify-center font-black text-lg">
            U
          </div>
          <div>
            <div class="font-black text-lg">
              Candidate
            </div>
            <div class="text-sm font-bold uppercase text-brutal-gray">
              Roll No: 12345678
            </div>
          </div>
        </div>

        <!-- Palette Legend -->
        <div class="p-4 grid grid-cols-2 gap-3 text-xs font-bold border-b-4 border-black dark:border-brutal-white bg-brutal-cyan/20">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 border-4 border-black bg-brutal-lime text-black flex items-center justify-center font-black">
              1
            </div>
            <span>Answered</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 border-4 border-black bg-brutal-pink text-white flex items-center justify-center font-black">
              2
            </div>
            <span>Not Answered</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 border-4 border-black bg-brutal-gray text-brutal-white flex items-center justify-center font-black">
              3
            </div>
            <span>Not Visited</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 border-4 border-black bg-brutal-purple text-white flex items-center justify-center font-black relative">
              4
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-brutal-lime rounded-full border-2 border-black" />
            </div>
            <span>Marked + Ans</span>
          </div>
        </div>

        <!-- Question Grid -->
        <div class="flex-1 overflow-y-auto p-4">
          <div class="font-black text-sm text-brutal-gray mb-4 uppercase">
            General Awareness
          </div>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="(q, idx) in questions"
              :key="q.id"
              class="w-12 h-12 border-4 border-black flex items-center justify-center text-sm font-black transition-all hover:scale-105 focus:ring-4 focus:ring-brutal-yellow/50"
              :class="getPaletteClass(idx, q.id)"
              @click="attempt.jump(idx)"
            >
              {{ idx + 1 }}
              <div 
                v-if="isMarked(q.id) && isAnswered(q.id)" 
                class="absolute -top-1 -right-1 w-3 h-3 bg-brutal-lime rounded-full border-2 border-black"
              />
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- Mobile Palette Toggle (Visible only on small screens) -->
    <div class="xl:hidden fixed bottom-20 right-4 z-50">
      <button 
        class="w-16 h-16 bg-brutal-pink border-4 border-black shadow-brutal-lg flex items-center justify-center transform rotate-[2deg] hover:rotate-0 transition-transform"
        @click="showPalette = !showPalette"
      >
        <svg
          class="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    
    <!-- Mobile Palette Drawer -->
    <div
      v-if="showPalette"
      class="xl:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      @click="showPalette = false"
    >
      <div
        class="absolute right-0 top-0 bottom-0 w-80 bg-brutal-white dark:bg-brutal-black border-l-4 border-black shadow-brutal-lg flex flex-col"
        @click.stop
      >
        <div class="p-4 border-b-4 border-black flex justify-between items-center">
          <h3 class="font-black text-lg uppercase">
            Question Palette
          </h3>
          <button
            class="p-2 bg-brutal-yellow border-2 border-black hover:shadow-brutal transition-all"
            @click="showPalette = false"
          >
            <svg
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="(q, idx) in questions"
              :key="q.id"
              class="w-12 h-12 border-4 border-black flex items-center justify-center text-sm font-black transition-all"
              :class="getPaletteClass(idx, q.id)"
              @click="{ attempt.jump(idx); showPalette = false; }"
            >
              {{ idx + 1 }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAttemptStore } from '@/stores/attempt'
import { supabase } from '@/supabase/client'
import { useSettingsStore } from '@/stores/settings'
import { useI18n } from 'vue-i18n'
import { demoQuestions, demoTest, dailyGKQuestions, dailyGKTest } from '@/lib/demo'
import { env } from '@/config/env'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const attempt = useAttemptStore()
const settings = useSettingsStore()
const showPalette = ref(false)

type Content = string | { text?: string } | null
type Pair = [string, string]
type Options = string[] | { pairs?: Pair[] }
type Question = { id: string; type?: 'mcq'|'tf'|'fib'|'match'; content_en: Content; content_hi: Content; options: Options; correct_answer: number }

const questions = ref<Question[]>([])

const current = computed(() => questions.value[attempt.currentIndex])
const content = computed(() => {
  const c = settings.locale === 'hi' ? current.value?.content_hi : current.value?.content_en
  if (!c) return ''
  return typeof c === 'string' ? c : c.text ?? ''
})
const options = computed(() => {
  const q = current.value
  if (!q) return []
  if (q.type === 'match') return q.options?.pairs || []
  return q.options || []
})

const answerIndex = computed(() => attempt.answers[attempt.currentIndex]?.option_index ?? null)
const fibText = computed(() => attempt.answers[attempt.currentIndex]?.text ?? '')
const marked = computed(() => attempt.answers[attempt.currentIndex]?.marked ?? false)

// Matching questions state
const selectedMatchA = ref<number | null>(null)
const selectedMatchB = ref<number | null>(null)
const matchedPairs = ref<{a: number, b: number}[]>([])

// Matching questions computed properties are handled directly in template

// Matching questions methods
const selectMatchA = (index: number) => {
  selectedMatchA.value = index
  // Check if this item is already matched
  const existingMatch = matchedPairs.value.findIndex(pair => pair.a === index)
  if (existingMatch !== -1) {
    selectedMatchB.value = matchedPairs.value[existingMatch].b
  }
}

const selectMatchB = (index: number) => {
  selectedMatchB.value = index
  // Check if this item is already matched
  const existingMatch = matchedPairs.value.findIndex(pair => pair.b === index)
  if (existingMatch !== -1) {
    selectedMatchA.value = matchedPairs.value[existingMatch].a
  }
}

const addMatch = () => {
  if (selectedMatchA.value !== null && selectedMatchB.value !== null) {
    // Remove any existing matches for these items
    matchedPairs.value = matchedPairs.value.filter(
      pair => pair.a !== selectedMatchA.value && pair.b !== selectedMatchB.value
    )
    // Add new match
    matchedPairs.value.push({ a: selectedMatchA.value, b: selectedMatchB.value })
    // Clear selections
    selectedMatchA.value = null
    selectedMatchB.value = null
    // Save the match
    saveMatchAnswer()
  }
}

const removeMatch = (index: number) => {
  matchedPairs.value.splice(index, 1)
  saveMatchAnswer()
}

const saveMatchAnswer = () => {
  const matches = matchedPairs.value.map(pair => `${pair.a}-${pair.b}`).join(',')
  attempt.saveAnswer(attempt.currentIndex, { option_index: -1, text: matches, marked: marked.value })
}

// Watch for question changes to load matching answers
watch(() => current.value?.id, () => {
  if (current.value?.type === 'match') {
    const answer = attempt.answers[attempt.currentIndex]?.text || ''
    matchedPairs.value = answer ? answer.split(',').map(pair => {
      const [a, b] = pair.split('-').map(Number)
      return { a, b }
    }).filter(pair => !isNaN(pair.a) && !isNaN(pair.b)) : []
    selectedMatchA.value = null
    selectedMatchB.value = null
  }
}, { immediate: true })

const now = ref(Date.now())
const remainingMs = computed(() => Math.max((attempt.startedAt ? (attempt.startedAt + attempt.durationMs) - now.value : 0), 0))
const minutes = computed(() => String(Math.floor(remainingMs.value / 60000)).padStart(2, '0'))
const seconds = computed(() => String(Math.floor((remainingMs.value % 60000) / 1000)).padStart(2, '0'))

onMounted(async () => {
  const id = route.params.id as string
  const test = (!env.supabaseUrl || !env.supabaseAnonKey)
    ? null
    : (await supabase.from('tests').select('id, duration_minutes').eq('id', id).single()).data
  const qs = (!env.supabaseUrl || !env.supabaseAnonKey)
    ? null
    : (await supabase.from('questions').select('*').eq('test_id', id)).data
  const isDaily = id === 'daily-gk'
  const rows = ((qs && qs.length ? qs : (isDaily ? dailyGKQuestions : demoQuestions)) || []) as Question[]
  
  // Only shuffle if it's a fresh start, but for now we shuffle always as per previous logic
  // Ideally we should store the question order in the attempt
  if (attempt.answers.length === 0) {
      for (let i = rows.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [rows[i], rows[j]] = [rows[j], rows[i]] }
  }
  
  questions.value = rows
  attempt.load(id)
  const duration = test?.duration_minutes ?? (isDaily ? dailyGKTest.duration_minutes : demoTest.duration_minutes) ?? 30
  if (!attempt.testId) attempt.start(id, duration, questions.value)
  window.addEventListener('keydown', onKey)
  const interval = setInterval(() => { now.value = Date.now() }, 1000)
  onUnmounted(() => clearInterval(interval))
})

function onKey(e: KeyboardEvent) {
  // Prevent accidental navigation if typing in input
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
  if (e.key === 'ArrowRight') saveAndNext()
  if (e.key === 'ArrowLeft') prev()
}

function select(idx: number) { if (current.value) attempt.setAnswer(current.value.id, idx) }
function onFibInput(e: Event) { if (current.value) attempt.setTextAnswer(current.value.id, (e.target as HTMLInputElement).value) }
function toggleMark() { if (current.value) attempt.toggleMark(current.value.id) }
function saveAndNext() { attempt.next(questions.value.length) }
function prev() { attempt.prev() }

function clearResponse() {
  if (!current.value) return
  attempt.setAnswer(current.value.id, null) 
  attempt.setTextAnswer(current.value.id, '')
}

function isAnswered(qId: string) {
  const ans = attempt.answers.find(a => a.question_id === qId)
  return ans && (ans.option_index !== null && ans.option_index !== -1 || ans.text)
}

function isMarked(qId: string) {
  const ans = attempt.answers.find(a => a.question_id === qId)
  return ans?.marked
}

function getPaletteClass(idx: number, qId: string) {
  const isCurrent = idx === attempt.currentIndex
  const answered = isAnswered(qId)
  const marked = isMarked(qId)
  
  if (isCurrent) {
    return 'bg-brutal-cyan text-black shadow-brutal-lg'
  }
  
  if (marked) {
    return 'bg-brutal-purple text-white'
  }
  
  if (answered) {
    return 'bg-brutal-lime text-black'
  }
  
  // Not visited vs Not answered
  return 'bg-brutal-pink text-white'
}

async function submit() {
  if (!confirm(t('test.submitConfirm') || 'Are you sure you want to submit?')) return
  
  let score = 0
  attempt.answers.forEach((a) => {
    const q = questions.value.find(q => q.id === a.question_id)
    if (!q) return
    if ((q.type || 'mcq') === 'fib') {
      const opts = Array.isArray(q.options) ? q.options : []
      const expected = (opts[q.correct_answer] || '').toString().trim().toLowerCase()
      const actual = (a.text || '').toString().trim().toLowerCase()
      if (expected && actual && expected === actual) score++
    } else {
      if (q.correct_answer === a.option_index) score++
    }
  })
  const percent = Math.round((score / questions.value.length) * 100)
  
  // Try to submit to Supabase, but fall back to local storage if not available
  try {
    const attemptId = await attempt.submit(percent)
    if (!attemptId) throw new Error('Failed to submit to database')
    router.push({ name: 'results', params: { attemptId } })
  } catch (error) {
    console.warn('Supabase submission failed, using fallback:', error)
    // Fallback: store results in localStorage and navigate with a mock ID
    const mockAttemptId = `demo-${Date.now()}`
    const resultData = {
      id: mockAttemptId,
      test_id: attempt.testId,
      score: percent,
      answers: attempt.answers,
      questions: questions.value,
      completed_at: new Date().toISOString()
    }
    localStorage.setItem(`results:${mockAttemptId}`, JSON.stringify(resultData))
    router.push({ name: 'results', params: { attemptId: mockAttemptId } })
  }
}
</script>

<style scoped>
/* Custom scrollbar for the question area */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #334155;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Hide scrollbar for horizontal tabs */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
