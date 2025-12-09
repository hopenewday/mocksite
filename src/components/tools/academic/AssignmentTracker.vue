<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">
      Assignment Tracker
    </h2>
    
    <div class="grid md:grid-cols-4 gap-4 mb-6">
      <!-- Stats -->
      <div class="bg-brutal-cyan dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-4">
        <div class="text-xs font-bold text-brutal-gray">
          Total
        </div>
        <div class="text-3xl font-black">
          {{ assignments.length }}
        </div>
      </div>
      <div class="bg-brutal-lime dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-4">
        <div class="text-xs font-bold text-brutal-gray">
          Completed
        </div>
        <div class="text-3xl font-black">
          {{ completed }}
        </div>
      </div>
      <div class="bg-brutal-yellow dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-4">
        <div class="text-xs font-bold text-brutal-gray">
          Pending
        </div>
        <div class="text-3xl font-black">
          {{ pending }}
        </div>
      </div>
      <div class="bg-red-200 border-4 border-red-600 p-4">
        <div class="text-xs font-bold text-brutal-gray">
          Overdue
        </div>
        <div class="text-3xl font-black">
          {{ overdue }}
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-4 gap-4 mb-6">
      <!-- Filters -->
      <div>
        <label class="font-black block text-sm mb-2">Filter by Priority</label>
        <select
          v-model="filterPriority"
          class="input w-full text-sm"
        >
          <option value="">
            All
          </option>
          <option value="high">
            High
          </option>
          <option value="medium">
            Medium
          </option>
          <option value="low">
            Low
          </option>
        </select>
      </div>
      <div>
        <label class="font-black block text-sm mb-2">Filter by Status</label>
        <select
          v-model="filterStatus"
          class="input w-full text-sm"
        >
          <option value="">
            All
          </option>
          <option value="pending">
            Pending
          </option>
          <option value="completed">
            Completed
          </option>
          <option value="overdue">
            Overdue
          </option>
        </select>
      </div>
      <div>
        <label class="font-black block text-sm mb-2">Sort By</label>
        <select
          v-model="sortBy"
          class="input w-full text-sm"
        >
          <option value="due">
            Due Date
          </option>
          <option value="priority">
            Priority
          </option>
          <option value="subject">
            Subject
          </option>
        </select>
      </div>
      <div>
        <label class="font-black block text-sm mb-2">&nbsp;</label>
        <button
          class="btn-primary btn-primary-pink w-full text-sm"
          @click="addAssignment"
        >
          + Add
        </button>
      </div>
    </div>

    <!-- List -->
    <div class="space-y-2 max-h-[500px] overflow-y-auto">
      <div
        v-for="(a, idx) in filteredSorted"
        :key="idx"
        class="bg-brutal-white border-4 border-black p-4 grid grid-cols-6 gap-2 items-center text-sm"
      >
        <input
          v-model="a.completed"
          type="checkbox"
          class="w-4 h-4"
        >
        <div class="col-span-2">
          <div
            class="font-black"
            :class="{ 'line-through': a.completed }"
          >
            {{ a.title }}
          </div>
          <div class="text-xs font-bold text-brutal-gray">
            {{ a.subject }}
          </div>
        </div>
        <div class="text-xs">
          <span
            class="font-black"
            :class="getPriorityColor(a.priority)"
          >{{ a.priority.toUpperCase() }}</span>
        </div>
        <div class="text-xs font-bold">
          {{ formatDate(a.dueDate) }}
        </div>
        <button
          class="btn-small btn-primary-pink"
          @click="removeAssignment(idx)"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Export -->
    <div class="mt-6 grid grid-cols-2 gap-4">
      <button
        class="btn-primary btn-primary-cyan"
        :class="{ 'animate-copy-bounce': copying }"
        @click="copyList"
      >
        {{ copying ? 'Copied!' : 'Copy List' }}
      </button>
      <button
        class="btn-primary btn-primary-lime"
        @click="exportJSON"
      >
        Download JSON
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'

useHead({
  title: 'Assignment Tracker',
  meta: [
    { name: 'description', content: 'Track assignments, due dates, and priorities.' },
    { property: 'og:title', content: 'Assignment Tracker' },
    { property: 'og:description', content: 'Track assignments, due dates, and priorities.' }
  ]
})

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

interface Assignment {
  title: string
  subject: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

const assignments = ref<Assignment[]>([
  { title: 'Math homework', subject: 'Math', dueDate: '2025-12-05', priority: 'high', completed: false },
  { title: 'Essay draft', subject: 'English', dueDate: '2025-12-07', priority: 'medium', completed: true }
])

const filterPriority = ref('')
const filterStatus = ref('')
const sortBy = ref('due')

const completed = computed(() => assignments.value.filter(a => a.completed).length)
const pending = computed(() => assignments.value.filter(a => !a.completed && new Date(a.dueDate) > new Date()).length)
const overdue = computed(() => assignments.value.filter(a => !a.completed && new Date(a.dueDate) < new Date()).length)

const filteredSorted = computed(() => {
  let filtered = assignments.value.filter(a => {
    if (filterPriority.value && a.priority !== filterPriority.value) return false
    if (filterStatus.value === 'completed' && !a.completed) return false
    if (filterStatus.value === 'pending' && (a.completed || new Date(a.dueDate) < new Date())) return false
    if (filterStatus.value === 'overdue' && (a.completed || new Date(a.dueDate) >= new Date())) return false
    return true
  })

  return filtered.sort((a, b) => {
    if (sortBy.value === 'due') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    if (sortBy.value === 'priority') {
      const priority = { high: 0, medium: 1, low: 2 }
      return priority[a.priority] - priority[b.priority]
    }
    return a.subject.localeCompare(b.subject)
  })
})

function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString()
}

function getPriorityColor(priority: string): string {
  if (priority === 'high') return 'text-red-600'
  if (priority === 'medium') return 'text-orange-600'
  return 'text-green-600'
}

function addAssignment() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  assignments.value.push({
    title: '',
    subject: '',
    dueDate: tomorrow.toISOString().split('T')[0],
    priority: 'medium',
    completed: false
  })
}

function removeAssignment(idx: number) {
  assignments.value.splice(idx, 1)
}

function copyList() {
  const list = assignments.value.map(a => `${a.title} (${a.subject}) - Due: ${formatDate(a.dueDate)} - ${a.completed ? '✓' : '○'}`).join('\n')
  copyWithFeedback(list)
}

function exportJSON() {
  const data = JSON.stringify(assignments.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'assignments.json'
  link.click()
}
</script>
