<template>
  <div class="card card-brutal-purple p-8">
    <h2 class="subheading-brutal mb-6">
      Custom Test Builder
    </h2>
    
    <!-- Test Configuration -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Test Details
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Test Name</label>
            <input 
              v-model="testConfig.name"
              type="text"
              placeholder="Enter test name"
              class="input w-full"
            >
          </div>
          
          <div>
            <label class="font-black mb-2 block">Description</label>
            <textarea 
              v-model="testConfig.description"
              placeholder="Describe your test"
              class="input w-full h-20 resize-none"
            />
          </div>
          
          <div>
            <label class="font-black mb-2 block">Duration (minutes)</label>
            <input 
              v-model.number="testConfig.duration"
              type="number"
              min="5"
              max="180"
              class="input w-full"
            >
          </div>
          
          <div>
            <label class="font-black mb-2 block">Difficulty</label>
            <select
              v-model="testConfig.difficulty"
              class="select"
            >
              <option value="Easy">
                Easy
              </option>
              <option value="Medium">
                Medium
              </option>
              <option value="Hard">
                Hard
              </option>
              <option value="Mixed">
                Mixed
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Subject Selection -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Subjects & Topics
        </h3>
        
        <div class="space-y-3">
          <div
            v-for="subject in availableSubjects"
            :key="subject.name"
          >
            <div class="flex items-center justify-between mb-2">
              <label class="font-black flex items-center gap-2">
                <input 
                  v-model="selectedSubjects"
                  type="checkbox"
                  :value="subject.name"
                  class="w-4 h-4"
                >
                {{ subject.name }}
              </label>
              <span class="text-sm font-bold">{{ questionCounts[subject.name] || 0 }} questions</span>
            </div>
            
            <!-- Topic Selection -->
            <div
              v-if="selectedSubjects.includes(subject.name)"
              class="ml-6 space-y-1"
            >
              <label
                v-for="topic in subject.topics"
                :key="topic"
                class="flex items-center gap-2 text-sm"
              >
                <input 
                  v-model="selectedTopics[subject.name]"
                  type="checkbox"
                  :value="topic"
                  class="w-3 h-3"
                >
                <span class="font-bold">{{ topic }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Question Distribution -->
    <div class="bg-brutal-yellow border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Question Distribution
      </h3>
      
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <label class="font-black mb-2 block">Total Questions</label>
          <input 
            v-model.number="testConfig.totalQuestions"
            type="number"
            min="10"
            max="200"
            class="input w-full"
          >
        </div>
        
        <div>
          <label class="font-black mb-2 block">Marks per Question</label>
          <input 
            v-model.number="testConfig.marksPerQuestion"
            type="number"
            min="1"
            max="10"
            class="input w-full"
          >
        </div>
        
        <div>
          <label class="font-black mb-2 block">Negative Marking</label>
          <input 
            v-model.number="testConfig.negativeMarking"
            type="number"
            min="0"
            max="1"
            step="0.25"
            class="input w-full"
          >
        </div>
      </div>
      
      <!-- Auto Distribution -->
      <div class="mt-4">
        <button 
          class="btn-primary btn-primary-pink"
          @click="autoDistributeQuestions"
        >
          Auto Distribute Questions
        </button>
      </div>
    </div>
    
    <!-- Question Preview -->
    <div
      v-if="generatedQuestions.length"
      class="bg-brutal-lime border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Generated Questions ({{ generatedQuestions.length }})
      </h3>
      
      <div class="space-y-3 max-h-64 overflow-y-auto">
        <div 
          v-for="(question, index) in generatedQuestions.slice(0, 10)"
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
                <span class="badge badge-cyan text-xs">{{ question.subject }}</span>
                <span class="badge badge-pink text-xs">{{ question.difficulty }}</span>
                <span class="badge badge-yellow text-xs">{{ question.type }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div
          v-if="generatedQuestions.length > 10"
          class="text-center"
        >
          <p class="font-black text-brutal-gray">
            ... and {{ generatedQuestions.length - 10 }} more questions
          </p>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex gap-4">
      <button 
        :disabled="!canGenerate"
        class="btn-primary btn-primary-purple flex-1 disabled:opacity-50"
        @click="generateTest"
      >
        Generate Test
      </button>
      
      <button 
        :disabled="!generatedQuestions.length"
        class="btn-primary btn-primary-cyan disabled:opacity-50"
        @click="saveTest"
      >
        Save Test
      </button>
      
      <button 
        :disabled="!generatedQuestions.length"
        class="btn-primary btn-primary-lime disabled:opacity-50"
        @click="startTest"
      >
        Start Test
      </button>
      
      <button 
        class="btn-primary btn-primary-pink"
        @click="resetBuilder"
      >
        Reset
      </button>
    </div>
    
    <!-- Error Message -->
    <div
      v-if="error"
      class="mt-4 p-4 bg-brutal-pink/20 border-4 border-brutal-pink"
    >
      <p class="font-black text-brutal-pink">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const testConfig = ref({
  name: '',
  description: '',
  duration: 60,
  difficulty: 'Medium',
  totalQuestions: 50,
  marksPerQuestion: 2,
  negativeMarking: 0.5
})

const selectedSubjects = ref<string[]>([])
const selectedTopics = ref<Record<string, string[]>>({})
const generatedQuestions = ref<any[]>([])
const error = ref('')

const availableSubjects = ref([
  {
    name: 'Quantitative Aptitude',
    topics: ['Percentage', 'Profit & Loss', 'Time & Work', 'Speed & Distance', 'Algebra', 'Geometry', 'Mensuration']
  },
  {
    name: 'Reasoning Ability',
    topics: ['Series', 'Analogy', 'Classification', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Order & Ranking']
  },
  {
    name: 'General Awareness',
    topics: ['Current Affairs', 'History', 'Geography', 'Polity', 'Economics', 'Science & Technology']
  },
  {
    name: 'English Language',
    topics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Synonyms & Antonyms', 'Cloze Test', 'Sentence Improvement']
  }
])

const questionCounts = ref<Record<string, number>>({
  'Quantitative Aptitude': 150,
  'Reasoning Ability': 120,
  'General Awareness': 200,
  'English Language': 100
})

const canGenerate = computed(() => {
  return testConfig.value.name.trim() !== '' && 
         selectedSubjects.value.length > 0 && 
         testConfig.value.totalQuestions >= 10
})

const autoDistributeQuestions = () => {
  const totalQuestions = testConfig.value.totalQuestions
  const subjectCount = selectedSubjects.value.length
  const questionsPerSubject = Math.floor(totalQuestions / subjectCount)
  const remainder = totalQuestions % subjectCount
  
  selectedSubjects.value.forEach((subject, index) => {
    const count = questionsPerSubject + (index < remainder ? 1 : 0)
    // Store distribution for later use
    testConfig.value[`${subject.replace(/\s+/g, '_').toLowerCase()}_questions`] = count
  })
  
  // Show confirmation
  error.value = ''
  setTimeout(() => {
    error.value = `Distributed ${totalQuestions} questions across ${subjectCount} subjects`
    setTimeout(() => error.value = '', 3000)
  }, 100)
}

const generateTest = async () => {
  if (!canGenerate.value) return
  
  error.value = ''
  generatedQuestions.value = []
  
  try {
    // Simulate question generation using browser APIs
    const questions = []
    let questionId = 1
    
    for (const subject of selectedSubjects.value) {
      const subjectQuestions = testConfig.value[`${subject.replace(/\s+/g, '_').toLowerCase()}_questions`] || 
                            Math.floor(testConfig.value.totalQuestions / selectedSubjects.value.length)
      
      for (let i = 0; i < subjectQuestions; i++) {
        const difficulty = testConfig.value.difficulty === 'Mixed' ? 
                          ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] : 
                          testConfig.value.difficulty
        
        questions.push({
          id: `q${questionId++}`,
          subject,
          difficulty,
          type: 'mcq',
          content: generateQuestionContent(subject, difficulty),
          options: generateOptions(),
          correctAnswer: Math.floor(Math.random() * 4),
          marks: testConfig.value.marksPerQuestion,
          negativeMarks: testConfig.value.negativeMarking,
          timeLimit: difficulty === 'Easy' ? 60 : difficulty === 'Medium' ? 90 : 120
        })
      }
    }
    
    // Shuffle questions
    generatedQuestions.value = questions.sort(() => Math.random() - 0.5)
    
  } catch (err) {
    error.value = 'Failed to generate test. Please try again.'
    console.error('Test generation error:', err)
  }
}

const generateQuestionContent = (subject: string, difficulty: string): string => {
  const templates = {
    'Quantitative Aptitude': [
      'What is the value of X in the equation: 2X + 5 = 15?',
      'If a shopkeeper sells an article at 20% profit for ₹240, what is the cost price?',
      'A train travels 300 km in 4 hours. What is its average speed?'
    ],
    'Reasoning Ability': [
      'Find the missing number in the series: 2, 6, 12, 20, 30, ?',
      'If A is the brother of B, and B is the sister of C, how is A related to C?',
      'Pointing to a man, a woman said, "His mother is the only daughter of my mother." How is the woman related to the man?'
    ],
    'General Awareness': [
      'Who is the current Prime Minister of India?',
      'Which river is known as the "Ganga of the South"?',
      'When was the Constitution of India adopted?'
    ],
    'English Language': [
      'Choose the correct synonym for the word "Ephemeral".',
      'Identify the grammatically correct sentence.',
      'Fill in the blank: The meeting was _____ due to heavy rain.'
    ]
  }
  
  const subjectTemplates = templates[subject as keyof typeof templates] || templates['Quantitative Aptitude']
  return subjectTemplates[Math.floor(Math.random() * subjectTemplates.length)]
}

const generateOptions = (): string[] => {
  const options = [
    ['Option A', 'Option B', 'Option C', 'Option D'],
    ['10', '20', '30', '40'],
    ['₹100', '₹200', '₹300', '₹400'],
    ['60 km/h', '70 km/h', '75 km/h', '80 km/h']
  ]
  
  return options[Math.floor(Math.random() * options.length)]
}

const saveTest = () => {
  if (!generatedQuestions.value.length) return
  
  // Save to localStorage using browser APIs
  const testToSave = {
    ...testConfig.value,
    questions: generatedQuestions.value,
    createdAt: new Date().toISOString(),
    id: `custom_${Date.now()}`
  }
  
  // Get existing custom tests
  const existingTests = JSON.parse(localStorage.getItem('customTests') || '[]')
  existingTests.push(testToSave)
  localStorage.setItem('customTests', JSON.stringify(existingTests))
  
  error.value = 'Test saved successfully!'
  setTimeout(() => error.value = '', 3000)
}

const startTest = () => {
  if (!generatedQuestions.value.length) return
  
  // Save test to session storage for immediate use
  sessionStorage.setItem('currentTest', JSON.stringify({
    ...testConfig.value,
    questions: generatedQuestions.value,
    isCustom: true
  }))
  
  // Navigate to test page
  router.push('/test/custom')
}

const resetBuilder = () => {
  testConfig.value = {
    name: '',
    description: '',
    duration: 60,
    difficulty: 'Medium',
    totalQuestions: 50,
    marksPerQuestion: 2,
    negativeMarking: 0.5
  }
  selectedSubjects.value = []
  selectedTopics.value = {}
  generatedQuestions.value = []
  error.value = ''
}
</script>
