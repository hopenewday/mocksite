<template>
  <div :class="[
    'card bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-6 transition-all duration-300 cursor-pointer shadow-brutal dark:shadow-[4px_4px_0px_#fff] h-full flex flex-col',
    tiltClass
  ]">
    <div class="w-16 h-16 bg-brutal-yellow border-4 border-black shadow-brutal flex items-center justify-center mb-4 flex-shrink-0">
      <span class="text-2xl">{{ icon }}</span>
    </div>
    <div class="flex-1 flex flex-col">
      <h3 class="font-extrabold text-xl uppercase text-black dark:text-white mb-2 line-clamp-2">
        {{ title }}
      </h3>
      <p class="text-gray-700 dark:text-gray-300 mb-4 text-sm line-clamp-3 flex-1">
        {{ description }}
      </p>
    </div>
    <router-link
      :to="link"
      class="btn-primary btn-primary-cyan w-full flex-shrink-0"
    >
      {{ buttonText }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  title: string
  description: string
  link: string
  buttonText?: string
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Use Tool',
  index: 0
})

const tiltClass = computed(() => {
  const tiltClasses = [
    'transform rotate-[-2deg] hover:rotate-0',
    'transform rotate-[1deg] hover:rotate-0', 
    'transform rotate-[-1deg] hover:rotate-0',
    'transform rotate-[2deg] hover:rotate-0',
    'transform rotate-[-1.5deg] hover:rotate-0',
    'transform rotate-[0.5deg] hover:rotate-0'
  ]
  return tiltClasses[props.index % tiltClasses.length]
})
</script>
