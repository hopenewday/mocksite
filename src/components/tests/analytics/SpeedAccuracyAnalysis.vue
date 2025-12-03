<template>
  <div class="card card-brutal-purple p-8">
    <h2 class="subheading-brutal mb-6">
      Speed vs Accuracy Trade-offs
    </h2>
    
    <!-- Overall Performance Metrics -->
    <div class="grid md:grid-cols-4 gap-4 mb-8">
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-cyan">
          {{ overallAccuracy }}%
        </div>
        <div class="text-sm font-bold">
          Accuracy
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-pink">
          {{ averageSpeed }}
        </div>
        <div class="text-sm font-bold">
          Avg Speed (q/min)
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-lime">
          {{ efficiencyScore }}
        </div>
        <div class="text-sm font-bold">
          Efficiency Score
        </div>
      </div>
      
      <div class="bg-brutal-white border-4 border-black p-4 text-center">
        <div class="text-2xl font-black text-brutal-yellow">
          {{ optimalZone }}%
        </div>
        <div class="text-sm font-bold">
          Optimal Zone
        </div>
      </div>
    </div>
    
    <!-- Speed-Accuracy Scatter Plot -->
    <div class="bg-brutal-cyan border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Speed-Accuracy Distribution
      </h3>
      
      <div class="relative h-80 bg-brutal-white border-2 border-black">
        <!-- Grid Lines -->
        <div class="absolute inset-0 grid grid-cols-10 grid-rows-10">
          <div
            v-for="i in 100"
            :key="i"
            class="border border-brutal-gray/20"
          />
        </div>
        
        <!-- Scatter Points -->
        <div class="absolute inset-0">
          <div 
            v-for="(point, index) in speedAccuracyPoints"
            :key="index"
            class="absolute w-3 h-3 border-2 border-black transform -translate-x-1/2 -translate-y-1/2"
            :class="getPointClass(point.zone)"
            :style="{
              left: `${point.speed}%`,
              bottom: `${point.accuracy}%`
            }"
            :title="`Q${index + 1}: ${point.accuracy}% accuracy, ${point.speed} q/min`"
          />
        </div>
        
        <!-- Optimal Zone -->
        <div 
          class="absolute border-4 border-dashed border-brutal-lime bg-brutal-lime/20"
          :style="optimalZoneStyle"
        />
        
        <!-- Axes Labels -->
        <div class="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs font-black">
          Accuracy (%)
        </div>
        <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-black">
          Speed (questions/min)
        </div>
      </div>
      
      <!-- Legend -->
      <div class="flex justify-center gap-4 mt-4">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-brutal-lime border-2 border-black" />
          <span class="text-xs font-bold">Optimal Zone</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-brutal-cyan border-2 border-black" />
          <span class="text-xs font-bold">Balanced</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-brutal-pink border-2 border-black" />
          <span class="text-xs font-bold">Fast but Inaccurate</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-brutal-yellow border-2 border-black" />
          <span class="text-xs font-bold">Slow but Accurate</span>
        </div>
      </div>
    </div>
    
    <!-- Zone Analysis -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-brutal-lime border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Performance Zones
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="zone in performanceZones"
            :key="zone.name"
            class="border-2 border-black p-3"
            :class="getZoneCardClass(zone.name)"
          >
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-black">
                {{ zone.name }}
              </h4>
              <span class="font-black">{{ zone.count }} questions</span>
            </div>
            
            <div class="text-sm font-bold text-brutal-gray mb-2">
              {{ zone.description }}
            </div>
            
            <div class="w-full h-3 bg-brutal-gray border border-black">
              <div 
                class="h-full transition-all duration-500"
                :class="zone.color"
                :style="{ width: `${zone.percentage}%` }"
              />
            </div>
            
            <div class="text-xs font-bold text-brutal-gray mt-1">
              {{ zone.percentage }}% of total questions
            </div>
          </div>
        </div>
      </div>
      
      <!-- Trade-off Analysis -->
      <div class="bg-brutal-pink border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Trade-off Analysis
        </h3>
        
        <div class="space-y-4">
          <div>
            <h4 class="font-bold mb-2">
              Current Balance
            </h4>
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <div class="text-center mb-1">
                  <span class="font-black text-lg">{{ speedBias }}%</span>
                </div>
                <div class="w-full h-4 bg-brutal-gray border-2 border-black">
                  <div 
                    class="h-full bg-brutal-pink transition-all duration-500"
                    :style="{ width: `${speedBias}%` }"
                  />
                </div>
                <div class="text-center text-xs font-bold mt-1">
                  Speed
                </div>
              </div>
              
              <div class="text-2xl font-black">
                VS
              </div>
              
              <div class="flex-1">
                <div class="text-center mb-1">
                  <span class="font-black text-lg">{{ accuracyBias }}%</span>
                </div>
                <div class="w-full h-4 bg-brutal-gray border-2 border-black">
                  <div 
                    class="h-full bg-brutal-cyan transition-all duration-500"
                    :style="{ width: `${accuracyBias}%` }"
                  />
                </div>
                <div class="text-center text-xs font-bold mt-1">
                  Accuracy
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="font-bold mb-2">
              Optimization Suggestions
            </h4>
            <div class="space-y-2">
              <div 
                v-for="suggestion in optimizationSuggestions"
                :key="suggestion.id"
                class="flex items-center gap-2 p-2 bg-brutal-white border-2 border-black"
              >
                <span class="text-lg">{{ suggestion.icon }}</span>
                <div class="flex-1">
                  <p class="text-sm font-black">
                    {{ suggestion.text }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Subject-wise Speed-Accuracy -->
    <div class="bg-brutal-yellow border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Subject-wise Analysis
      </h3>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          v-for="subject in subjectSpeedAccuracy"
          :key="subject.name"
          class="bg-brutal-white border-2 border-black p-4"
        >
          <h4 class="font-black text-center mb-3">
            {{ subject.name }}
          </h4>
          
          <!-- Mini Scatter Plot -->
          <div class="relative h-32 bg-brutal-gray border border-black mb-3">
            <div 
              v-for="(point, index) in subject.points.slice(0, 20)"
              :key="index"
              class="absolute w-2 h-2 border border-black transform -translate-x-1/2 -translate-y-1/2"
              :class="getPointClass(point.zone)"
              :style="{
                left: `${point.speed}%`,
                bottom: `${point.accuracy}%`
              }"
            />
          </div>
          
          <!-- Stats -->
          <div class="text-xs space-y-1">
            <div class="flex justify-between">
              <span class="font-bold">Accuracy:</span>
              <span class="font-black">{{ subject.accuracy }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Speed:</span>
              <span class="font-black">{{ subject.speed }} q/min</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Zone:</span>
              <span class="font-black">{{ subject.primaryZone }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Improvement Recommendations -->
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Speed Training
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="training in speedTraining"
            :key="training.id"
            class="flex items-start gap-3 p-3 bg-brutal-white border-2 border-black"
          >
            <span class="text-2xl">{{ training.icon }}</span>
            <div class="flex-1">
              <h4 class="font-black text-sm mb-1">
                {{ training.title }}
              </h4>
              <p class="text-xs font-bold text-brutal-gray mb-2">
                {{ training.description }}
              </p>
              <div class="flex items-center gap-2">
                <span class="badge badge-cyan text-xs">{{ training.duration }}</span>
                <span class="badge badge-yellow text-xs">{{ training.difficulty }}</span>
              </div>
            </div>
            <button 
              class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
              @click="startSpeedTraining(training.id)"
            >
              Start
            </button>
          </div>
        </div>
      </div>
      
      <div class="bg-brutal-lime border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Accuracy Training
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="training in accuracyTraining"
            :key="training.id"
            class="flex items-start gap-3 p-3 bg-brutal-white border-2 border-black"
          >
            <span class="text-2xl">{{ training.icon }}</span>
            <div class="flex-1">
              <h4 class="font-black text-sm mb-1">
                {{ training.title }}
              </h4>
              <p class="text-xs font-bold text-brutal-gray mb-2">
                {{ training.description }}
              </p>
              <div class="flex items-center gap-2">
                <span class="badge badge-lime text-xs">{{ training.duration }}</span>
                <span class="badge badge-pink text-xs">{{ training.difficulty }}</span>
              </div>
            </div>
            <button 
              class="btn-primary btn-primary-lime px-3 py-1 text-xs"
              @click="startAccuracyTraining(training.id)"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface SpeedAccuracyPoint {
  speed: number
  accuracy: number
  zone: string
}

interface SubjectSpeedAccuracy {
  name: string
  accuracy: number
  speed: number
  primaryZone: string
  points: SpeedAccuracyPoint[]
}

// Generate mock data for speed-accuracy analysis
const generateSpeedAccuracyData = (): SpeedAccuracyPoint[] => {
  const points: SpeedAccuracyPoint[] = []
  
  for (let i = 0; i < 50; i++) {
    const speed = Math.random() * 2.5 + 0.5 // 0.5 to 3 questions per minute
    const accuracy = Math.max(20, Math.min(100, 
      100 - (speed - 1) * 20 + (Math.random() - 0.5) * 30
    ))
    
    let zone = 'Balanced'
    if (speed > 2 && accuracy < 60) zone = 'Fast but Inaccurate'
    else if (speed < 1 && accuracy > 85) zone = 'Slow but Accurate'
    else if (speed >= 1 && speed <= 1.5 && accuracy >= 75 && accuracy <= 90) zone = 'Optimal'
    
    points.push({
      speed: (speed / 3) * 100, // Normalize to percentage
      accuracy,
      zone
    })
  }
  
  return points
}

const speedAccuracyPoints = ref<SpeedAccuracyPoint[]>(generateSpeedAccuracyData())

const subjectSpeedAccuracy = ref<SubjectSpeedAccuracy[]>([
  {
    name: 'Quantitative Aptitude',
    accuracy: 78,
    speed: 1.2,
    primaryZone: 'Balanced',
    points: generateSpeedAccuracyData().slice(0, 25)
  },
  {
    name: 'Reasoning Ability',
    accuracy: 82,
    speed: 1.5,
    primaryZone: 'Optimal',
    points: generateSpeedAccuracyData().slice(25, 35)
  },
  {
    name: 'General Awareness',
    accuracy: 90,
    speed: 2.0,
    primaryZone: 'Fast but Inaccurate',
    points: generateSpeedAccuracyData().slice(35, 42)
  },
  {
    name: 'English Language',
    accuracy: 70,
    speed: 0.8,
    primaryZone: 'Slow but Accurate',
    points: generateSpeedAccuracyData().slice(42, 50)
  }
])

const overallAccuracy = computed(() => {
  const totalAccuracy = speedAccuracyPoints.value.reduce((sum, point) => sum + point.accuracy, 0)
  return Math.round(totalAccuracy / speedAccuracyPoints.value.length)
})

const averageSpeed = computed(() => {
  const totalSpeed = speedAccuracyPoints.value.reduce((sum, point) => sum + (point.speed / 100) * 3, 0)
  return (totalSpeed / speedAccuracyPoints.value.length).toFixed(1)
})

const efficiencyScore = computed(() => {
  const accuracy = overallAccuracy.value
  const speed = parseFloat(averageSpeed.value)
  return Math.round((accuracy * speed) / 2)
})

const optimalZone = computed(() => {
  const optimalCount = speedAccuracyPoints.value.filter(point => point.zone === 'Optimal').length
  return Math.round((optimalCount / speedAccuracyPoints.value.length) * 100)
})

const optimalZoneStyle = computed(() => {
  return {
    left: '33%',
    bottom: '60%',
    width: '34%',
    height: '30%'
  }
})

const performanceZones = computed(() => {
  const zones = {
    'Optimal': { count: 0, color: 'bg-brutal-lime' },
    'Balanced': { count: 0, color: 'bg-brutal-cyan' },
    'Fast but Inaccurate': { count: 0, color: 'bg-brutal-pink' },
    'Slow but Accurate': { count: 0, color: 'bg-brutal-yellow' }
  }
  
  speedAccuracyPoints.value.forEach(point => {
    if (zones[point.zone as keyof typeof zones]) {
      zones[point.zone as keyof typeof zones].count++
    }
  })
  
  return Object.entries(zones).map(([name, data]) => ({
    name,
    count: data.count,
    color: data.color,
    percentage: Math.round((data.count / speedAccuracyPoints.value.length) * 100),
    description: getZoneDescription(name)
  }))
})

const speedBias = computed(() => {
  const fastInaccurate = speedAccuracyPoints.value.filter(p => p.zone === 'Fast but Inaccurate').length
  const optimal = speedAccuracyPoints.value.filter(p => p.zone === 'Optimal').length
  const balanced = speedAccuracyPoints.value.filter(p => p.zone === 'Balanced').length
  return Math.round(((fastInaccurate + optimal * 0.7 + balanced * 0.5) / speedAccuracyPoints.value.length) * 100)
})

const accuracyBias = computed(() => 100 - speedBias.value)

const optimizationSuggestions = computed(() => {
  const suggestions = []
  
  if (speedBias.value > 70) {
    suggestions.push({
      id: 1,
      icon: '🐢',
      text: 'Focus on accuracy - slow down and double-check answers'
    })
  } else if (accuracyBias.value > 70) {
    suggestions.push({
      id: 2,
      icon: '🚀',
      text: 'Increase speed - practice time management techniques'
    })
  } else {
    suggestions.push({
      id: 3,
      icon: '⚖️',
      text: 'Good balance! Maintain current approach'
    })
  }
  
  if (optimalZone.value < 30) {
    suggestions.push({
      id: 4,
      icon: '🎯',
      text: 'Aim for optimal zone: 75-90% accuracy with 1-1.5 q/min speed'
    })
  }
  
  return suggestions
})

const speedTraining = ref([
  {
    id: 1,
    icon: '⚡',
    title: 'Speed Drills',
    description: 'Practice quick calculations and mental math',
    duration: '10 min/day',
    difficulty: 'Medium'
  },
  {
    id: 2,
    icon: '⏱️',
    title: 'Time Trials',
    description: 'Complete questions under time pressure',
    duration: '15 min/day',
    difficulty: 'Hard'
  }
])

const accuracyTraining = ref([
  {
    id: 1,
    icon: '🎯',
    title: 'Precision Practice',
    description: 'Focus on accuracy without time limits',
    duration: '20 min/day',
    difficulty: 'Easy'
  },
  {
    id: 2,
    icon: '🔍',
    title: 'Review Sessions',
    description: 'Analyze mistakes and learn correct methods',
    duration: '15 min/day',
    difficulty: 'Medium'
  }
])

const getPointClass = (zone: string): string => {
  switch (zone) {
    case 'Optimal': return 'bg-brutal-lime'
    case 'Balanced': return 'bg-brutal-cyan'
    case 'Fast but Inaccurate': return 'bg-brutal-pink'
    case 'Slow but Accurate': return 'bg-brutal-yellow'
    default: return 'bg-brutal-gray'
  }
}

const getZoneCardClass = (zone: string): string => {
  switch (zone) {
    case 'Optimal': return 'bg-brutal-lime/20'
    case 'Balanced': return 'bg-brutal-cyan/20'
    case 'Fast but Inaccurate': return 'bg-brutal-pink/20'
    case 'Slow but Accurate': return 'bg-brutal-yellow/20'
    default: return 'bg-brutal-gray/20'
  }
}

const getZoneDescription = (zone: string): string => {
  switch (zone) {
    case 'Optimal': return 'Perfect balance of speed and accuracy'
    case 'Balanced': return 'Good performance with room for improvement'
    case 'Fast but Inaccurate': return 'High speed but low accuracy - needs focus on precision'
    case 'Slow but Accurate': return 'High accuracy but could improve speed'
    default: return 'Unknown zone'
  }
}

const startSpeedTraining = (trainingId: number) => {
  console.log('Starting speed training:', trainingId)
  // Navigate to speed training module
}

const startAccuracyTraining = (trainingId: number) => {
  console.log('Starting accuracy training:', trainingId)
  // Navigate to accuracy training module
}

onMounted(() => {
  // Load speed-accuracy data from IndexedDB
  loadSpeedAccuracyData()
})

const loadSpeedAccuracyData = async () => {
  try {
    const storedData = localStorage.getItem('speedAccuracyData')
    if (storedData) {
      const data = JSON.parse(storedData)
      speedAccuracyPoints.value = data.speedAccuracyPoints || speedAccuracyPoints.value
      subjectSpeedAccuracy.value = data.subjectSpeedAccuracy || subjectSpeedAccuracy.value
    }
  } catch (error) {
    console.error('Failed to load speed-accuracy data:', error)
  }
}
</script>
