<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Study Planner
    </h2>
    
    <div class="grid md:grid-cols-4 gap-4 mb-6">
      <div>
        <label class="font-black text-sm block mb-2">Day</label>
        <select
          v-model="selectedDay"
          class="input w-full text-sm"
        >
          <option
            v-for="day in days"
            :key="day"
            :value="day"
          >
            {{ day }}
          </option>
        </select>
      </div>
      <div>
        <label class="font-black text-sm block mb-2">Time</label>
        <input
          v-model="newSession.time"
          type="time"
          class="input w-full text-sm"
        >
      </div>
      <div>
        <label class="font-black text-sm block mb-2">Duration (min)</label>
        <input
          v-model.number="newSession.duration"
          type="number"
          min="15"
          max="480"
          step="15"
          class="input w-full text-sm"
        >
      </div>
      <div>
        <label class="font-black text-sm block mb-2">Subject</label>
        <input
          v-model="newSession.subject"
          type="text"
          placeholder="Subject"
          class="input w-full text-sm"
        >
      </div>
    </div>

    <button
      class="btn-primary btn-primary-lime w-full mb-6"
      @click="addSession"
    >
      + Add Session
    </button>

    <!-- Weekly Schedule Grid -->
    <div class="grid grid-cols-7 gap-2 mb-6">
      <div
        v-for="day in days"
        :key="day"
        class="bg-brutal-white dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-4"
      >
        <h3 class="font-black text-sm mb-2">
          {{ day }}
        </h3>
        <div class="space-y-1 min-h-96 bg-brutal-cyan dark:bg-brutal-black border-2 border-black dark:border-brutal-white p-2">
          <div
            v-for="(session, idx) in getSessionsForDay(day)"
            :key="idx"
            :style="{ backgroundColor: getColorForSubject(session.subject) }"
            class="border-2 border-black p-2 text-xs font-bold cursor-pointer hover:opacity-75"
            @click="removeSession(day, idx)"
          >
            <div>{{ session.time }}</div>
            <div>{{ session.subject }}</div>
            <div>{{ session.duration }}m</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hours Summary -->
    <div class="grid grid-cols-7 gap-2 mb-6">
      <div
        v-for="day in days"
        :key="day + '-total'"
        class="bg-brutal-yellow border-4 border-black p-4 text-center"
      >
        <div class="text-xs font-bold text-brutal-gray">
          Total
        </div>
        <div class="text-2xl font-black">
          {{ getTotalHours(day).toFixed(1) }}h
        </div>
      </div>
    </div>

    <!-- Subject Distribution -->
    <div class="grid md:grid-cols-3 gap-6">
      <div
        v-for="(hours, subject) in subjectHours"
        :key="subject"
        class="bg-brutal-pink border-4 border-black p-4"
      >
        <div class="text-sm font-bold text-brutal-gray mb-2">
          {{ subject }}
        </div>
        <div class="text-3xl font-black">
          {{ hours.toFixed(1) }}h
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 grid grid-cols-3 gap-4">
      <button
        class="btn-primary btn-primary-cyan"
        :class="{ 'animate-copy-bounce': copying }"
        @click="copySchedule"
      >
        {{ copying ? 'Copied!' : 'Copy' }}
      </button>
      <button
        class="btn-primary btn-primary-yellow"
        @click="exportImage"
      >
        Export as Image
      </button>
      <button
        class="btn-primary btn-primary-pink"
        @click="clearAll"
      >
        Clear All
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'

useHead({
  title: 'Study Planner',
  meta: [
    { name: 'description', content: 'Plan your weekly study schedule by subject and time.' },
    { property: 'og:title', content: 'Study Planner' },
    { property: 'og:description', content: 'Plan your weekly study schedule by subject and time.' }
  ]
})

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

interface Session {
  time: string
  duration: number
  subject: string
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const schedule = ref<Record<string, Session[]>>({
  Monday: [{ time: '09:00', duration: 60, subject: 'Math' }],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: []
})

const selectedDay = ref('Monday')
const newSession = ref({ time: '09:00', duration: 60, subject: '' })

const subjectColors: Record<string, string> = {
  Math: '#D4FF00',
  English: '#00D4FF',
  Science: '#FF00D4',
  History: '#FFD400',
  Art: '#D4FF00',
  PE: '#00FFD4',
  Default: '#CCCCCC'
}

function getColorForSubject(subject: string): string {
  return subjectColors[subject] || subjectColors.Default
}

function getSessionsForDay(day: string): Session[] {
  return (schedule.value[day] || []).sort((a, b) => a.time.localeCompare(b.time))
}

function getTotalHours(day: string): number {
  return getSessionsForDay(day).reduce((sum, s) => sum + s.duration / 60, 0)
}

const subjectHours = computed(() => {
  const hours: Record<string, number> = {}
  Object.values(schedule.value).forEach(sessions => {
    sessions.forEach(session => {
      hours[session.subject] = (hours[session.subject] || 0) + session.duration / 60
    })
  })
  return hours
})

function addSession() {
  if (!newSession.value.subject) return
  if (!schedule.value[selectedDay.value]) {
    schedule.value[selectedDay.value] = []
  }
  schedule.value[selectedDay.value].push({ ...newSession.value })
  newSession.value = { time: '09:00', duration: 60, subject: '' }
}

function removeSession(day: string, idx: number) {
  if (schedule.value[day]) {
    schedule.value[day].splice(idx, 1)
  }
}

function clearAll() {
  days.forEach(day => {
    schedule.value[day] = []
  })
}

function copySchedule() {
  let text = 'Weekly Study Schedule:\n\n'
  days.forEach(day => {
    const sessions = getSessionsForDay(day)
    text += `${day}: ${getTotalHours(day).toFixed(1)}h\n`
    sessions.forEach(s => {
      text += `  ${s.time} - ${s.subject} (${s.duration}m)\n`
    })
  })
  copyWithFeedback(text)
}

function exportImage() {
  // Placeholder for canvas export
  alert('Export as image feature coming soon!')
}
</script>
