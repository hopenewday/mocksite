<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Twitter Thread Formatter
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Split long text into Twitter threads with numbering and formatting.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div class="space-y-6">
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Input Text
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="font-black block mb-2">Long Text</label>
                <textarea 
                  v-model="inputText" 
                  rows="12" 
                  class="input-brutal w-full"
                  placeholder="Paste your long text here to split into a Twitter thread..."
                />
                <div class="flex justify-between text-sm mt-1">
                  <span class="font-black">{{ inputText.length }} characters</span>
                  <span class="text-gray-600">{{ Math.ceil(inputText.length / 280) }} tweets needed</span>
                </div>
              </div>
              
              <div class="flex gap-2">
                <button 
                  class="btn-primary btn-primary-yellow flex-1"
                  :disabled="!inputText.trim()"
                  @click="splitIntoThread"
                >
                  Split into Thread
                </button>
                <button 
                  class="btn-primary btn-primary-pink flex-1"
                  :disabled="tweets.length === 0"
                  @click="clearAll"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <!-- Settings -->
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Thread Settings
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="inline-flex items-center gap-2">
                  <input
                    v-model="includeNumbering"
                    type="checkbox"
                  >
                  <span class="font-black">Include tweet numbering (1/n)</span>
                </label>
              </div>
              
              <div>
                <label class="inline-flex items-center gap-2">
                  <input
                    v-model="autoSplit"
                    type="checkbox"
                  >
                  <span class="font-black">Auto-split on word boundaries</span>
                </label>
              </div>
              
              <div>
                <label class="font-black block mb-2">Max Characters per Tweet</label>
                <input 
                  v-model.number="maxCharacters" 
                  type="number" 
                  min="50" 
                  max="280" 
                  class="input-brutal w-full"
                >
                <p class="text-sm text-gray-600 mt-1">
                  Twitter limit is 280 characters
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Quick Actions
            </h2>
            
            <div class="flex gap-2">
              <button 
                class="btn-primary btn-primary-lime flex-1"
                @click="loadSample"
              >
                Load Sample
              </button>
              <button 
                class="btn-primary btn-primary-yellow flex-1"
                :disabled="tweets.length >= 25"
                @click="addEmptyTweet"
              >
                Add Tweet
              </button>
            </div>
          </div>
        </div>

        <!-- Thread Output -->
        <div class="space-y-6">
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="subheading-brutal">
                Twitter Thread
              </h2>
              <div class="text-sm font-black">
                {{ tweets.length }} tweets
              </div>
            </div>
            
            <div
              v-if="tweets.length > 0"
              class="space-y-4"
            >
              <div 
                v-for="(tweet, index) in tweets" 
                :key="tweet.id"
                class="border-4 border-black p-4 bg-white relative group"
                :class="{ 'opacity-50': dragIndex === index }"
                draggable="true"
                @dragstart="onDragStart(index)"
                @dragover.prevent
                @drop="onDrop(index)"
              >
                <!-- Drag Handle -->
                <div class="absolute top-2 left-2 text-gray-400 cursor-move">
                  ⋮⋮
                </div>
                
                <!-- Tweet Number -->
                <div class="absolute top-2 right-2 flex gap-1">
                  <span class="text-xs bg-brutal-cyan px-2 py-1 border-2 border-black">
                    {{ index + 1 }}/{{ tweets.length }}
                  </span>
                  <button 
                    class="btn-primary btn-primary-pink text-xs w-6 h-6 p-0"
                    :disabled="tweets.length <= 1"
                    @click="removeTweet(index)"
                  >
                    ×
                  </button>
                </div>
                
                <!-- Tweet Content -->
                <div class="mt-6">
                  <textarea 
                    v-model="tweet.content" 
                    rows="4" 
                    class="input-brutal w-full text-sm"
                    :placeholder="`Tweet ${index + 1} content...`"
                    @input="updateTweet(index)"
                  />
                  
                  <div class="flex justify-between items-center mt-2">
                    <span 
                      class="text-sm font-black"
                      :class="tweet.content.length > maxCharacters ? 'text-red-600' : 'text-gray-600'"
                    >
                      {{ tweet.content.length }}/{{ maxCharacters }} characters
                    </span>
                    <button 
                      class="btn-primary btn-primary-lime text-xs"
                      :disabled="!tweet.content.trim()"
                      :class="{ 'animate-copy-bounce': copiedIndex === index }"
                      @click="copySingleTweet(index)"
                    >
                      Copy Tweet
                    </button>
                  </div>
                  
                  <div
                    v-if="tweet.content.length > maxCharacters"
                    class="mt-2 p-2 bg-red-100 border-2 border-red-500 text-red-800"
                  >
                    <p class="text-sm font-black">
                      ⚠️ This tweet exceeds the character limit!
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Thread Actions -->
              <div class="flex gap-2 pt-4 border-t-4 border-black">
                <button 
                  class="btn-primary btn-primary-lime flex-1"
                  :disabled="tweets.length === 0"
                  :class="{ 'animate-copy-bounce': copyingAll }"
                  @click="copyAllTweets"
                >
                  Copy All Tweets
                </button>
                <button 
                  class="btn-primary btn-primary-yellow flex-1"
                  :disabled="tweets.length === 0"
                  @click="copyAsThread"
                >
                  Copy as Thread
                </button>
              </div>
            </div>
            
            <div
              v-else
              class="text-center py-8 text-gray-600"
            >
              <div class="text-4xl mb-4">
                🧵
              </div>
              <p>Your Twitter thread will appear here</p>
            </div>
          </div>

          <!-- Thread Stats -->
          <div
            v-if="tweets.length > 0"
            class="card-brutal-white dark:card-brutal-black border-4 border-black p-6"
          >
            <h3 class="font-black mb-4">
              Thread Statistics
            </h3>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="p-3 bg-brutal-cyan border-2 border-black text-center">
                <div class="font-black text-2xl">
                  {{ tweets.length }}
                </div>
                <div>Total Tweets</div>
              </div>
              <div class="p-3 bg-brutal-lime border-2 border-black text-center">
                <div class="font-black text-2xl">
                  {{ getTotalCharacters() }}
                </div>
                <div>Total Characters</div>
              </div>
              <div class="p-3 bg-brutal-pink border-2 border-black text-center">
                <div class="font-black text-2xl">
                  {{ getAverageLength() }}
                </div>
                <div>Avg per Tweet</div>
              </div>
              <div class="p-3 bg-brutal-yellow border-2 border-black text-center">
                <div class="font-black text-2xl">
                  {{ getLongestTweet() }}
                </div>
                <div>Longest Tweet</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'

