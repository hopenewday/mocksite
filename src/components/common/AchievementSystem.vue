<template>
  <div class="card card-brutal-purple p-8">
    <h2 class="subheading-brutal mb-6">
      Achievements & Badges
    </h2>
    
    <!-- Achievement Stats -->
    <div class="grid md:grid-cols-3 gap-4 mb-8">
      <div class="bg-brutal-yellow border-4 border-black p-4 text-center">
        <div class="text-2xl font-black">
          {{ unlockedAchievements.length }}
        </div>
        <div class="text-sm font-bold">
          Unlocked
        </div>
      </div>
      
      <div class="bg-brutal-cyan border-4 border-black p-4 text-center">
        <div class="text-2xl font-black">
          {{ totalAchievements - unlockedAchievements.length }}
        </div>
        <div class="text-sm font-bold">
          Locked
        </div>
      </div>
      
      <div class="bg-brutal-lime border-4 border-black p-4 text-center">
        <div class="text-2xl font-black">
          {{ Math.round((unlockedAchievements.length / totalAchievements) * 100) }}%
        </div>
        <div class="text-sm font-bold">
          Complete
        </div>
      </div>
    </div>
    
    <!-- Achievement Categories -->
    <div class="flex gap-2 mb-6 flex-wrap">
      <button 
        v-for="category in categories"
        :key="category.value"
        :class="[
          'btn-primary px-4 py-2 text-sm font-black',
          selectedCategory === category.value 
            ? 'btn-primary-purple' 
            : 'btn-primary-white border-2 border-black'
        ]"
        @click="selectedCategory = category.value"
      >
        {{ category.icon }} {{ category.label }}
      </button>
    </div>
    
    <!-- Achievements Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="achievement in filteredAchievements"
        :key="achievement.id"
        :class="[
          'p-4 border-4 border-black transform transition-all duration-300',
          achievement.unlocked 
            ? 'bg-gradient-to-br from-brutal-lime to-brutal-cyan rotate-[-1deg] hover:rotate-0' 
            : 'bg-brutal-gray/50 rotate-[1deg] opacity-60'
        ]"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="text-3xl">
            {{ achievement.icon }}
          </div>
          <div class="flex-1">
            <h3 class="font-black text-sm">
              {{ achievement.name }}
            </h3>
            <p class="text-xs font-bold text-brutal-gray">
              {{ achievement.description }}
            </p>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div
          v-if="!achievement.unlocked && achievement.progress !== undefined"
          class="mb-2"
        >
          <div class="flex justify-between text-xs font-bold mb-1">
            <span>Progress</span>
            <span>{{ achievement.progress.current }}/{{ achievement.progress.required }}</span>
          </div>
          <div class="w-full h-2 bg-brutal-gray border border-black">
            <div 
              class="h-full bg-brutal-cyan transition-all duration-500"
              :style="{ width: `${(achievement.progress.current / achievement.progress.required) * 100}%` }"
            />
          </div>
        </div>
        
        <!-- Reward -->
        <div class="flex items-center justify-between">
          <div class="text-xs font-bold">
            <span
              v-if="achievement.unlocked"
              class="text-green-600"
            >✅ Unlocked</span>
            <span
              v-else
              class="text-red-600"
            >🔒 Locked</span>
          </div>
          <div
            v-if="achievement.reward"
            class="text-xs font-black"
          >
            +{{ achievement.reward }} pts
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Unlocks -->
    <div
      v-if="recentUnlocks.length"
      class="mt-8"
    >
      <h3 class="font-black text-lg mb-4">
        Recent Unlocks
      </h3>
      <div class="space-y-2">
        <div 
          v-for="unlock in recentUnlocks"
          :key="unlock.id"
          class="bg-brutal-yellow border-4 border-black p-3 flex items-center gap-3 transform rotate-[-1deg]"
        >
          <span class="text-2xl">{{ unlock.icon }}</span>
          <div class="flex-1">
            <div class="font-black text-sm">
              {{ unlock.name }}
            </div>
            <div class="text-xs font-bold text-brutal-gray">
              Unlocked {{ unlock.timeAgo }}
            </div>
          </div>
          <div class="font-black text-sm">
            +{{ unlock.reward }} pts
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  unlocked: boolean
  reward?: number
  progress?: {
    current: number
    required: number
  }
}

const selectedCategory = ref('all')

const categories = [
  { value: 'all', label: 'All', icon: '🏆' },
  { value: 'tests', label: 'Tests', icon: '📝' },
  { value: 'streak', label: 'Streaks', icon: '🔥' },
  { value: 'scores', label: 'Scores', icon: '📊' },
  { value: 'time', label: 'Time', icon: '⏰' },
  { value: 'special', label: 'Special', icon: '⭐' }
]

const achievements = ref<Achievement[]>([
  // Test Achievements
  {
    id: 'first_test',
    name: 'First Steps',
    description: 'Complete your first mock test',
    icon: '🌱',
    category: 'tests',
    unlocked: true,
    reward: 50
  },
  {
    id: 'test_veteran',
    name: 'Test Veteran',
    description: 'Complete 50 mock tests',
    icon: '👑',
    category: 'tests',
    unlocked: false,
    reward: 500,
    progress: { current: 23, required: 50 }
  },
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    description: 'Score 100% in any test',
    icon: '💯',
    category: 'scores',
    unlocked: false,
    reward: 1000
  },
  
  // Streak Achievements
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: '7-day study streak',
    icon: '🔥',
    category: 'streak',
    unlocked: true,
    reward: 200
  },
  {
    id: 'month_streak',
    name: 'Monthly Master',
    description: '30-day study streak',
    icon: '🌟',
    category: 'streak',
    unlocked: false,
    reward: 1000,
    progress: { current: 12, required: 30 }
  },
  
  // Score Achievements
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Score above 80% in 10 tests',
    icon: '🎯',
    category: 'scores',
    unlocked: false,
    reward: 300,
    progress: { current: 6, required: 10 }
  },
  
  // Time Achievements
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete test in half time',
    icon: '⚡',
    category: 'time',
    unlocked: false,
    reward: 250
  },
  
  // Special Achievements
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete 5 tests before 9 AM',
    icon: '🐦',
    category: 'special',
    unlocked: false,
    reward: 150,
    progress: { current: 2, required: 5 }
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete 5 tests after 10 PM',
    icon: '🦉',
    category: 'special',
    unlocked: false,
    reward: 150,
    progress: { current: 3, required: 5 }
  }
])

const recentUnlocks = ref([
  {
    id: 'first_test',
    name: 'First Steps',
    icon: '🌱',
    reward: 50,
    timeAgo: '2 days ago'
  },
  {
    id: 'week_streak',
    name: 'Week Warrior',
    icon: '🔥',
    reward: 200,
    timeAgo: '1 day ago'
  }
])

const filteredAchievements = computed(() => {
  if (selectedCategory.value === 'all') {
    return achievements.value
  }
  return achievements.value.filter(a => a.category === selectedCategory.value)
})

const unlockedAchievements = computed(() => 
  achievements.value.filter(a => a.unlocked)
)

const totalAchievements = computed(() => achievements.value.length)
</script>
