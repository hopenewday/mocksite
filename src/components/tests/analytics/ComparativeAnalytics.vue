<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">
      Comparative Analytics
    </h2>
    
    <!-- User Profile Comparison -->
    <div class="grid md:grid-cols-3 gap-4 mb-8">
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-cyan">
          {{ userPercentile }}%
        </div>
        <div class="text-sm font-bold">
          Your Percentile
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-pink">
          {{ usersAhead.toLocaleString() }}
        </div>
        <div class="text-sm font-bold">
          Users Ahead
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-lime">
          {{ usersBehind.toLocaleString() }}
        </div>
        <div class="text-sm font-bold">
          Users Behind
        </div>
      </div>
    </div>
    
    <!-- Peer Group Selection -->
    <div class="bg-brutal-yellow border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Compare With
      </h3>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="font-black mb-2 block">Exam Category</label>
          <select
            v-model="selectedCategory"
            class="select"
          >
            <option value="all">
              All Categories
            </option>
            <option value="ssc">
              SSC Exams
            </option>
            <option value="banking">
              Banking Exams
            </option>
            <option value="railway">
              Railway Exams
            </option>
            <option value="upsc">
              UPSC Exams
            </option>
          </select>
        </div>
        
        <div>
          <label class="font-black mb-2 block">Experience Level</label>
          <select
            v-model="selectedLevel"
            class="select"
          >
            <option value="all">
              All Levels
            </option>
            <option value="beginner">
              Beginner (0-10 tests)
            </option>
            <option value="intermediate">
              Intermediate (11-50 tests)
            </option>
            <option value="advanced">
              Advanced (50+ tests)
            </option>
          </select>
        </div>
      </div>
      
      <div class="mt-4 flex gap-4">
        <button
          class="btn-primary btn-primary-cyan"
          @click="updateComparison"
        >
          Update Comparison
        </button>
        
        <button
          class="btn-primary btn-primary-pink"
          @click="compareWithFriends"
        >
          Compare with Friends
        </button>
      </div>
    </div>
    
    <!-- Performance Comparison Chart -->
    <div class="bg-brutal-white border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Performance Comparison
      </h3>
      
      <div class="space-y-4">
        <div 
          v-for="metric in performanceMetrics"
          :key="metric.name"
          class="border-2 border-black p-4"
        >
          <div class="flex justify-between mb-2">
            <span class="font-bold">{{ metric.name }}</span>
            <span class="font-black">{{ metric.userValue }}{{ metric.unit }}</span>
          </div>
          
          <!-- Comparison Bars -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold w-16">You</span>
            <div class="flex-1 h-6 bg-brutal-gray border border-black">
              <div 
                class="h-full bg-brutal-cyan transition-all duration-500"
                :style="{ width: `${(metric.userValue / metric.maxValue) * 100}%` }"
              />
            </div>
            <span class="text-xs font-black w-12">{{ Math.round((metric.userValue / metric.maxValue) * 100) }}%</span>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold w-16">Avg</span>
            <div class="flex-1 h-6 bg-brutal-gray border border-black">
              <div 
                class="h-full bg-brutal-pink transition-all duration-500"
                :style="{ width: `${(metric.avgValue / metric.maxValue) * 100}%` }"
              />
            </div>
            <span class="text-xs font-black w-12">{{ Math.round((metric.avgValue / metric.maxValue) * 100) }}%</span>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold w-16">Top 10%</span>
            <div class="flex-1 h-6 bg-brutal-gray border border-black">
              <div 
                class="h-full bg-brutal-lime transition-all duration-500"
                :style="{ width: `${(metric.top10Value / metric.maxValue) * 100}%` }"
              />
            </div>
            <span class="text-xs font-black w-12">{{ Math.round((metric.top10Value / metric.maxValue) * 100) }}%</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Subject-wise Comparison -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Subject-wise Ranking
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="subject in subjectRankings"
            :key="subject.name"
            class="flex items-center justify-between p-3 bg-brutal-white border-2 border-black"
          >
            <div>
              <div class="font-black">
                {{ subject.name }}
              </div>
              <div class="text-xs font-bold text-brutal-gray">
                Score: {{ subject.score }}%
              </div>
            </div>
            <div class="text-right">
              <div class="font-black text-lg">
                #{{ subject.rank }}
              </div>
              <div class="text-xs font-bold">
                {{ subject.percentile }}th percentile
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Improvement Opportunities -->
      <div class="bg-brutal-pink border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Improvement Opportunities
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="opportunity in improvementOpportunities"
            :key="opportunity.subject"
            class="flex items-start gap-3 p-3 bg-brutal-white border-2 border-black"
          >
            <span class="text-2xl">{{ opportunity.icon }}</span>
            <div class="flex-1">
              <h4 class="font-black text-sm mb-1">
                {{ opportunity.subject }}
              </h4>
              <p class="text-xs font-bold text-brutal-gray mb-2">
                {{ opportunity.description }}
              </p>
              <div class="flex items-center gap-2">
                <span class="badge badge-cyan text-xs">{{ opportunity.gain }}% gain possible</span>
                <span class="badge badge-yellow text-xs">{{ opportunity.difficulty }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Progress Over Time -->
    <div class="bg-brutal-yellow border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Progress Over Time
      </h3>
      
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Score Progress -->
        <div>
          <h4 class="font-bold mb-3">
            Score Progress vs Peers
          </h4>
          <div class="h-32 flex items-end justify-between gap-1">
            <div 
              v-for="(data, index) in progressData"
              :key="index"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <div class="w-full flex gap-px">
                <div 
                  class="flex-1 bg-brutal-cyan border border-black transition-all duration-300"
                  :style="{ height: `${(data.userScore / 100) * 100}%` }"
                  :title="`You: ${data.userScore}%`"
                />
                <div 
                  class="flex-1 bg-brutal-pink border border-black transition-all duration-300"
                  :style="{ height: `${data.avgScore / 100 * 100}%` }"
                  :title="`Average: ${data.avgScore}%`"
                />
              </div>
              <span class="text-xs font-bold">{{ data.label }}</span>
            </div>
          </div>
          
          <div class="flex justify-center gap-4 mt-2">
            <div class="flex items-center gap-1">
              <div class="w-3 h-3 bg-brutal-cyan border border-black" />
              <span class="text-xs font-bold">You</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-3 h-3 bg-brutal-pink border border-black" />
              <span class="text-xs font-bold">Average</span>
            </div>
          </div>
        </div>
        
        <!-- Rank Progress -->
        <div>
          <h4 class="font-bold mb-3">
            Rank Improvement
          </h4>
          <div class="h-32 flex items-end justify-between gap-1">
            <div 
              v-for="(rank, index) in rankProgress"
              :key="index"
              class="flex-1 bg-brutal-lime border border-black transition-all duration-300"
              :style="{ height: `${(1 - rank / 10000) * 100}%` }"
              :title="`Rank: ${rank}`"
            />
          </div>
          
          <div class="text-center mt-2">
            <span class="text-sm font-bold">Current Rank: #{{ currentRank }}</span>
            <span class="text-xs font-bold text-brutal-gray ml-2">
              ({{ rankImprovement > 0 ? '+' : '' }}{{ rankImprovement }} positions)
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Friend Comparison Modal -->
    <div
      v-if="showFriendComparison"
      class="fixed inset-0 bg-brutal-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-brutal-white border-4 border-black p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 class="font-black text-xl mb-6">
          Compare with Friends
        </h3>
        
        <div class="mb-6">
          <div class="bg-brutal-cyan border-2 border-black p-4 mb-4">
            <h4 class="font-bold mb-2">
              Your Performance
            </h4>
            <div class="text-2xl font-black">
              {{ userScore }}%
            </div>
            <div class="text-sm font-bold">
              {{ totalTests }} tests taken
            </div>
          </div>
        </div>
        
        <div class="space-y-3 mb-6">
          <h4 class="font-bold">
            Friends Performance
          </h4>
          <div 
            v-for="friend in friends"
            :key="friend.id"
            class="flex items-center justify-between p-3 bg-brutal-white border-2 border-black"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ friend.avatar }}</span>
              <div>
                <p class="font-black">
                  {{ friend.name }}
                </p>
                <p class="text-xs font-bold text-brutal-gray">
                  {{ friend.tests }} tests
                </p>
              </div>
            </div>
            
            <div class="text-right">
              <div class="font-black text-lg">
                {{ friend.score }}%
              </div>
              <button 
                class="btn-primary btn-primary-cyan px-3 py-1 text-xs mt-1"
                @click="challengeFriend(friend.id)"
              >
                Challenge
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex gap-2">
          <button
            class="btn-primary btn-primary-lime flex-1"
            @click="inviteFriend"
          >
            Invite Friends
          </button>
          <button
            class="btn-primary btn-primary-pink"
            @click="showFriendComparison = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const selectedCategory = ref('all')
