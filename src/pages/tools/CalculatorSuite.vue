<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header
      v-if="$route.name === 'calculator-suite'"
      class="bg-brutal-yellow border-b-4 border-black shadow-brutal p-6"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="font-black text-4xl uppercase text-black">
          Calculator Suite
        </h1>
        <p class="text-black mt-2 text-lg opacity-80">
          Professional calculators for various needs
        </p>
      </div>
    </header>
    
    <div
      v-if="$route.name === 'calculator-suite'"
      class="max-w-7xl mx-auto p-6"
    >
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard 
          icon="📊" 
          title="Percentage Calculator" 
          description="Calculate percentages and ratios"
          link="/tools/calculator/percentage"
          button-text="Calculate"
        />
        
        <ToolCard 
          icon="🧮" 
          title="Scientific Calculator" 
          description="Advanced mathematical calculations"
          link="/tools/calculator/scientific"
          button-text="Calculate"
        />
        
        <ToolCard 
          icon="⚖️" 
          title="BMI Calculator" 
          description="Calculate Body Mass Index"
          link="/tools/calculator/bmi"
          button-text="Calculate BMI"
        />
        
        <ToolCard 
          icon="📅" 
          title="Age Calculator" 
          description="Calculate age from birth date"
          link="/tools/calculator/age"
          button-text="Calculate Age"
        />
      </div>
      
      <!-- Tool Preview Section -->
    </div>
    <RouterView
      v-else
      v-slot="{ Component }"
    >
      <Transition
        name="route-fade"
        mode="out-in"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import ToolCard from '@/components/common/ToolCard.vue'
import { useHead } from '@vueuse/head'

useHead({
  meta: [
    { name: 'description', content: 'Percentage, scientific, BMI, and age calculators.' },
    { property: 'og:title', content: 'Calculator Suite' },
    { property: 'og:description', content: 'Handy online calculators: percentage, scientific, BMI, and age.' }
  ]
})
</script>
