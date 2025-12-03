<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header
      v-if="$route.name === 'datetime-tools'"
      class="bg-brutal-cyan border-b-4 border-black shadow-brutal p-6"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="heading-brutal text-4xl">
          Date & Time Tools
        </h1>
        <p class="text-brutal mt-2 text-lg">
          Date and time calculation tools
        </p>
      </div>
    </header>
    
    <div
      v-if="$route.name === 'datetime-tools'"
      class="max-w-7xl mx-auto p-6"
    >
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard 
          icon="🎂" 
          title="Age Calculator" 
          description="Calculate exact age from birth date"
          link="/tools/datetime/age-calculator"
          button-text="Calculate Age"
        />
        
        <ToolCard 
          icon="📅" 
          title="Date Difference" 
          description="Calculate difference between dates"
          link="/tools/datetime/date-difference"
          button-text="Calculate"
        />

        <ToolCard 
          icon="➕➖" 
          title="Date Calculator" 
          description="Add or subtract days and compute business days"
          link="/tools/datetime/date-calculator"
          button-text="Calculate"
        />

        <ToolCard 
          icon="🌍" 
          title="World Clock" 
          description="View time across time zones"
          link="/tools/datetime/world-clock"
          button-text="View"
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
    { name: 'description', content: 'Age calculator and date difference tools.' },
    { property: 'og:title', content: 'Date & Time Tools' },
    { property: 'og:description', content: 'Calculate age and date differences.' }
  ]
})
</script>
