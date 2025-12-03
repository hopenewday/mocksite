<template>
  <div class="card card-brutal-cyan p-4 transform rotate-[-1deg] hover:rotate-0 transition-all duration-300 cursor-pointer">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 bg-brutal-yellow border-4 border-black shadow-brutal flex items-center justify-center flex-shrink-0">
        <span class="text-xl">{{ icon }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-black text-lg mb-1">
          {{ title }}
        </h3>
        <p class="text-sm font-bold text-brutal-gray truncate">
          {{ description }}
        </p>
      </div>
      <div class="w-8 h-8 bg-brutal-pink border-4 border-black shadow-brutal flex items-center justify-center">
        <svg
          class="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
  link: string
}

defineProps<Props>()
</script>
