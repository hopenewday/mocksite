<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Date & Time Age Calculator
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Input Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Calculate Age Between Dates
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Start Date</label>
            <input 
              v-model="startDate"
              type="datetime-local"
              class="input w-full"
            >
          </div>
          
          <div>
            <label class="font-black mb-2 block">End Date</label>
            <input 
              v-model="endDate"
              type="datetime-local"
              class="input w-full"
            >
          </div>
          
          <div>
            <label class="font-black mb-2 block">Current Time</label>
            <button
              class="btn-primary btn-primary-cyan w-full"
              @click="setCurrentTime"
            >
              Use Current Time
            </button>
          </div>
          
          <button 
            :disabled="!startDate || !endDate"
            class="btn-primary btn-primary-lime w-full disabled:opacity-50"
            @click="calculateTimeDifference"
          >
            Calculate Difference
          </button>
        </div>
      </div>
      
      <!-- Results Section -->
      <div class="bg-brutal-yellow border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Time Difference
        </h3>
        
        <div
          v-if="timeResult"
          class="space-y-4"
        >
          <!-- Main Display -->
          <div class="text-center bg-brutal-white border-2 border-black p-6">
            <div class="text-3xl font-black mb-2">
              {{ timeResult.years }}
            </div>
            <div class="text-lg font-bold mb-2">
              Years
            </div>
            <div class="text-sm font-bold text-brutal-gray">
              {{ timeResult.months }} months, {{ timeResult.days }} days
            </div>
            <div class="text-xs font-bold text-brutal-gray mt-2">
              {{ timeResult.hours }} hours, {{ timeResult.minutes }} minutes
            </div>
          </div>
          
          <!-- Detailed Breakdown -->
          <div class="space-y-2">
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Total Days</span>
              <span class="font-black">{{ timeResult.totalDays }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Total Hours</span>
              <span class="font-black">{{ timeResult.totalHours }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Total Minutes</span>
              <span class="font-black">{{ timeResult.totalMinutes }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Total Seconds</span>
              <span class="font-black">{{ timeResult.totalSeconds }}</span>
            </div>
          </div>
        </div>
        
        <div
          v-else
          class="text-center py-8"
        >
          <p class="font-black text-brutal-gray">
            Select dates to calculate time difference
          </p>
        </div>
      </div>
    </div>
    
    <!-- Quick Calculations -->
    <div class="bg-brutal-lime border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Quick Calculations
      </h3>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="calculateFromBirth"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              👶
            </div>
            <h4 class="font-black text-sm">
              Age from Birth
            </h4>
          </div>
        </button>
        
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="calculateWorkExperience"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              💼
            </div>
            <h4 class="font-black text-sm">
              Work Experience
            </h4>
          </div>
        </button>
        
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="calculateRelationship"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              💑
            </div>
            <h4 class="font-black text-sm">
              Relationship
            </h4>
          </div>
        </button>
        
        <button 
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="calculateProjectDuration"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              📅
            </div>
            <h4 class="font-black text-sm">
              Project Duration
            </h4>
          </div>
        </button>
      </div>
    </div>
    
    <!-- Time Zones -->
    <div
      v-if="timeResult"
      class="bg-brutal-pink border-4 border-black p-6"
    >
      <h3 class="font-black text-lg mb-4">
        Time Zone Information
      </h3>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-bold mb-2">
            Start Date Time Zones
          </h4>
          <div class="space-y-2">
            <div class="flex justify-between items-center p-2 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">Local</span>
              <span class="font-black text-sm">{{ formatDateTime(startDate) }}</span>
            </div>
            <div class="flex justify-between items-center p-2 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">UTC</span>
              <span class="font-black text-sm">{{ formatDateTimeUTC(startDate) }}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="font-bold mb-2">
            End Date Time Zones
          </h4>
          <div class="space-y-2">
            <div class="flex justify-between items-center p-2 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">Local</span>
              <span class="font-black text-sm">{{ formatDateTime(endDate) }}</span>
            </div>
            <div class="flex justify-between items-center p-2 bg-brutal-white border-2 border-black">
              <span class="font-black text-sm">UTC</span>
              <span class="font-black text-sm">{{ formatDateTimeUTC(endDate) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TimeResult {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
}

const startDate = ref('')
const endDate = ref('')
const timeResult = ref<TimeResult | null>(null)

const setCurrentTime = () => {
  const now = new Date()
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
  
  if (!startDate.value) {
    startDate.value = localDateTime
  }
  if (!endDate.value) {
    endDate.value = localDateTime
  }
}

const calculateTimeDifference = () => {
  if (!startDate.value || !endDate.value) return
  
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  
  if (start > end) {
    alert('Start date cannot be after end date')
    return
  }
  
  // Calculate difference
  const diffMs = end.getTime() - start.getTime()
  
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365))
  const months = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
  const days = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const totalSeconds = Math.floor(diffMs / 1000)
  
  timeResult.value = {
    years,
    months,
    days,
    hours,
    minutes,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds
  }
}

const calculateFromBirth = () => {
  const birthDate = prompt('Enter your birth date (YYYY-MM-DD):')
  if (birthDate) {
    startDate.value = birthDate + 'T00:00'
    setCurrentTime()
    calculateTimeDifference()
  }
}

const calculateWorkExperience = () => {
  const startDateWork = prompt('Enter work start date (YYYY-MM-DD):')
  if (startDateWork) {
    startDate.value = startDateWork + 'T09:00'
    setCurrentTime()
    calculateTimeDifference()
  }
}

const calculateRelationship = () => {
  const relationshipStart = prompt('Enter relationship start date (YYYY-MM-DD):')
  if (relationshipStart) {
    startDate.value = relationshipStart + 'T00:00'
    setCurrentTime()
    calculateTimeDifference()
  }
}

const calculateProjectDuration = () => {
  const projectStart = prompt('Enter project start date (YYYY-MM-DD):')
  const projectEnd = prompt('Enter project end date (YYYY-MM-DD):')
  if (projectStart && projectEnd) {
    startDate.value = projectStart + 'T00:00'
    endDate.value = projectEnd + 'T00:00'
    calculateTimeDifference()
  }
}

const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  return date.toLocaleString()
}

const formatDateTimeUTC = (dateTimeString: string) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  return date.toUTCString()
}
</script>
