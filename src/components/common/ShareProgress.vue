<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Share Your Progress
    </h2>
    
    <!-- Share Options -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Achievement Share -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Share Achievement
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Select Achievement</label>
            <select
              v-model="selectedAchievement"
              class="select"
            >
              <option value="">
                Choose an achievement...
              </option>
              <option
                v-for="achievement in achievements"
                :key="achievement.id"
                :value="achievement.id"
              >
                {{ achievement.name }} - {{ achievement.description }}
              </option>
            </select>
          </div>
          
          <div v-if="selectedAchievementData">
            <div class="bg-brutal-yellow border-2 border-black p-4">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-3xl">{{ selectedAchievementData.icon }}</span>
                <div>
                  <h4 class="font-black">
                    {{ selectedAchievementData.name }}
                  </h4>
                  <p class="text-sm font-bold text-brutal-gray">
                    {{ selectedAchievementData.description }}
                  </p>
                </div>
              </div>
              <div class="text-center">
                <span class="badge badge-cyan font-black">+{{ selectedAchievementData.points }} points</span>
              </div>
            </div>
          </div>
          
          <button 
            :disabled="!selectedAchievement"
            class="btn-primary btn-primary-cyan w-full disabled:opacity-50"
            @click="shareAchievement"
          >
            Share Achievement
          </button>
        </div>
      </div>
      
      <!-- Progress Share -->
      <div class="bg-brutal-lime border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Share Progress
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Progress Type</label>
            <select
              v-model="selectedProgressType"
              class="select"
            >
              <option value="weekly">
                Weekly Progress
              </option>
              <option value="monthly">
                Monthly Progress
              </option>
              <option value="overall">
                Overall Progress
              </option>
              <option value="streak">
                Current Streak
              </option>
            </select>
          </div>
          
          <div class="bg-brutal-pink border-2 border-black p-4">
            <div class="text-center">
              <div class="text-3xl font-black mb-2">
                {{ progressDisplay.value }}
              </div>
              <div class="text-sm font-bold">
                {{ progressDisplay.label }}
              </div>
            </div>
            
            <!-- Mini Progress Bar -->
            <div class="w-full h-3 bg-brutal-gray border border-black mt-3">
              <div 
                class="h-full bg-brutal-cyan transition-all duration-500"
                :style="{ width: `${progressDisplay.percentage}%` }"
              />
            </div>
          </div>
          
          <button 
            class="btn-primary btn-primary-lime w-full"
            @click="shareProgress"
          >
            Share Progress
          </button>
        </div>
      </div>
    </div>
    
    <!-- Custom Share Message -->
    <div class="bg-brutal-yellow border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Custom Message
      </h3>
      
      <div class="space-y-4">
        <textarea 
          v-model="customMessage"
          placeholder="Write your own message to share..."
          class="input w-full h-24 resize-none"
        />
        
        <div class="flex gap-4">
          <button 
            :disabled="!customMessage.trim()"
            class="btn-primary btn-primary-yellow flex-1 disabled:opacity-50"
            @click="shareCustomMessage"
          >
            Share Custom Message
          </button>
          
          <button 
            class="btn-primary btn-primary-pink"
            @click="generateMessage"
          >
            Generate Message
          </button>
        </div>
      </div>
    </div>
    
    <!-- Quick Share Templates -->
    <div class="bg-brutal-pink border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Quick Share Templates
      </h3>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="template in shareTemplates"
          :key="template.id"
          class="bg-brutal-white border-2 border-black p-4 cursor-pointer transform transition-all duration-200 hover:rotate-[-1deg] hover:scale-105"
          @click="useTemplate(template)"
        >
          <div class="text-center mb-2">
            <span class="text-2xl">{{ template.icon }}</span>
          </div>
          <h4 class="font-black text-center mb-2">
            {{ template.title }}
          </h4>
          <p class="text-xs font-bold text-brutal-gray text-center">
            {{ template.preview }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Recent Shares -->
    <div class="bg-brutal-purple border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Recent Shares
      </h3>
      
      <div class="space-y-3">
        <div 
          v-for="share in recentShares"
          :key="share.id"
          class="flex items-center gap-4 p-3 bg-brutal-white border-2 border-black"
        >
          <span class="text-2xl">{{ share.icon }}</span>
          <div class="flex-1">
            <p class="font-black text-sm">
              {{ share.message }}
            </p>
            <p class="text-xs font-bold text-brutal-gray">
              {{ share.timeAgo }}
            </p>
          </div>
          <div class="flex gap-2">
            <button 
              class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
              @click="reshare(share)"
            >
              Reshare
            </button>
            <button 
              class="btn-primary btn-primary-pink px-3 py-1 text-xs"
              @click="copyShareLink(share)"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Share Modal -->
    <div
      v-if="showShareModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-brutal-white border-4 border-black p-8 max-w-md w-full transform rotate-[-1deg]">
        <h3 class="font-black text-xl mb-4">
          Share Your Progress
        </h3>
        
        <div class="bg-brutal-yellow border-2 border-black p-4 mb-6">
          <p class="font-black text-center mb-2">
            {{ shareContent }}
          </p>
          <div class="text-center">
            <span class="badge badge-cyan font-black">#MockTestPro</span>
          </div>
        </div>
        
        <div class="space-y-3">
          <button 
            v-if="navigator.share"
            class="btn-primary btn-primary-cyan w-full"
            @click="nativeShare"
          >
            📱 Share via Device
          </button>
          
          <button 
            class="btn-primary btn-primary-pink w-full"
            @click="copyToClipboard"
          >
            📋 Copy to Clipboard
          </button>
          
          <button 
            class="btn-primary btn-primary-lime w-full"
            @click="shareOnSocial('twitter')"
          >
            🐦 Share on Twitter
          </button>
          
          <button 
            class="btn-primary btn-primary-yellow w-full"
            @click="shareOnSocial('facebook')"
          >
            📘 Share on Facebook
          </button>
          
          <button 
            class="btn-primary btn-primary-purple w-full"
            @click="shareOnSocial('linkedin')"
          >
            💼 Share on LinkedIn
          </button>
        </div>
        
        <button 
          class="btn-primary btn-primary-pink w-full mt-4"
          @click="showShareModal = false"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ShareTemplate {
  message: string
}

interface ShareItem {
  message: string
  id: string
}

const selectedAchievement = ref('')
const selectedProgressType = ref('weekly')
const customMessage = ref('')
const showShareModal = ref(false)
const shareContent = ref('')

const achievements = ref([
  {
    id: 'first_test',
    name: 'First Steps',
    description: 'Completed first mock test',
    icon: '🌱',
    points: 50
  },
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: '7-day study streak',
    icon: '🔥',
    points: 200
  },
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Scored above 80% in 10 tests',
    icon: '🎯',
    points: 300
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Completed test in half time',
    icon: '⚡',
    points: 250
  }
])

