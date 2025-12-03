import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserStats, UserAttempt } from '@/lib/data/examData'

interface StudyPlanItem {
  id: string
  title: string
  type: string
  duration: number
  completed: boolean
  [key: string]: unknown
}

export const useUserProgressStore = defineStore('userProgress', () => {
  // User Profile
  const userName = ref('Guest User')
  const userAvatar = ref('')
  const isPremium = ref(false)
  const premiumExpiry = ref<Date | null>(null)
  
  // User Stats
  const totalTests = ref(0)
  const totalStudyTime = ref(0) // in minutes
  const currentStreak = ref(0)
  const longestStreak = ref(0)
  const lastActiveDate = ref<Date | null>(null)
  const totalPoints = ref(0)
  
  // Performance Stats
  const averageScore = ref(0)
  const bestScore = ref(0)
  const currentRank = ref(0)
  const previousRank = ref(0)
  
  // Subject-wise Performance
  const subjectScores = ref<Record<string, number>>({})
  const weakAreas = ref<string[]>([])
  const strongAreas = ref<string[]>([])
  
  // Recent Attempts
  const recentAttempts = ref<UserAttempt[]>([])
  const scoreHistory = ref<number[]>([])
  
  // Achievements
  const unlockedAchievements = ref<string[]>([])
  const achievementProgress = ref<Record<string, number>>({})
  
  // Study Plan
  const studyPlan = ref<StudyPlanItem[]>([])
  const completedToday = ref<string[]>([])
  
  // Computed Properties
  const userStats = computed<UserStats>(() => ({
    totalTests: totalTests.value,
    avgScore: averageScore.value,
    bestScore: bestScore.value,
    totalStudyTime: totalStudyTime.value,
    streak: currentStreak.value,
    rank: currentRank.value,
    percentile: Math.round((1 - currentRank.value / 10000) * 100), // Assuming 10k users
    subjectWiseScores: subjectScores.value,
    weakAreas: weakAreas.value,
    strongAreas: strongAreas.value
  }))
  
  const rankChange = computed(() => previousRank.value - currentRank.value)
  
  const todayProgress = computed(() => ({
    completedTests: completedToday.value.length,
    studyTime: totalStudyTime.value % 1440, // Today's minutes
    pointsEarned: totalPoints.value % 1000 // Rough estimate
  }))
  
  // Actions
  const updateUserProfile = (profile: {
    name?: string
    avatar?: string
    isPremium?: boolean
    premiumExpiry?: Date | null
  }) => {
    if (profile.name) userName.value = profile.name
    if (profile.avatar) userAvatar.value = profile.avatar
    if (profile.isPremium !== undefined) isPremium.value = profile.isPremium
    if (profile.premiumExpiry) premiumExpiry.value = profile.premiumExpiry
  }
  
  const addTestAttempt = (attempt: UserAttempt) => {
    recentAttempts.value.unshift(attempt)
    if (recentAttempts.value.length > 10) {
      recentAttempts.value = recentAttempts.value.slice(0, 10)
    }
    
    // Update stats
    totalTests.value++
    if (attempt.status === 'completed') {
      const score = (attempt.score / attempt.totalMarks) * 100
      scoreHistory.value.push(score)
      if (scoreHistory.value.length > 20) {
        scoreHistory.value = scoreHistory.value.slice(-20)
      }
      
      // Update average score
      const totalScore = scoreHistory.value.reduce((sum, s) => sum + s, 0)
      averageScore.value = Math.round(totalScore / scoreHistory.value.length)
      
      // Update best score
      if (score > bestScore.value) {
        bestScore.value = Math.round(score)
      }
      
      // Update study time
      if (attempt.startTime && attempt.endTime) {
        const duration = (attempt.endTime.getTime() - attempt.startTime.getTime()) / (1000 * 60)
        totalStudyTime.value += Math.round(duration)
      }
      
      // Update streak
      updateStreak()
      
      // Add points
      const points = Math.round(score * 10)
      totalPoints.value += points
      
      // Check achievements
      checkAchievements()
    }
  }
  
  const updateStreak = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (!lastActiveDate.value) {
      currentStreak.value = 1
      longestStreak.value = 1
    } else {
      const lastActive = new Date(lastActiveDate.value)
      lastActive.setHours(0, 0, 0, 0)
      
      const dayDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
      
      if (dayDiff === 0) {
        // Same day, no change
      } else if (dayDiff === 1) {
        // Next day, increment streak
        currentStreak.value++
        if (currentStreak.value > longestStreak.value) {
          longestStreak.value = currentStreak.value
        }
      } else {
        // Gap of more than 1 day, reset streak
        currentStreak.value = 1
      }
    }
    
    lastActiveDate.value = today
  }
  
  const updateSubjectScore = (subject: string, score: number) => {
    subjectScores.value[subject] = score
    updateWeakAndStrongAreas()
  }
  
  const updateWeakAndStrongAreas = () => {
    const subjects = Object.entries(subjectScores.value)
    
    // Sort by score
    subjects.sort(([, a], [, b]) => a - b)
    
    // Bottom 3 are weak areas
    weakAreas.value = subjects.slice(0, 3).map(([subject]) => subject)
    
    // Top 3 are strong areas
    strongAreas.value = subjects.slice(-3).reverse().map(([subject]) => subject)
  }
  
  const unlockAchievement = (achievementId: string) => {
    if (!unlockedAchievements.value.includes(achievementId)) {
      unlockedAchievements.value.push(achievementId)
      
      // Add achievement points
      const points = getAchievementPoints(achievementId)
      totalPoints.value += points
    }
  }
  
  const getAchievementPoints = (achievementId: string): number => {
    const pointsMap: Record<string, number> = {
      'first_test': 50,
      'test_veteran': 500,
      'perfect_score': 1000,
      'week_streak': 200,
      'month_streak': 1000,
      'high_scorer': 300,
      'speed_demon': 250,
      'early_bird': 150,
      'night_owl': 150
    }
    return pointsMap[achievementId] || 0
  }
  
  const checkAchievements = () => {
    // First test
    if (totalTests.value === 1) {
      unlockAchievement('first_test')
    }
    
    // Test veteran
    if (totalTests.value >= 50) {
      unlockAchievement('test_veteran')
    }
    
    // Week streak
    if (currentStreak.value >= 7) {
      unlockAchievement('week_streak')
    }
    
    // Month streak
    if (currentStreak.value >= 30) {
      unlockAchievement('month_streak')
    }
    
    // High scorer
    const highScores = scoreHistory.value.filter(score => score >= 80).length
    if (highScores >= 10) {
      unlockAchievement('high_scorer')
    }
  }
  
  const updateRank = (newRank: number) => {
    previousRank.value = currentRank.value
    currentRank.value = newRank
  }
  
  const addToStudyPlan = (item: StudyPlanItem) => {
    studyPlan.value.push(item)
  }
  
  const markCompleted = (itemId: string) => {
    completedToday.value.push(itemId)
  }
  
  const resetDailyProgress = () => {
    completedToday.value = []
  }
  
  return {
    // State
    userName,
    userAvatar,
    isPremium,
    premiumExpiry,
    totalTests,
    totalStudyTime,
    currentStreak,
    longestStreak,
    lastActiveDate,
    totalPoints,
    averageScore,
    bestScore,
    currentRank,
    previousRank,
    subjectScores,
    weakAreas,
    strongAreas,
    recentAttempts,
    scoreHistory,
    unlockedAchievements,
    achievementProgress,
    studyPlan,
    completedToday,
    
    // Computed
    userStats,
    rankChange,
    todayProgress,
    
    // Actions
    updateUserProfile,
    addTestAttempt,
    updateStreak,
    updateSubjectScore,
    updateWeakAndStrongAreas,
    unlockAchievement,
    checkAchievements,
    updateRank,
    addToStudyPlan,
    markCompleted,
    resetDailyProgress
  }
})
