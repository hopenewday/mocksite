<template>
  <section class="max-w-7xl mx-auto px-4 py-16">
    <!-- Header -->
    <div class="text-center mb-12">
      <div class="inline-block mb-6">
        <div class="bg-brutal-pink border-4 border-black shadow-brutal px-8 py-4 transform rotate-[1deg]">
          <h1 class="heading-brutal text-3xl md:text-4xl">
            Find Your Dream Job
          </h1>
        </div>
      </div>
      <div class="max-w-3xl mx-auto">
        <div class="bg-brutal-cyan border-4 border-black shadow-brutal px-8 py-6 transform rotate-[-1deg]">
          <p class="text-brutal text-xl font-bold">
            Browse thousands of latest openings across all sectors
          </p>
        </div>
      </div>
      <div class="mt-6">
        <router-link
          to="/onboarding"
          class="btn-primary btn-primary-brutal inline-flex items-center gap-2"
        >
          New here? View Guide
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </router-link>
      </div>
    </div>

    <div class="flex justify-end mb-6">
      <div class="bg-brutal-yellow border-4 border-black shadow-brutal p-3 transform rotate-[-2deg]">
        <TTSControls />
      </div>
    </div>

    <!-- Search Section -->
    <div class="card card-brutal-lime p-8 mb-12 transform rotate-[-1deg]">
      <div class="grid md:grid-cols-4 gap-4 mb-6">
        <input 
          v-model="q" 
          class="input md:col-span-3" 
          placeholder="Search for jobs, companies, or keywords..." 
          aria-label="Search jobs" 
        >
        <button
          class="btn-primary btn-primary-lime w-full flex items-center justify-center gap-2 jobs-nav"
          data-jobs-nav
        >
          <svg
            class="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
          Search Jobs
        </button>
      </div>
      <div class="flex flex-wrap gap-3">
        <span class="text-sm font-bold uppercase">Popular:</span>
        <button
          class="badge badge-cyan cursor-pointer jobs-nav hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          data-jobs-nav
        >
          UPSC
        </button>
        <button
          class="badge badge-lime cursor-pointer jobs-nav hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          data-jobs-nav
        >
          Banking
        </button>
        <button
          class="badge badge-pink cursor-pointer jobs-nav hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          data-jobs-nav
        >
          Railway
        </button>
        <button
          class="badge badge-yellow cursor-pointer jobs-nav hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          data-jobs-nav
        >
          SSC
        </button>
        <button
          class="badge badge-pink cursor-pointer jobs-nav hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          data-jobs-nav
        >
          Teaching
        </button>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="mb-16">
      <div class="inline-block mb-8">
        <div class="bg-brutal-yellow border-4 border-black shadow-brutal px-6 py-3 transform rotate-[-2deg]">
          <h2 class="subheading-brutal text-2xl">
            Browse by Category
          </h2>
        </div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <button 
          v-for="(cat, index) in categories" 
          :key="cat" 
          :class="[
            'card p-6 transform transition-all duration-200 hover:rotate-0 jobs-nav',
            index % 4 === 0 ? 'card-brutal-yellow rotate-[-1deg]' : 
            index % 4 === 1 ? 'card-brutal-pink rotate-[1deg]' : 
            index % 4 === 2 ? 'card-brutal-cyan rotate-[-2deg]' : 
            'card-brutal-lime rotate-[2deg]'
          ]" 
          data-jobs-nav
        >
          <div class="w-16 h-16 mx-auto bg-brutal-white dark:bg-brutal-black border-4 border-black shadow-brutal flex items-center justify-center mb-4 transform rotate-[-3deg]">
            <span class="text-3xl">{{ getIcon(cat) }}</span>
          </div>
          <span class="font-black text-lg uppercase">{{ cat }}</span>
        </button>
      </div>
    </div>

    <!-- Latest Notifications -->
    <div>
      <div class="inline-block mb-8">
        <div class="bg-brutal-cyan border-4 border-black shadow-brutal px-6 py-3 transform rotate-[1deg]">
          <h2 class="subheading-brutal text-2xl">
            Latest Notifications
          </h2>
        </div>
      </div>
      
      <div class="grid md:grid-cols-2 gap-6">
        <button 
          v-for="i in 6" 
          :key="i" 
          :class="[
            'card p-6 transform transition-all duration-200 hover:rotate-0 jobs-nav text-left',
            i % 2 === 0 ? 'card-brutal-pink rotate-[-1deg]' : 'card-brutal-yellow rotate-[1deg]'
          ]" 
          data-jobs-nav
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="font-black text-lg mb-2">
                Latest Recruitment Notification {{ 2025 }} - {{ i }}
              </div>
              <div class="badge badge-cyan">
                Multiple Positions
              </div>
              <div class="badge badge-lime mt-2">
                Apply Online
              </div>
            </div>
            <div class="w-12 h-12 bg-brutal-yellow border-4 border-black shadow-brutal flex items-center justify-center transform rotate-[3deg]">
              <svg
                class="w-6 h-6"
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
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TTSControls from '@/components/TTSControls.vue'

const q = ref('')
const categories = ['Government', 'Private', 'Banking', 'IT', 'Education', 'Defence', 'Railway', 'Medical']

function getIcon(cat: string) {
  const icons: Record<string, string> = {
    'Government': '🏛️', 'Private': '🏢', 'Banking': '🏦', 'IT': '💻',
    'Education': '🎓', 'Defence': '🛡️', 'Railway': '🚂', 'Medical': '🏥'
  }
  return icons[cat] || '💼'
}
</script>
