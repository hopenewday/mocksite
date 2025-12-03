<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Dashboard
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Track your progress and performance
        </p>
      </div>
    </header>
    
    <div class="max-w-7xl mx-auto p-6">
      <!-- User Welcome Section -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="md:col-span-2">
          <div class="bg-brutal-yellow border-4 border-black p-6 transform rotate-[-1deg]">
            <div class="flex items-center gap-4">
              <div class="w-20 h-20 bg-brutal-pink border-4 border-black shadow-brutal flex items-center justify-center">
                <span class="text-3xl">👤</span>
              </div>
              <div>
                <h2 class="font-black text-2xl mb-1">
                  Welcome back, {{ userName }}!
                </h2>
                <p class="font-bold text-brutal-gray">
                  Ready to ace your exams today?
                </p>
                <div class="flex items-center gap-4 mt-2">
                  <span class="badge badge-cyan">🔥 {{ streak }} day streak</span>
                  <span class="badge badge-lime">📊 {{ totalTests }} tests completed</span>
                  <span class="badge badge-pink">⭐ {{ averageScore }}% avg score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="bg-brutal-lime border-4 border-black p-6 transform rotate-[1deg]">
          <h3 class="font-black text-lg mb-4">
            Quick Actions
          </h3>
          <div class="space-y-2">
            <router-link
              to="/tests"
              class="btn-primary btn-primary-cyan w-full"
            >
              📝 Start a Test
            </router-link>
            <router-link
              to="/tools"
              class="btn-primary btn-primary-pink w-full"
            >
              🛠️ Use Tools
            </router-link>
            <router-link
              to="/my/assessments"
              class="btn-primary btn-primary-yellow w-full"
            >
              📊 View Progress
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Main Dashboard Grid -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Performance Analytics (2 columns) -->
        <div class="lg:col-span-2">
          <PerformanceAnalytics :user-stats="userStats" />
        </div>
        
        <!-- Leaderboard -->
        <div>
          <Leaderboard />
        </div>
      </div>
      
      <!-- Second Row -->
      <div class="grid lg:grid-cols-3 gap-6 mt-6">
        <!-- Confetti Settings -->
        <div>
          <ConfettiSettings />
        </div>
        
        <!-- Recent Activity -->
        <div class="card card-brutal-pink p-6">
          <h3 class="font-black text-lg mb-4">
            Recent Activity
          </h3>
          <div class="space-y-3">
            <div 
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-center gap-3 p-3 bg-brutal-white border-2 border-black"
            >
              <span class="text-2xl">{{ activity.icon }}</span>
              <div class="flex-1">
                <div class="font-black text-sm">
                  {{ activity.title }}
                </div>
                <div class="text-xs font-bold text-brutal-gray">
                  {{ activity.time }}
                </div>
              </div>
              <div class="font-black text-sm">
                {{ activity.score }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Upcoming Tests / Study Plan -->
        <div class="card card-brutal-yellow p-6">
          <h3 class="font-black text-lg mb-4">
            Study Plan
          </h3>
          <div class="space-y-3">
            <div 
              v-for="plan in studyPlan"
              :key="plan.id"
              class="flex items-center gap-3 p-3 bg-brutal-white border-2 border-black"
            >
              <span class="text-2xl">{{ plan.icon }}</span>
              <div class="flex-1">
                <div class="font-black text-sm">
                  {{ plan.title }}
                </div>
                <div class="text-xs font-bold text-brutal-gray">
                  {{ plan.description }}
                </div>
              </div>
              <button class="btn-primary btn-primary-cyan px-3 py-1 text-xs">
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Achievements Section -->
      <div class="mt-6">
        <AchievementSystem />
      </div>
      
      <!-- Premium Banner (if not premium) -->
      <div
        v-if="!isPremium"
        class="mt-6"
      >
        <PremiumBanner />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PerformanceAnalytics from '@/components/tests/analytics/PerformanceAnalytics.vue'
import Leaderboard from '@/components/common/Leaderboard.vue'
import AchievementSystem from '@/components/common/AchievementSystem.vue'
import PremiumBanner from '@/components/common/PremiumBanner.vue'
import ConfettiSettings from '@/components/ConfettiSettings.vue'
import type { UserStats } from '@/lib/data/examData'

const userName = ref('Rahul Sharma')
const streak = ref(12)
const totalTests = ref(45)
const averageScore = ref(78)
const isPremium = ref(false)

const userStats: UserStats = {
  totalTests: 45,
  avgScore: 78,
  bestScore: 92,
  totalStudyTime: 120,
  streak: 12,
  rank: 342,
  percentile: 85,
  subjectWiseScores: {
    'Quantitative Aptitude': 85,
    'Reasoning Ability': 78,
    'General Awareness': 92,
    'English Language': 70
  },
  weakAreas: ['English Language'],
  strongAreas: ['General Awareness', 'Quantitative Aptitude']
}

const recentActivities = ref([
  {
    id: 1,
    icon: '📝',
    title: 'SSC CGL Mock Test 1',
    time: '2 hours ago',
    score: '82%'
  },
  {
    id: 2,
    icon: '📊',
    title: 'Percentage Calculator',
    time: '5 hours ago',
    score: 'Used'
  },
  {
    id: 3,
    icon: '📝',
    title: 'IBPS PO Practice Set',
    time: '1 day ago',
    score: '75%'
  },
  {
    id: 4,
    icon: '🎯',
    title: 'Daily Quiz',
    time: '1 day ago',
    score: '90%'
  }
])

const studyPlan = ref([
  {
    id: 1,
    icon: '📚',
    title: 'Quantitative Aptitude',
    description: 'Practice Percentage and Profit Loss'
  },
  {
    id: 2,
    icon: '📖',
    title: 'Current Affairs',
    description: 'Read today\'s news summary'
  },
  {
    id: 3,
    icon: '📝',
    title: 'Mock Test',
    description: 'SSC CGL Full Length Test'
  }
])
</script>
