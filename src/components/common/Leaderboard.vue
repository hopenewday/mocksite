<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Leaderboard
    </h2>
    
    <!-- Time Filter -->
    <div class="flex gap-2 mb-6">
      <button 
        v-for="period in periods"
        :key="period.value"
        :class="[
          'btn-primary px-4 py-2 text-sm font-black',
          selectedPeriod === period.value 
            ? 'btn-primary-cyan' 
            : 'btn-primary-white border-2 border-black'
        ]"
        @click="selectedPeriod = period.value"
      >
        {{ period.label }}
      </button>
    </div>
    
    <!-- Top 3 Winners -->
    <div class="grid md:grid-cols-3 gap-4 mb-8">
      <div 
        v-for="(user, index) in topThree" 
        :key="user.id"
        :class="[
          'p-6 text-center border-4 border-black transform',
          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 rotate-[-1deg] scale-105' : 
          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 rotate-[1deg]' : 
          'bg-gradient-to-br from-orange-400 to-orange-600 rotate-[-1deg]'
        ]"
      >
        <div class="text-4xl mb-2">
          {{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}
        </div>
        <div class="font-black text-lg mb-1">
          {{ user.name }}
        </div>
        <div class="text-sm font-bold mb-2">
          {{ user.badge }}
        </div>
        <div class="text-2xl font-black">
          {{ user.score }}
        </div>
        <div class="text-sm font-bold">
          points
        </div>
      </div>
    </div>
    
    <!-- Rest of Leaderboard -->
    <div class="space-y-3">
      <div 
        v-for="(user, index) in restOfLeaderboard"
        :key="user.id"
        class="flex items-center justify-between p-4 border-4 border-black bg-brutal-white transform rotate-[-1deg] hover:rotate-0 transition-all"
      >
        <div class="flex items-center gap-4">
          <div class="w-8 h-8 border-2 border-black flex items-center justify-center font-black">
            {{ index + 4 }}
          </div>
          <div>
            <div class="font-black">
              {{ user.name }}
            </div>
            <div class="text-sm font-bold text-brutal-gray">
              {{ user.badge }}
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-black text-lg">
            {{ user.score }}
          </div>
          <div class="text-sm font-bold">
            points
          </div>
        </div>
      </div>
    </div>
    
    <!-- Your Position -->
    <div
      v-if="userPosition"
      class="mt-6 p-4 bg-brutal-cyan border-4 border-black transform rotate-[1deg]"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-8 h-8 border-2 border-black bg-brutal-white flex items-center justify-center font-black">
            {{ userPosition.rank }}
          </div>
          <div>
            <div class="font-black">
              You
            </div>
            <div class="text-sm font-bold">
              {{ userPosition.badge }}
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-black text-lg">
            {{ userPosition.score }}
          </div>
          <div class="text-sm font-bold">
            points
          </div>
        </div>
      </div>
    </div>
    
    <!-- View More Button -->
    <div class="mt-6 text-center">
      <button class="btn-primary btn-primary-pink">
        View Full Leaderboard
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedPeriod = ref('weekly')

const periods = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'alltime', label: 'All Time' }
]

const leaderboardData = ref({
  daily: [
    { id: 1, name: 'Rahul Sharma', score: 2450, badge: '🔥 30-Day Streak' },
    { id: 2, name: 'Priya Patel', score: 2380, badge: '⭐ Top Performer' },
    { id: 3, name: 'Amit Kumar', score: 2290, badge: '🚀 Fast Learner' },
    { id: 4, name: 'Sneha Reddy', score: 2150, badge: '💪 Consistent' },
    { id: 5, name: 'Vikram Singh', score: 2080, badge: '📚 Bookworm' },
    { id: 6, name: 'Neha Gupta', score: 1950, badge: '🎯 Sharp Shooter' },
    { id: 7, name: 'Rohit Verma', score: 1820, badge: '⚡ Quick Thinker' }
  ],
  weekly: [
    { id: 1, name: 'Priya Patel', score: 8450, badge: '🏆 Weekly Champion' },
    { id: 2, name: 'Rahul Sharma', score: 8230, badge: '🌟 Rising Star' },
    { id: 3, name: 'Amit Kumar', score: 7890, badge: '💎 Diamond' },
    { id: 4, name: 'Sneha Reddy', score: 7650, badge: '🔥 On Fire' },
    { id: 5, name: 'Vikram Singh', score: 7280, badge: '🎯 Precision Master' }
  ],
  monthly: [
    { id: 1, name: 'Rahul Sharma', score: 28450, badge: '👑 King of Month' },
    { id: 2, name: 'Priya Patel', score: 27230, badge: '👸 Queen of Month' },
    { id: 3, name: 'Amit Kumar', score: 26890, badge: '🏅 Elite' },
    { id: 4, name: 'Sneha Reddy', score: 25650, badge: '⚡ Lightning' }
  ],
  alltime: [
    { id: 1, name: 'Rahul Sharma', score: 128450, badge: '🏆 All Time Champion' },
    { id: 2, name: 'Priya Patel', score: 122230, badge: '🌟 Legend' },
    { id: 3, name: 'Amit Kumar', score: 118890, badge: '💎 Master' },
    { id: 4, name: 'Sneha Reddy', score: 115650, badge: '🔥 Phenomenon' }
  ]
})

const currentLeaderboard = computed(() => {
  return leaderboardData.value[selectedPeriod.value] || []
})

const topThree = computed(() => currentLeaderboard.value.slice(0, 3))

const restOfLeaderboard = computed(() => currentLeaderboard.value.slice(3, 7))

const userPosition = computed(() => ({
  rank: 12,
  score: 1450,
  badge: '🌱 Growing Strong'
}))
</script>
