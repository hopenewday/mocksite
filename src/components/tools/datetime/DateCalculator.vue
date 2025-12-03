<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Date Calculator
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Calculate date differences, add/subtract days, and find business days.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="btn-primary"
          :class="[
            activeTab === tab.id ? 'bg-brutal-cyan' : 'bg-brutal-white',
            'border-4 border-black shadow-brutal font-black px-6 py-3'
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Add/Subtract Days -->
      <div
        v-if="activeTab === 'add-subtract'"
        class="card-brutal-white dark:card-brutal-black border-4 border-black p-6"
      >
        <h2 class="subheading-brutal mb-6">
          Add/Subtract Days
        </h2>
        
        <div class="grid md:grid-cols-3 gap-6">
          <div>
            <label class="font-black block mb-2">Start Date</label>
            <input 
              v-model="startDate" 
              type="date" 
              class="input-brutal w-full"
            >
          </div>
          
          <div>
            <label class="font-black block mb-2">Days to {{ operation }}</label>
            <input 
              v-model.number="daysToAdd" 
              type="number" 
              class="input-brutal w-full"
              placeholder="Enter number of days"
            >
          </div>
          
          <div class="flex items-end">
            <button 
              class="btn-primary btn-primary-yellow w-full"
              :disabled="!startDate || !daysToAdd"
              @click="calculateDate"
            >
              Calculate
            </button>
          </div>
        </div>

        <div
          v-if="resultDate"
          class="mt-6 p-4 bg-brutal-lime border-4 border-black"
        >
          <h3 class="font-black text-xl mb-2">
            Result
          </h3>
          <p class="font-black text-lg">
            {{ formatDate(resultDate) }}
          </p>
          <p class="text-sm">
            {{ resultDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
        </div>
      </div>

      <!-- Date Difference -->
      <div
        v-if="activeTab === 'difference'"
        class="card-brutal-white dark:card-brutal-black border-4 border-black p-6"
      >
        <h2 class="subheading-brutal mb-6">
          Date Difference
        </h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="font-black block mb-2">Start Date</label>
            <input 
              v-model="startDateDiff" 
              type="date" 
              class="input-brutal w-full"
            >
          </div>
          
          <div>
            <label class="font-black block mb-2">End Date</label>
            <input 
              v-model="endDateDiff" 
              type="date" 
              class="input-brutal w-full"
            >
          </div>
        </div>

        <div class="mt-6">
          <button 
            class="btn-primary btn-primary-yellow"
            :disabled="!startDateDiff || !endDateDiff"
            @click="calculateDifference"
          >
            Calculate Difference
          </button>
        </div>

        <div
          v-if="difference"
          class="mt-6 space-y-4"
        >
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-3 bg-brutal-cyan border-2 border-black text-center">
              <div class="font-black text-2xl">
                {{ difference.years }}
              </div>
              <div class="text-sm">
                Years
              </div>
            </div>
            <div class="p-3 bg-brutal-lime border-2 border-black text-center">
              <div class="font-black text-2xl">
                {{ difference.months }}
              </div>
              <div class="text-sm">
                Months
              </div>
            </div>
            <div class="p-3 bg-brutal-pink border-2 border-black text-center">
              <div class="font-black text-2xl">
                {{ difference.days }}
              </div>
              <div class="text-sm">
                Days
              </div>
            </div>
            <div class="p-3 bg-brutal-yellow border-2 border-black text-center">
              <div class="font-black text-2xl">
                {{ difference.totalDays }}
              </div>
              <div class="text-sm">
                Total Days
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Business Days -->
      <div
        v-if="activeTab === 'business-days'"
        class="card-brutal-white dark:card-brutal-black border-4 border-black p-6"
      >
        <h2 class="subheading-brutal mb-6">
          Business Days Calculator
        </h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="font-black block mb-2">Start Date</label>
            <input 
              v-model="startDateBusiness" 
              type="date" 
              class="input-brutal w-full"
            >
          </div>
          
          <div>
            <label class="font-black block mb-2">End Date</label>
            <input 
              v-model="endDateBusiness" 
              type="date" 
              class="input-brutal w-full"
            >
          </div>
        </div>

        <div class="mt-4 flex items-center gap-4">
          <label class="inline-flex items-center gap-2">
            <input
              v-model="excludeWeekends"
              type="checkbox"
            >
            <span class="font-black">Exclude weekends</span>
          </label>
        </div>

        <div class="mt-6">
          <button 
            class="btn-primary btn-primary-yellow"
            :disabled="!startDateBusiness || !endDateBusiness"
            @click="calculateBusinessDays"
          >
            Calculate Business Days
          </button>
        </div>

        <div
          v-if="businessDaysResult !== null"
          class="mt-6 p-4 bg-brutal-lime border-4 border-black"
        >
          <h3 class="font-black text-xl mb-2">
            Result
          </h3>
          <p class="font-black text-lg">
            {{ businessDaysResult }} business days
          </p>
          <p
            v-if="excludeWeekends"
            class="text-sm"
          >
            (Weekends excluded)
          </p>
        </div>
      </div>

      <!-- Current Date Quick Select -->
      <div class="mt-6 card-brutal-white dark:card-brutal-black border-4 border-black p-4">
        <h3 class="font-black mb-4">
          Quick Actions
        </h3>
        <div class="flex flex-wrap gap-3">
          <button
            class="btn-primary btn-primary-lime"
            @click="setToday('start')"
          >
            Set Today's Date
          </button>
          <button
            class="btn-primary btn-primary-lime"
            @click="setToday('startDiff')"
          >
            Set Today's Date (Start)
          </button>
          <button
            class="btn-primary btn-primary-lime"
            @click="setToday('endDiff')"
          >
            Set Today's Date (End)
          </button>
          <button
            class="btn-primary btn-primary-pink"
            @click="clearAll"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useMilestones } from '@/composables/useMilestones'

useHead({
  title: 'Date Calculator - Free Online Tool',
  meta: [
    { name: 'description', content: 'Calculate date differences, add/subtract days, and find business days between dates. Free online date calculator.' },
    { property: 'og:title', content: 'Date Calculator' },
    { property: 'og:description', content: 'Calculate date differences, add/subtract days, and find business days between dates.' }
  ]
})

const tabs = [
  { id: 'add-subtract', label: 'Add/Subtract Days' },
  { id: 'difference', label: 'Date Difference' },
  { id: 'business-days', label: 'Business Days' }
]

const activeTab = ref('add-subtract')
const operation = ref('Add')

// Add/Subtract Days
const startDate = ref('')
const daysToAdd = ref(0)
const resultDate = ref<Date | null>(null)

// Date Difference
const startDateDiff = ref('')
const endDateDiff = ref('')
const difference = ref<{
  years: number
  months: number
  days: number
  totalDays: number
} | null>(null)

// Business Days
const startDateBusiness = ref('')
const endDateBusiness = ref('')
const excludeWeekends = ref(true)
const businessDaysResult = ref<number | null>(null)

const { celebrateFirstUse } = useMilestones()

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const setToday = (field: string) => {
  const today = new Date().toISOString().split('T')[0]
  
  switch (field) {
    case 'start':
      startDate.value = today
      break
    case 'startDiff':
      startDateDiff.value = today
      break
    case 'endDiff':
      endDateDiff.value = today
      break
  }
}

const calculateDate = () => {
  if (!startDate.value || !daysToAdd.value) return

  const date = new Date(startDate.value)
  date.setDate(date.getDate() + daysToAdd.value)
  resultDate.value = date

  if (!startDate.value) {
    celebrateFirstUse('date-calculator')
  }
}

const calculateDifference = () => {
  if (!startDateDiff.value || !endDateDiff.value) return

  const start = new Date(startDateDiff.value)
  const end = new Date(endDateDiff.value)
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Calculate years, months, and days
  const years = end.getFullYear() - start.getFullYear()
  const months = end.getMonth() - start.getMonth()
  const days = end.getDate() - start.getDate()
  
  let adjustedYears = years
  let adjustedMonths = months
  let adjustedDays = days
  
  if (adjustedDays < 0) {
    adjustedMonths--
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    adjustedDays += prevMonth.getDate()
  }
  
  if (adjustedMonths < 0) {
    adjustedYears--
    adjustedMonths += 12
  }
  
  difference.value = {
    years: adjustedYears,
    months: adjustedMonths,
    days: adjustedDays,
    totalDays
  }
}

const calculateBusinessDays = () => {
  if (!startDateBusiness.value || !endDateBusiness.value) return

  const start = new Date(startDateBusiness.value)
  const end = new Date(endDateBusiness.value)
  
  let count = 0
  const current = new Date(start)
  
  while (current <= end) {
    const dayOfWeek = current.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    if (!excludeWeekends.value || !isWeekend) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }
  
  businessDaysResult.value = count
  celebrateFirstUse('date-calculator')
}

const clearAll = () => {
  startDate.value = ''
  daysToAdd.value = 0
  resultDate.value = null
  startDateDiff.value = ''
  endDateDiff.value = ''
  difference.value = null
  startDateBusiness.value = ''
  endDateBusiness.value = ''
  businessDaysResult.value = null
}
</script>

<style scoped>
.input-brutal { @apply w-full p-3 border-4 border-black bg-white dark:bg-brutal-black text-black dark:text-white; }
.btn-primary { @apply px-4 py-2 border-4 border-black shadow-brutal font-black; }
.btn-primary-yellow { @apply bg-brutal-yellow; }
.btn-primary-lime { @apply bg-brutal-lime; }
.btn-primary-pink { @apply bg-brutal-pink; }
.card-brutal-white { @apply bg-brutal-white; }
.card-brutal-black { @apply bg-brutal-black; }
</style>
