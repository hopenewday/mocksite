<template>
  <div class="card card-brutal-purple p-8">
    <h2 class="subheading-brutal mb-6">
      Vocabulary Builder
    </h2>
    
    <!-- Stats Overview -->
    <div class="grid md:grid-cols-4 gap-4 mb-8">
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-cyan">
          {{ totalWords }}
        </div>
        <div class="text-sm font-bold">
          Total Words
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-lime">
          {{ masteredWords }}
        </div>
        <div class="text-sm font-bold">
          Mastered
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-pink">
          {{ learningWords }}
        </div>
        <div class="text-sm font-bold">
          Learning
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-yellow">
          {{ todayWords }}
        </div>
        <div class="text-sm font-bold">
          Today
        </div>
      </div>
    </div>
    
    <!-- Study Mode Selection -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Study Mode
        </h3>
        
        <div class="space-y-3">
          <button 
            v-for="mode in studyModes"
            :key="mode.id"
            :class="[
              'w-full p-4 border-2 border-black text-left transform transition-all duration-200',
              selectedMode === mode.id 
                ? 'bg-brutal-lime rotate-[-1deg] scale-105' 
                : 'bg-brutal-white hover:rotate-[1deg]'
            ]"
            @click="selectStudyMode(mode.id)"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ mode.icon }}</span>
              <div>
                <h4 class="font-black">
                  {{ mode.name }}
                </h4>
                <p class="text-sm font-bold text-brutal-gray">
                  {{ mode.description }}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <!-- Word List Configuration -->
      <div class="bg-brutal-lime border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Word Selection
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Category</label>
            <select
              v-model="selectedCategory"
              class="select"
              @change="updateWordList"
            >
              <option value="all">
                All Categories
              </option>
              <option value="common">
                Common Words
              </option>
              <option value="academic">
                Academic
              </option>
              <option value="business">
                Business
              </option>
              <option value="exam">
                Exam Specific
              </option>
              <option value="advanced">
                Advanced
              </option>
            </select>
          </div>
          
          <div>
            <label class="font-black mb-2 block">Difficulty Level</label>
            <select
              v-model="selectedDifficulty"
              class="select"
              @change="updateWordList"
            >
              <option value="all">
                All Levels
              </option>
              <option value="beginner">
                Beginner
              </option>
              <option value="intermediate">
                Intermediate
              </option>
              <option value="advanced">
                Advanced
              </option>
            </select>
          </div>
          
          <div>
            <label class="font-black mb-2 block">Number of Words</label>
            <input 
              v-model.number="wordCount"
              type="number"
              min="5"
              max="50"
              class="input w-full"
              @change="updateWordList"
            >
          </div>
          
          <button
            class="btn-primary btn-primary-pink w-full"
            @click="generateWordList"
          >
            Generate Word List
          </button>
        </div>
      </div>
    </div>
    
    <!-- Current Study Session -->
    <div
      v-if="currentWord"
      class="bg-brutal-yellow border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Current Word
      </h3>
      
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Word Display -->
        <div class="bg-brutal-white border-2 border-black p-6">
          <div class="text-center mb-4">
            <h2 class="text-4xl font-black mb-2">
              {{ currentWord.word }}
            </h2>
            <p class="text-lg font-bold text-brutal-gray">
              {{ currentWord.phonetic }}
            </p>
          </div>
          
          <button 
            class="btn-primary btn-primary-cyan w-full mb-4"
            @click="playPronunciation"
          >
            🔊 Play Pronunciation
          </button>
          
          <div class="space-y-3">
            <div>
              <h4 class="font-bold mb-1">
                Part of Speech
              </h4>
              <span class="badge badge-pink">{{ currentWord.partOfSpeech }}</span>
            </div>
            
            <div>
              <h4 class="font-bold mb-1">
                Definition
              </h4>
              <p class="font-black">
                {{ currentWord.definition }}
              </p>
            </div>
            
            <div v-if="currentWord.example">
              <h4 class="font-bold mb-1">
                Example
              </h4>
              <p class="font-black italic">
                "{{ currentWord.example }}"
              </p>
            </div>
          </div>
        </div>
        
        <!-- Study Actions -->
        <div class="space-y-4">
          <!-- Multiple Choice -->
          <div
            v-if="selectedMode === 'flashcard'"
            class="bg-brutal-white border-2 border-black p-4"
          >
            <h4 class="font-bold mb-3">
              Choose the correct meaning:
            </h4>
            <div class="space-y-2">
              <button 
                v-for="(option, index) in currentWord.options"
                :key="index"
                :class="[
                  'w-full p-3 border-2 border-black text-left font-black',
                  selectedAnswer === index ? 'bg-brutal-cyan' : 'bg-brutal-white'
                ]"
                @click="checkAnswer(index)"
              >
                {{ option }}
              </button>
            </div>
          </div>
          
          <!-- Typing Practice -->
          <div
            v-if="selectedMode === 'typing'"
            class="bg-brutal-white border-2 border-black p-4"
          >
            <h4 class="font-bold mb-3">
              Type the word:
            </h4>
            <input 
              v-model="typedWord"
              type="text"
              placeholder="Type the word here..."
              class="input w-full mb-3"
              @keyup.enter="checkSpelling"
            >
            <button
              class="btn-primary btn-primary-pink w-full"
              @click="checkSpelling"
            >
              Check Spelling
            </button>
          </div>
          
          <!-- Synonym/Antonym -->
          <div
            v-if="selectedMode === 'synonyms'"
            class="bg-brutal-white border-2 border-black p-4"
          >
            <h4 class="font-bold mb-3">
              Synonyms:
            </h4>
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="synonym in currentWord.synonyms" 
                :key="synonym"
                class="badge badge-cyan"
              >
                {{ synonym }}
              </span>
            </div>
            
            <h4 class="font-bold mb-3">
              Antonyms:
            </h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="antonym in currentWord.antonyms" 
                :key="antonym"
                class="badge badge-pink"
              >
                {{ antonym }}
              </span>
            </div>
          </div>
          
          <!-- Progress Buttons -->
          <div class="flex gap-4">
            <button 
              class="btn-primary btn-primary-lime flex-1"
              @click="markKnown"
            >
              ✓ I Know This
            </button>
            
            <button 
              class="btn-primary btn-primary-yellow flex-1"
              @click="markLearning"
            >
              📚 Still Learning
            </button>
            
            <button 
              class="btn-primary btn-primary-pink"
              @click="nextWord"
            >
              Next Word →
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Word Progress -->
    <div class="bg-brutal-pink border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Today's Progress
      </h3>
      
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Progress Chart -->
        <div>
          <h4 class="font-bold mb-3">
            Words Studied
          </h4>
          <div class="h-32 flex items-end justify-between gap-1">
            <div 
              v-for="(count, index) in hourlyProgress"
              :key="index"
              class="flex-1 bg-brutal-cyan border border-black transition-all duration-300"
              :style="{ height: `${count}%` }"
              :title="`${index * 2}:00 - ${index * 2 + 2}:00: ${count} words`"
            />
          </div>
          <div class="flex justify-between mt-1 text-xs font-bold">
            <span>12AM</span>
            <span>6AM</span>
            <span>12PM</span>
            <span>6PM</span>
            <span>Now</span>
          </div>
        </div>
        
        <!-- Category Breakdown -->
        <div>
          <h4 class="font-bold mb-3">
            Category Breakdown
          </h4>
          <div class="space-y-2">
            <div 
              v-for="category in categoryProgress"
              :key="category.name"
              class="flex items-center gap-2"
            >
              <span class="text-xs font-bold w-20">{{ category.name }}</span>
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
      </div>
    </div>
    
    <!-- Word History -->
    <div class="bg-brutal-cyan border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Recent Words
      </h3>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="word in recentWords"
          :key="word.id"
          class="bg-brutal-white border-2 border-black p-4 cursor-pointer transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="reviewWord(word)"
        >
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-black">
              {{ word.word }}
            </h4>
            <span
              class="badge"
              :class="getStatusBadgeClass(word.status)"
            >
              {{ word.status }}
            </span>
          </div>
          
          <p class="text-sm font-black text-brutal-gray mb-2">
            {{ word.definition }}
          </p>
          
          <div class="text-xs font-bold text-brutal-gray">
            Studied {{ word.timeAgo }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Word {
  id: string
  word: string
  phonetic: string
  partOfSpeech: string
  definition: string
  example: string
  synonyms: string[]
  antonyms: string[]
  difficulty: string
  category: string
  status: 'new' | 'learning' | 'mastered'
  options?: string[]
}

const selectedMode = ref('flashcard')
const selectedCategory = ref('all')
const selectedDifficulty = ref('all')
const wordCount = ref(10)
const currentWord = ref<Word | null>(null)
const selectedAnswer = ref(-1)
const typedWord = ref('')
const currentWordIndex = ref(0)

const studyModes = ref([
  {
    id: 'flashcard',
    name: 'Flashcards',
    description: 'Multiple choice questions',
    icon: '📝'
  },
  {
    id: 'typing',
    name: 'Typing Practice',
    description: 'Type the words you see',
    icon: '⌨️'
  },
  {
    id: 'synonyms',
    name: 'Synonyms & Antonyms',
    description: 'Learn related words',
    icon: '🔗'
  },
  {
    id: 'pronunciation',
    name: 'Pronunciation',
    description: 'Practice speaking',
    icon: '🔊'
  }
])

const wordDatabase = ref<Word[]>([
  {
    id: '1',
    word: 'Eloquent',
    phonetic: '/ˈel.ə.kwənt/',
    partOfSpeech: 'adjective',
    definition: 'Fluent or persuasive in speaking or writing',
    example: 'She gave an eloquent speech at the conference.',
    synonyms: ['articulate', 'fluent', 'expressive'],
    antonyms: ['inarticulate', 'tongue-tied'],
    difficulty: 'advanced',
    category: 'academic',
    status: 'new'
  },
  {
    id: '2',
    word: 'Ubiquitous',
    phonetic: '/juːˈbɪk.wɪ.təs/',
    partOfSpeech: 'adjective',
    definition: 'Present, appearing, or found everywhere',
    example: 'Smartphones have become ubiquitous in modern society.',
    synonyms: ['omnipresent', 'everywhere', 'universal'],
    antonyms: ['rare', 'scarce', 'uncommon'],
    difficulty: 'advanced',
    category: 'academic',
    status: 'new'
  },
  {
    id: '3',
    word: 'Pragmatic',
    phonetic: '/præɡˈmæt.ɪk/',
    partOfSpeech: 'adjective',
    definition: 'Dealing with things sensibly and realistically',
    example: 'We need a pragmatic approach to solve this problem.',
    synonyms: ['practical', 'realistic', 'sensible'],
    antonyms: ['idealistic', 'impractical', 'unrealistic'],
    difficulty: 'intermediate',
    category: 'business',
    status: 'new'
  }
])

const currentWordList = ref<Word[]>([])
const recentWords = ref<Word[]>([])

const totalWords = computed(() => wordDatabase.value.length)

const masteredWords = computed(() => 
  wordDatabase.value.filter(w => w.status === 'mastered').length
)

const learningWords = computed(() => 
  wordDatabase.value.filter(w => w.status === 'learning').length
)

const todayWords = computed(() => {
  // Simulate today's words count
  return 15
})

const hourlyProgress = ref([20, 15, 10, 25, 30, 45, 60, 40, 35, 50, 55, 48])

const categoryProgress = computed(() => [
  { name: 'Common', count: 25, percentage: 40, color: 'bg-brutal-lime' },
  { name: 'Academic', count: 20, percentage: 32, color: 'bg-brutal-cyan' },
  { name: 'Business', count: 10, percentage: 16, color: 'bg-brutal-pink' },
  { name: 'Exam', count: 7, percentage: 12, color: 'bg-brutal-yellow' }
])

const selectStudyMode = (modeId: string) => {
  selectedMode.value = modeId
  if (currentWordList.value.length > 0) {
    loadCurrentWord()
  }
}

const updateWordList = () => {
  generateWordList()
}

const generateWordList = () => {
  let filtered = [...wordDatabase.value]
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(w => w.category === selectedCategory.value)
  }
  
  // Filter by difficulty
  if (selectedDifficulty.value !== 'all') {
    filtered = filtered.filter(w => w.difficulty === selectedDifficulty.value)
  }
  
  // Shuffle and take required number
  filtered = filtered.sort(() => Math.random() - 0.5).slice(0, wordCount.value)
  
  // Add multiple choice options for flashcard mode
  if (selectedMode.value === 'flashcard') {
    filtered = filtered.map(word => ({
      ...word,
      options: generateOptions(word)
    }))
  }
  
  currentWordList.value = filtered
  currentWordIndex.value = 0
  loadCurrentWord()
}

