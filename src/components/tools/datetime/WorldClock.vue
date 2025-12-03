<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          World Clock
        </h1>
        <p class="text-brutal mt-2 text-lg">
          View current time in multiple timezones around the world.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <!-- Time Format Toggle -->
      <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="font-black">Time Format:</span>
            <div class="flex gap-2">
              <button 
                class="btn-primary"
                :class="timeFormat === '12' ? 'bg-brutal-cyan' : 'bg-brutal-white'"
                @click="timeFormat = '12'"
              >
                12-Hour
              </button>
              <button 
                class="btn-primary"
                :class="timeFormat === '24' ? 'bg-brutal-cyan' : 'bg-brutal-white'"
                @click="timeFormat = '24'"
              >
                24-Hour
              </button>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <button 
              class="btn-primary btn-primary-lime"
              :disabled="timezones.length === 0"
              @click="copyAllTimes"
            >
              Copy All Times
            </button>
            <button 
              class="btn-primary btn-primary-pink"
              :disabled="timezones.length === 0"
              @click="clearAll"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <!-- Add Timezone -->
      <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-4 mb-6">
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <label class="font-black block mb-2">Add Timezone</label>
            <input 
              v-model="searchQuery" 
              placeholder="Search for a city or timezone..."
              class="input-brutal w-full"
              @input="searchTimezones"
            >
            
            <!-- Search Results -->
            <div
              v-if="searchResults.length > 0"
              class="mt-2 border-2 border-black bg-white max-h-40 overflow-y-auto"
            >
              <div 
                v-for="timezone in searchResults" 
                :key="timezone.value"
                class="p-2 hover:bg-brutal-lime cursor-pointer border-b border-black"
                @click="addTimezone(timezone)"
              >
                <div class="font-black">
                  {{ timezone.label }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ timezone.value }}
                </div>
              </div>
            </div>
          </div>
          
          <button 
            class="btn-primary btn-primary-yellow"
            @click="searchTimezones"
          >
            Search
          </button>
        </div>
      </div>

      <!-- Timezones Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="timezone in timezones" 
          :key="timezone.id"
          class="card-brutal-white dark:card-brutal-black border-4 border-black p-6 relative"
        >
          <!-- Remove Button -->
          <button 
            class="absolute top-2 right-2 btn-primary btn-primary-pink text-sm w-8 h-8 p-0"
            @click="removeTimezone(timezone.id)"
          >
            ×
          </button>
          
          <div class="text-center">
            <h3 class="font-black text-xl mb-2">
              {{ timezone.city }}
            </h3>
            <div class="text-sm text-gray-600 mb-4">
              {{ timezone.timezone }}
            </div>
            
            <!-- Current Time -->
            <div class="mb-4">
              <div class="font-black text-3xl md:text-4xl">
                {{ formatTime(timezone.currentTime, timeFormat) }}
              </div>
              <div class="text-sm text-gray-600">
                {{ formatDate(timezone.currentTime) }}
              </div>
            </div>
            
            <!-- UTC Offset -->
            <div class="p-2 bg-brutal-yellow border-2 border-black">
              <div class="font-black text-sm">
                UTC{{ formatOffset(timezone.offset) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div 
          v-if="timezones.length === 0" 
          class="col-span-full text-center py-12"
        >
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-8">
            <h3 class="font-black text-xl mb-4">
              No Timezones Added
            </h3>
            <p class="text-gray-600 mb-4">
              Search for cities above to add them to your world clock
            </p>
            <div class="flex flex-wrap justify-center gap-2">
              <button 
                v-for="city in defaultCities" 
                :key="city.timezone"
                class="btn-primary btn-primary-lime"
                @click="addTimezone(city)"
              >
                {{ city.city }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="mt-6 card-brutal-white dark:card-brutal-black border-4 border-black p-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div class="font-black text-2xl text-brutal-cyan">
              {{ timezones.length }}
            </div>
            <div class="text-sm">
              Timezones
            </div>
          </div>
          <div>
            <div class="font-black text-2xl text-brutal-lime">
              {{ formatTime(new Date(), timeFormat).split(':')[0] }}
            </div>
            <div class="text-sm">
              Current Hour
            </div>
          </div>
          <div>
            <div class="font-black text-2xl text-brutal-pink">
              {{ getDayCount() }}
            </div>
            <div class="text-sm">
              Different Days
            </div>
          </div>
          <div>
            <div class="font-black text-2xl text-brutal-yellow">
              {{ Math.max(...timezones.map(t => t.offset)) - Math.min(...timezones.map(t => t.offset)) }}
            </div>
            <div class="text-sm">
              Hour Difference
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'

useHead({
  title: 'World Clock - Free Online Tool',
  meta: [
    { name: 'description', content: 'View current time in multiple timezones around the world. Free online world clock tool.' },
    { property: 'og:title', content: 'World Clock' },
    { property: 'og:description', content: 'View current time in multiple timezones around the world.' }
  ]
})

const timeFormat = ref<'12' | '24'>('12')
const searchQuery = ref('')
const searchResults = ref<Array<{ value: string; label: string }>>([])

const timezones = ref<Array<{
  id: string
  city: string
  timezone: string
  offset: number
  currentTime: Date
}>>([])

let updateInterval: number | null = null

const defaultCities = [
  { city: 'New York', timezone: 'America/New_York', value: 'America/New_York', label: 'New York (EST/EDT)' },
  { city: 'London', timezone: 'Europe/London', value: 'Europe/London', label: 'London (GMT/BST)' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { city: 'Sydney', timezone: 'Australia/Sydney', value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { city: 'Dubai', timezone: 'Asia/Dubai', value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { city: 'Los Angeles', timezone: 'America/Los_Angeles', value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { city: 'Paris', timezone: 'Europe/Paris', value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { city: 'Mumbai', timezone: 'Asia/Kolkata', value: 'Asia/Kolkata', label: 'Mumbai (IST)' }
]

const availableTimezones = [
  { value: 'Pacific/Midway', label: 'Midway (UTC-11)' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (UTC-10)' },
  { value: 'America/Anchorage', label: 'Anchorage (UTC-9)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8)' },
  { value: 'America/Denver', label: 'Denver (UTC-7)' },
  { value: 'America/Chicago', label: 'Chicago (UTC-6)' },
  { value: 'America/New_York', label: 'New York (UTC-5)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (UTC-3)' },
  { value: 'Atlantic/Azores', label: 'Azores (UTC-1)' },
  { value: 'Europe/London', label: 'London (UTC+0)' },
  { value: 'Europe/Paris', label: 'Paris (UTC+1)' },
  { value: 'Europe/Moscow', label: 'Moscow (UTC+3)' },
  { value: 'Asia/Dubai', label: 'Dubai (UTC+4)' },
  { value: 'Asia/Karachi', label: 'Karachi (UTC+5)' },
  { value: 'Asia/Kolkata', label: 'Mumbai (UTC+5:30)' },
  { value: 'Asia/Dhaka', label: 'Dhaka (UTC+6)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (UTC+7)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (UTC+8)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
  { value: 'Australia/Sydney', label: 'Sydney (UTC+10)' },
  { value: 'Pacific/Noumea', label: 'Noumea (UTC+11)' },
  { value: 'Pacific/Fiji', label: 'Fiji (UTC+12)' }
]

const { copyWithFeedback } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

const formatTime = (date: Date, format: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: format === '12'
  }
  return date.toLocaleTimeString('en-US', options)
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

const formatOffset = (offset: number): string => {
  const sign = offset >= 0 ? '+' : '-'
  const hours = Math.floor(Math.abs(offset) / 60)
  const minutes = Math.abs(offset) % 60
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

const getTimezoneOffset = (timezone: string): number => {
  try {
    const date = new Date()
    const utc = new Date(date.getTime() + (date.getTimezoneOffset() * 60000))
    const target = new Date(utc.toLocaleString('en-US', { timeZone: timezone }))
    return Math.round((target.getTime() - utc.getTime()) / 60000)
  } catch (e) {
    return 0
  }
}

const searchTimezones = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  searchResults.value = availableTimezones
    .filter(tz => 
      tz.label.toLowerCase().includes(query) || 
      tz.value.toLowerCase().includes(query)
    )
    .slice(0, 10)
}

const addTimezone = (timezone: { value: string; label: string; city?: string }) => {
  const city = timezone.city || timezone.label.split(' (')[0]
  const id = `${timezone.value}-${Date.now()}`
  const offset = getTimezoneOffset(timezone.value)
  
  timezones.value.push({
    id,
    city,
    timezone: timezone.value,
    offset,
    currentTime: new Date()
  })
  
  searchQuery.value = ''
  searchResults.value = []
  
  if (timezones.value.length === 1) {
    celebrateFirstUse('world-clock')
  }
}

const removeTimezone = (id: string) => {
  timezones.value = timezones.value.filter(tz => tz.id !== id)
}

const updateTimes = () => {
  timezones.value.forEach(timezone => {
    const now = new Date()
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
    const target = new Date(utc.getTime() + (timezone.offset * 60000))
    timezone.currentTime = target
  })
}

const copyAllTimes = async () => {
  if (timezones.value.length === 0) return
  
  const times = timezones.value.map(tz => 
    `${tz.city}: ${formatTime(tz.currentTime, timeFormat)} (${formatDate(tz.currentTime)})`
  ).join('\n')
  
  await copyWithFeedback(times)
}

const clearAll = () => {
  timezones.value = []
}

const getDayCount = (): number => {
  if (timezones.value.length === 0) return 0
  
  const dates = timezones.value.map(tz => 
    tz.currentTime.toDateString()
  )
  return new Set(dates).size
}

onMounted(() => {
  // Add default cities
  defaultCities.slice(0, 4).forEach(city => {
    addTimezone(city)
  })
  
  updateTimes()
  updateInterval = setInterval(updateTimes, 1000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
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
