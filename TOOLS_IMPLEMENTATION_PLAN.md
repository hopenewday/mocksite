# Tools & Features Implementation Plan

## 📋 Overview
This document outlines the implementation strategy for adding comprehensive tools and mock test features to the Mock Test Pro website with neo-brutalist design.

---

## 🏗️ Architecture Overview

### **Current Structure**
```
src/
├── components/          # Vue components
├── pages/              # Route pages
├── stores/             # Pinia stores
├── lib/                # Utilities
├── router/             # Vue Router config
└── assets/             # Static assets
```

### **New Structure**
```
src/
├── components/
│   ├── tools/          # Tool-specific components
│   │   ├── pdf/        # PDF tools
│   │   ├── image/      # Image tools
│   │   ├── calculator/ # Calculator tools
│   │   ├── text/       # Text tools
│   │   ├── datetime/   # Date/time tools
│   │   ├── qr/         # QR code tools
│   │   ├── color/      # Color tools
│   │   └── font/       # Font tools
│   ├── tests/          # Mock test components
│   │   ├── exam/       # Exam-specific
│   │   ├── analytics/  # Performance analytics
│   │   └── practice/   # Practice modes
│   └── common/         # Shared components
├── pages/
│   ├── tools/          # Tools pages
│   ├── tests/          # Enhanced test pages
│   └── dashboard/      # User dashboard
├── stores/
│   ├── tools/          # Tool state management
│   ├── tests/          # Enhanced test store
│   └── user/           # User data store
└── lib/
    ├── tools/          # Tool utilities
    ├── api/            # API integrations
    └── data/           # Static data
```

---

## 🛠️ Phase 1: Core Infrastructure

### **1. Navigation & Routing**
```javascript
// router/index.ts - New routes
{
  path: '/tools',
  name: 'tools',
  component: ToolsIndex,
  children: [
    { path: 'pdf', name: 'pdf-tools', component: PDFTools },
    { path: 'image', name: 'image-tools', component: ImageTools },
    { path: 'calculator', name: 'calculator-suite', component: CalculatorSuite },
    { path: 'text', name: 'text-tools', component: TextTools },
    { path: 'datetime', name: 'datetime-tools', component: DateTimeTools },
    { path: 'qr', name: 'qr-tools', component: QRTools },
    { path: 'color', name: 'color-tools', component: ColorTools },
    { path: 'font', name: 'font-tools', component: FontTools },
    { path: 'document', name: 'document-converters', component: DocumentConverters },
    { path: 'misc', name: 'misc-tools', component: MiscTools }
  ]
}
```

### **2. Neo-Brutalist Tool Components**
```vue
<!-- components/common/ToolCard.vue -->
<template>
  <div class="card card-brutal-cyan p-6 transform rotate-[-1deg] hover:rotate-0 transition-all">
    <div class="w-16 h-16 bg-brutal-yellow border-4 border-black shadow-brutal flex items-center justify-center mb-4">
      <span class="text-2xl">{{ icon }}</span>
    </div>
    <h3 class="subheading-brutal mb-2">{{ title }}</h3>
    <p class="text-brutal mb-4">{{ description }}</p>
    <router-link :to="link" class="btn-primary btn-primary-cyan w-full">
      {{ buttonText }}
    </router-link>
  </div>
</template>
```

---

## 📄 Phase 2: PDF Tools Implementation

### **Dependencies**
```bash
npm install pdf-lib jspdf html2canvas pdf2pic
```