const generateOptions = (correctWord: Word): string[] => {
  const options = [correctWord.definition]
  const otherWords = wordDatabase.value.filter(w => w.id !== correctWord.id)
  
  while (options.length < 4 && otherWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherWords.length)
    const option = otherWords[randomIndex].definition
    if (!options.includes(option)) {
      options.push(option)
    }
    otherWords.splice(randomIndex, 1)
  }
  
  return options.sort(() => Math.random() - 0.5)
}

const loadCurrentWord = () => {
  if (currentWordList.value.length === 0) return
  
  currentWord.value = currentWordList.value[currentWordIndex.value]
  selectedAnswer.value = -1
  typedWord.value = ''
}

const checkAnswer = (answerIndex: number) => {
  selectedAnswer.value = answerIndex
  
  if (currentWord.value && currentWord.value.options && answerIndex === currentWord.value.options.indexOf(currentWord.value.definition)) {
    setTimeout(() => {
      markKnown()
    }, 1000)
  }
}

const checkSpelling = () => {
  if (currentWord.value && typedWord.value.toLowerCase() === currentWord.value.word.toLowerCase()) {
    setTimeout(() => {
      markKnown()
    }, 1000)
  }
}

const playPronunciation = () => {
  if ('speechSynthesis' in window && currentWord.value) {
    const utterance = new SpeechSynthesisUtterance(currentWord.value.word)
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }
}

