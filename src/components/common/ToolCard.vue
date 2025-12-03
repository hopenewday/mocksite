<template>
  <div class="card card-brutal-cyan p-6 transform rotate-[-1deg] hover:rotate-0 transition-all duration-300 cursor-pointer">
    <div class="w-16 h-16 bg-brutal-yellow border-4 border-black shadow-brutal flex items-center justify-center mb-4">
      <span class="text-2xl">{{ icon }}</span>
    </div>
    <h3 class="subheading-brutal mb-2">
      {{ title }}
    </h3>
    <p class="text-brutal mb-4 text-sm">
      {{ description }}
    </p>
    <router-link
      :to="link"
      class="btn-primary btn-primary-cyan w-full"
    >
      {{ buttonText }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
  link: string
  buttonText?: string
}

withDefaults(defineProps<Props>(), {
  buttonText: 'Use Tool'
})
</script>