### **PDF Tools Structure**
```vue
<!-- pages/tools/PDFTools.vue -->
<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-pink border-b-4 border-black shadow-brutal p-6">
      <h1 class="heading-brutal">PDF Tools</h1>
    </header>
    
    <div class="max-w-7xl mx-auto p-6">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Merge PDFs -->
        <ToolCard 
          icon="📋" 
          title="Merge PDFs" 
          description="Combine multiple PDFs into one"
          link="/tools/pdf/merge"
        />
        
        <!-- Split PDF -->
        <ToolCard 
          icon="✂️" 
          title="Split PDF" 
          description="Extract pages from PDFs"
          link="/tools/pdf/split"
        />
        
        <!-- Rotate PDF -->
        <ToolCard 
          icon="🔄" 
          title="Rotate PDF" 
          description="Rotate PDF pages"
          link="/tools/pdf/rotate"
        />
        
        <!-- Compress PDF -->
        <ToolCard 
          icon="🗜️" 
          title="Compress PDF" 
          description="Reduce PDF file size"
          link="/tools/pdf/compress"
        />
        
        <!-- Convert to PDF -->
        <ToolCard 
          icon="📄" 
          title="Convert to PDF" 
          description="Convert images, Word, Excel to PDF"
          link="/tools/pdf/convert"
        />
        
        <!-- PDF to Images -->
        <ToolCard 
          icon="🖼️" 
          title="PDF to Images" 
          description="Convert PDF pages to images"
          link="/tools/pdf/to-images"
        />
      </div>
    </div>
  </div>
</template>
```

### **PDF Merge Component**
```vue
<!-- components/tools/pdf/PDFMerger.vue -->
<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">Merge PDF Files</h2>
    
    <div class="space-y-4">
      <div 
        v-for="(file, index) in files" 
        :key="index"
        class="bg-brutal-white border-4 border-black p-4 flex items-center justify-between"
      >
        <span class="font-black">{{ file.name }}</span>
        <button @click="removeFile(index)" class="btn-primary btn-primary-pink">
          Remove
        </button>
      </div>
    </div>
    
    <input 
      type="file" 
      multiple 
      accept=".pdf"
      @change="handleFileSelect"
      class="input mb-6"
    />
    
    <button 
      @click="mergePDFs"
      :disabled="files.length < 2"
      class="btn-primary btn-primary-cyan w-full"
    >
      Merge PDFs
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PDFDocument } from 'pdf-lib'

const files = ref<File[]>([])

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    files.value = [...files.value, ...Array.from(target.files)]
  }
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

const mergePDFs = async () => {
  const mergedPdf = await PDFDocument.create()
  
  for (const file of files.value) {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    pages.forEach(page => mergedPdf.addPage(page))
  }
  
  const mergedPdfBytes = await mergedPdf.save()
  downloadBlob(mergedPdfBytes, 'merged.pdf')
}

const downloadBlob = (bytes: Uint8Array, filename: string) => {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>
```

---

## 🖼️ Phase 3: Image Tools Implementation

### **Dependencies**
```bash
npm install cropperjs file-saver
```

### **Image Tools Component**
```vue
<!-- components/tools/image/ImageConverter.vue -->
<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">Image Format Converter</h2>
    
    <div class="space-y-6">
      <div>
        <label class="font-black mb-2 block">Upload Image</label>
        <input 
          type="file" 
          accept="image/*"
          @change="handleImageSelect"
          class="input"
        />
      </div>
      
      <div v-if="previewImage">
        <img :src="previewImage" class="w-32 h-32 border-4 border-black" />
      </div>
      
      <div>
        <label class="font-black mb-2 block">Convert To</label>
        <select v-model="targetFormat" class="select">
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WebP</option>
        </select>
      </div>
      
      <button 
        @click="convertImage"
        :disabled="!selectedImage"
        class="btn-primary btn-primary-cyan w-full"
      >
        Convert Image
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedImage = ref<File | null>(null)
const previewImage = ref<string>('')
const targetFormat = ref('png')

const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedImage.value = target.files[0]
    previewImage.value = URL.createObjectURL(target.files[0])
  }
}

const convertImage = () => {
  if (!selectedImage.value) return
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    ctx?.drawImage(img, 0, 0)
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `converted.${targetFormat.value}`
        a.click()
        URL.revokeObjectURL(url)
      }
    }, `image/${targetFormat.value}`)
  }
  
  img.src = previewImage.value
}
</script>
```

