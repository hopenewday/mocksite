<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">Attendance Calculator</h2>
    
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Input -->
      <div class="bg-brutal-white border-4 border-black p-6 space-y-6">
        <div>
          <label class="font-black block mb-2">Total Classes</label>
          <input
            v-model.number="totalClasses"
            type="number"
            min="1"
            class="input w-full text-lg"
          >
        </div>

        <div>
          <label class="font-black block mb-2">Classes Attended</label>
          <input
            v-model.number="classesAttended"
            type="number"
            min="0"
            class="input w-full text-lg"
          >
        </div>

        <div>
          <label class="font-black block mb-2">Required Attendance %</label>
          <input
            v-model.number="requiredPercentage"
            type="number"
            min="0"
            max="100"
            step="1"
            class="input w-full"
          >
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button class="btn-primary btn-primary-cyan" :class="{ 'animate-copy-bounce': copying }" @click="copyAttendance">
            {{ copying ? 'Copied!' : 'Copy' }}
          </button>
          <button class="btn-primary btn-primary-pink" @click="reset">Reset</button>
        </div>
      </div>

      <!-- Results -->
      <div class="space-y-6">
        <!-- Current Attendance -->
        <div class="bg-brutal-cyan border-4 border-black p-6">
          <div class="text-sm font-bold text-brutal-gray mb-2">Current Attendance</div>
          <div class="text-5xl font-black mb-4">{{ attendancePercentage.toFixed(1) }}%</div>
          <div class="text-sm font-bold text-brutal-gray">{{ classesAttended }} / {{ totalClasses }} classes</div>
        </div>

        <!-- Status Indicator -->
        <div :class="['border-4 border-black p-6', statusColor]">
          <div class="text-sm font-bold text-brutal-gray mb-2">Status</div>
          <div class="text-2xl font-black">{{ statusMessage }}</div>
          <div v-if="attendancePercentage < requiredPercentage" class="text-sm font-bold mt-2 text-brutal-gray">
            ⚠️ {{ (requiredPercentage - parseFloat(attendancePercentage.toFixed(1))).toFixed(1) }}% more needed
          </div>
          <div v-else class="text-sm font-bold mt-2 text-brutal-gray">
            ✓ {{ (attendancePercentage - requiredPercentage).toFixed(1) }}% above requirement
          </div>
        </div>

        <!-- Predictions -->
        <div class="bg-brutal-yellow border-4 border-black p-6">
          <div class="text-sm font-bold text-brutal-gray mb-2">Missed Classes Allowed</div>
          <div class="text-4xl font-black">{{ classesCanMiss }}</div>
          <div class="text-xs font-bold mt-2 text-brutal-gray">to maintain {{ requiredPercentage }}%</div>
        </div>

        <div class="bg-brutal-pink border-4 border-black p-6">
          <div class="text-sm font-bold text-brutal-gray mb-2">Classes to Attend</div>
          <div class="text-4xl font-black">{{ classesNeeded }}</div>
          <div class="text-xs font-bold mt-2 text-brutal-gray">out of remaining {{ totalClasses - classesAttended }}</div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mt-8 bg-brutal-white border-4 border-black p-6">
      <div class="flex justify-between mb-2">
        <span class="font-black">Progress</span>
        <span class="font-black">{{ attendancePercentage.toFixed(1) }}% / {{ requiredPercentage }}%</span>
      </div>
      <div class="w-full bg-brutal-gray border-2 border-black h-8 relative overflow-hidden">
        <div class="absolute h-full bg-brutal-yellow border-r-2 border-black" :style="{ width: `${requiredPercentage}%` }"></div>
        <div class="relative h-full bg-brutal-cyan border-r-2 border-black" :style="{ width: `${attendancePercentage}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'

useHead({
  title: 'Attendance Calculator',
  meta: [
    { name: 'description', content: 'Track attendance percentage and calculate how many classes you can miss.' },
    { property: 'og:title', content: 'Attendance Calculator' },
    { property: 'og:description', content: 'Track attendance percentage and calculate how many classes you can miss.' }
  ]
})

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

const totalClasses = ref(30)
const classesAttended = ref(24)
const requiredPercentage = ref(75)

const attendancePercentage = computed(() => 
  totalClasses.value > 0 ? (classesAttended.value / totalClasses.value) * 100 : 0
)

const statusColor = computed(() => {
  if (attendancePercentage.value < requiredPercentage.value - 10) return 'bg-red-200 border-red-600'
  if (attendancePercentage.value < requiredPercentage.value) return 'bg-yellow-200 border-yellow-600'
  return 'bg-green-200 border-green-600'
})

const statusMessage = computed(() => {
  if (attendancePercentage.value < requiredPercentage.value) return '❌ Below Requirement'
  if (attendancePercentage.value >= requiredPercentage.value && attendancePercentage.value < requiredPercentage.value + 5) return '⚠️ Barely Passing'
  return '✓ Good Standing'
})

const classesCanMiss = computed(() => {
  const needed = Math.ceil((requiredPercentage.value / 100) * totalClasses.value)
  return Math.max(0, classesAttended.value - needed)
})

const classesNeeded = computed(() => {
  const needed = Math.ceil((requiredPercentage.value / 100) * totalClasses.value)
  return Math.max(0, needed - classesAttended.value)
})

function reset() {
  totalClasses.value = 30
  classesAttended.value = 24
  requiredPercentage.value = 75
}

function copyAttendance() {
  copyWithFeedback(`Attendance: ${attendancePercentage.value.toFixed(1)}% (${classesAttended.value}/${totalClasses.value})`)
}
</script>