const markKnown = () => {
  if (currentWord.value) {
    currentWord.value.status = 'mastered'
    updateWordStatus(currentWord.value.id, 'mastered')
    nextWord()
  }
}

const markLearning = () => {
  if (currentWord.value) {
    currentWord.value.status = 'learning'
    updateWordStatus(currentWord.value.id, 'learning')
    nextWord()
  }
}

const nextWord = () => {
  if (currentWordIndex.value < currentWordList.value.length - 1) {
    currentWordIndex.value++
    loadCurrentWord()
  } else {
    // Session completed
    alert('Session completed! Great job!')
    generateWordList()
  }
}

const reviewWord = (word: Word) => {
  currentWord.value = word
  currentWordIndex.value = currentWordList.value.findIndex(w => w.id === word.id)
}

const updateWordStatus = (wordId: string, status: string) => {
  const word = wordDatabase.value.find(w => w.id === wordId)
  if (word) {
    word.status = status as 'new' | 'learning' | 'mastered'
  }
  
  // Add to recent words
  if (!recentWords.value.find(w => w.id === wordId)) {
    recentWords.value.unshift({
      ...word,
      timeAgo: 'Just now'
    })
    
    if (recentWords.value.length > 6) {
      recentWords.value = recentWords.value.slice(0, 6)
    }
  }
  
  // Save to localStorage
  saveProgress()
}

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'mastered': return 'badge-lime'
    case 'learning': return 'badge-yellow'
    case 'new': return 'badge-pink'
    default: return 'badge-gray'
  }
}

const saveProgress = () => {
  const progress = {
    wordDatabase: wordDatabase.value,
    recentWords: recentWords.value,
    todayWords: todayWords.value,
    lastStudyDate: new Date().toISOString()
  }
  localStorage.setItem('vocabularyProgress', JSON.stringify(progress))
}

onMounted(() => {
  // Load progress from localStorage
  const saved = localStorage.getItem('vocabularyProgress')
  if (saved) {
    const progress = JSON.parse(saved)
    wordDatabase.value = progress.wordDatabase || wordDatabase.value
    recentWords.value = progress.recentWords || []
  }
  
  // Generate initial word list
  generateWordList()
})
</script>