---

## 🧮 Phase 4: Calculator Suite

### **Calculator Components**
```vue
<!-- components/tools/calculator/PercentageCalculator.vue -->
<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">Percentage Calculator</h2>
    
    <div class="space-y-6">
      <div>
        <label class="font-black mb-2 block">What is X% of Y?</label>
        <div class="flex gap-4">
          <input 
            v-model="x" 
            type="number" 
            placeholder="X"
            class="input flex-1"
          />
          <span class="font-black self-center">%</span>
          <input 
            v-model="y" 
            type="number" 
            placeholder="Y"
            class="input flex-1"
          />
        </div>
        <div v-if="result" class="mt-4 p-4 bg-brutal-cyan border-4 border-black">
          <span class="font-black text-xl">Result: {{ result }}</span>
        </div>
      </div>
      
      <div>
        <label class="font-black mb-2 block">X is what % of Y?</label>
        <div class="flex gap-4">
          <input 
            v-model="x2" 
            type="number" 
            placeholder="X"
            class="input flex-1"
          />
          <span class="font-black self-center">is</span>
          <input 
            v-model="y2" 
            type="number" 
            placeholder="Y"
            class="input flex-1"
          />
          <span class="font-black self-center">%</span>
        </div>
        <div v-if="result2" class="mt-4 p-4 bg-brutal-pink border-4 border-black">
          <span class="font-black text-xl">Result: {{ result2 }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const x = ref(0)
const y = ref(0)
const x2 = ref(0)
const y2 = ref(0)

const result = computed(() => {
  return (x.value * y.value) / 100
})

const result2 = computed(() => {
  return y2.value !== 0 ? (x2.value / y2.value) * 100 : 0
})
</script>
```

---

## 📝 Phase 5: Mock Tests Enhancement

### **Exam Categories**
```vue
<!-- pages/tests/ExamCategory.vue -->
<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6">
      <h1 class="heading-brutal">{{ category.name }}</h1>
      <p class="text-brutal mt-2">{{ category.description }}</p>
    </header>
    
    <div class="max-w-7xl mx-auto p-6">
      <!-- Subcategories -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          v-for="subcategory in category.subcategories"
          :key="subcategory.id"
          class="card card-brutal-lime p-6 transform rotate-[-1deg] hover:rotate-0"
        >
          <h3 class="subheading-brutal mb-2">{{ subcategory.name }}</h3>
          <p class="text-brutal mb-4">{{ subcategory.description }}</p>
          <router-link 
            :to="`/tests/${subcategory.id}`"
            class="btn-primary btn-primary-cyan w-full"
          >
            View Tests
          </router-link>
        </div>
      </div>
      
      <!-- Featured Tests -->
      <section>
        <h2 class="subheading-brutal mb-6">Featured Tests</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <TestCard 
            v-for="test in featuredTests"
            :key="test.id"
            :test="test"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const examCategories = {
  ssc: {
    name: 'SSC Exams',
    description: 'Staff Selection Commission Exams',
    subcategories: [
      { id: 'ssc-cgl', name: 'SSC CGL', description: 'Combined Graduate Level' },
      { id: 'ssc-chsl', name: 'SSC CHSL', description: 'Combined Higher Secondary' },
      { id: 'ssc-mts', name: 'SSC MTS', description: 'Multi Tasking Staff' }
    ]
  },
  banking: {
    name: 'Banking Exams',
    description: 'Banking Recruitment Exams',
    subcategories: [
      { id: 'ibps-po', name: 'IBPS PO', description: 'Probationary Officer' },
      { id: 'ibps-clerk', name: 'IBPS Clerk', description: 'Clerical Cadre' },
      { id: 'sbi-po', name: 'SBI PO', description: 'State Bank PO' }
    ]
  }
}

const category = computed(() => examCategories[route.params.category as string])
const featuredTests = ref([])
</script>
```

