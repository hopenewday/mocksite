<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">
      Performance Analytics
    </h2>
    
    <!-- Overall Stats -->
    <div class="grid md:grid-cols-4 gap-4 mb-8">
      <div class="bg-brutal-cyan border-4 border-black p-4 text-center">
        <div class="text-2xl font-black">
          {{ userStats.totalTests }}
        </div>
        <div class="text-sm font-bold">
          Total Tests
        </div>
      </div>
      
      <div class="bg-brutal-lime border-4 border-black p-4 text-center">
        <div class="text-2xl font-black">
          {{ userStats.avgScore }}%
        </div>
        <div class="text-sm font-bold">
          Average Score
        </div>
      </div>
      
      <div class="bg-brutal-yellow border-4 border-black p-4 text-center">
        <div class="text-2xl font-black">
          {{ userStats.bestScore }}%
        </div>
        <div class="text-sm font-bold">
          Best Score
        </div>
      </div>
      
      <div class="bg-brutal-purple border-4 border-black p-4 text-center">
        <div class="text-2xl font-black">
          {{ userStats.streak }}
        </div>
        <div class="text-sm font-bold">
          Day Streak
        </div>
      </div>
    </div>
    
    <!-- Subject-wise Performance -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Score Breakdown -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black mb-4">
          Score by Subject
        </h3>
        <div class="space-y-3">
          <div 
            v-for="subject in subjectScores"
            :key="subject.name"
            class="flex items-center justify-between"
          >
            <span class="font-bold text-sm">{{ subject.name }}</span>
            <div class="flex items-center gap-2 flex-1 ml-4">
              <div class="w-32 h-4 bg-brutal-gray border-2 border-black">
                <div 
                  class="h-full transition-all duration-500"
                  :class="getScoreColor(subject.percentage)"
                  :style="{ width: `${subject.percentage}%` }"
                />
              </div>
              <span class="font-black text-sm w-12 text-right">{{ subject.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Accuracy vs Speed -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black mb-4">
          Performance Metrics
        </h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between mb-1">
              <span class="font-bold">Accuracy</span>
              <span class="font-black">{{ accuracy }}%</span>
            </div>
            <div class="w-full h-4 bg-brutal-gray border-2 border-black">
              <div 
                class="h-full bg-brutal-cyan transition-all duration-500"
                :style="{ width: `${accuracy}%` }"
              />
            </div>
          </div>
          
          <div>
            <div class="flex justify-between mb-1">
              <span class="font-bold">Speed</span>
              <span class="font-black">{{ speed }} q/min</span>
            </div>
            <div class="w-full h-4 bg-brutal-gray border-2 border-black">
              <div 
                class="h-full bg-brutal-pink transition-all duration-500"
                :style="{ width: `${Math.min((speed / 2) * 100, 100)}%` }"
              />
            </div>
          </div>
          
          <div>
            <div class="flex justify-between mb-1">
              <span class="font-bold">Time Management</span>
              <span class="font-black">{{ timeManagement }}%</span>
            </div>
            <div class="w-full h-4 bg-brutal-gray border-2 border-black">
              <div 
                class="h-full bg-brutal-lime transition-all duration-500"
                :style="{ width: `${timeManagement}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Progress Chart -->
    <div class="bg-brutal-yellow border-4 border-black p-6 mb-8">
      <h3 class="font-black mb-4">
        Score Progress
      </h3>
      <div class="h-48 flex items-end justify-between gap-2">
        <div 
          v-for="(score, index) in scoreHistory"
          :key="index"
          class="flex-1 bg-brutal-cyan border-2 border-black transition-all duration-300 hover:bg-brutal-pink"
          :style="{ height: `${score}%` }"
          :title="`Test ${index + 1}: ${score}%`"
        />
      </div>
      <div class="flex justify-between mt-2 text-xs font-bold">
        <span>Test 1</span>
        <span>Test 5</span>
        <span>Test 10</span>
        <span>Latest</span>
      </div>
    </div>
    
    <!-- Rank Comparison -->
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black mb-4">
          Rank Comparison
        </h3>
        <div class="text-center">
          <div class="text-4xl font-black mb-2">
            #{{ userStats.rank }}
          </div>
          <div class="font-bold">
            out of {{ totalUsers }} users
          </div>
          <div class="text-sm mt-2">
            Top {{ percentile }}% percentile
          </div>
          
          <!-- Rank Progress Bar -->
          <div class="mt-4 w-full h-6 bg-brutal-gray border-2 border-black">
            <div 
              class="h-full bg-gradient-to-r from-brutal-lime to-brutal-cyan transition-all duration-500"
              :style="{ width: `${percentile}%` }"
            />
          </div>
        </div>
      </div>
      
      <!-- Recommendations -->
      <div class="bg-brutal-lime border-4 border-black p-6">
        <h3 class="font-black mb-4">
          Recommendations
        </h3>
        <div class="space-y-3">
          <div
            v-for="area in userStats.weakAreas"
            :key="area"
            class="flex items-center gap-2"
          >
            <span class="text-red-600 font-black">⚠️</span>
            <span class="font-bold">Focus on {{ area }}</span>
          </div>
          <div
            v-for="area in userStats.strongAreas"
            :key="area"
            class="flex items-center gap-2"
          >
            <span class="text-green-600 font-black">✅</span>
            <span class="font-bold">Strong in {{ area }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { UserStats } from '@/lib/data/examData'

interface Props {
  userStats: UserStats
}

const props = defineProps<Props>()

const subjectScores = computed(() => [
  { name: 'Quantitative Aptitude', percentage: 85 },
  { name: 'Reasoning Ability', percentage: 78 },
  { name: 'General Awareness', percentage: 92 },
  { name: 'English Language', percentage: 70 },
  { name: 'Computer Knowledge', percentage: 88 },
  { name: 'Current Affairs', percentage: 75 }
])

const accuracy = computed(() => 82)
const speed = computed(() => 1.4)
const timeManagement = computed(() => 78)

const scoreHistory = computed(() => [65, 70, 68, 75, 72, 78, 80, 82, 85, 88])

const totalUsers = ref(5420)
const percentile = computed(() => Math.round((1 - props.userStats.rank / totalUsers.value) * 100))

const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-brutal-lime'
  if (percentage >= 60) return 'bg-brutal-cyan'
  if (percentage >= 40) return 'bg-brutal-yellow'
  return 'bg-brutal-pink'
}
</script>
