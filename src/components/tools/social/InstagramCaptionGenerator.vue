<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Instagram Caption Generator
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Generate engaging Instagram captions with hashtags and emojis.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Input & Settings -->
        <div class="space-y-6">
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Caption Content
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="font-black block mb-2">Main Text</label>
                <textarea 
                  v-model="captionText" 
                  rows="6" 
                  class="input-brutal w-full"
                  placeholder="Write your caption text here..."
                />
                <div class="flex justify-between text-sm mt-1">
                  <span class="font-black">{{ captionText.length }} / 2200 characters</span>
                  <span 
                    :class="captionText.length > 2200 ? 'text-red-600' : 'text-gray-600'"
                  >
                    {{ captionText.length > 2200 ? 'Too long!' : 'OK' }}
                  </span>
                </div>
              </div>
              
              <div>
                <label class="font-black block mb-2">Keywords (for hashtag generation)</label>
                <input 
                  v-model="keywords" 
                  type="text" 
                  class="input-brutal w-full"
                  placeholder="travel, food, fitness, fashion..."
                >
                <p class="text-sm text-gray-600 mt-1">
                  Separate keywords with commas
                </p>
              </div>
              
              <div>
                <label class="font-black block mb-2">Caption Style</label>
                <select
                  v-model="style"
                  class="input-brutal w-full"
                >
                  <option value="casual">
                    Casual & Fun
                  </option>
                  <option value="professional">
                    Professional
                  </option>
                  <option value="inspiring">
                    Inspiring
                  </option>
                  <option value="humorous">
                    Humorous
                  </option>
                  <option value="motivational">
                    Motivational
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Hashtag Categories -->
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Hashtag Categories
            </h2>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button 
                v-for="category in hashtagCategories" 
                :key="category.name"
                class="btn-primary text-sm"
                :class="selectedCategories.includes(category.name) ? 'bg-brutal-cyan' : 'bg-brutal-white'"
                @click="toggleCategory(category.name)"
              >
                {{ category.name }}
                <div class="text-xs">
                  ({{ category.hashtags.length }})
                </div>
              </button>
            </div>
          </div>

          <!-- Settings -->
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Settings
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="font-black block mb-2">Number of Hashtags</label>
                <select
                  v-model.number="hashtagCount"
                  class="input-brutal w-full"
                >
                  <option :value="5">
                    5 hashtags
                  </option>
                  <option :value="10">
                    10 hashtags
                  </option>
                  <option :value="15">
                    15 hashtags
                  </option>
                  <option :value="20">
                    20 hashtags
                  </option>
                  <option :value="30">
                    30 hashtags
                  </option>
                </select>
              </div>
              
              <div>
                <label class="font-black block mb-2">Include Emojis</label>
                <select
                  v-model="emojiStyle"
                  class="input-brutal w-full"
                >
                  <option value="none">
                    No emojis
                  </option>
                  <option value="few">
                    Few emojis
                  </option>
                  <option value="moderate">
                    Moderate emojis
                  </option>
                  <option value="many">
                    Many emojis
                  </option>
                </select>
              </div>
              
              <div>
                <label class="inline-flex items-center gap-2">
                  <input
                    v-model="includeTrending"
                    type="checkbox"
                  >
                  <span class="font-black">Include trending hashtags</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button 
              class="btn-primary btn-primary-yellow flex-1"
              @click="generateCaption"
            >
              Generate Caption
            </button>
            <button 
              class="btn-primary btn-primary-lime flex-1"
              :disabled="!generatedCaption"
              @click="addEmojis"
            >
              Add Emojis
            </button>
          </div>
        </div>

        <!-- Output -->
        <div class="space-y-6">
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Generated Caption
            </h2>
            
            <div v-if="generatedCaption">
              <div class="p-4 bg-white border-4 border-black mb-4">
                <div class="whitespace-pre-wrap">
                  {{ generatedCaption }}
                </div>
              </div>
              
              <div class="flex gap-2">
                <button 
                  class="btn-primary btn-primary-lime flex-1"
                  :class="{ 'animate-copy-bounce': copyingCaption }"
                  @click="copyCaption"
                >
                  Copy Caption
                </button>
                <button 
                  class="btn-primary btn-primary-pink"
                  @click="clearAll"
                >
                  Clear
                </button>
              </div>
              
              <div class="mt-4 p-3 bg-brutal-lime border-2 border-black">
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>Characters:</strong> {{ generatedCaption.length }}
                  </div>
                  <div>
                    <strong>Hashtags:</strong> {{ getHashtagCount() }}
                  </div>
                  <div>
                    <strong>Emojis:</strong> {{ getEmojiCount() }}
                  </div>
                  <div>
                    <strong>Words:</strong> {{ generatedCaption.split(/\s+/).length }}
                  </div>
                </div>
              </div>
            </div>
            
            <div
              v-else
              class="text-center py-8 text-gray-600"
            >
              <div class="text-4xl mb-4">
                📝
              </div>
              <p>Your generated caption will appear here</p>
            </div>
          </div>

          <!-- Templates -->
          <div class="card-brutal-white dark:card-brutal-black border-4 border-black p-6">
            <h2 class="subheading-brutal mb-4">
              Caption Templates
            </h2>
            
            <div class="space-y-2">
              <button 
                v-for="template in templates" 
                :key="template.name"
                class="btn-primary btn-primary-white w-full text-left text-sm"
                @click="loadTemplate(template)"
              >
                {{ template.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'

useHead({
  title: 'Instagram Caption Generator - Free Online Tool',
  meta: [
    { name: 'description', content: 'Generate engaging Instagram captions with hashtags and emojis. Free online Instagram caption generator.' },
    { property: 'og:title', content: 'Instagram Caption Generator' },
    { property: 'og:description', content: 'Generate engaging Instagram captions with hashtags and emojis.' }
  ]
})

const captionText = ref('')
const keywords = ref('')
const style = ref('casual')
const emojiStyle = ref('moderate')
const includeTrending = ref(true)
const hashtagCount = ref(15)
const selectedCategories = ref<string[]>([])
const generatedCaption = ref('')

const { copyWithFeedback, isCopying: copyingCaption } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

const hashtagCategories = [
  {
    name: 'Travel',
    hashtags: ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation', '#travelgram', '#instatravel', '#travelphotography', '#beautifuldestinations', '#traveladdict']
  },
  {
    name: 'Food',
    hashtags: ['#food', '#foodie', '#yum', '#delicious', '#foodstagram', '#instafood', '#foodphotography', '#dinner', '#lunch', '#breakfast']
  },
  {
    name: 'Fitness',
    hashtags: ['#fitness', '#workout', '#gym', '#fit', '#health', '#exercise', '#fitnessmotivation', '#fitlife', '#healthy', '#training']
  },
  {
    name: 'Fashion',
    hashtags: ['#fashion', '#style', '#ootd', '#outfit', '#fashionista', '#instafashion', '#fashionblogger', '#streetstyle', '#mensfashion', '#womensfashion']
  },
  {
    name: 'Nature',
    hashtags: ['#nature', '#beautiful', '#landscape', '#outdoors', '#natural', '#wildlife', '#scenic', '#mountains', '#beach', '#sunset']
  },
  {
    name: 'Business',
    hashtags: ['#business', '#entrepreneur', '#success', '#motivation', '#goals', '#hustle', '#startup', '#leadership', '#inspiration', '#mindset']
  },
  {
    name: 'Lifestyle',
    hashtags: ['#lifestyle', '#life', '#motivation', '#inspiration', '#selfcare', '#happiness', '#positivity', '#grateful', '#mindfulness', '#wellness']
  },
  {
    name: 'Art',
    hashtags: ['#art', '#artist', '#creative', '#design', '#drawing', '#painting', '#illustration', '#digitalart', '#artwork', '#creative']
  },
  {
    name: 'Technology',
    hashtags: ['#tech', '#technology', '#innovation', '#digital', '#gadgets', '#software', '#programming', '#coding', '#ai', '#future']
  }
]

const trendingHashtags = [
  '#trending', '#viral', '#reels', '#explore', '#instagood', '#photooftheday', '#picoftheday', '#bestoftheday', '#instadaily'
]

const templates = [
  {
    name: 'Travel Adventure',
    text: "Just had the most incredible adventure! 🗺️✨ Every moment was magical and I'm already planning my next destination. Who else loves exploring new places? 🌍"
  },
  {
    name: 'Fitness Motivation',
    text: "Another workout in the books! 💪 Nothing beats that post-gym feeling. Remember, progress over perfection. What's your favorite way to stay active? 🏃‍♀️"
  },
  {
    name: 'Foodie Moment',
    text: "This looks absolutely delicious! 😍 Sometimes the best moments are shared over good food with great people. What's your favorite comfort food? 🍕"
  },
  {
    name: 'Monday Motivation',
    text: "Starting the week with intention and positive energy! 🌟 Remember, you have the power to make this week amazing. What are you most excited about? 💪"
  },
  {
    name: 'Grateful Sunday',
    text: "Feeling so grateful for this beautiful day and all the blessings in my life 🙏 Sometimes we just need to pause and appreciate the simple things. What are you grateful for today?"
  }
]

const toggleCategory = (categoryName: string) => {
  const index = selectedCategories.value.indexOf(categoryName)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(categoryName)
  }
}

const generateCaption = () => {
  let caption = captionText.value
  
  // Add hashtags based on selected categories and keywords
  let hashtags: string[] = []
  
  // Get hashtags from selected categories
  selectedCategories.value.forEach(catName => {
    const category = hashtagCategories.find(cat => cat.name === catName)
    if (category) {
      hashtags.push(...category.hashtags.slice(0, 3))
    }
  })
  
  // Add keyword-based hashtags
  if (keywords.value) {
    const keywordTags = keywords.value
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k)
      .map(k => `#${k.replace(/\s+/g, '')}`)
    hashtags.push(...keywordTags)
  }
  
  // Add trending hashtags if enabled
  if (includeTrending.value) {
    hashtags.push(...trendingHashtags.slice(0, 3))
  }
  
  // Remove duplicates and limit count
  hashtags = [...new Set(hashtags)].slice(0, hashtagCount.value)
  
  // Add line break before hashtags
  if (hashtags.length > 0) {
    caption += '\n\n' + hashtags.join(' ')
  }
  
  generatedCaption.value = caption
  
  if (generatedCaption.value) {
    celebrateFirstUse('instagram-caption')
  }
}