useHead({
  title: 'Twitter Thread Formatter - Free Online Tool',
  meta: [
    { name: 'description', content: 'Split long text into Twitter threads with numbering and formatting. Free online Twitter thread formatter.' },
    { property: 'og:title', content: 'Twitter Thread Formatter' },
    { property: 'og:description', content: 'Split long text into Twitter threads with numbering and formatting.' }
  ]
})

const inputText = ref('')
const includeNumbering = ref(true)
const autoSplit = ref(true)
const maxCharacters = ref(280)
const tweets = ref<Array<{ id: string; content: string }>>([])
const dragIndex = ref<number | null>(null)

const { copyWithFeedback, isCopying: copyingAll } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

let tweetIdCounter = 0
let copiedIndex = ref<number | null>(null)

const generateId = (): string => {
  return `tweet-${++tweetIdCounter}`
}

const splitIntoThread = () => {
  if (!inputText.value.trim()) return
  
  tweets.value = []
  let text = inputText.value.trim()
  
  // Split text into chunks
  if (autoSplit.value) {
    // Auto-split on word boundaries
    const words = text.split(/\s+/)
    let currentTweet = ''
    
    for (const word of words) {
      const potentialTweet = currentTweet + (currentTweet ? ' ' : '') + word
      const tweetWithNumber = includeNumbering.value ? 
        `${potentialTweet} (1/1)` : potentialTweet
      
      if (tweetWithNumber.length <= maxCharacters.value) {
        currentTweet = potentialTweet
      } else {
        if (currentTweet) {
          tweets.value.push({
            id: generateId(),
            content: currentTweet
          })
        }
        currentTweet = word
      }
    }
    
    if (currentTweet) {
      tweets.value.push({
        id: generateId(),
        content: currentTweet
      })
    }
  } else {
    // Manual chunking
    const chunks = []
    for (let i = 0; i < text.length; i += maxCharacters.value - 50) { // Reserve space for numbering
      chunks.push(text.slice(i, i + maxCharacters.value - 50))
    }
    
    chunks.forEach(chunk => {
      tweets.value.push({
        id: generateId(),
        content: chunk
      })
    })
  }
  
  // Add numbering if enabled
  if (includeNumbering.value) {
    const totalTweets = tweets.value.length
    tweets.value = tweets.value.map((tweet, index) => ({
      ...tweet,
      content: `${tweet.content.trim()} (${index + 1}/${totalTweets})`
    }))
  }
  
  if (tweets.value.length > 0) {
    celebrateFirstUse('twitter-thread')
  }
}

