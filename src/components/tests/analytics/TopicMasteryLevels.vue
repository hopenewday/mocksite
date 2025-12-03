<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Topic-wise Mastery Levels
    </h2>
    
    <!-- Overall Mastery Overview -->
    <div class="grid md:grid-cols-4 gap-4 mb-8">
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-cyan">
          {{ overallMastery }}%
        </div>
        <div class="text-sm font-bold">
          Overall Mastery
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-lime">
          {{ masteredTopics }}
        </div>
        <div class="text-sm font-bold">
          Mastered Topics
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-pink">
          {{ inProgressTopics }}
        </div>
        <div class="text-sm font-bold">
          In Progress
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-purple">
          {{ needsImprovement }}
        </div>
        <div class="text-sm font-bold">
          Needs Work
        </div>
      </div>
    </div>
    
    <!-- Subject-wise Mastery -->
    <div class="space-y-6 mb-8">
      <div
        v-for="subject in subjectMastery"
        :key="subject.name"
      >
        <div class="bg-brutal-white border-4 border-black p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-black text-lg">
              {{ subject.name }}
            </h3>
            <div class="flex items-center gap-2">
              <span
                class="badge"
                :class="getMasteryBadgeClass(subject.overallMastery)"
              >
                {{ getMasteryLevel(subject.overallMastery) }}
              </span>
              <span class="font-black text-lg">{{ subject.overallMastery }}%</span>
            </div>
          </div>
          
          <!-- Overall Progress Bar -->
          <div class="w-full h-6 bg-brutal-gray border-2 border-black mb-6">
            <div 
              class="h-full transition-all duration-1000"
              :class="getMasteryColor(subject.overallMastery)"
              :style="{ width: `${subject.overallMastery}%` }"
            />
          </div>
          
          <!-- Topic-wise Breakdown -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="topic in subject.topics"
              :key="topic.name"
              class="border-2 border-black p-4 transform transition-all duration-200 hover:scale-105"
              :class="getTopicCardClass(topic.mastery)"
            >
              <div class="flex justify-between items-center mb-2">
                <h4 class="font-black text-sm">
                  {{ topic.name }}
                </h4>
                <span class="text-xs font-black">{{ topic.mastery }}%</span>
              </div>
              
              <!-- Topic Progress -->
              <div class="w-full h-3 bg-brutal-gray border border-black mb-3">
                <div 
                  class="h-full transition-all duration-500"
                  :class="getMasteryColor(topic.mastery)"
                  :style="{ width: `${topic.mastery}%` }"
                />
              </div>
              
              <!-- Topic Stats -->
              <div class="text-xs font-bold text-brutal-gray space-y-1">
                <div class="flex justify-between">
                  <span>Questions:</span>
                  <span>{{ topic.questionsAttempted }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Accuracy:</span>
                  <span>{{ topic.accuracy }}%</span>
                </div>
                <div class="flex justify-between">
                  <span>Last Practice:</span>
                  <span>{{ topic.lastPractice }}</span>
                </div>
              </div>
              
              <!-- Action Button -->
              <button 
                class="btn-primary btn-primary-cyan w-full mt-3 text-xs py-2"
                @click="practiceTopic(topic)"
              >
                {{ getActionButton(topic.mastery) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mastery Journey Visualization -->
    <div class="bg-brutal-cyan border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Mastery Journey
      </h3>
      
      <div class="relative">
        <!-- Timeline -->
        <div class="absolute left-8 top-0 bottom-0 w-1 bg-brutal-gray" />
        
        <div class="space-y-6">
          <div 
            v-for="milestone in masteryJourney"
            :key="milestone.id"
            class="flex items-center gap-4"
          >
            <div 
              class="w-16 h-16 border-4 border-black flex items-center justify-center z-10"
              :class="milestone.completed ? 'bg-brutal-lime' : 'bg-brutal-gray'"
            >
              <span class="text-2xl">{{ milestone.icon }}</span>
            </div>
            
            <div class="flex-1 bg-brutal-white border-2 border-black p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-black">
                    {{ milestone.title }}
                  </h4>
                  <p class="text-sm font-bold text-brutal-gray">
                    {{ milestone.description }}
                  </p>
                </div>
                <div class="text-right">
                  <div class="font-black text-sm">
                    {{ milestone.progress }}%
                  </div>
                  <div class="text-xs font-bold text-brutal-gray">
                    {{ milestone.date }}
                  </div>
                </div>
              </div>
              
              <div class="w-full h-2 bg-brutal-gray border border-black mt-2">
                <div 
                  class="h-full bg-brutal-cyan transition-all duration-500"
                  :style="{ width: `${milestone.progress}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Learning Recommendations -->
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-brutal-pink border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Focus Areas
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="area in focusAreas"
            :key="area.topic"
            class="flex items-center gap-3 p-3 bg-brutal-white border-2 border-black"
          >
            <span class="text-2xl">{{ area.icon }}</span>
            <div class="flex-1">
              <h4 class="font-black text-sm">
                {{ area.topic }}
              </h4>
              <p class="text-xs font-bold text-brutal-gray">
                {{ area.reason }}
              </p>
              <div class="mt-2">
                <span class="badge badge-cyan text-xs">{{ area.priority }}</span>
              </div>
            </div>
            <button 
              class="btn-primary btn-primary-pink px-3 py-1 text-xs"
              @click="startPractice(area.topic)"
            >
              Practice
            </button>
          </div>
        </div>
      </div>
      
      <div class="bg-brutal-lime border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Next Milestones
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="milestone in nextMilestones"
            :key="milestone.id"
            class="flex items-center gap-3 p-3 bg-brutal-white border-2 border-black"
          >
            <span class="text-2xl">{{ milestone.icon }}</span>
            <div class="flex-1">
              <h4 class="font-black text-sm">
                {{ milestone.title }}
              </h4>
              <p class="text-xs font-bold text-brutal-gray">
                {{ milestone.requirement }}
              </p>
              <div class="mt-2">
                <div class="text-xs font-bold">
                  Progress: {{ milestone.current }}/{{ milestone.target }}
                </div>
                <div class="w-full h-1 bg-brutal-gray border border-black mt-1">
                  <div 
                    class="h-full bg-brutal-cyan transition-all duration-500"
                    :style="{ width: `${(milestone.current / milestone.target) * 100}%` }"
                  />
                </div>
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
import { useRouter } from 'vue-router'

interface TopicData {
  name: string
  mastery: number
  questionsAttempted: number
  accuracy: number
  lastPractice: string
}

interface SubjectData {
  name: string
  overallMastery: number
  topics: TopicData[]
}

const subjectMastery = ref<SubjectData[]>([
  {
    name: 'Quantitative Aptitude',
    overallMastery: 78,
    topics: [
      { name: 'Percentage', mastery: 85, questionsAttempted: 45, accuracy: 88, lastPractice: '2 days ago' },
      { name: 'Profit & Loss', mastery: 72, questionsAttempted: 32, accuracy: 75, lastPractice: '1 week ago' },
      { name: 'Time & Work', mastery: 68, questionsAttempted: 28, accuracy: 70, lastPractice: '3 days ago' },
      { name: 'Speed & Distance', mastery: 80, questionsAttempted: 38, accuracy: 82, lastPractice: '1 day ago' },
      { name: 'Algebra', mastery: 65, questionsAttempted: 25, accuracy: 68, lastPractice: '5 days ago' },
      { name: 'Geometry', mastery: 90, questionsAttempted: 52, accuracy: 92, lastPractice: 'Today' }
    ]
  },
  {
    name: 'Reasoning Ability',
    overallMastery: 72,
    topics: [
      { name: 'Series', mastery: 78, questionsAttempted: 41, accuracy: 80, lastPractice: 'Yesterday' },
      { name: 'Analogy', mastery: 85, questionsAttempted: 48, accuracy: 87, lastPractice: '2 days ago' },
      { name: 'Classification', mastery: 70, questionsAttempted: 35, accuracy: 72, lastPractice: '4 days ago' },
      { name: 'Coding-Decoding', mastery: 65, questionsAttempted: 30, accuracy: 67, lastPractice: '1 week ago' },
      { name: 'Blood Relations', mastery: 75, questionsAttempted: 38, accuracy: 77, lastPractice: '3 days ago' }
    ]
  },
  {
    name: 'General Awareness',
    overallMastery: 85,
    topics: [
      { name: 'Current Affairs', mastery: 88, questionsAttempted: 65, accuracy: 90, lastPractice: 'Today' },
      { name: 'History', mastery: 82, questionsAttempted: 42, accuracy: 84, lastPractice: '2 days ago' },
      { name: 'Geography', mastery: 78, questionsAttempted: 38, accuracy: 80, lastPractice: '5 days ago' },
      { name: 'Polity', mastery: 90, questionsAttempted: 55, accuracy: 92, lastPractice: 'Yesterday' },
      { name: 'Economics', mastery: 75, questionsAttempted: 35, accuracy: 77, lastPractice: '1 week ago' }
    ]
  },
  {
    name: 'English Language',
    overallMastery: 68,
    topics: [
      { name: 'Reading Comprehension', mastery: 72, questionsAttempted: 28, accuracy: 74, lastPractice: '3 days ago' },
      { name: 'Grammar', mastery: 65, questionsAttempted: 32, accuracy: 67, lastPractice: '4 days ago' },
      { name: 'Vocabulary', mastery: 60, questionsAttempted: 25, accuracy: 62, lastPractice: '1 week ago' },
      { name: 'Synonyms & Antonyms', mastery: 70, questionsAttempted: 30, accuracy: 72, lastPractice: '2 days ago' },
      { name: 'Cloze Test', mastery: 75, questionsAttempted: 35, accuracy: 77, lastPractice: 'Yesterday' }
    ]
  }
])

const masteryJourney = ref([
  {
    id: 1,
    icon: '🌱',
    title: 'Beginner',
    description: 'Started your learning journey',
    progress: 100,
    completed: true,
    date: '2 months ago'
  },
  {
    id: 2,
    icon: '📚',
    title: 'Foundation Builder',
    description: 'Complete basics of all subjects',
    progress: 100,
    completed: true,
    date: '1 month ago'
  },
  {
    id: 3,
    icon: '🎯',
    title: 'Topic Master',
    description: 'Master 10 topics with 80%+ accuracy',
    progress: 70,
    completed: false,
    date: 'In progress'
  },
  {
    id: 4,
    icon: '🏆',
    title: 'Subject Expert',
    description: 'Achieve 80% mastery in 3 subjects',
    progress: 40,
    completed: false,
    date: 'Future'
  },
  {
    id: 5,
    icon: '👑',
    title: 'Exam Champion',
    description: 'Achieve 85% overall mastery',
    progress: 20,
    completed: false,
    date: 'Future'
  }
])

const overallMastery = computed(() => {
  const totalMastery = subjectMastery.value.reduce((sum, subject) => sum + subject.overallMastery, 0)
  return Math.round(totalMastery / subjectMastery.value.length)
})

const masteredTopics = computed(() => {
  return subjectMastery.value.reduce((count, subject) => {
    return count + subject.topics.filter(topic => topic.mastery >= 80).length
  }, 0)
})

const inProgressTopics = computed(() => {
  return subjectMastery.value.reduce((count, subject) => {
    return count + subject.topics.filter(topic => topic.mastery >= 60 && topic.mastery < 80).length
  }, 0)
})

const needsImprovement = computed(() => {
  return subjectMastery.value.reduce((count, subject) => {
    return count + subject.topics.filter(topic => topic.mastery < 60).length
  }, 0)
})

const focusAreas = computed(() => {
  const areas = []
  
  subjectMastery.value.forEach(subject => {
    subject.topics.forEach(topic => {
      if (topic.mastery < 70) {
        areas.push({
          topic: `${subject.name} - ${topic.name}`,
          mastery: topic.mastery,
          priority: topic.mastery < 50 ? 'High Priority' : 'Medium Priority',
          reason: topic.mastery < 50 ? 'Low mastery score' : 'Needs improvement',
          icon: topic.mastery < 50 ? '🔴' : '🟡'
        })
      }
    })
  })
  
  return areas.sort((a, b) => a.mastery - b.mastery).slice(0, 4)
})

const nextMilestones = computed(() => {
  const milestones = []
  
  // Count mastered topics
  const masteredCount = masteredTopics.value
  const nextTarget = Math.ceil((masteredCount + 1) / 5) * 5
  
  milestones.push({
    id: 1,
    icon: '🎯',
    title: `Master ${nextTarget} Topics`,
    requirement: 'Achieve 80% mastery in topics',
    current: masteredCount,
    target: nextTarget
  })
  
  // Check subject mastery
  const masteredSubjects = subjectMastery.value.filter(s => s.overallMastery >= 80).length
  milestones.push({
    id: 2,
    icon: '📚',
    title: `Master ${masteredSubjects + 1} Subjects`,
    requirement: 'Achieve 80% mastery in subjects',
    current: masteredSubjects,
    target: masteredSubjects + 1
  })
  
  // Overall mastery target
  milestones.push({
    id: 3,
    icon: '🏆',
    title: 'Reach 80% Overall',
    requirement: 'Achieve 80% overall mastery',
    current: overallMastery.value,
    target: 80
  })
  
  return milestones
})

const getMasteryLevel = (mastery: number): string => {
  if (mastery >= 90) return 'Expert'
  if (mastery >= 80) return 'Mastered'
  if (mastery >= 70) return 'Proficient'
  if (mastery >= 60) return 'Developing'
  if (mastery >= 40) return 'Beginner'
  return 'Novice'
}

const getMasteryBadgeClass = (mastery: number): string => {
  if (mastery >= 80) return 'badge-lime'
  if (mastery >= 60) return 'badge-cyan'
  if (mastery >= 40) return 'badge-yellow'
  return 'badge-pink'
}

const getMasteryColor = (mastery: number): string => {
  if (mastery >= 80) return 'bg-brutal-lime'
  if (mastery >= 60) return 'bg-brutal-cyan'
  if (mastery >= 40) return 'bg-brutal-yellow'
  return 'bg-brutal-pink'
}

const getTopicCardClass = (mastery: number): string => {
  if (mastery >= 80) return 'bg-brutal-lime/20'
  if (mastery >= 60) return 'bg-brutal-cyan/20'
  if (mastery >= 40) return 'bg-brutal-yellow/20'
  return 'bg-brutal-pink/20'
}

const getActionButton = (mastery: number): string => {
  if (mastery >= 80) return 'Practice More'
  if (mastery >= 60) return 'Improve'
  return 'Start Learning'
}

const practiceTopic = (topic: TopicData) => {
  // Navigate to topic-specific practice
  const router = useRouter()
  
  // Store practice session data
  const practiceData = {
    topic: topic.name,
    masteryLevel: topic.level,
    questionsCount: Math.max(5, Math.floor((100 - topic.score) / 10)),
    focusAreas: topic.weakAreas
  }
  
  localStorage.setItem('currentPractice', JSON.stringify(practiceData))
  
  // Navigate to custom test builder with pre-filled data
  router.push({
    name: 'custom-test-builder',
    query: { topic: topic.name, mastery: topic.level.toString() }
  })
}

const startPractice = (topicName: string) => {
  // Navigate to focused practice session
  const router = useRouter()
  
  const practiceData = {
    topic: topicName,
    focusMode: true,
    difficulty: 'adaptive'
  }
  
  localStorage.setItem('currentPractice', JSON.stringify(practiceData))
  
  // Navigate to a practice test
  router.push({
    name: 'test',
    params: { id: 'practice-' + topicName.toLowerCase().replace(/\s+/g, '-') }
  })
}

onMounted(() => {
  // Load mastery data from IndexedDB
  loadMasteryData()
})

const loadMasteryData = async () => {
  try {
    const storedData = localStorage.getItem('topicMasteryData')
    if (storedData) {
      const data = JSON.parse(storedData)
      // Update with stored data
      subjectMastery.value = data.subjectMastery || subjectMastery.value
    }
  } catch (error) {
    console.error('Failed to load mastery data:', error)
  }
}
</script>