const selectedLevel = ref('all')
const totalUsers = ref(15420)

// Mock data - in real app, this would come from IndexedDB or API
const userData = ref({
  score: 78,
  totalTests: 45,
  averageTime: 65,
  accuracy: 82,
  rank: 3420,
  subjectScores: {
    'Quantitative Aptitude': 85,
    'Reasoning Ability': 78,
    'General Awareness': 92,
    'English Language': 70
  }
})

const peerData = ref({
  averageScore: 65,
  averageTests: 28,
  averageTime: 78,
  averageAccuracy: 72,
  top10Score: 92,
  top10Tests: 85,
  top10Time: 45,
  top10Accuracy: 95
})

const userPercentile = computed(() => 
  Math.round((1 - userData.value.rank / totalUsers.value) * 100)
)

const usersAhead = computed(() => userData.value.rank - 1)

const usersBehind = computed(() => totalUsers.value - userData.value.rank)

const currentRank = computed(() => userData.value.rank)

const rankImprovement = computed(() => {
  // Simulate rank improvement over time
  return 125
})

const performanceMetrics = computed(() => [
  {
    name: 'Average Score',
    userValue: userData.value.score,
    avgValue: peerData.value.averageScore,
    top10Value: peerData.value.top10Score,
    maxValue: 100,
    unit: '%'
  },
  {
    name: 'Tests Completed',
    userValue: userData.value.totalTests,
    avgValue: peerData.value.averageTests,
    top10Value: peerData.value.top10Tests,
    maxValue: 100,
    unit: ''
  },
  {
    name: 'Average Time per Question',
    userValue: userData.value.averageTime,
    avgValue: peerData.value.averageTime,
    top10Value: peerData.value.top10Time,
    maxValue: 120,
    unit: 's'
  },
  {
    name: 'Accuracy',
    userValue: userData.value.accuracy,
    avgValue: peerData.value.averageAccuracy,
    top10Value: peerData.value.top10Accuracy,
    maxValue: 100,
    unit: '%'
  }
])

