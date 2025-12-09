<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Timetable Generator
    </h2>
    
    <div class="grid md:grid-cols-5 gap-4 mb-6">
      <input
        v-model="newClass.subject"
        type="text"
        placeholder="Subject"
        class="input text-sm"
      >
      <input
        v-model="newClass.teacher"
        type="text"
        placeholder="Teacher"
        class="input text-sm"
      >
      <input
        v-model="newClass.room"
        type="text"
        placeholder="Room"
        class="input text-sm"
      >
      <input
        v-model="newClass.day"
        type="text"
        placeholder="Day"
        class="input text-sm"
      >
      <input
        v-model="newClass.time"
        type="time"
        class="input text-sm"
      >
    </div>

    <div class="grid grid-cols-4 gap-4 mb-6">
      <button
        class="btn-primary btn-primary-lime"
        @click="addClass"
      >
        + Add Class
      </button>
      <button
        class="btn-primary btn-primary-cyan text-sm"
        @click="useTemplate('5day')"
      >
        5-Day Template
      </button>
      <button
        class="btn-primary btn-primary-yellow text-sm"
        @click="useTemplate('6day')"
      >
        6-Day Template
      </button>
      <button
        class="btn-primary btn-primary-pink text-sm"
        @click="clearAll"
      >
        Clear All
      </button>
    </div>

    <!-- Timetable Grid -->
    <div class="overflow-x-auto mb-6">
      <table class="w-full border-collapse border-4 border-black">
        <thead>
          <tr class="bg-brutal-cyan dark:bg-brutal-black">
            <th class="border-4 border-black p-3 font-black">
              Time
            </th>
            <th
              v-for="day in days"
              :key="day"
              class="border-4 border-black p-3 font-black"
            >
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="period in periods"
            :key="period"
            class="bg-brutal-white dark:bg-brutal-black"
          >
            <td class="border-4 border-black p-3 font-black text-sm">
              {{ period }}
            </td>
            <td
              v-for="day in days"
              :key="day + period"
              class="border-4 border-black p-3 text-xs"
            >
              <div
                v-for="cls in getClassForSlot(day, period)"
                :key="cls.subject"
                :style="{ backgroundColor: getColorForSubject(cls.subject) }"
                class="border-2 border-black p-2 mb-1 cursor-pointer hover:opacity-75"
                @click="removeClass(cls)"
              >
                <div class="font-black">
                  {{ cls.subject }}
                </div>
                <div>{{ cls.teacher }}</div>
                <div>{{ cls.room }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Actions -->
    <div class="grid grid-cols-3 gap-4">
      <button
        class="btn-primary btn-primary-cyan"
        :class="{ 'animate-copy-bounce': copying }"
        @click="copyTimetable"
      >
        {{ copying ? 'Copied!' : 'Copy Timetable' }}
      </button>
      <button
        class="btn-primary btn-primary-yellow"
        @click="exportImage"
      >
        Export as Image
      </button>
      <button
        class="btn-primary btn-primary-lime"
        @click="printTimetable"
      >
        🖨️ Print
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'

useHead({
  title: 'Timetable Generator',
  meta: [
    { name: 'description', content: 'Create and organize your school timetable visually.' },
    { property: 'og:title', content: 'Timetable Generator' },
    { property: 'og:description', content: 'Create and organize your school timetable visually.' }
  ]
})

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

interface Class {
  subject: string
  teacher: string
  room: string
  day: string
  time: string
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const periods = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const classes = ref<Class[]>([
  { subject: 'Math', teacher: 'Mr. Smith', room: '101', day: 'Monday', time: '09:00' },
  { subject: 'English', teacher: 'Ms. Johnson', room: '102', day: 'Tuesday', time: '10:00' }
])

const newClass = ref({ subject: '', teacher: '', room: '', day: 'Monday', time: '09:00' })

const subjectColors: Record<string, string> = {
  Math: '#D4FF00',
  English: '#00D4FF',
  Science: '#FF00D4',
  History: '#FFD400',
  Art: '#D4FF00',
  PE: '#00FFD4',
  Chemistry: '#FF4400',
  Biology: '#44FF00',
  Physics: '#FF0044'
}

function getColorForSubject(subject: string): string {
  return subjectColors[subject] || '#CCCCCC'
}

function getClassForSlot(day: string, period: string): Class[] {
  return classes.value.filter(c => c.day === day && c.time === period)
}

function addClass() {
  if (newClass.value.subject && newClass.value.day && newClass.value.time) {
    classes.value.push({ ...newClass.value })
    newClass.value = { subject: '', teacher: '', room: '', day: 'Monday', time: '09:00' }
  }
}

function removeClass(cls: Class) {
  const idx = classes.value.findIndex(c => c.subject === cls.subject && c.day === cls.day && c.time === cls.time)
  if (idx !== -1) classes.value.splice(idx, 1)
}

function clearAll() {
  classes.value = []
}

function useTemplate(template: string) {
  classes.value = []
  if (template === '5day') {
    classes.value = [
      { subject: 'Math', teacher: 'Mr. A', room: '101', day: 'Monday', time: '09:00' },
      { subject: 'English', teacher: 'Ms. B', room: '102', day: 'Monday', time: '10:00' },
      { subject: 'Science', teacher: 'Dr. C', room: '103', day: 'Tuesday', time: '09:00' }
    ]
  }
}

function copyTimetable() {
  let text = 'My Timetable:\n\n'
  classes.value.forEach(cls => {
    text += `${cls.day} ${cls.time} - ${cls.subject} (${cls.teacher}, Room ${cls.room})\n`
  })
  copyWithFeedback(text)
}

function exportImage() {
  alert('Export as image feature coming soon!')
}

function printTimetable() {
  window.print()
}
</script>