const updateTweet = (index: number) => {
  // Auto-update numbering if enabled
  if (includeNumbering.value) {
    const totalTweets = tweets.value.length
    const content = tweets.value[index].content.replace(/\s*\(\d+\/\d+\)\s*$/, '')
    tweets.value[index].content = `${content.trim()} (${index + 1}/${totalTweets})`
  }
}

const addEmptyTweet = () => {
  if (tweets.value.length >= 25) return
  
  const newTweet = {
    id: generateId(),
    content: includeNumbering.value ? 
      `(Tweet content...) (${tweets.value.length + 1}/${tweets.value.length + 1})` : 
      'Tweet content...'
  }
  
  tweets.value.push(newTweet)
}

const removeTweet = (index: number) => {
  if (tweets.value.length <= 1) return
  
  tweets.value.splice(index, 1)
  
  // Re-number if enabled
  if (includeNumbering.value) {
    const totalTweets = tweets.value.length
    tweets.value = tweets.value.map((tweet, i) => {
      const content = tweet.content.replace(/\s*\(\d+\/\d+\)\s*$/, '')
      return {
        ...tweet,
        content: `${content.trim()} (${i + 1}/${totalTweets})`
      }
    })
  }
}

const onDragStart = (index: number) => {
  dragIndex.value = index
}

const onDrop = (dropIndex: number) => {
  if (dragIndex.value === null || dragIndex.value === dropIndex) return
  
  const draggedTweet = tweets.value[dragIndex.value]
  tweets.value.splice(dragIndex.value, 1)
  tweets.value.splice(dropIndex, 0, draggedTweet)
  
  // Re-number if enabled
  if (includeNumbering.value) {
    const totalTweets = tweets.value.length
    tweets.value = tweets.value.map((tweet, i) => {
      const content = tweet.content.replace(/\s*\(\d+\/\d+\)\s*$/, '')
      return {
        ...tweet,
        content: `${content.trim()} (${i + 1}/${totalTweets})`
      }
    })
  }
  
  dragIndex.value = null
}

const copySingleTweet = async (index: number) => {
  if (!tweets.value[index].content.trim()) return
  
  copiedIndex.value = index
  setTimeout(() => {
    copiedIndex.value = null
  }, 1000)
  
  await copyWithFeedback(tweets.value[index].content.trim())
}

const copyAllTweets = async () => {
  if (tweets.value.length === 0) return
  
  const allTweets = tweets.value.map(tweet => tweet.content.trim()).join('\n\n')
  await copyWithFeedback(allTweets)
}

const copyAsThread = async () => {
  if (tweets.value.length === 0) return
  
  const threadText = tweets.value.map((tweet, index) => 
    `${index + 1}/${tweets.value.length}\n${tweet.content.replace(/\s*\(\d+\/\d+\)\s*$/, '').trim()}`
  ).join('\n\n')
  
  await copyWithFeedback(threadText)
}

const loadSample = () => {
  inputText.value = `🚀 Just finished building an amazing new feature for our app! 

Here's what I learned during this journey:

1. User feedback is everything. We iterated based on real user pain points and it made all the difference.

2. Performance matters more than you think. A 0.5 second improvement in load time increased our conversion by 15%.

3. Testing is not optional. We caught 23 bugs in QA that would have been disasters in production.

4. Team collaboration is key. Daily standups and clear communication prevented scope creep.

5. Documentation saves time. Future you will thank present you for good docs.

The feature launches next week and I'm excited to see how users respond! 

What's the best feature you've built recently? Drop your thoughts below! 👇`
  
  splitIntoThread()
}

const clearAll = () => {
  inputText.value = ''
  tweets.value = []
}

const getTotalCharacters = (): number => {
  return tweets.value.reduce((total, tweet) => total + tweet.content.length, 0)
}

const getAverageLength = (): number => {
  if (tweets.value.length === 0) return 0
  return Math.round(getTotalCharacters() / tweets.value.length)
}

const getLongestTweet = (): number => {
  if (tweets.value.length === 0) return 0
  return Math.max(...tweets.value.map(tweet => tweet.content.length))
}
</script>