const subjectRankings = computed(() => {
  const subjects = Object.entries(userData.value.subjectScores)
  
  return subjects.map(([name, score]) => {
    // Simulate ranking calculation
    const subjectUsers = Math.floor(totalUsers.value * 0.7) // Assume 70% attempt each subject
    const rank = Math.floor((1 - score / 100) * subjectUsers) + 1
    const percentile = Math.round((1 - rank / subjectUsers) * 100)
    
    return { name, score, rank, percentile }
  }).sort((a, b) => b.score - a.score)
})

const improvementOpportunities = computed(() => {
  const opportunities = []
  
  Object.entries(userData.value.subjectScores).forEach(([subject, score]) => {
    if (score < 80) {
      const avgScore = peerData.value.averageScore
      const gain = Math.min(80 - score, avgScore - score)
      
      opportunities.push({
        subject,
        score,
        gain: Math.round(gain),
        difficulty: score < 60 ? 'High' : score < 70 ? 'Medium' : 'Low',
        icon: score < 60 ? '🔴' : score < 70 ? '🟡' : '🟢',
        description: `You're ${80 - score}% points away from excellence. Focus on fundamentals.`
      })
    }
  })
  
  return opportunities.sort((a, b) => b.gain - a.gain).slice(0, 4)
})

const progressData = ref([
  { label: 'Week 1', userScore: 65, avgScore: 60 },
  { label: 'Week 2', userScore: 68, avgScore: 62 },
  { label: 'Week 3', userScore: 72, avgScore: 63 },
  { label: 'Week 4', userScore: 75, avgScore: 64 },
  { label: 'Week 5', userScore: 78, avgScore: 65 }
])

const rankProgress = ref([8000, 6500, 5200, 4500, 3420])

const updateComparison = () => {
  // Simulate updating comparison data based on filters
  console.log('Updating comparison for:', selectedCategory.value, selectedLevel.value)
  
  // In real app, this would query IndexedDB or API
  // For now, we'll just simulate with random variations
  const variation = Math.random() * 10 - 5
  peerData.value.averageScore = Math.max(50, Math.min(80, peerData.value.averageScore + variation))
}

const compareWithFriends = () => {
  // Implement friend comparison logic
  console.log('Comparing with friends...')
  
  // Show friend comparison modal
  showFriendComparison.value = true
  
  // Load friend data from localStorage or simulate
  loadFriendData()
}

// Friend comparison state
const showFriendComparison = ref(false)
const friends = ref([
  { id: 1, name: 'Alex Kumar', score: 78, tests: 12, avatar: '👨‍🎓' },
  { id: 2, name: 'Priya Sharma', score: 85, tests: 15, avatar: '👩‍🎓' },
  { id: 3, name: 'Rahul Verma', score: 72, tests: 8, avatar: '👨‍💼' },
  { id: 4, name: 'Neha Patel', score: 90, tests: 20, avatar: '👩‍💼' }
])

const loadFriendData = () => {
  // In real app, this would fetch from API or WebRTC
  const savedFriends = localStorage.getItem('friendsData')
  if (savedFriends) {
    friends.value = JSON.parse(savedFriends)
  }
}

const inviteFriend = () => {
  // Share functionality to invite friends
  const shareData = {
    title: 'Mock Test Pro - Challenge Your Friends!',
    text: `I scored ${userScore.value}% on Mock Test Pro! Can you beat my score?`,
    url: window.location.origin
  }
  
  if (navigator.share) {
    navigator.share(shareData)
  } else {
    // Fallback: copy to clipboard
    const text = `${shareData.text} ${shareData.url}`
    navigator.clipboard.writeText(text)
    alert('Share link copied to clipboard!')
  }
}

const challengeFriend = (friendId: number) => {
  const friend = friends.value.find(f => f.id === friendId)
  if (friend) {
    // In real app, this would send a challenge notification
    alert(`Challenge sent to ${friend.name}!`)
  }
}

onMounted(() => {
  // Load comparison data from IndexedDB
  loadComparisonData()
})

const loadComparisonData = async () => {
  try {
    // Simulate loading from IndexedDB
    const storedData = localStorage.getItem('comparativeAnalytics')
    if (storedData) {
      const data = JSON.parse(storedData)
      userData.value = { ...userData.value, ...data.userData }
      peerData.value = { ...peerData.value, ...data.peerData }
    }
  } catch (error) {
    console.error('Failed to load comparison data:', error)
  }
}
</script>
