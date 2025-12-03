<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">
      Error Pattern Analysis
    </h2>
    
    <!-- Error Overview Stats -->
    <div class="grid md:grid-cols-4 gap-4 mb-8">
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-pink">
          {{ totalErrors }}
        </div>
        <div class="text-sm font-bold">
          Total Errors
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-cyan">
          {{ errorRate }}%
        </div>
        <div class="text-sm font-bold">
          Error Rate
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-yellow">
          {{ repeatedErrors }}
        </div>
        <div class="text-sm font-bold">
          Repeated Errors
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-lime">
          {{ improvement }}%
        </div>
        <div class="text-sm font-bold">
          Improvement
        </div>
      </div>
    </div>
    
    <!-- Error Categories -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Error Types
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="errorType in errorTypes"
            :key="errorType.name"
            class="border-2 border-black p-3"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-black">{{ errorType.name }}</span>
              <span class="font-black">{{ errorType.count }}</span>
            </div>
            
            <div class="w-full h-3 bg-brutal-gray border border-black">
              <div 
                class="h-full transition-all duration-500"
                :class="errorType.color"
                :style="{ width: `${(errorType.count / maxErrorCount) * 100}%` }"
              />
            </div>
            
            <div class="text-xs font-bold text-brutal-gray mt-1">
              {{ errorType.percentage }}% of total errors
            </div>
          </div>
        </div>
      </div>
      
      <!-- Subject-wise Errors -->
      <div class="bg-brutal-lime border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Subject-wise Errors
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="subject in subjectErrors"
            :key="subject.name"
            class="border-2 border-black p-3"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-black">{{ subject.name }}</span>
              <span class="font-black">{{ subject.errors }}/{{ subject.total }}</span>
            </div>
            
            <div class="w-full h-3 bg-brutal-gray border border-black">
              <div 
                class="h-full bg-brutal-pink transition-all duration-500"
                :style="{ width: `${subject.errorRate}%` }"
              />
            </div>
            
            <div class="text-xs font-bold text-brutal-gray mt-1">
              {{ subject.errorRate }}% error rate
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Common Mistakes Pattern -->
    <div class="bg-brutal-yellow border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Common Mistakes Pattern
      </h3>
      
      <div class="grid md:grid-cols-3 gap-4">
        <div 
          v-for="pattern in mistakePatterns"
          :key="pattern.id"
          class="bg-brutal-white border-2 border-black p-4"
        >
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">{{ pattern.icon }}</span>
            <h4 class="font-black">
              {{ pattern.title }}
            </h4>
          </div>
          
          <p class="text-sm font-bold text-brutal-gray mb-3">
            {{ pattern.description }}
          </p>
          
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="font-bold">Frequency:</span>
              <span class="font-black">{{ pattern.frequency }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="font-bold">Impact:</span>
              <span class="font-black">{{ pattern.impact }}</span>
            </div>
          </div>
          
          <button 
            class="btn-primary btn-primary-cyan w-full mt-3 text-xs"
            @click="getHelpForPattern(pattern.id)"
          >
            Get Help
          </button>
        </div>
      </div>
    </div>
    
    <!-- Detailed Error Analysis -->
    <div class="bg-brutal-white border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Detailed Error Analysis
      </h3>
      
      <div class="space-y-3 max-h-64 overflow-y-auto">
        <div 
          v-for="error in detailedErrors"
          :key="error.id"
          class="flex items-start gap-4 p-3 border-2 border-black"
          :class="getErrorSeverityClass(error.severity)"
        >
          <div class="w-12 text-center">
            <div class="font-black text-sm">
              Q{{ error.question }}
            </div>
            <div class="text-xs font-bold">
              {{ error.subject }}
            </div>
          </div>
          
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span
                class="badge"
                :class="getErrorBadgeClass(error.type)"
              >
                {{ error.type }}
              </span>
              <span
                class="badge"
                :class="getSeverityBadgeClass(error.severity)"
              >
                {{ error.severity }}
              </span>
            </div>
            
            <p class="text-sm font-black mb-2">
              {{ error.description }}
            </p>
            
            <div class="text-xs font-bold text-brutal-gray">
              Your answer: {{ error.yourAnswer }} | 
              Correct: {{ error.correctAnswer }} |
              Occurrences: {{ error.occurrences }}
            </div>
          </div>
          
          <div class="flex flex-col gap-2">
            <button 
              class="btn-primary btn-primary-cyan text-xs px-2 py-1"
              @click="reviewQuestion(error.questionId)"
            >
              Review
            </button>
            <button 
              class="btn-primary btn-primary-pink text-xs px-2 py-1"
              @click="practiceSimilar(error.topic)"
            >
              Practice
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Improvement Recommendations -->
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-brutal-purple border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Targeted Improvement Plan
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="plan in improvementPlan"
            :key="plan.id"
            class="flex items-start gap-3 p-3 bg-brutal-white border-2 border-black"
          >
            <span class="text-2xl">{{ plan.icon }}</span>
            <div class="flex-1">
              <h4 class="font-black text-sm mb-1">
                {{ plan.title }}
              </h4>
              <p class="text-xs font-bold text-brutal-gray mb-2">
                {{ plan.description }}
              </p>
              <div class="flex items-center gap-2">
                <span class="badge badge-cyan text-xs">{{ plan.duration }}</span>
                <span class="badge badge-yellow text-xs">{{ plan.difficulty }}</span>
              </div>
            </div>
            <button 
              class="btn-primary btn-primary-purple px-3 py-1 text-xs"
              @click="startImprovement(plan.id)"
            >
              Start
            </button>
          </div>
        </div>
      </div>
      
      <!-- Progress Tracking -->
      <div class="bg-brutal-gray border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Error Reduction Progress
        </h3>
        
        <div class="space-y-4">
          <!-- Progress Chart -->
          <div>
            <h4 class="font-bold mb-2">
              Error Rate Over Time
            </h4>
            <div class="h-24 flex items-end justify-between gap-1">
              <div 
                v-for="(rate, index) in errorRateProgress"
                :key="index"
                class="flex-1 bg-brutal-cyan border border-black transition-all duration-300"
                :style="{ height: `${rate}%` }"
                :title="`Week ${index + 1}: ${rate}%`"
              />
            </div>
            <div class="flex justify-between mt-1 text-xs font-bold">
              <span>Week 1</span>
              <span>Week 4</span>
              <span>Week 8</span>
              <span>Current</span>
            </div>
          </div>
          
          <!-- Success Metrics -->
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <div class="text-2xl font-black text-brutal-lime">
                {{ errorsReduced }}
              </div>
              <div class="text-xs font-bold">
                Errors Reduced
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-black text-brutal-cyan">
                {{ patternsFixed }}
              </div>
              <div class="text-xs font-bold">
                Patterns Fixed
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

interface ErrorData {
  id: string
  question: number
  questionId: string
  subject: string
  topic: string
  type: string
  severity: string
  description: string
  yourAnswer: string
  correctAnswer: string
  occurrences: number
}

const detailedErrors = ref<ErrorData[]>([
  {
    id: 'e1',
    question: 12,
    questionId: 'q12',
    subject: 'Quantitative Aptitude',
    topic: 'Percentage',
    type: 'Calculation Error',
    severity: 'High',
    description: 'Incorrect percentage calculation - forgot to convert decimal to percentage',
    yourAnswer: '0.25',
    correctAnswer: '25%',
    occurrences: 3
  },
  {
    id: 'e2',
    question: 8,
    questionId: 'q8',
    subject: 'Reasoning Ability',
    topic: 'Series',
    type: 'Pattern Recognition',
    severity: 'Medium',
    description: 'Failed to identify the arithmetic progression pattern',
    yourAnswer: '24',
    correctAnswer: '30',
    occurrences: 2
  },
  {
    id: 'e3',
    question: 15,
    questionId: 'q15',
    subject: 'English Language',
    topic: 'Grammar',
    type: 'Grammar Rule',
    severity: 'Low',
    description: 'Subject-verb agreement error',
    yourAnswer: 'were',
    correctAnswer: 'was',
    occurrences: 1
  },
  {
    id: 'e4',
    question: 22,
    questionId: 'q22',
    subject: 'Quantitative Aptitude',
    topic: 'Time & Work',
    type: 'Formula Error',
    severity: 'High',
    description: 'Used wrong formula for work-rate problems',
    yourAnswer: '6 days',
    correctAnswer: '4 days',
    occurrences: 4
  }
])

const errorTypes = ref([
  { name: 'Calculation Error', count: 8, percentage: 35, color: 'bg-brutal-pink' },
  { name: 'Conceptual Error', count: 6, percentage: 26, color: 'bg-brutal-cyan' },
  { name: 'Formula Error', count: 4, percentage: 17, color: 'bg-brutal-yellow' },
  { name: 'Grammar Error', count: 3, percentage: 13, color: 'bg-brutal-lime' },
  { name: 'Reading Error', count: 2, percentage: 9, color: 'bg-brutal-purple' }
])

const subjectErrors = ref([
  { name: 'Quantitative Aptitude', errors: 12, total: 45, errorRate: 27 },
  { name: 'Reasoning Ability', errors: 6, total: 35, errorRate: 17 },
  { name: 'English Language', errors: 4, total: 30, errorRate: 13 },
  { name: 'General Awareness', errors: 1, total: 25, errorRate: 4 }
])

const mistakePatterns = ref([
  {
    id: 1,
    icon: '🧮',
    title: 'Calculation Mistakes',
    description: 'Arithmetic errors in percentage, profit & loss calculations',
    frequency: '35% of errors',
    impact: 'High impact on scores'
  },
  {
    id: 2,
    icon: '📚',
    title: 'Formula Confusion',
    description: 'Mixing up similar formulas in time & work, speed problems',
    frequency: '17% of errors',
    impact: 'Medium impact'
  },
  {
    id: 3,
    icon: '🔍',
    title: 'Pattern Recognition',
    description: 'Missing patterns in series and analogy questions',
    frequency: '15% of errors',
    impact: 'Medium impact'
  }
])

const improvementPlan = ref([
  {
    id: 1,
    icon: '🎯',
    title: 'Master Percentage Calculations',
    description: 'Focused practice on percentage problems with step-by-step methods',
    duration: '2 weeks',
    difficulty: 'Medium'
  },
  {
    id: 2,
    icon: '📝',
    title: 'Formula Revision',
    description: 'Create formula sheets and practice quantitative aptitude formulas',
    duration: '1 week',
    difficulty: 'Easy'
  },
  {
    id: 3,
    icon: '🧠',
    title: 'Pattern Recognition Training',
    description: 'Practice series and analogy questions with pattern identification techniques',
    duration: '3 weeks',
    difficulty: 'Hard'
  }
])

const errorRateProgress = ref([35, 32, 28, 25, 22, 20, 18, 15])

const totalErrors = computed(() => detailedErrors.value.length)

const errorRate = computed(() => {
  const totalQuestions = 135 // Total questions attempted
  return Math.round((totalErrors.value / totalQuestions) * 100)
})

const repeatedErrors = computed(() => 
  detailedErrors.value.filter(error => error.occurrences > 1).length
)

const maxErrorCount = computed(() => 
  Math.max(...errorTypes.value.map(type => type.count))
)

const improvement = computed(() => {
  const initialRate = errorRateProgress.value[0]
  const currentRate = errorRateProgress.value[errorRateProgress.value.length - 1]
  return Math.round(((initialRate - currentRate) / initialRate) * 100)
})

const errorsReduced = computed(() => {
  const initialErrors = Math.round((135 * errorRateProgress.value[0]) / 100)
  const currentErrors = Math.round((135 * errorRateProgress.value[errorRateProgress.value.length - 1]) / 100)
  return initialErrors - currentErrors
})

const patternsFixed = computed(() => 2) // Simulated data

const getErrorSeverityClass = (severity: string): string => {
  switch (severity) {
    case 'High': return 'bg-brutal-pink/20'
    case 'Medium': return 'bg-brutal-yellow/20'
    case 'Low': return 'bg-brutal-lime/20'
    default: return 'bg-brutal-gray/20'
  }
}

const getErrorBadgeClass = (type: string): string => {
  switch (type) {
    case 'Calculation Error': return 'badge-pink'
    case 'Conceptual Error': return 'badge-cyan'
    case 'Formula Error': return 'badge-yellow'
    case 'Grammar Error': return 'badge-lime'
    case 'Reading Error': return 'badge-purple'
    default: return 'badge-gray'
  }
}

const getSeverityBadgeClass = (severity: string): string => {
  switch (severity) {
    case 'High': return 'badge-pink'
    case 'Medium': return 'badge-yellow'
    case 'Low': return 'badge-lime'
    default: return 'badge-gray'
  }
}

const reviewQuestion = (questionId: string) => {
  console.log('Reviewing question:', questionId)
  // Navigate to question review
}

const practiceSimilar = (topic: string) => {
  console.log('Practicing similar questions for:', topic)
  // Navigate to topic practice
}

const getHelpForPattern = (patternId: number) => {
  console.log('Getting help for pattern:', patternId)
  // Show help modal or navigate to learning resources
}

const startImprovement = (planId: number) => {
  console.log('Starting improvement plan:', planId)
  // Navigate to improvement plan
}

onMounted(() => {
  // Load error data from IndexedDB
  loadErrorData()
})

const loadErrorData = async () => {
  try {
    const storedData = localStorage.getItem('errorPatternData')
    if (storedData) {
      const data = JSON.parse(storedData)
      detailedErrors.value = data.detailedErrors || detailedErrors.value
      errorTypes.value = data.errorTypes || errorTypes.value
      subjectErrors.value = data.subjectErrors || subjectErrors.value
    }
  } catch (error) {
    console.error('Failed to load error data:', error)
  }
}
</script>
