<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Percentage Calculator
    </h2>
    
    <div class="space-y-8">
      <!-- What is X% of Y -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          What is X% of Y?
        </h3>
        <div class="flex gap-4 items-center">
          <input 
            v-model.number="x" 
            type="number" 
            placeholder="X"
            class="input flex-1"
          >
          <span class="font-black">%</span>
          <span class="font-black">of</span>
          <input 
            v-model.number="y" 
            type="number" 
            placeholder="Y"
            class="input flex-1"
          >
        </div>
        <div
          v-if="result !== null"
          class="mt-4 p-4 bg-brutal-cyan border-4 border-black"
        >
          <span class="font-black text-xl">Result: {{ result.toFixed(2) }}</span>
        </div>
      </div>
      
      <!-- X is what % of Y -->
      <div class="bg-brutal-lime border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          X is what % of Y?
        </h3>
        <div class="flex gap-4 items-center">
          <input 
            v-model.number="x2" 
            type="number" 
            placeholder="X"
            class="input flex-1"
          >
          <span class="font-black">is</span>
          <span class="font-black">what % of</span>
          <input 
            v-model.number="y2" 
            type="number" 
            placeholder="Y"
            class="input flex-1"
          >
        </div>
        <div
          v-if="result2 !== null"
          class="mt-4 p-4 bg-brutal-pink border-4 border-black"
        >
          <span class="font-black text-xl">Result: {{ result2.toFixed(2) }}%</span>
        </div>
      </div>
      
      <!-- Percentage Change -->
      <div class="bg-brutal-pink border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Percentage Change
        </h3>
        <div class="flex gap-4 items-center">
          <div class="flex-1">
            <label class="text-sm font-black block mb-1">From</label>
            <input 
              v-model.number="fromValue" 
              type="number" 
              placeholder="Original value"
              class="input w-full"
            >
          </div>
          <div class="flex-1">
            <label class="text-sm font-black block mb-1">To</label>
            <input 
              v-model.number="toValue" 
              type="number" 
              placeholder="New value"
              class="input w-full"
            >
          </div>
        </div>
        <div
          v-if="percentageChange !== null"
          class="mt-4 p-4 bg-brutal-cyan border-4 border-black"
        >
          <div class="flex items-center justify-between">
            <span class="font-black text-xl">Change: {{ percentageChange.toFixed(2) }}%</span>
            <span 
              :class="[
                'font-black text-lg',
                percentageChange > 0 ? 'text-green-600' : 
                percentageChange < 0 ? 'text-red-600' : 'text-gray-600'
              ]"
            >
              {{ percentageChange > 0 ? '↑' : percentageChange < 0 ? '↓' : '→' }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Common Percentages -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Common Percentages
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            v-for="percent in commonPercentages"
            :key="percent"
            class="btn-primary btn-primary-white border-2 border-black font-black"
            @click="setPercentage(percent)"
          >
            {{ percent }}%
          </button>
        </div>
      </div>
      
      <!-- Clear Button -->
      <button 
        class="btn-primary btn-primary-pink w-full"
        @click="clearAll"
      >
        Clear All
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const x = ref(0)
const y = ref(0)
const x2 = ref(0)
const y2 = ref(0)
const fromValue = ref(0)
const toValue = ref(0)

const commonPercentages = [10, 25, 33, 50, 66, 75, 90, 100]

const result = computed(() => {
  if (y.value === 0) return null
  return (x.value * y.value) / 100
})

const result2 = computed(() => {
  if (y2.value === 0) return null
  return (x2.value / y2.value) * 100
})

const percentageChange = computed(() => {
  if (fromValue.value === 0) return null
  return ((toValue.value - fromValue.value) / fromValue.value) * 100
})

const setPercentage = (percent: number) => {
  x.value = percent
}

const clearAll = () => {
  x.value = 0
  y.value = 0
  x2.value = 0
  y2.value = 0
  fromValue.value = 0
  toValue.value = 0
}
</script>
