<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">
      Date Difference Calculator
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Input Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Select Dates
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">First Date</label>
            <input 
              v-model="firstDate"
              type="date"
              class="input w-full"
            >
          </div>
          
          <div>
            <label class="font-black mb-2 block">Second Date</label>
            <input 
              v-model="secondDate"
              type="date"
              class="input w-full"
            >
          </div>
          
          <div>
            <label class="font-black mb-2 block">Include End Date</label>
            <label class="flex items-center gap-2">
              <input
                v-model="includeEndDate"
                type="checkbox"
                class="w-4 h-4"
              >
              <span class="font-bold">Include second date in calculation</span>
            </label>
          </div>
          
          <button 
            :disabled="!firstDate || !secondDate"
            class="btn-primary btn-primary-cyan w-full disabled:opacity-50"
            @click="calculateDifference"
          >
            Calculate Difference
          </button>
        </div>
      </div>
      
      <!-- Results Section -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Date Difference
        </h3>
        
        <div
          v-if="differenceResult"
          class="space-y-4"
        >
          <!-- Main Display -->
          <div class="text-center bg-brutal-white border-2 border-black p-6">
            <div class="text-4xl font-black mb-2">
              {{ differenceResult.totalDays }}
            </div>
            <div class="text-lg font-bold mb-2">
              Days
            </div>
            <div class="text-sm font-bold text-brutal-gray">
              {{ differenceResult.weeks }} weeks, {{ differenceResult.remainingDays }} days
            </div>
          </div>
          
          <!-- Detailed Breakdown -->
          <div class="space-y-2">
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Years</span>
              <span class="font-black">{{ differenceResult.years }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Months</span>
              <span class="font-black">{{ differenceResult.months }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Weeks</span>
              <span class="font-black">{{ differenceResult.weeks }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Weekdays</span>
              <span class="font-black">{{ differenceResult.weekdays }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Weekends</span>
              <span class="font-black">{{ differenceResult.weekends }}</span>
            </div>
          </div>
        </div>
        
        <div
          v-else
          class="text-center py-8"
        >
          <p class="font-black text-brutal-gray">
            Select two dates to calculate difference
          </p>
        </div>
      </div>
    </div>
    
    <!-- Calendar View -->
    <div
      v-if="differenceResult"
      class="bg-brutal-yellow border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Calendar Overview
      </h3>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-bold mb-2">
            From: {{ formatDate(firstDate) }}
          </h4>
          <div class="bg-brutal-white border-2 border-black p-4">
            <div class="text-center">
              <div class="text-2xl font-black mb-2">
                {{ getDayOfWeek(firstDate) }}
              </div>
              <div class="text-sm font-bold">
                {{ getMonthYear(firstDate) }}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="font-bold mb-2">
            To: {{ formatDate(secondDate) }}
          </h4>
          <div class="bg-brutal-white border-2 border-black p-4">
            <div class="text-center">
              <div class="text-2xl font-black mb-2">
                {{ getDayOfWeek(secondDate) }}
              </div>
              <div class="text-sm font-bold">
                {{ getMonthYear(secondDate) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quick Calculations -->
    <div class="bg-brutal-lime border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Quick Calculations
      </h3>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="calculateFromToday"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              📅
            </div>
            <h4 class="font-black text-sm">
              From Today
            </h4>
          </div>
        </button>
        
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="calculateUntilToday"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🎯
            </div>
            <h4 class="font-black text-sm">
              Until Today
            </h4>
          </div>
        </button>
        
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="calculateThisYear"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              📆
            </div>
            <h4 class="font-black text-sm">
              This Year
            </h4>
          </div>
        </button>
        
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="calculateThisMonth"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🗓️
            </div>
            <h4 class="font-black text-sm">
              This Month
            </h4>
          </div>
        </button>
        
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="calculateThisWeek"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              📊
            </div>
            <h4 class="font-black text-sm">
              This Week
            </h4>
          </div>
        </button>
        
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="calculateLeapYear"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🎲
            </div>
            <h4 class="font-black text-sm">
              Leap Year Check
            </h4>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface DifferenceResult {
  totalDays: number
  weeks: number
  remainingDays: number
  years: number
  months: number
  weekdays: number
  weekends: number
}

const firstDate = ref('')
const secondDate = ref('')
const includeEndDate = ref(false)
const differenceResult = ref<DifferenceResult | null>(null)

const calculateDifference = () => {
  if (!firstDate.value || !secondDate.value) return
  
  const start = new Date(firstDate.value)
  const end = new Date(secondDate.value)
  
  let diffTime = end.getTime() - start.getTime()
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (includeEndDate.value) {
    diffDays += 1
  }
  
  if (diffDays < 0) {
    alert('First date cannot be after second date')
    return
  }
  
  // Calculate various units
  const weeks = Math.floor(diffDays / 7)
  const remainingDays = diffDays % 7
  
  // Calculate years and months
  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()
  
  if (days < 0) {
    months--
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    days += lastMonth.getDate()
  }
  
  if (months < 0) {
    years--
    months += 12
  }
  
  // Calculate weekdays and weekends
  let weekdays = 0
  let weekends = 0
  
  for (let i = 0; i < diffDays; i++) {
    const currentDate = new Date(start)
    currentDate.setDate(currentDate.getDate() + i)
    const dayOfWeek = currentDate.getDay()
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekends++
    } else {
      weekdays++
    }
  }
  
  differenceResult.value = {
    totalDays: diffDays,
    weeks,
    remainingDays,
    years,
    months,
    weekdays,
    weekends
  }
}

const calculateFromToday = () => {
  const today = new Date().toISOString().split('T')[0]
  firstDate.value = today
  
  const targetDate = prompt('Enter target date (YYYY-MM-DD):')
  if (targetDate) {
    secondDate.value = targetDate
    calculateDifference()
  }
}

const calculateUntilToday = () => {
  const today = new Date().toISOString().split('T')[0]
  secondDate.value = today
  
  const startDate = prompt('Enter start date (YYYY-MM-DD):')
  if (startDate) {
    firstDate.value = startDate
    calculateDifference()
  }
}

const calculateThisYear = () => {
  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
  const yearEnd = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]
  
  firstDate.value = yearStart
  secondDate.value = yearEnd
  calculateDifference()
}

const calculateThisMonth = () => {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  
  firstDate.value = monthStart
  secondDate.value = monthEnd
  calculateDifference()
}

const calculateThisWeek = () => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - dayOfWeek)
  const weekEnd = new Date(now)
  weekEnd.setDate(now.getDate() + (6 - dayOfWeek))
  
  firstDate.value = weekStart.toISOString().split('T')[0]
  secondDate.value = weekEnd.toISOString().split('T')[0]
  calculateDifference()
}

const calculateLeapYear = () => {
  const year = prompt('Enter year to check:')
  if (year) {
    const yearNum = parseInt(year)
    const isLeap = (yearNum % 4 === 0 && yearNum % 100 !== 0) || (yearNum % 400 === 0)
    alert(`${yearNum} is ${isLeap ? 'a' : 'not a'} leap year`)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDayOfWeek = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

const getMonthYear = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
</script>