const shareTemplates = ref([
  {
    id: 1,
    icon: '🎉',
    title: 'Excited',
    preview: 'Just scored my highest ever!',
    message: '🎉 Just scored my highest ever in mock tests! Thanks to Mock Test Pro for the amazing practice platform. #MockTestPro #ExamPrep'
  },
  {
    id: 2,
    icon: '💪',
    title: 'Determined',
    preview: 'Working hard towards my goal!',
    message: '💪 Working hard towards my exam goal! 30-day study streak achieved. Every day counts! #MockTestPro #StudyMotivation'
  },
  {
    id: 3,
    icon: '🚀',
    title: 'Progress',
    preview: 'Great improvement this month!',
    message: '🚀 Great improvement this month! My accuracy went from 65% to 82%. Consistent practice pays off! #MockTestPro #Progress'
  },
  {
    id: 4,
    icon: '🏆',
    title: 'Achievement',
    preview: 'Unlocked a new achievement!',
    message: '🏆 Just unlocked the "Week Warrior" badge on Mock Test Pro! 7-day study streak complete! #Achievement #MockTestPro'
  },
  {
    id: 5,
    icon: '📚',
    title: 'Learning',
    preview: 'Learning something new every day!',
    message: '📚 Learning something new every day with Mock Test Pro. The detailed analytics help me improve constantly! #Learning #MockTestPro'
  },
  {
    id: 6,
    icon: '🎯',
    title: 'Focused',
    preview: 'Targeting excellence!',
    message: '🎯 Targeting excellence! Mastered 15 topics with 80%+ accuracy. The journey continues! #MockTestPro #GoalSetting'
  }
])

const recentShares = ref([
  {
    id: 1,
    icon: '🎉',
    message: 'Just scored 85% in SSC CGL mock test!',
    timeAgo: '2 hours ago'
  },
  {
    id: 2,
    icon: '🔥',
    message: '15-day study streak achieved! 🚀',
    timeAgo: '1 day ago'
  },
  {
    id: 3,
    icon: '🏆',
    message: 'Unlocked "High Scorer" achievement!',
    timeAgo: '3 days ago'
  }
])

