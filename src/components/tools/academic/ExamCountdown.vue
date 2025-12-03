<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">Exam Countdown</h2>
    
    <div class="grid md:grid-cols-4 gap-4 mb-6">
      <!-- Stats -->
      <div class="bg-brutal-cyan border-4 border-black p-4">
        <div class="text-xs font-bold text-brutal-gray">Total Exams</div>
        <div class="text-3xl font-black">{{ exams.length }}</div>
      </div>
      <div class="bg-brutal-lime border-4 border-black p-4">
        <div class="text-xs font-bold text-brutal-gray">Upcoming</div>
        <div class="text-3xl font-black">{{ upcoming }}</div>
      </div>
      <div class="bg-brutal-yellow border-4 border-black p-4">
        <div class="text-xs font-bold text-brutal-gray">This Week</div>
        <div class="text-3xl font-black">{{ thisWeek }}</div>
      </div>
      <div class="bg-red-200 border-4 border-red-600 p-4">
        <div class="text-xs font-bold text-brutal-gray">Completed</div>
        <div class="text-3xl font-black">{{ completed }}</div>
      </div>
    </div>

    <div class="grid md:grid-cols-4 gap-4 mb-6">
      <input v-model="newExam.name" type="text" placeholder="Exam name" class="input text-sm" @keyup.enter="addExam">
      <input v-model="newExam.subject" type="text" placeholder="Subject" class="input text-sm" @keyup.enter="addExam">
      <input v-model="newExam.datetime" type="datetime-local" class="input text-sm" @keyup.enter="addExam">
      <button class="btn-primary btn-primary-lime" @click="addExam">+ Add Exam</button>
    </div>

    <!-- Exams List -->
    <div class="space-y-3 max-h-[500px] overflow-y-auto">
      <div v-for="(exam, idx) in sortedExams" :key="idx" :class="['border-4 border-black p-4', getExamColor(exam)]">
        <div class="flex justify-between items-start mb-2">
          <div>
            <div class="font-black text-lg">{{ exam.name }}</div>
            <div class="text-sm font-bold text-brutal-gray">{{ exam.subject }}</div>
          </div>
          <button class="btn-small btn-primary-pink" @click="removeExam(idx)">✕</button>
        </div>
        
        <div v-if="!exam.completed" class="grid grid-cols-4 gap-2 text-sm mb-2">
          <div>
            <span class="font-black text-2xl text-brutal-cyan">{{ getCountdown(exam).days }}</span>
            <div class="text-xs font-bold">days</div>
          </div>
          <div>
            <span class="font-black text-2xl text-brutal-lime">{{ getCountdown(exam).hours }}</span>
            <div class="text-xs font-bold">hours</div>
          </div>
          <div>
            <span class="font-black text-2xl text-brutal-yellow">{{ getCountdown(exam).mins }}</span>
            <div class="text-xs font-bold">mins</div>
          </div>
          <div class="text-right">
            <div class="font-black text-sm">{{ formatDate(exam.datetime) }}</div>
            <div class="text-xs font-bold">{{ formatTime(exam.datetime) }}</div>
          </div>
        </div>

        <div v-else class="text-sm font-black text-green-600">✓ Completed</div>

        <div v-if="!exam.completed" class="flex gap-2 mt-2">
          <button class="btn-small btn-primary-cyan text-xs" @click="exam.completed = true">Mark Done</button>
          <button v-if="exam.notification" class="btn-small btn-primary-yellow text-xs">🔔 Alert On</button>
        </div>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-4">
      <button class="btn-primary btn-primary-cyan" :class="{ 'animate-copy-bounce': copying }" @click="copyList">
        {{ copying ? 'Copied!' : 'Copy List' }}
      </button>
      <button class="btn-primary btn-primary-lime" @click="clearAll">Clear All</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'

useHead({
  title: 'Exam Countdown',
  meta: [
    { name: 'description', content: 'Countdown to your exams and track progress.' },
    { property: 'og:title', content: 'Exam Countdown' },
    { property: 'og:description', content: 'Countdown to your exams and track progress.' }
  ]
})

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

interface Exam {
  name: string
  subject: string
  datetime: string
  completed: boolean
  notification: boolean
}

const exams = ref<Exam[]>([
  { name: 'Math Final', subject: 'Math', datetime: '2025-12-15T14:00', completed: false, notification: true },
  { name: 'Physics Midterm', subject: 'Physics', datetime: '2025-12-10T10:00', completed: false, notification: false }
])

const newExam = ref({ name: '', subject: '', datetime: '' })
const now = ref(new Date())

onMounted(() => {
  setInterval(() => {
    now.value = new Date()
  }, 1000)
})

const upcoming = computed(() => exams.value.filter(e => !e.completed && new Date(e.datetime) > now.value).length)
const thisWeek = computed(() => {
  const weekAway = new Date(now.value.getTime() + 7 * 24 * 60 * 60 * 1000)
  return exams.value.filter(e => !e.completed && new Date(e.datetime) > now.value && new Date(e.datetime) < weekAway).length
})
const completed = computed(() => exams.value.filter(e => e.completed).length)

const sortedExams = computed(() => {
  return [...exams.value].sort((a, b) => {
    if (a.completed && !b.completed) return 1
    if (!a.completed && b.completed) return -1
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  })
})

function getCountdown(exam: Exam) {
  const target = new Date(exam.datetime)
  const diff = target.getTime() - now.value.getTime()
  
  if (diff < 0) return { days: 0, hours: 0, mins: 0 }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return { days, hours, mins }
}

function getExamColor(exam: Exam): string {
  if (exam.completed) return 'bg-green-200 border-green-600'
  const countdown = getCountdown(exam)
  if (countdown.days === 0) return 'bg-red-200 border-red-600'
  if (countdown.days <= 3) return 'bg-yellow-200 border-yellow-600'
  return 'bg-brutal-white'
}

function formatDate(datetime: string): string {
  return new Date(datetime).toLocaleDateString()
}

function formatTime(datetime: string): string {
  return new Date(datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function addExam() {
  if (newExam.value.name && newExam.value.subject && newExam.value.datetime) {
    exams.value.push({
      ...newExam.value,
      completed: false,
      notification: false
    })
    newExam.value = { name: '', subject: '', datetime: '' }
  }
}

function removeExam(idx: number) {
  exams.value.splice(idx, 1)
}

function copyList() {
  const list = exams.value.map(e => `${e.name} (${e.subject}) - ${formatDate(e.datetime)} ${formatTime(e.datetime)}`).join('\n')
  copyWithFeedback(list)
}

function clearAll() {
  exams.value = []
}
</script>
