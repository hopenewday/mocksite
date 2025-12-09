<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black font-sans pb-16">
    <!-- Header -->
    <header class="bg-brutal-cyan dark:bg-gray-900 border-b-4 border-black dark:border-white p-6 text-black dark:text-white">
      <div class="max-w-7xl mx-auto">
        <h1 class="font-black text-4xl uppercase tracking-tighter">
          DASHBOARD
        </h1>
        <p class="font-bold text-lg mt-1 opacity-80">
          Track your progress and performance
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <!-- Performance Analytics (Top Row) -->
      <div class="bg-brutal-cyan dark:bg-gray-900 border-4 border-black dark:border-white p-6 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff]">
        <h2 class="font-black text-xl mb-4 uppercase text-black dark:text-white">
          Performance Analytics
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Stat Card 1 -->
          <div class="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-4 text-center shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff]">
            <div class="font-black text-4xl mb-1 text-black dark:text-white">
              {{ user.totalTests || 0 }}
            </div>
            <div class="font-bold text-xs uppercase text-black dark:text-gray-300">
              Total Tests
            </div>
          </div>
          <!-- Stat Card 2 -->
          <div class="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-4 text-center shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff]">
            <div class="font-black text-4xl mb-1 text-black dark:text-white">
              {{ user.averageScore || 0 }}%
            </div>
            <div class="font-bold text-xs uppercase text-black dark:text-gray-300">
              Average Score
            </div>
          </div>
          <!-- Stat Card 3 -->
          <div class="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-4 text-center shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff]">
            <div class="font-black text-4xl mb-1 text-black dark:text-white">
              {{ user.bestScore || 0 }}%
            </div>
            <div class="font-bold text-xs uppercase text-black dark:text-gray-300">
              Best Score
            </div>
          </div>
          <!-- Stat Card 4 -->
          <div class="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-4 text-center shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff]">
            <div class="font-black text-4xl mb-1 text-black dark:text-white">
              {{ user.currentStreak || 0 }}
            </div>
            <div class="font-bold text-xs uppercase text-black dark:text-gray-300">
              Day Streak
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Left Column (Analytics) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Subject & Metrics Grid -->
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Score by Subject -->
            <div class="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-4 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff]">
              <h3 class="font-black text-lg mb-4 uppercase border-b-2 border-black dark:border-white pb-2 text-black dark:text-white">
                Score by Subject
              </h3>
              <div class="space-y-4">
                <div
                  v-for="sub in subjects"
                  :key="sub.name"
                >
                  <div class="flex justify-between font-bold text-xs mb-1 text-black dark:text-white">
                    <span>{{ sub.name }}</span>
                    <span>{{ sub.score }}%</span>
                  </div>
                  <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 border-2 border-black dark:border-white overflow-hidden relative">
                    <div
                      class="h-full bg-brutal-pink absolute top-0 left-0"
                      :style="{ width: sub.score + '%' }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Performance Metrics -->
            <div class="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-4 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff]">
              <h3 class="font-black text-lg mb-4 uppercase border-b-2 border-black dark:border-white pb-2 text-black dark:text-white">
                Performance Metrics
              </h3>
              <div class="space-y-6">
                <div>
                  <div class="flex justify-between font-bold text-xs mb-1 text-black dark:text-white">
                    <span>Accuracy</span>
                    <span>82%</span>
                  </div>
                  <div class="h-4 w-full bg-gray-200 border-2 border-black overflow-hidden relative">
                    <div class="h-full bg-brutal-pink w-[82%] absolute top-0 left-0" />
                  </div>
                </div>
                <div>
                  <div class="flex justify-between font-bold text-xs mb-1 text-black dark:text-white">
                    <span>Speed</span>
                    <span>1.4 q/min</span>
                  </div>
                  <div class="h-4 w-full bg-gray-200 border-2 border-black overflow-hidden relative">
                    <div class="h-full bg-brutal-pink w-[60%] absolute top-0 left-0" />
                  </div>
                </div>
                <div>
                  <div class="flex justify-between font-bold text-xs mb-1 text-black dark:text-white">
                    <span>Time Management</span>
                    <span>78%</span>
                  </div>
                  <div class="h-4 w-full bg-gray-200 border-2 border-black overflow-hidden relative">
                    <div class="h-full bg-brutal-pink w-[78%] absolute top-0 left-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Score Progress Chart (Mock Visual) -->
          <div class="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-4 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff]">
            <h3 class="font-black text-lg mb-4 uppercase border-b-2 border-black dark:border-white pb-2 text-black dark:text-white">
              Score Progress
            </h3>
            <div class="flex items-end justify-between h-40 gap-2 px-2">
              <div class="w-full bg-brutal-cyan border-2 border-black h-[40%]" />
              <div class="w-full bg-brutal-cyan border-2 border-black h-[55%]" />
              <div class="w-full bg-brutal-cyan border-2 border-black h-[50%]" />
              <div class="w-full bg-brutal-cyan border-2 border-black h-[65%]" />
              <div class="w-full bg-brutal-cyan border-2 border-black h-[70%]" />
              <div class="w-full bg-brutal-cyan border-2 border-black h-[60%]" />
              <div class="w-full bg-brutal-cyan border-2 border-black h-[80%]" />
              <div class="w-full bg-brutal-cyan border-2 border-black h-[85%]" />
            </div>
            <div class="flex justify-between text-xs font-bold mt-2 opacity-60 text-black dark:text-white">
              <span>Test 1</span>
              <span>Test 5</span>
              <span>Test 10</span>
              <span>Latest</span>
            </div>
          </div>

          <!-- Rank & Recommendations -->
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Rank Comparison -->
            <div class="bg-brutal-pink border-4 border-black dark:border-white p-6 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff] text-center">
              <h3 class="font-black text-sm uppercase mb-2">
                Rank Comparison
              </h3>
              <div class="text-6xl font-black mb-1">
                #0
              </div>
              <div class="font-bold text-sm mb-4">
                out of 5420 users
              </div>
              <div class="text-xs font-bold uppercase bg-black text-white inline-block px-2 py-1">
                Top 100% percentile
              </div>
              <div class="h-4 w-full bg-white border-2 border-black mt-4 relative">
                <div class="absolute left-0 top-0 h-full bg-brutal-yellow w-[10%]" />
              </div>
            </div>

            <!-- Recommendations -->
            <div class="bg-brutal-pink border-4 border-black dark:border-white p-6 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff]">
              <h3 class="font-black text-sm uppercase mb-2">
                Recommendations
              </h3>
              <div class="h-32 flex items-center justify-center text-center font-bold opacity-60 border-2 border-black dark:border-white border-dashed bg-white/20">
                Detailed analysis after 5 tests
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column (Leaderboard & Activity) -->
        <div class="space-y-6">
          <!-- Leaderboard -->
          <div class="bg-brutal-yellow border-4 border-black dark:border-white p-4 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff]">
            <div class="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
              <h3 class="font-black text-lg uppercase">
                Leaderboard
              </h3>
              <div class="flex gap-1">
                <button class="bg-white border-2 border-black px-2 py-1 text-xs font-bold hover:bg-black hover:text-white transition-colors">
                  DAILY
                </button>
                <button class="bg-brutal-cyan border-2 border-black px-2 py-1 text-xs font-bold">
                  WEEKLY
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <!-- Top 3 -->
              <div class="grid grid-cols-3 gap-2 text-center mb-4">
                <div class="bg-white border-2 border-black p-2 relative pt-6">
                  <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-brutal-pink border-2 border-black rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div class="font-black text-sm truncate">
                    Rahul S.
                  </div>
                  <div class="text-xs font-bold text-gray-500">
                    8230 pts
                  </div>
                </div>
                <div class="bg-brutal-cyan border-2 border-black p-2 relative pt-6 transform -translate-y-2 scale-110 z-10">
                  <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-brutal-yellow border-2 border-black rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div class="font-black text-sm truncate">
                    Priya P.
                  </div>
                  <div class="text-xs font-bold text-gray-500">
                    8450 pts
                  </div>
                </div>
                <div class="bg-white border-2 border-black p-2 relative pt-6">
                  <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-brutal-lime border-2 border-black rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div class="font-black text-sm truncate">
                    Amit K.
                  </div>
                  <div class="text-xs font-bold text-gray-500">
                    7890 pts
                  </div>
                </div>
              </div>

              <!-- Your Rank -->
              <div class="bg-brutal-pink border-2 border-black p-3 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="bg-black text-white font-bold w-6 h-6 flex items-center justify-center text-xs">
                    12
                  </div>
                  <div class="font-black text-sm">
                    You
                  </div>
                </div>
                <div class="font-bold text-xs">
                  1450 pts
                </div>
              </div>
            </div>
          </div>

          <!-- Celebration Settings -->
          <div class="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-4 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff]">
            <h3 class="font-black text-sm uppercase mb-2 px-1 text-black dark:text-white">
              🎉 Celebration Settings
            </h3>
            <div class="flex items-center justify-between">
              <p class="text-xs font-bold max-w-[70%] text-black dark:text-white">
                Show confetti for milestones and achievements
              </p>
              <div class="w-12 h-6 bg-brutal-cyan border-2 border-black rounded-full relative cursor-pointer">
                <div class="absolute right-1 top-1 w-3.5 h-3.5 bg-white border-2 border-black rounded-full" />
              </div>
            </div>
            <button class="w-full mt-4 bg-brutal-pink border-2 border-black py-2 font-black uppercase text-xs hover:bg-white hover:text-black transition-colors text-black">
              Reset All Milestones
            </button>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-4 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff]">
            <h3 class="font-black text-sm uppercase mb-4 px-1 text-black dark:text-white">
              Recent Activity
            </h3>
            <div class="space-y-3">
              <div
                v-for="activity in recentActivities"
                :key="activity.title"
                class="flex items-center gap-3 border-b-2 border-gray-100 dark:border-gray-800 pb-2 last:border-0"
              >
                <div class="text-xl">
                  {{ activity.icon }}
                </div>
                <div class="flex-1">
                  <div class="font-bold text-xs text-black dark:text-white">
                    {{ activity.title }}
                  </div>
                  <div class="text-[10px] font-bold text-gray-400">
                    {{ activity.time }}
                  </div>
                </div>
                <div class="font-black text-xs text-black dark:text-white">
                  {{ activity.score }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievements & Badges (Green Section) -->
      <div class="bg-brutal-green border-4 border-black dark:border-white p-6 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff] mt-8">
        <h2 class="font-black text-xl mb-6 uppercase text-black">
          Achievements & Badges
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Badge 1 -->
          <div class="bg-white border-2 border-black p-4 relative overflow-hidden">
            <div class="flex items-start justify-between">
              <div>
                <div class="text-2xl mb-2">
                  🌱
                </div>
                <div class="font-black text-sm uppercase">
                  First Steps
                </div>
                <div class="text-xs font-bold mt-1 opacity-70">
                  Complete your first mock test
                </div>
              </div>
              <div class="font-black text-xs opacity-50">
                +50 pts
              </div>
            </div>
            <div class="mt-4 flex items-center gap-2 text-xs font-bold text-green-600">
              <span>✅ Unlocked</span>
            </div>
          </div>

          <!-- Badge 2 -->
          <div class="bg-white border-2 border-black p-4 relative overflow-hidden">
            <div class="flex items-start justify-between">
              <div>
                <div class="text-2xl mb-2">
                  🔥
                </div>
                <div class="font-black text-sm uppercase">
                  Week Warrior
                </div>
                <div class="text-xs font-bold mt-1 opacity-70">
                  7-day daily streak
                </div>
              </div>
              <div class="font-black text-xs opacity-50">
                +200 pts
              </div>
            </div>
            <div class="mt-4 flex items-center gap-2 text-xs font-bold text-green-600">
              <span>✅ Unlocked</span>
            </div>
          </div>

          <!-- Locked Badge -->
          <div class="bg-brutal-yellow border-2 border-black p-4 relative overflow-hidden opacity-90">
            <div class="flex items-start justify-between">
              <div>
                <div class="text-2xl mb-2">
                  👑
                </div>
                <div class="font-black text-sm uppercase">
                  Test Veteran
                </div>
                <div class="text-xs font-bold mt-1 opacity-70">
                  Complete 50 mock tests
                </div>
              </div>
              <div class="font-black text-xs opacity-50">
                +500 pts
              </div>
            </div>
            <div class="mt-4">
              <div class="flex justify-between text-[10px] font-bold mb-1">
                <span>Progress</span>
                <span>25/50</span>
              </div>
              <div class="h-2 w-full bg-white border border-black">
                <div class="h-full bg-black w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Recent Unlocks & Premium -->
      <div class="grid md:grid-cols-3 gap-6 mt-6">
        <div class="md:col-span-2 bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-6 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff]">
          <h3 class="font-black text-sm uppercase mb-4 text-black dark:text-white">
            Recent Unlocks
          </h3>
          <div class="space-y-2">
            <div class="bg-brutal-green border-2 border-black dark:border-white p-2 flex justify-between items-center px-4">
              <span class="font-bold text-xs uppercase text-black">🌱 First Steps</span>
              <span class="font-black text-xs text-black">+50 pts</span>
            </div>
            <div class="bg-brutal-yellow border-2 border-black dark:border-white p-2 flex justify-between items-center px-4">
              <span class="font-bold text-xs uppercase text-black">🔥 Week Warrior</span>
              <span class="font-black text-xs text-black">+200 pts</span>
            </div>
          </div>
        </div>

        <div class="bg-brutal-pink border-4 border-black dark:border-white p-6 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff] text-center flex flex-col justify-center items-center">
          <h3 class="font-black text-lg uppercase mb-2">
            GO PREMIUM
          </h3>
          <div class="bg-white border-2 border-black p-4 w-full mb-4">
            <div class="font-black text-3xl">
              ₹299
            </div>
            <div class="font-bold text-xs uppercase">
              per month
            </div>
          </div>
          <button class="bg-brutal-cyan border-2 border-black px-6 py-2 font-black uppercase text-sm hover:bg-white hover:text-black transition-colors w-full text-black">
            UPGRADE NOW
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserProgressStore } from '@/stores/userProgress'
const user = useUserProgressStore()

const subjects = [
  { name: 'Quantitative Aptitude', score: 85 },
  { name: 'Reasoning Ability', score: 78 },
  { name: 'English Awareness', score: 92 },
  { name: 'General Knowledge', score: 70 },
  { name: 'Computer Knowledge', score: 88 },
  { name: 'Current Affairs', score: 75 }
]

const recentActivities = [
  { title: 'SSC CGL Mock Test 1', time: '2 hours ago', score: '82%', icon: '📊' },
  { title: 'Percentage Calculator', time: '3 hours ago', score: '75%', icon: '🧮' },
  { title: 'Daily Quiz', time: '1 day ago', score: '90%', icon: '🎯' }
]
</script>
