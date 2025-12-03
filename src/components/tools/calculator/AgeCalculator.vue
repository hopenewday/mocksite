<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">
      Age Calculator
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Input Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Select Date of Birth
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Date of Birth</label>
            <input 
              v-model="dateOfBirth"
              type="date"
              :max="today"
              class="input w-full"
            >
          </div>
          
          <div>
            <label class="font-black mb-2 block">Or Calculate Age At</label>
            <input 
              v-model="targetDate"
              type="date"
              :max="today"
              class="input w-full"
            >
          </div>
          
          <button 
            :disabled="!dateOfBirth"
            class="btn-primary btn-primary-cyan w-full disabled:opacity-50"
            @click="calculateAge"
          >
            Calculate Age
          </button>
        </div>
      </div>
      
      <!-- Results Section -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Age Results
        </h3>
        
        <div
          v-if="ageResult"
          class="space-y-4"
        >
          <!-- Main Age Display -->
          <div class="text-center bg-brutal-white border-2 border-black p-6">
            <div class="text-4xl font-black mb-2">
              {{ ageResult.years }}
            </div>
            <div class="text-lg font-bold mb-2">
              Years Old
            </div>
            <div class="text-sm font-bold text-brutal-gray">
              {{ ageResult.months }} months, {{ ageResult.days }} days
            </div>
          </div>
          
          <!-- Detailed Breakdown -->
          <div class="space-y-2">
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Total Months</span>
              <span class="font-black">{{ ageResult.totalMonths }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Total Weeks</span>
              <span class="font-black">{{ ageResult.totalWeeks }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Total Days</span>
              <span class="font-black">{{ ageResult.totalDays }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Total Hours</span>
              <span class="font-black">{{ ageResult.totalHours }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-brutal-white border-2 border-black">
              <span class="font-black">Total Minutes</span>
              <span class="font-black">{{ ageResult.totalMinutes }}</span>
            </div>
          </div>
        </div>
        
        <div
          v-else
          class="text-center py-8"
        >
          <p class="font-black text-brutal-gray">
            Select date of birth to calculate age
          </p>
        </div>
      </div>
    </div>
    
    <!-- Milestones -->
    <div
      v-if="ageResult"
      class="bg-brutal-yellow border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Life Milestones
      </h3>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="milestone in milestones"
          :key="milestone.age"
          :class="[
            'p-4 border-2 border-black',
            ageResult.years >= milestone.age ? 'bg-brutal-lime' : 'bg-brutal-white'
          ]"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              {{ milestone.icon }}
            </div>
            <h4 class="font-black mb-1">
              {{ milestone.title }}
            </h4>
            <p class="text-sm font-bold">
              {{ milestone.age }} years
            </p>
            <p
              v-if="ageResult.years >= milestone.age"
              class="text-xs font-bold text-brutal-gray mt-1"
            >
              Achieved {{ ageResult.years - milestone.age }} years ago
            </p>
            <p
              v-else
              class="text-xs font-bold text-brutal-gray mt-1"
            >
              In {{ milestone.age - ageResult.years }} years
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Next Birthday -->
    <div
      v-if="ageResult"
      class="bg-brutal-pink border-4 border-black p-6"
    >
      <h3 class="font-black text-lg mb-4">
        Next Birthday
      </h3>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-brutal-white border-2 border-black p-4">
          <div class="text-center">
            <div class="text-3xl font-black mb-2">
              {{ ageResult.nextBirthdayAge }}
            </div>
            <div class="font-black mb-2">
              Years Old
            </div>
            <p class="text-sm font-bold text-brutal-gray">
              {{ formatDate(ageResult.nextBirthdayDate) }}
            </p>
          </div>
        </div>
        
        <div class="bg-brutal-white border-2 border-black p-4">
          <div class="text-center">
            <div class="text-3xl font-black mb-2">
              {{ ageResult.daysUntilNextBirthday }}
            </div>
            <div class="font-black mb-2">
              Days Until
            </div>
            <p class="text-sm font-bold text-brutal-gray">
              {{ ageResult.weeksUntilNextBirthday }} weeks
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface AgeResult {
  years: number
  months: number
  days: number
  totalMonths: number
  totalWeeks: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  nextBirthdayAge: number
  nextBirthdayDate: Date
  daysUntilNextBirthday: number
  weeksUntilNextBirthday: number
}

interface Milestone {
  title: string
  age: number
  icon: string
}

const dateOfBirth = ref('')
const targetDate = ref('')
const ageResult = ref<AgeResult | null>(null)

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const milestones: Milestone[] = [
  { title: 'Start School', age: 6, icon: '🎒' },
  { title: 'Teenager', age: 13, icon: '🎉' },
  { title: 'Driving License', age: 16, icon: '🚗' },
  { title: 'Adult', age: 18, icon: '👤' },
  { title: 'Legal Drinking', age: 21, icon: '🍻' },
  { title: 'Quarter Century', age: 25, icon: '🎂' },
  { title: 'Thirty', age: 30, icon: '🎯' },
  { title: 'Mid-life', age: 40, icon: '⚡' },
  { title: 'Half Century', age: 50, icon: '🏆' },
  { title: 'Senior Citizen', age: 60, icon: '👴' },
  { title: 'Retirement Age', age: 65, icon: '🏖️' },
  { title: 'Golden Years', age: 70, icon: '⭐' }
]

const calculateAge = () => {
  if (!dateOfBirth.value) return
  
  const birth = new Date(dateOfBirth.value)
  const target = targetDate.value ? new Date(targetDate.value) : new Date()
  
  // Validate dates
  if (birth > target) {
    alert('Date of birth cannot be in the future')
    return
  }
  
  // Calculate age
  let years = target.getFullYear() - birth.getFullYear()
  let months = target.getMonth() - birth.getMonth()
  let days = target.getDate() - birth.getDate()
  
  if (days < 0) {
    months--
    const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0)
    days += lastMonth.getDate()
  }
  
  if (months < 0) {
    years--
    months += 12
  }
  
  // Calculate total values
  const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = years * 12 + months
  const totalHours = totalDays * 24
  const totalMinutes = totalHours * 60
  
  // Calculate next birthday
  const nextBirthdayAge = years + 1
  const nextBirthdayDate = new Date(birth.getFullYear() + nextBirthdayAge, birth.getMonth(), birth.getDate())
  
  // If next birthday has passed this year, calculate for next year
  if (nextBirthdayDate < target) {
    nextBirthdayDate.setFullYear(nextBirthdayDate.getFullYear() + 1)
  }
  
  const daysUntilNextBirthday = Math.ceil((nextBirthdayDate.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))
  const weeksUntilNextBirthday = Math.floor(daysUntilNextBirthday / 7)
  
  ageResult.value = {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    nextBirthdayAge,
    nextBirthdayDate,
    daysUntilNextBirthday,
    weeksUntilNextBirthday
  }
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
