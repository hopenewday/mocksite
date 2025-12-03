<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Detailed Time Analysis
    </h2>
    
    <!-- Overall Time Stats -->
    <div class="grid md:grid-cols-4 gap-4 mb-8">
      <div class="bg-brutal-yellow border-4 border-black p-4 text-center">
        <div class="text-2xl font-black">
          {{ formatTime(totalTime) }}
        </div>
        <div class="text-sm font-bold">
          Total Time
        </div>
      </div>
      
      <div class="bg-brutal-lime border-4 border-black p-4 text-center">
        <div class="text-2xl font-black">
          {{ formatTime(averageTime) }}
        </div>
        <div class="text-sm font-bold">
          Avg per Question
        </div>
      </div>
      
      <div class="bg-brutal-pink border-4 border-black p-4 text-center">
        <div class="text-2xl font-black">
          {{ formatTime(fastestTime) }}
        </div>
        <div class="text-sm font-bold">
          Fastest Question
        </div>
      </div>
      
      <div class="bg-brutal-purple border-4 border-black p-4 text-center">
        <div class="text-2xl font-black">
          {{ formatTime(slowestTime) }}
        </div>
        <div class="text-sm font-bold">
          Slowest Question
        </div>
      </div>
    </div>
    
    <!-- Question-wise Time Analysis -->
    <div class="bg-brutal-white border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Question-wise Time Distribution
      </h3>
      
      <div class="space-y-3 max-h-64 overflow-y-auto">
        <div 
          v-for="(question, index) in questionTimes"
          :key="question.id"
          class="flex items-center gap-4 p-3 border-2 border-black"
          :class="getTimeClass(question.timeSpent, question.averageTime)"
        >
          <div class="w-12 text-center">
            <div class="font-black">
              Q{{ index + 1 }}
            </div>
            <div class="text-xs font-bold">
              {{ question.correct ? '✅' : '❌' }}
            </div>
          </div>
          
          <div class="flex-1">
            <div class="flex justify-between mb-1">
              <span class="font-bold text-sm">{{ question.subject }}</span>
              <span class="font-black text-sm">{{ formatTime(question.timeSpent) }}</span>
            </div>
            
            <!-- Time Bar -->
            <div class="w-full h-3 bg-brutal-gray border border-black">
              <div 
                class="h-full transition-all duration-500"
                :class="getTimeBarColor(question.timeSpent, question.averageTime)"
                :style="{ width: `${Math.min((question.timeSpent / maxTime) * 100, 100)}%` }"
              />
            </div>
            
            <div class="text-xs font-bold text-brutal-gray mt-1">
              Avg: {{ formatTime(question.averageTime) }} 
              {{ question.timeSpent > question.averageTime ? '⚠️ Slower' : '✅ Faster' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Subject-wise Time Analysis -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-brutal-lime border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Subject-wise Time Analysis
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="subject in subjectTimeAnalysis"
            :key="subject.name"
            class="border-2 border-black p-3"
          >
            <div class="flex justify-between mb-2">
              <span class="font-bold">{{ subject.name }}</span>
              <span class="font-black">{{ formatTime(subject.totalTime) }}</span>
            </div>
            
            <div class="text-sm font-bold text-brutal-gray">
              Questions: {{ subject.count }} | 
              Avg: {{ formatTime(subject.averageTime) }} | 
              Efficiency: {{ subject.efficiency }}%
            </div>
            
            <div class="w-full h-2 bg-brutal-gray border border-black mt-2">
              <div 
                class="h-full bg-brutal-cyan transition-all duration-500"
                :style="{ width: `${subject.efficiency}%` }"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Time Improvement Suggestions -->
      <div class="bg-brutal-pink border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Time Improvement Suggestions
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="suggestion in timeSuggestions"
            :key="suggestion.id"
            class="flex items-start gap-3 p-3 bg-brutal-white border-2 border-black"
          >
            <span class="text-2xl">{{ suggestion.icon }}</span>
            <div>
              <h4 class="font-black text-sm mb-1">
                {{ suggestion.title }}
              </h4>
              <p class="text-xs font-bold text-brutal-gray">
                {{ suggestion.description }}
              </p>
              <div class="mt-2">
                <span class="badge badge-cyan text-xs">{{ category.impact }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Time Pattern Analysis -->
    <div class="bg-brutal-yellow border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Time Pattern Analysis
      </h3>
      
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Time Trend Chart -->
        <div>
          <h4 class="font-bold mb-3">
            Time Trend (Last 10 Questions)
          </h4>
          <div class="h-32 flex items-end justify-between gap-1">
            <div 
              v-for="(time, index) in timeTrend"
              :key="index"
              class="flex-1 bg-brutal-cyan border border-black transition-all duration-300"
              :style="{ height: `${(time / maxTime) * 100}%` }"
              :title="`Q${index + 1}: ${formatTime(time)}`"
            />
          </div>
        </div>
        
        <!-- Speed Distribution -->
        <div>
          <h4 class="font-bold mb-3">
            Speed Distribution
          </h4>
          <div class="space-y-2">
            <div
              v-for="category in speedDistribution"
              :key="category.label"
              class="flex items-center gap-2"
            >
              <span class="text-xs font-bold w-16">{{ category.label }}</span>
              <div class="flex-1 h-4 bg-brutal-gray border border-black">
                <div 
                  class="h-full transition-all duration-500"
                  :class="category.color"
                  :style="{ width: `${category.percentage}%` }"
                />
              </div>
              <span class="text-xs font-black w-8">{{ category.count }}</span>
            </div>
          </div>
        </div>
        
        <!-- Time Efficiency Score -->
        <div>
          <h4 class="font-bold mb-3">
            Time Efficiency Score
          </h4>
          <div class="text-center">
            <div class="text-4xl font-black mb-2">
              {{ timeEfficiencyScore }}
            </div>
            <div class="text-sm font-bold mb-3">
              out of 100
            </div>
            
            <!-- Circular Progress -->
            <div class="relative w-24 h-24 mx-auto">
              <svg class="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="none"
                  class="text-brutal-gray"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="none"
                  :stroke-dasharray="`${timeEfficiencyScore * 2.26} 226`"
                  class="text-brutal-lime transition-all duration-1000"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-lg font-black">{{ timeEfficiencyScore }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface QuestionTimeData {
  id: string
  subject: string
  timeSpent: number
  averageTime: number
  correct: boolean
  difficulty: string
}

const questionTimes = ref<QuestionTimeData[]>([])

// Simulated data - in real app, this would come from performance timing
const mockQuestionData: QuestionTimeData[] = [
  { id: 'q1', subject: 'Quantitative Aptitude', timeSpent: 45, averageTime: 60, correct: true, difficulty: 'Easy' },
  { id: 'q2', subject: 'Reasoning Ability', timeSpent: 90, averageTime: 75, correct: false, difficulty: 'Medium' },
  { id: 'q3', subject: 'General Awareness', timeSpent: 30, averageTime: 45, correct: true, difficulty: 'Easy' },
  { id: 'q4', subject: 'English Language', timeSpent: 120, averageTime: 90, correct: true, difficulty: 'Hard' },
  { id: 'q5', subject: 'Quantitative Aptitude', timeSpent: 75, averageTime: 60, correct: true, difficulty: 'Medium' },
  { id: 'q6', subject: 'Reasoning Ability', timeSpent: 60, averageTime: 75, correct: true, difficulty: 'Medium' },
  { id: 'q7', subject: 'General Awareness', timeSpent: 25, averageTime: 45, correct: false, difficulty: 'Easy' },
  { id: 'q8', subject: 'English Language', timeSpent: 95, averageTime: 90, correct: true, difficulty: 'Medium' }
]

onMounted(() => {
  // Load data from localStorage or use mock data
  const storedData = localStorage.getItem('questionTimeData')
  if (storedData) {
    questionTimes.value = JSON.parse(storedData)
  } else {
    questionTimes.value = mockQuestionData
  }
})

const totalTime = computed(() => 
  questionTimes.value.reduce((sum, q) => sum + q.timeSpent, 0)
)

const averageTime = computed(() => 
  questionTimes.value.length > 0 ? totalTime.value / questionTimes.value.length : 0
)

const fastestTime = computed(() => 
  Math.min(...questionTimes.value.map(q => q.timeSpent))
)

const slowestTime = computed(() => 
  Math.max(...questionTimes.value.map(q => q.timeSpent))
)

const maxTime = computed(() => slowestTime.value || 100)

const subjectTimeAnalysis = computed(() => {
  const subjects: Record<string, { totalTime: number; count: number; correct: number }> = {}
  
  questionTimes.value.forEach(q => {
    if (!subjects[q.subject]) {
      subjects[q.subject] = { totalTime: 0, count: 0, correct: 0 }
    }
    subjects[q.subject].totalTime += q.timeSpent
    subjects[q.subject].count++
    if (q.correct) subjects[q.subject].correct++
  })
  
  return Object.entries(subjects).map(([name, data]) => ({
    name,
    totalTime: data.totalTime,
    count: data.count,
    averageTime: data.totalTime / data.count,
    accuracy: (data.correct / data.count) * 100,
    efficiency: Math.round((data.correct / data.count) * 100 * (1 - (data.totalTime / data.count) / 120))
  }))
})

const timeSuggestions = computed(() => {
  const suggestions = []
  
  // Analyze slow subjects
  subjectTimeAnalysis.value.forEach(subject => {
    if (subject.averageTime > 90) {
      suggestions.push({
        id: `slow-${subject.name}`,
        icon: '⏱️',
        title: `Speed up in ${subject.name}`,
        description: `You're taking ${Math.round(subject.averageTime - 60)}s extra per question. Practice time management.`,
        impact: 'High Impact'
      })
    }
  })
  
  // Analyze incorrect but fast answers
  const fastIncorrect = questionTimes.value.filter(q => !q.correct && q.timeSpent < q.averageTime * 0.7)
  if (fastIncorrect.length > 0) {
    suggestions.push({
      id: 'rushed',
      icon: '⚠️',
      title: 'Avoid Rushing',
      description: `${fastIncorrect.length} questions were incorrect despite being answered quickly. Take time to read carefully.`,
      impact: 'Medium Impact'
    })
  }
  
  // Analyze time consistency
  const timeVariance = calculateTimeVariance()
  if (timeVariance > 50) {
    suggestions.push({
      id: 'consistency',
      icon: '📊',
      title: 'Improve Consistency',
      description: 'Your time per question varies significantly. Try to maintain a steady pace.',
      impact: 'Medium Impact'
    })
  }
  
  return suggestions.slice(0, 4)
})

const timeTrend = computed(() => 
  questionTimes.value.slice(-10).map(q => q.timeSpent)
)

const speedDistribution = computed(() => {
  const distribution = [
    { label: 'Fast (<30s)', min: 0, max: 30, color: 'bg-brutal-lime', count: 0 },
    { label: 'Normal (30-60s)', min: 30, max: 60, color: 'bg-brutal-cyan', count: 0 },
    { label: 'Slow (60-90s)', min: 60, max: 90, color: 'bg-brutal-yellow', count: 0 },
    { label: 'Very Slow (>90s)', min: 90, max: Infinity, color: 'bg-brutal-pink', count: 0 }
  ]
  
  questionTimes.value.forEach(q => {
    const category = distribution.find(d => q.timeSpent >= d.min && q.timeSpent < d.max)
    if (category) category.count++
  })
  
  const total = questionTimes.value.length
  return distribution.map(d => ({
    ...d,
    percentage: total > 0 ? Math.round((d.count / total) * 100) : 0
  }))
})

const timeEfficiencyScore = computed(() => {
  let score = 100
  
  // Deduct points for slow answers
  questionTimes.value.forEach(q => {
    if (q.timeSpent > q.averageTime * 1.5) {
      score -= 5
    } else if (q.timeSpent > q.averageTime * 1.2) {
      score -= 2
    }
    
    // Deduct points for rushed incorrect answers
    if (!q.correct && q.timeSpent < q.averageTime * 0.7) {
      score -= 3
    }
  })
  
  return Math.max(0, Math.min(100, score))
})

const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

const getTimeClass = (timeSpent: number, averageTime: number): string => {
  if (timeSpent > averageTime * 1.5) return 'bg-brutal-pink/20'
  if (timeSpent > averageTime * 1.2) return 'bg-brutal-yellow/20'
  if (timeSpent < averageTime * 0.7) return 'bg-brutal-lime/20'
  return 'bg-brutal-cyan/20'
}

const getTimeBarColor = (timeSpent: number, averageTime: number): string => {
  if (timeSpent > averageTime * 1.5) return 'bg-brutal-pink'
  if (timeSpent > averageTime * 1.2) return 'bg-brutal-yellow'
  if (timeSpent < averageTime * 0.7) return 'bg-brutal-lime'
  return 'bg-brutal-cyan'
}

const calculateTimeVariance = (): number => {
  if (questionTimes.value.length === 0) return 0
  
  const times = questionTimes.value.map(q => q.timeSpent)
  const mean = times.reduce((sum, time) => sum + time, 0) / times.length
  const variance = times.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / times.length
  
  return Math.sqrt(variance)
}
</script>