const addEmojis = () => {
  const emojiSets: Record<string, string[]> = {
    casual: ['😄', '😍', '🔥', '💯', '✨', '🌟', '💫', '🎉', '🥳', '🤩'],
    professional: ['💼', '📈', '🎯', '💡', '🏆', '🚀', '⭐', '💪', '🎊', '👏'],
    inspiring: ['🌟', '✨', '💫', '🚀', '💪', '🎯', '🏆', '💎', '🔥', '💡'],
    humorous: ['😄', '😂', '🤣', '😜', '🤪', '😝', '🤗', '😋', '😎', '🤩'],
    motivational: ['💪', '🔥', '💯', '⭐', '🚀', '🎯', '🏆', '🌟', '✨', '💎']
  }
  
  const emojis = emojiSets[style.value] || emojiSets.casual
  const emojiCount = emojiStyle.value === 'few' ? 2 : 
                    emojiStyle.value === 'moderate' ? 4 : 
                    emojiStyle.value === 'many' ? 6 : 0
  
  if (emojiCount > 0) {
    const selectedEmojis = emojis.slice(0, emojiCount)
    generatedCaption.value += ' ' + selectedEmojis.join(' ')
  }
}

const loadTemplate = (template: typeof templates[0]) => {
  captionText.value = template.text
  generatedCaption.value = ''
}

const copyCaption = async () => {
  if (!generatedCaption.value) return
  await copyWithFeedback(generatedCaption.value)
}

const clearAll = () => {
  captionText.value = ''
  keywords.value = ''
  generatedCaption.value = ''
  selectedCategories.value = []
}

const getHashtagCount = (): number => {
  if (!generatedCaption.value) return 0
  return (generatedCaption.value.match(/#\w+/g) || []).length
}

const getEmojiCount = (): number => {
  if (!generatedCaption.value) return 0
  return (generatedCaption.value.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) || []).length
}
</script>

<style scoped>
.input-brutal { @apply w-full p-3 border-4 border-black bg-white dark:bg-brutal-black text-black dark:text-white; }
.btn-primary { @apply px-4 py-2 border-4 border-black shadow-brutal font-black; }
.btn-primary-yellow { @apply bg-brutal-yellow; }
.btn-primary-lime { @apply bg-brutal-lime; }
.btn-primary-pink { @apply bg-brutal-pink; }
.btn-primary-white { @apply bg-white; }
.card-brutal-white { @apply bg-brutal-white; }
.card-brutal-black { @apply bg-brutal-black; }
</style>