### **Performance Analytics**
```vue
<!-- components/tests/analytics/PerformanceAnalytics.vue -->
<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">Performance Analytics</h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Score Breakdown -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black mb-4">Score by Subject</h3>
        <div class="space-y-3">
          <div 
            v-for="subject in subjectScores"
            :key="subject.name"
            class="flex items-center justify-between"
          >
            <span class="font-bold">{{ subject.name }}</span>
            <div class="flex items-center gap-2">
              <div class="w-32 h-4 bg-brutal-gray border-2 border-black">
                <div 
                  class="h-full bg-brutal-lime"
                  :style="{ width: `${subject.percentage}%` }"
                ></div>
              </div>
              <span class="font-black">{{ subject.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Accuracy vs Speed -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black mb-4">Accuracy vs Speed</h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between mb-1">
              <span class="font-bold">Accuracy</span>
              <span class="font-black">{{ accuracy }}%</span>
            </div>
            <div class="w-full h-4 bg-brutal-gray border-2 border-black">
              <div 
                class="h-full bg-brutal-cyan"
                :style="{ width: `${accuracy}%` }"
              ></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span class="font-bold">Speed</span>
              <span class="font-black">{{ speed }} q/min</span>
            </div>
            <div class="w-full h-4 bg-brutal-gray border-2 border-black">
              <div 
                class="h-full bg-brutal-pink"
                :style="{ width: `${(speed / 2) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Rank Comparison -->
    <div class="bg-brutal-yellow border-4 border-black p-6">
      <h3 class="font-black mb-4">Rank Comparison</h3>
      <div class="text-center">
        <div class="text-4xl font-black mb-2">#{{ rank }}</div>
        <div class="font-bold">out of {{ totalUsers }} users</div>
        <div class="text-sm mt-2">Top {{ percentile }}% percentile</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const subjectScores = ref([
  { name: 'Quantitative Aptitude', percentage: 85 },
  { name: 'Reasoning Ability', percentage: 78 },
  { name: 'General Awareness', percentage: 92 },
  { name: 'English Language', percentage: 70 }
])

const accuracy = computed(() => 82)
const speed = computed(() => 1.4)
const rank = ref(342)
const totalUsers = ref(5420)
const percentile = computed(() => Math.round((1 - rank.value / totalUsers.value) * 100))
</script>
```

---

## 🎯 Phase 6: Gamification & Engagement

### **Leaderboard Component**
```vue
<!-- components/common/Leaderboard.vue -->
<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">Leaderboard</h2>
    
    <div class="space-y-3">
      <div 
        v-for="(user, index) in leaderboard"
        :key="user.id"
        class="flex items-center justify-between p-4 border-4 border-black"
        :class="index < 3 ? 'bg-brutal-lime/20' : 'bg-brutal-white'"
      >
        <div class="flex items-center gap-4">
          <div class="w-8 h-8 border-2 border-black flex items-center justify-center font-black">
            {{ index + 1 }}
          </div>
          <div>
            <div class="font-black">{{ user.name }}</div>
            <div class="text-sm font-bold">{{ user.badge }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-black text-lg">{{ user.score }}</div>
          <div class="text-sm font-bold">points</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const leaderboard = ref([
  { id: 1, name: 'Rahul Sharma', score: 2450, badge: '🔥 30-Day Streak' },
  { id: 2, name: 'Priya Patel', score: 2380, badge: '⭐ Top Performer' },
  { id: 3, name: 'Amit Kumar', score: 2290, badge: '🚀 Fast Learner' },
  { id: 4, name: 'Sneha Reddy', score: 2150, badge: '💪 Consistent' },
  { id: 5, name: 'Vikram Singh', score: 2080, badge: '📚 Bookworm' }
])
</script>
```

---

## 📱 Phase 7: Mobile Optimization

### **Mobile-First Components**
```vue
<!-- components/common/MobileToolCard.vue -->
<template>
  <div class="card card-brutal-cyan p-4 transform rotate-[-1deg] hover:rotate-0">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 bg-brutal-yellow border-4 border-black shadow-brutal flex items-center justify-center flex-shrink-0">
        <span class="text-xl">{{ icon }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-black text-lg mb-1">{{ title }}</h3>
        <p class="text-sm font-bold text-brutal-gray truncate">{{ description }}</p>
      </div>
      <div class="w-8 h-8 bg-brutal-pink border-4 border-black shadow-brutal flex items-center justify-center">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>
```

---

## 🗄️ Phase 8: Data Management

### **Mock Data Structure**
```typescript
// lib/data/examData.ts
export interface Exam {
  id: string
  name: string
  description: string
  category: string
  subcategory: string
  duration: number
  questions: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  isPremium: boolean
}

export interface Question {
  id: string
  examId: string
  type: 'mcq' | 'tf' | 'fib'
  category: string
  difficulty: string
  content: {
    en: string
    hi?: string
  }
  options?: string[]
  correctAnswer: number | string
  explanation: {
    en: string
    hi?: string
  }
  previousYear?: number
}

export const mockExams: Exam[] = [
  {
    id: 'ssc-cgl-2024-mock1',
    name: 'SSC CGL Mock Test 1',
    description: 'Full length mock test for SSC CGL Tier 1',
    category: 'ssc',
    subcategory: 'cgl',
    duration: 60,
    questions: 100,
    difficulty: 'Medium',
    tags: ['mock', 'tier1', 'full-length'],
    isPremium: false
  },
  // ... more exams
]

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    examId: 'ssc-cgl-2024-mock1',
    type: 'mcq',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    content: {
      en: 'What is the value of 25% of 200?',
      hi: '200 का 25% मान क्या है?'
    },
    options: ['40', '50', '60', '80'],
    correctAnswer: 1,
    explanation: {
      en: '25% of 200 = (25/100) × 200 = 50',
      hi: '200 का 25% = (25/100) × 200 = 50'
    }
  },
  // ... more questions
]
```

---

## 🔧 Phase 9: API Integrations

### **Weather API Integration**
```vue
<!-- components/tools/WeatherWidget.vue -->
<template>
  <div class="card card-brutal-cyan p-6">
    <h2 class="subheading-brutal mb-4">Weather Widget</h2>
    
    <div class="space-y-4">
      <input 
        v-model="city"
        type="text"
        placeholder="Enter city name"
        class="input"
        @keyup.enter="fetchWeather"
      />
      
      <button 
        @click="fetchWeather"
        class="btn-primary btn-primary-pink w-full"
      >
        Get Weather
      </button>
      
      <div v-if="weather" class="bg-brutal-yellow border-4 border-black p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-black text-lg">{{ weather.name }}</div>
            <div class="text-2xl font-black">{{ weather.main.temp }}°C</div>
          </div>
          <div class="text-4xl">
            {{ getWeatherIcon(weather.weather[0].main) }}
          </div>
        </div>
        <div class="mt-2 text-sm font-bold">
          {{ weather.weather[0].description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const city = ref('Delhi')
const weather = ref(null)

const fetchWeather = async () => {
  try {
    const apiKey = 'your-openweather-api-key'
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=metric`
    )
    weather.value = await response.json()
  } catch (error) {
    console.error('Weather fetch error:', error)
  }
}

const getWeatherIcon = (condition: string) => {
  const icons: Record<string, string> = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Snow': '❄️',
    'Thunderstorm': '⛈️',
    'Drizzle': '🌦️',
    'Mist': '🌫️'
  }
  return icons[condition] || '🌡️'
}
</script>
```

---

## 💰 Phase 10: Monetization Strategy

### **Premium Features Component**
```vue
<!-- components/common/PremiumBanner.vue -->
<template>
  <div class="bg-brutal-pink border-4 border-black shadow-brutal p-6 transform rotate-[1deg]">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-black text-xl mb-2">👑 Go Premium</h3>
        <p class="font-bold">Unlock all mock tests and features</p>
        <ul class="mt-4 space-y-2 text-sm font-bold">
          <li>✅ 1000+ mock tests</li>
          <li>✅ Detailed analytics</li>
          <li>✅ Previous year papers</li>
          <li>✅ Ad-free experience</li>
        </ul>
      </div>
      <button class="btn-primary btn-primary-yellow px-6 py-3">
        Upgrade Now
      </button>
    </div>
  </div>
</template>
```

---

## 📚 Implementation Timeline

### **Week 1-2: Foundation**
- Set up routing structure
- Create base components
- Implement neo-brutalist design system
- Set up state management

### **Week 3-4: Core Tools**
- PDF tools (merge, split, rotate, compress)
- Image tools (converter, cropper)
- Calculator suite
- Text tools

### **Week 5-6: Mock Tests**
- Exam categorization
- Performance analytics
- Leaderboard system
- Daily quizzes

### **Week 7-8: Advanced Features**
- QR code tools
- Color tools
- Font tools
- API integrations

### **Week 9-10: Polish & Launch**
- Mobile optimization
- Premium features
- Testing & bug fixes
- Performance optimization

---

## 🎨 Design Guidelines

### **Neo-Brutalist Principles**
1. **Bold Borders**: 4px minimum border width
2. **Strong Shadows**: Multiple shadow levels
3. **Vibrant Colors**: Yellow, pink, cyan, lime, purple
4. **Rotated Elements**: Subtle rotations (-2deg to +2deg)
5. **Bold Typography**: Font-black, uppercase text
6. **High Contrast**: Black borders on bright backgrounds

### **Component Patterns**
```css
.tool-card {
  @apply card border-4 border-black shadow-brutal transform rotate-[-1deg] hover:rotate-0;
}

.tool-header {
  @apply subheading-brutal mb-6;
}

.tool-button {
  @apply btn-primary btn-primary-cyan w-full font-black uppercase;
}
```

---

## 🚀 Performance Considerations

### **Code Splitting**
```javascript
// router/index.ts
const ToolsIndex = () => import('@/pages/tools/ToolsIndex.vue')
const PDFTools = () => import('@/pages/tools/PDFTools.vue')
const ImageTools = () => import('@/pages/tools/ImageTools.vue')
```

### **Lazy Loading**
```vue
<!-- Heavy components -->
<template>
  <Suspense>
    <template #default>
      <HeavyToolComponent />
    </template>
    <template #fallback>
      <div class="animate-pulse bg-brutal-gray h-64"></div>
    </template>
  </Suspense>
</template>
```

### **Image Optimization**
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
```

---

## 📊 Analytics & Tracking

### **User Events**
```typescript
// lib/analytics.ts
export const trackToolUsage = (toolName: string, action: string) => {
  // Implement analytics tracking
  console.log(`Tool: ${toolName}, Action: ${action}`)
}

export const trackTestPerformance = (testId: string, score: number, time: number) => {
  // Track test performance
  console.log(`Test: ${testId}, Score: ${score}, Time: ${time}`)
}
```

---

## 🔒 Security Considerations

### **File Upload Security**
```typescript
// lib/fileSecurity.ts
export const validateFileUpload = (file: File, allowedTypes: string[]) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) throw new Error('File too large')
  if (!allowedTypes.includes(file.type)) throw new Error('Invalid file type')
  return true
}
```

### **XSS Prevention**
```typescript
// lib/sanitize.ts
export const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}
```

---

## 📱 Mobile Responsiveness

### **Breakpoints**
```css
/* Tailwind config */
screens: {
  'xs': '475px',
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px'
}
```

### **Touch-Friendly Design**
- Minimum 44px touch targets
- Adequate spacing between elements
- Swipe gestures for navigation
- Haptic feedback support

---

This comprehensive implementation plan provides a roadmap for transforming your mock test website into a full-featured learning platform with neo-brutalist design. The modular approach allows for incremental development while maintaining consistency in design and user experience.