const selectedAchievementData = computed(() => {
  return achievements.value.find(a => a.id === selectedAchievement.value)
})

const progressDisplay = computed(() => {
  switch (selectedProgressType.value) {
    case 'weekly':
      return { value: '12 tests', label: 'Tests this week', percentage: 80 }
    case 'monthly':
      return { value: '45 tests', label: 'Tests this month', percentage: 75 }
    case 'overall':
      return { value: '78%', label: 'Overall accuracy', percentage: 78 }
    case 'streak':
      return { value: '12 days', label: 'Current streak', percentage: 60 }
    default:
      return { value: '0', label: '', percentage: 0 }
  }
})

const shareAchievement = () => {
  if (!selectedAchievementData.value) return
  
  const achievement = selectedAchievementData.value
  shareContent.value = `🏆 Just unlocked "${achievement.name}" on Mock Test Pro! ${achievement.description} +${achievement.points} points #MockTestPro #Achievement`
  showShareModal.value = true
}

const shareProgress = () => {
  const progress = progressDisplay.value
  shareContent.value = `📈 My ${progress.label.toLowerCase()}: ${progress.value}! Making steady progress with Mock Test Pro. #MockTestPro #Progress`
  showShareModal.value = true
}

const shareCustomMessage = () => {
  if (!customMessage.value.trim()) return
  
  shareContent.value = `${customMessage.value} #MockTestPro`
  showShareModal.value = true
}

const generateMessage = () => {
  const templates = [
    "🎯 Just scored {{score}}% in my mock test! Practice makes perfect! #MockTestPro",
    "🔥 {{streak}}-day study streak achieved! Consistency is key! #MockTestPro #StudyMotivation",
    "📚 Mastered {{topics}} topics this week! Learning never stops! #MockTestPro",
    "⚡ Improved my speed by {{improvement}}%! Mock Test Pro really works! #MockTestPro"
  ]
  
  const template = templates[Math.floor(Math.random() * templates.length)]
  customMessage.value = template
    .replace('{{score}}', Math.floor(Math.random() * 30 + 70))
    .replace('{{streak}}', Math.floor(Math.random() * 20 + 5))
    .replace('{{topics}}', Math.floor(Math.random() * 10 + 3))
    .replace('{{improvement}}', Math.floor(Math.random() * 20 + 10))
}

const useTemplate = (template: ShareTemplate) => {
  customMessage.value = template.message
  shareContent.value = template.message
  showShareModal.value = true
}

const nativeShare = async () => {
  if (!navigator.share) return
  
  try {
    await navigator.share({
      title: 'Mock Test Pro Progress',
      text: shareContent.value,
      url: window.location.href
    })
    
    // Record share
    recordShare('native')
    showShareModal.value = false
  } catch (error) {
    console.error('Share failed:', error)
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareContent.value)
    
    // Record share
    recordShare('clipboard')
    showShareModal.value = false
    
    // Show success message
    alert('Copied to clipboard!')
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

const shareOnSocial = (platform: string) => {
  let url = ''
  const text = encodeURIComponent(shareContent.value)
  const currentUrl = encodeURIComponent(window.location.href)
  
  switch (platform) {
    case 'twitter':
      url = `https://twitter.com/intent/tweet?text=${text}&url=${currentUrl}`
      break
    case 'facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${text}`
      break
    case 'linkedin':
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}&summary=${text}`
      break
  }
  
  if (url) {
    window.open(url, '_blank', 'width=600,height=400')
    recordShare(platform)
    showShareModal.value = false
  }
}

const reshare = (share: ShareItem) => {
  shareContent.value = `${share.message} #MockTestPro`
  showShareModal.value = true
}

const copyShareLink = (share: ShareItem) => {
  const link = `${window.location.href}?share=${share.id}`
  navigator.clipboard.writeText(link).then(() => {
    alert('Share link copied!')
  })
}

const recordShare = (method: string) => {
  // Record share in localStorage for analytics
  const shares = JSON.parse(localStorage.getItem('shareHistory') || '[]')
  shares.push({
    id: Date.now(),
    method,
    content: shareContent.value,
    timestamp: new Date().toISOString()
  })
  localStorage.setItem('shareHistory', JSON.stringify(shares))
  
  // Add to recent shares
  recentShares.value.unshift({
    id: Date.now(),
    icon: '📤',
    message: shareContent.value.substring(0, 50) + '...',
    timeAgo: 'Just now'
  })
  
  if (recentShares.value.length > 5) {
    recentShares.value = recentShares.value.slice(0, 5)
  }
}
</script>
