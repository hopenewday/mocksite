<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">
      BMI Calculator
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Input Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Enter Your Details
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Height</label>
            <div class="flex gap-2">
              <input 
                v-model.number="heightValue"
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter height"
                class="input flex-1"
              >
              <select
                v-model="heightUnit"
                class="select"
              >
                <option value="cm">
                  cm
                </option>
                <option value="ft">
                  ft
                </option>
                <option value="in">
                  in
                </option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="font-black mb-2 block">Weight</label>
            <div class="flex gap-2">
              <input 
                v-model.number="weightValue"
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter weight"
                class="input flex-1"
              >
              <select
                v-model="weightUnit"
                class="select"
              >
                <option value="kg">
                  kg
                </option>
                <option value="lbs">
                  lbs
                </option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="font-black mb-2 block">Age</label>
            <input 
              v-model.number="age"
              type="number"
              min="1"
              max="120"
              placeholder="Enter age"
              class="input w-full"
            >
          </div>
          
          <div>
            <label class="font-black mb-2 block">Gender</label>
            <select
              v-model="gender"
              class="select"
            >
              <option value="">
                Select gender
              </option>
              <option value="male">
                Male
              </option>
              <option value="female">
                Female
              </option>
            </select>
          </div>
          
          <div>
            <label class="font-black mb-2 block">Activity Level</label>
            <select
              v-model="activityLevel"
              class="select"
            >
              <option value="sedentary">
                Sedentary (little or no exercise)
              </option>
              <option value="light">
                Light (1-3 days/week)
              </option>
              <option value="moderate">
                Moderate (3-5 days/week)
              </option>
              <option value="active">
                Active (6-7 days/week)
              </option>
              <option value="very-active">
                Very Active (twice per day)
              </option>
            </select>
          </div>
          
          <button 
            :disabled="!canCalculate"
            class="btn-primary btn-primary-cyan w-full disabled:opacity-50"
            @click="calculateBMI"
          >
            Calculate BMI
          </button>
        </div>
      </div>
      
      <!-- Results Section -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Results
        </h3>
        
        <div
          v-if="bmiResult"
          class="space-y-4"
        >
          <!-- BMI Value -->
          <div class="text-center bg-brutal-white border-2 border-black p-4">
            <div class="text-4xl font-black mb-2">
              {{ bmiResult.bmi }}
            </div>
            <div class="text-lg font-bold">
              {{ bmiResult.category }}
            </div>
          </div>
          
          <!-- BMI Gauge -->
          <div class="bg-brutal-white border-2 border-black p-4">
            <div class="relative h-8">
              <div class="absolute inset-0 flex">
                <div class="flex-1 bg-brutal-lime" />
                <div class="flex-1 bg-brutal-cyan" />
                <div class="flex-1 bg-brutal-yellow" />
                <div class="flex-1 bg-brutal-pink" />
              </div>
              <div 
                class="absolute top-0 w-2 h-full bg-brutal-gray border-2 border-black transform -translate-x-1/2"
                :style="{ left: `${bmiResult.position}%` }"
              />
            </div>
            <div class="flex justify-between text-xs font-bold mt-2">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>
          
          <!-- Health Indicators -->
          <div class="space-y-2">
            <div class="flex justify-between items-center p-2 bg-brutal-white border-2 border-black">
              <span class="font-black">Ideal Weight Range</span>
              <span class="font-black">{{ bmiResult.idealWeightRange }}</span>
            </div>
            
            <div
              v-if="bmiResult.caloriesNeeded"
              class="flex justify-between items-center p-2 bg-brutal-white border-2 border-black"
            >
              <span class="font-black">Daily Calories</span>
              <span class="font-black">{{ bmiResult.caloriesNeeded }} kcal</span>
            </div>
          </div>
        </div>
        
        <div
          v-else
          class="text-center py-8"
        >
          <p class="font-black text-brutal-gray">
            Enter your details to calculate BMI
          </p>
        </div>
      </div>
    </div>
    
    <!-- BMI Categories -->
    <div class="bg-brutal-yellow border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        BMI Categories
      </h3>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-brutal-lime border-2 border-black p-4 text-center">
          <div class="font-black mb-2">
            Underweight
          </div>
          <div class="text-2xl font-black mb-2">
            &lt; 18.5
          </div>
          <p class="text-sm font-bold">
            Consider consulting a healthcare provider
          </p>
        </div>
        
        <div class="bg-brutal-cyan border-2 border-black p-4 text-center">
          <div class="font-black mb-2">
            Normal Weight
          </div>
          <div class="text-2xl font-black mb-2">
            18.5 - 24.9
          </div>
          <p class="text-sm font-bold">
            Healthy weight range
          </p>
        </div>
        
        <div class="bg-brutal-yellow border-2 border-black p-4 text-center">
          <div class="font-black mb-2">
            Overweight
          </div>
          <div class="text-2xl font-black mb-2">
            25 - 29.9
          </div>
          <p class="text-sm font-bold">
            Consider weight management
          </p>
        </div>
        
        <div class="bg-brutal-pink border-2 border-black p-4 text-center">
          <div class="font-black mb-2">
            Obese
          </div>
          <div class="text-2xl font-black mb-2">
            ≥ 30
          </div>
          <p class="text-sm font-bold">
            Consult healthcare provider
          </p>
        </div>
      </div>
    </div>
    
    <!-- Health Tips -->
    <div
      v-if="bmiResult"
      class="bg-brutal-pink border-4 border-black p-6"
    >
      <h3 class="font-black text-lg mb-4">
        Health Recommendations
      </h3>
      
      <div class="space-y-3">
        <div 
          v-for="tip in bmiResult.tips" 
          :key="tip.title"
          class="flex items-start gap-3 p-3 bg-brutal-white border-2 border-black"
        >
          <span class="text-2xl">{{ tip.icon }}</span>
          <div>
            <h4 class="font-black mb-1">
              {{ tip.title }}
            </h4>
            <p class="text-sm font-bold text-brutal-gray">
              {{ tip.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const heightValue = ref('')
const heightUnit = ref('cm')
const weightValue = ref('')
const weightUnit = ref('kg')
const age = ref('')
const gender = ref('')
const activityLevel = ref('sedentary')

const bmiResult = ref(null)

const canCalculate = computed(() => {
  return heightValue.value && weightValue.value
})

const calculateBMI = () => {
  if (!canCalculate.value) return
  
  // Convert to metric units
  let heightInMeters = heightValue.value
  let weightInKg = weightValue.value
  
  if (heightUnit.value === 'ft') {
    heightInMeters = heightValue.value * 0.3048
  } else if (heightUnit.value === 'in') {
    heightInMeters = heightValue.value * 0.0254
  }
  
  if (weightUnit.value === 'lbs') {
    weightInKg = weightValue.value * 0.453592
  }
  
  // Calculate BMI
  const bmi = weightInKg / (heightInMeters * heightInMeters)
  
  // Determine category
  let category = ''
  let position = 0
  
  if (bmi < 18.5) {
    category = 'Underweight'
    position = (bmi / 18.5) * 25
  } else if (bmi < 25) {
    category = 'Normal Weight'
    position = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25
  } else if (bmi < 30) {
    category = 'Overweight'
    position = 50 + ((bmi - 25) / (30 - 25)) * 25
  } else {
    category = 'Obese'
    position = 75 + Math.min(((bmi - 30) / 10) * 25, 25)
  }
  
  // Calculate ideal weight range
  const minIdealWeight = 18.5 * heightInMeters * heightInMeters
  const maxIdealWeight = 24.9 * heightInMeters * heightInMeters
  const idealWeightRange = `${minIdealWeight.toFixed(1)} - ${maxIdealWeight.toFixed(1)} kg`
  
  // Calculate calories needed
  let caloriesNeeded = null
  if (age.value && gender.value) {
    caloriesNeeded = calculateCalories(heightInMeters, weightInKg, age.value, gender.value, activityLevel.value)
  }
  
  // Generate tips
  const tips = generateTips(bmi, category)
  
  bmiResult.value = {
    bmi: bmi.toFixed(1),
    category,
    position,
    idealWeightRange,
    caloriesNeeded,
    tips
  }
}

const calculateCalories = (height: number, weight: number, age: number, gender: string, activity: string): number => {
  let bmr: number
  
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height * 100) - (5.677 * age)
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height * 100) - (4.330 * age)
  }
  
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9
  }
  
  return Math.round(bmr * activityMultipliers[activity as keyof typeof activityMultipliers])
}

