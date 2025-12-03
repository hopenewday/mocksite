<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Topic-wise Tests
    </h2>
    
    <!-- Topic Selection -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Select Subject & Topic
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Subject</label>
            <select
              v-model="selectedSubject"
              class="select"
              @change="updateTopics"
            >
              <option value="">
                Choose a subject...
              </option>
              <option
                v-for="subject in subjects"
                :key="subject.name"
                :value="subject.name"
              >
                {{ subject.name }} ({{ subject.topics.length }} topics)
              </option>
            </select>
          </div>
          
          <div v-if="selectedSubject">
            <label class="font-black mb-2 block">Topic</label>
            <select
              v-model="selectedTopic"
              class="select"
            >
              <option value="">
                Choose a topic...
              </option>
              <option
                v-for="topic in currentTopics"
                :key="topic.name"
                :value="topic.name"
              >
                {{ topic.name }} ({{ topic.questionCount }} questions)
              </option>
            </select>
          </div>
          
          <div v-if="selectedTopic">
            <label class="font-black mb-2 block">Difficulty</label>
            <select
              v-model="selectedDifficulty"
              class="select"
            >
              <option value="all">
                All Difficulties
              </option>
              <option value="Easy">
                Easy
              </option>
              <option value="Medium">
                Medium
              </option>
              <option value="Hard">
                Hard
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Test Configuration -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Test Configuration
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Number of Questions</label>
            <input 
              v-model.number="questionCount"
              type="number"
              min="5"
              :max="maxQuestions"
              class="input w-full"
            >
            <div class="text-xs font-bold text-brutal-gray mt-1">
              Available: {{ maxQuestions }} questions
            </div>
          </div>
          
          <div>
            <label class="font-black mb-2 block">Time Limit (minutes)</label>
            <select
              v-model="timeLimit"
              class="select"
            >
              <option value="no-limit">
                No Time Limit
              </option>
              <option value="5">
                5 minutes
              </option>
              <option value="10">
                10 minutes
              </option>
              <option value="15">
                15 minutes
              </option>
              <option value="20">
                20 minutes
              </option>
              <option value="30">
                30 minutes
              </option>
              <option value="custom">
                Custom
              </option>
            </select>
          </div>
          
          <div v-if="timeLimit === 'custom'">
            <input 
              v-model.number="customTime"
              type="number"
              min="1"
              max="120"
              placeholder="Enter minutes"
              class="input w-full"
            >
          </div>
          
          <div>
            <label class="font-black mb-2 block">Question Types</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input
                  v-model="questionTypes.mcq"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="font-bold">Multiple Choice</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="questionTypes.trueFalse"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="font-bold">True/False</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="questionTypes.fillBlanks"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="font-bold">Fill in the Blanks</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Topic Overview -->
    <div
      v-if="selectedTopic && topicOverview"
      class="bg-brutal-lime border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Topic Overview: {{ selectedTopic }}
      </h3>
      
      <div class="grid md:grid-cols-4 gap-4 mb-4">
        <div class="text-center">
          <div class="text-2xl font-black">
            {{ topicOverview.totalQuestions }}
          </div>
          <div class="text-sm font-bold">
            Total Questions
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-black">
            {{ topicOverview.avgAccuracy }}%
          </div>
          <div class="text-sm font-bold">
            Your Accuracy
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-black">
            {{ topicOverview.attempts }}
          </div>
          <div class="text-sm font-bold">
            Attempts
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-black">
            {{ topicOverview.mastery }}%
          </div>
          <div class="text-sm font-bold">
            Mastery Level
          </div>
        </div>
      </div>
      
      <!-- Difficulty Distribution -->
      <div class="mb-4">
        <h4 class="font-bold mb-2">
          Difficulty Distribution
        </h4>
        <div class="flex gap-2">
          <div class="flex-1 text-center">
            <div class="bg-brutal-lime border-2 border-black p-2">
              <div class="font-black">
                Easy
              </div>
              <div class="text-sm">
                {{ topicOverview.difficulty.easy }} questions
              </div>
            </div>
          </div>
          <div class="flex-1 text-center">
            <div class="bg-brutal-cyan border-2 border-black p-2">
              <div class="font-black">
                Medium
              </div>
              <div class="text-sm">
                {{ topicOverview.difficulty.medium }} questions
              </div>
            </div>
          </div>
          <div class="flex-1 text-center">
            <div class="bg-brutal-pink border-2 border-black p-2">
              <div class="font-black">
                Hard
              </div>
              <div class="text-sm">
                {{ topicOverview.difficulty.hard }} questions
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recommended Actions -->
      <div>
        <h4 class="font-bold mb-2">
          Recommended Actions
        </h4>
        <div class="flex gap-2">
          <span
            v-for="action in topicOverview.recommendations"
            :key="action" 
            class="badge badge-cyan text-xs"
          >
            {{ action }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Generate Test Button -->
    <div class="text-center mb-8">
      <button 
        :disabled="!canGenerateTest"
        class="btn-primary btn-primary-purple px-8 py-4 text-lg disabled:opacity-50"
        @click="generateTopicTest"
      >
        Generate Topic Test
      </button>
    </div>
    
    <!-- Generated Test Preview -->
    <div
      v-if="generatedTest"
      class="bg-brutal-pink border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Test Preview
      </h3>
      
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 class="font-bold mb-2">
            Test Details
          </h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="font-bold">Subject:</span>
              <span class="font-black">{{ generatedTest.subject }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Topic:</span>
              <span class="font-black">{{ generatedTest.topic }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Questions:</span>
              <span class="font-black">{{ generatedTest.questions.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Time Limit:</span>
              <span class="font-black">{{ generatedTest.timeLimit }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Difficulty:</span>
              <span class="font-black">{{ generatedTest.difficulty }}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="font-bold mb-2">
            Question Types
          </h4>
          <div class="space-y-2">
            <div
              v-for="(count, type) in generatedTest.questionTypeCount"
              :key="type" 
              class="flex justify-between text-sm"
            >
              <span class="font-bold">{{ formatQuestionType(type) }}:</span>
              <span class="font-black">{{ count }} questions</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sample Questions -->
      <div>
        <h4 class="font-bold mb-2">
          Sample Questions
        </h4>
        <div class="space-y-3 max-h-64 overflow-y-auto">
          <div 
            v-for="(question, index) in generatedTest.questions.slice(0, 3)"
            :key="index"
            class="bg-brutal-white border-2 border-black p-3"
          >
            <div class="flex items-start gap-3">
              <span class="font-black text-sm">Q{{ index + 1 }}</span>
              <div class="flex-1">
                <p class="font-black text-sm mb-2">
                  {{ question.content }}
                </p>
                <div class="flex items-center gap-2">
                  <span class="badge badge-cyan text-xs">{{ question.difficulty }}</span>
                  <span class="badge badge-yellow text-xs">{{ question.type }}</span>
                  <span class="badge badge-pink text-xs">{{ question.points }} pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-4 mt-6">
        <button 
          class="btn-primary btn-primary-lime flex-1"
          @click="startTopicTest"
        >
          Start Test
        </button>
        
        <button 
          class="btn-primary btn-primary-cyan"
          @click="saveTopicTest"
        >
          Save Test
        </button>
        
        <button 
          class="btn-primary btn-primary-pink"
          @click="regenerateTest"
        >
          Regenerate
        </button>
      </div>
    </div>
    
    <!-- Recent Topic Tests -->
    <div class="bg-brutal-purple border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Recent Topic Tests
      </h3>
      
      <div class="space-y-3">
        <div 
          v-for="test in recentTopicTests"
          :key="test.id"
          class="flex items-center justify-between p-3 bg-brutal-white border-2 border-black"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ test.icon }}</span>
            <div>
              <h4 class="font-black text-sm">
                {{ test.subject }} - {{ test.topic }}
              </h4>
              <p class="text-xs font-bold text-brutal-gray">
                {{ test.questions }} questions | {{ test.timeLimit }} | Score: {{ test.score }}%
              </p>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button 
              class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
              @click="retakeTest(test)"
            >
              Retake
            </button>
            <button 
              class="btn-primary btn-primary-pink px-3 py-1 text-xs"
              @click="reviewTest(test)"
            >
              Review
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectedSubject = ref('')
const selectedTopic = ref('')
const selectedDifficulty = ref('all')
const questionCount = ref(10)
const timeLimit = ref('10')
const customTime = ref(15)
const questionTypes = ref({
  mcq: true,
  trueFalse: true,
  fillBlanks: false
})

const generatedTest = ref(null)
const recentTopicTests = ref([])

const subjects = ref([
  {
    name: 'Quantitative Aptitude',
    topics: [
      { name: 'Percentage', questionCount: 45 },
      { name: 'Profit & Loss', questionCount: 38 },
      { name: 'Time & Work', questionCount: 42 },
      { name: 'Speed & Distance', questionCount: 35 },
      { name: 'Algebra', questionCount: 40 },
      { name: 'Geometry', questionCount: 48 },
      { name: 'Mensuration', questionCount: 32 }
    ]
  },
  {
    name: 'Reasoning Ability',
    topics: [
      { name: 'Series', questionCount: 50 },
      { name: 'Analogy', questionCount: 35 },
      { name: 'Classification', questionCount: 30 },
      { name: 'Coding-Decoding', questionCount: 40 },
      { name: 'Blood Relations', questionCount: 25 },
      { name: 'Direction Sense', questionCount: 28 },
      { name: 'Order & Ranking', questionCount: 32 }
    ]
  },
  {
    name: 'General Awareness',
    topics: [
      { name: 'Current Affairs', questionCount: 80 },
      { name: 'History', questionCount: 60 },
      { name: 'Geography', questionCount: 55 },
      { name: 'Polity', questionCount: 45 },
      { name: 'Economics', questionCount: 40 },
      { name: 'Science & Technology', questionCount: 50 }
    ]
  },
  {
    name: 'English Language',
    topics: [
      { name: 'Reading Comprehension', questionCount: 35 },
      { name: 'Grammar', questionCount: 45 },
      { name: 'Vocabulary', questionCount: 60 },
      { name: 'Synonyms & Antonyms', questionCount: 40 },
      { name: 'Cloze Test', questionCount: 30 },
      { name: 'Sentence Improvement', questionCount: 35 }
    ]
  }
])

const currentTopics = computed(() => {
  const subject = subjects.value.find(s => s.name === selectedSubject.value)
  return subject ? subject.topics : []
})

const maxQuestions = computed(() => {
  const topic = currentTopics.value.find(t => t.name === selectedTopic.value)
  return topic ? topic.questionCount : 0
})

const canGenerateTest = computed(() => {
  return selectedSubject.value && 
         selectedTopic.value && 
         questionCount.value > 0 && 
         questionCount.value <= maxQuestions.value &&
         (questionTypes.value.mcq || questionTypes.value.trueFalse || questionTypes.value.fillBlanks)
})

const topicOverview = computed(() => {
  if (!selectedTopic.value) return null
  
  // Simulate topic overview data
  return {
    totalQuestions: maxQuestions.value,
    avgAccuracy: Math.floor(Math.random() * 30 + 60),
    attempts: Math.floor(Math.random() * 20 + 5),
    mastery: Math.floor(Math.random() * 40 + 40),
    difficulty: {
      easy: Math.floor(maxQuestions.value * 0.3),
      medium: Math.floor(maxQuestions.value * 0.5),
      hard: Math.floor(maxQuestions.value * 0.2)
    },
    recommendations: getRecommendations()
  }
})

const updateTopics = () => {
  selectedTopic.value = ''
  questionCount.value = 10
}

const getRecommendations = () => {
  const recommendations = []
  
  if (topicOverview.value && topicOverview.value.avgAccuracy < 70) {
    recommendations.push('Focus on Basics')
  }
  
  if (topicOverview.value && topicOverview.value.attempts < 10) {
    recommendations.push('More Practice')
  }
  
  if (topicOverview.value && topicOverview.value.mastery < 50) {
    recommendations.push('Study Theory')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Challenge Yourself')
  }
  
  return recommendations
}

const generateTopicTest = () => {
  if (!canGenerateTest.value) return
  
  // Generate test questions
  const questions = []
  const enabledTypes = Object.keys(questionTypes.value).filter(type => questionTypes.value[type])
  
  for (let i = 0; i < questionCount.value; i++) {
    const type = enabledTypes[Math.floor(Math.random() * enabledTypes.length)]
    const difficulty = selectedDifficulty.value === 'all' ? 
                      ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] : 
                      selectedDifficulty.value
    
    questions.push({
      id: `q${i + 1}`,
      type: formatQuestionType(type),
      difficulty,
      content: generateQuestionContent(selectedSubject.value, selectedTopic.value, difficulty),
      options: type === 'mcq' ? generateOptions() : null,
      correctAnswer: Math.floor(Math.random() * 4),
      points: difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3,
      explanation: 'Detailed explanation would appear here'
    })
  }
  
  // Count question types
  const questionTypeCount = {}
  questions.forEach(q => {
    questionTypeCount[q.type] = (questionTypeCount[q.type] || 0) + 1
  })
  
  generatedTest.value = {
    id: `topic_test_${Date.now()}`,
    subject: selectedSubject.value,
    topic: selectedTopic.value,
    difficulty: selectedDifficulty.value,
    questions,
    questionTypeCount,
    timeLimit: timeLimit.value === 'custom' ? `${customTime.value} minutes` : 
                timeLimit.value === 'no-limit' ? 'No limit' : `${timeLimit.value} minutes`,
    createdAt: new Date().toISOString()
  }
}

const generateQuestionContent = (subject: string, topic: string, difficulty: string): string => {
  const templates = {
    'Quantitative Aptitude': {
      'Percentage': ['What is {{x}}% of {{y}}?', 'If {{x}}% of a number is {{y}}, find the number.'],
      'Profit & Loss': ['An article is sold for ₹{{x}} at {{y}}% profit. Find the cost price.'],
      'Time & Work': ['A can do a work in {{x}} days, B in {{y}} days. Together they can finish in?']
    },
    'Reasoning Ability': {
      'Series': ['Find the missing number: {{series}}'],
      'Analogy': ['{{word1}} is to {{word2}} as {{word3}} is to ?']
    }
  }
  
  const subjectTemplates = templates[subject]?.[topic] || ['Sample question for {{topic}}']
  const template = subjectTemplates[Math.floor(Math.random() * subjectTemplates.length)]
  
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    switch (key) {
      case 'x': return Math.floor(Math.random() * 50 + 10)
      case 'y': return Math.floor(Math.random() * 100 + 50)
      case 'topic': return topic
      default: return match
    }
  })
}

const generateOptions = () => {
  return ['Option A', 'Option B', 'Option C', 'Option D']
}

const formatQuestionType = (type: string): string => {
  switch (type) {
    case 'mcq': return 'Multiple Choice'
    case 'trueFalse': return 'True/False'
    case 'fillBlanks': return 'Fill in Blanks'
    default: return type
  }
}

const startTopicTest = () => {
  if (!generatedTest.value) return
  
  // Save test to session storage
  sessionStorage.setItem('currentTopicTest', JSON.stringify(generatedTest.value))
  
  // Navigate to test page
  router.push('/test/topic')
}

const saveTopicTest = () => {
  if (!generatedTest.value) return
  
  // Save to localStorage
  const savedTests = JSON.parse(localStorage.getItem('savedTopicTests') || '[]')
  savedTests.push(generatedTest.value)
  localStorage.setItem('savedTopicTests', JSON.stringify(savedTests))
  
  alert('Test saved successfully!')
}

const regenerateTest = () => {
  generateTopicTest()
}

interface Test {
  id: string
  [key: string]: unknown
}

const retakeTest = (test: Test) => {
  sessionStorage.setItem('currentTopicTest', JSON.stringify(test))
  router.push('/test/topic')
}

const reviewTest = (test: Test) => {
  router.push(`/test/review/${test.id}`)
}

onMounted(() => {
  // Load recent topic tests from localStorage
  const saved = localStorage.getItem('recentTopicTests')
  if (saved) {
    recentTopicTests.value = JSON.parse(saved)
  } else {
    // Mock data
    recentTopicTests.value = [
      {
        id: 't1',
        icon: '📊',
        subject: 'Quantitative Aptitude',
        topic: 'Percentage',
        questions: 10,
        timeLimit: '10 minutes',
        score: 85
      },
      {
        id: 't2',
        icon: '🧮',
        subject: 'Reasoning Ability',
        topic: 'Series',
        questions: 15,
        timeLimit: '15 minutes',
        score: 78
      }
    ]
  }
})
</script>