const generateTips = (bmi: number, category: string) => {
  const tips = []
  
  if (category === 'Underweight') {
    tips.push({
      icon: '🍽️',
      title: 'Increase Caloric Intake',
      description: 'Eat nutrient-dense foods and consider smaller, more frequent meals.'
    })
    tips.push({
      icon: '💪',
      title: 'Strength Training',
      description: 'Include resistance exercises to build muscle mass.'
    })
  } else if (category === 'Normal Weight') {
    tips.push({
      icon: '✅',
      title: 'Maintain Healthy Habits',
      description: 'Continue with balanced diet and regular exercise.'
    })
    tips.push({
      icon: '🎯',
      title: 'Stay Active',
      description: 'Aim for at least 150 minutes of moderate exercise per week.'
    })
  } else if (category === 'Overweight') {
    tips.push({
      icon: '🥗',
      title: 'Balanced Diet',
      description: 'Focus on portion control and nutrient-dense foods.'
    })
    tips.push({
      icon: '🏃',
      title: 'Increase Physical Activity',
      description: 'Aim for 30-60 minutes of moderate exercise most days.'
    })
  } else {
    tips.push({
      icon: '👨‍⚕️',
      title: 'Consult Healthcare Provider',
      description: 'Seek professional guidance for a safe weight loss plan.'
    })
    tips.push({
      icon: '📊',
      title: 'Set Realistic Goals',
      description: 'Aim for gradual weight loss of 1-2 pounds per week.'
    })
  }
  
  return tips
}
</script>
