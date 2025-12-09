<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black font-sans pb-16">
    <!-- Header -->
    <div class="w-full bg-white dark:bg-gray-900 border-b-4 border-black dark:border-white p-8 text-center relative overflow-hidden">
      <!-- Background Grid (Optional) -->
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div class="relative z-10 bg-white dark:bg-gray-900 border-4 border-black dark:border-white shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff] inline-block px-8 py-2">
        <h1 class="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none m-0 text-black dark:text-white">
          MOCK TESTS
        </h1>
      </div>
      <p class="font-bold text-center mt-4 text-xl text-black dark:text-white">
        Choose from 1000+ mock tests across all competitive exams
      </p>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Exam Categories -->
      <div class="mb-4">
        <h2 class="bg-white dark:bg-gray-900 border-4 border-black dark:border-white inline-block px-4 py-1 text-2xl font-black uppercase mb-6 transform -rotate-1 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff] text-black dark:text-white">
          Exam Categories
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <!-- SSC Exams (Cyan) -->
          <div
            :class="['card p-6 cursor-pointer hover:translate-y-1 transition-transform border-4 border-black dark:border-white bg-brutal-cyan relative overflow-hidden h-40', selectedCategory === 'ssc' ? 'ring-4 ring-black dark:ring-white ring-offset-2' : '']"
            @click="selectCategory('ssc')"
          >
            <div class="absolute top-2 right-2 text-4xl opacity-20">
              🏛️
            </div>
            <div class="text-4xl mb-2">
              🏛️
            </div>
            <h3 class="text-2xl font-black leading-none mb-1">
              SSC Exams
            </h3>
            <p class="font-bold text-sm">
              5 exams
            </p>
            <p class="text-xs font-bold mt-2">
              Staff Selection Commission Exams
            </p>
          </div>

          <!-- Banking (Lime) -->
          <div
            :class="['card p-6 cursor-pointer hover:translate-y-1 transition-transform border-4 border-black dark:border-white bg-brutal-lime relative overflow-hidden h-40', selectedCategory === 'banking' ? 'ring-4 ring-black dark:ring-white ring-offset-2' : '']"
            @click="selectCategory('banking')"
          >
            <div class="absolute top-2 right-2 text-4xl opacity-20">
              🏦
            </div>
            <div class="text-4xl mb-2">
              🏦
            </div>
            <h3 class="text-2xl font-black leading-none mb-1">
              Banking Exams
            </h3>
            <p class="font-bold text-sm">
              5 exams
            </p>
            <p class="text-xs font-bold mt-2">
              Banking Recruitment Exams
            </p>
          </div>

          <!-- Railway (Pink) -->
          <div
            :class="['card p-6 cursor-pointer hover:translate-y-1 transition-transform border-4 border-black dark:border-white bg-brutal-pink relative overflow-hidden h-40', selectedCategory === 'railway' ? 'ring-4 ring-black dark:ring-white ring-offset-2' : '']"
            @click="selectCategory('railway')"
          >
            <div class="absolute top-2 right-2 text-4xl opacity-20">
              🚂
            </div>
            <div class="text-4xl mb-2">
              🚂
            </div>
            <h3 class="text-2xl font-black leading-none mb-1">
              Railway Exams
            </h3>
            <p class="font-bold text-sm">
              4 exams
            </p>
            <p class="text-xs font-bold mt-2">
              Railway Recruitment Board Exams
            </p>
          </div>

          <!-- UPSC (Yellow) -->
          <div
            :class="['card p-6 cursor-pointer hover:translate-y-1 transition-transform border-4 border-black dark:border-white bg-brutal-yellow relative overflow-hidden h-40', selectedCategory === 'upsc' ? 'ring-4 ring-black dark:ring-white ring-offset-2' : '']"
            @click="selectCategory('upsc')"
          >
            <div class="absolute top-2 right-2 text-4xl opacity-20">
              🏛️
            </div>
            <div class="text-4xl mb-2">
              🏛️
            </div>
            <h3 class="text-2xl font-black leading-none mb-1">
              UPSC Exams
            </h3>
            <p class="font-bold text-sm">
              4 exams
            </p>
            <p class="text-xs font-bold mt-2">
              Union Public Service Commission Exams
            </p>
          </div>

          <!-- State (White) -->
          <div
            :class="['card p-6 cursor-pointer hover:translate-y-1 transition-transform border-4 border-black dark:border-white bg-white relative overflow-hidden h-40', selectedCategory === 'state' ? 'ring-4 ring-black dark:ring-white ring-offset-2' : '']"
            @click="selectCategory('state')"
          >
            <div class="absolute top-2 right-2 text-4xl opacity-20">
              🗺️
            </div>
            <div class="text-4xl mb-2">
              🗺️
            </div>
            <h3 class="text-2xl font-black leading-none mb-1">
              State Exams
            </h3>
            <p class="font-bold text-sm">
              3 exams
            </p>
            <p class="text-xs font-bold mt-2">
              State Government Recruitment Exams
            </p>
          </div>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="flex flex-wrap gap-3 items-center mb-8 border-4 border-black dark:border-white p-4 bg-white dark:bg-gray-900 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff]">
        <div class="flex flex-wrap gap-3 flex-1">
          <select
            v-model="difficultyFilter"
            class="bg-white dark:bg-gray-800 border-2 border-black dark:border-white p-2 px-3 font-bold focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white min-w-[140px]"
          >
            <option value="">
              All Difficulties
            </option>
            <option value="Easy">
              Easy
            </option>
            <option value="Medium">
              Medium
            </option>
            <option value="Hard">
              Hard
            </option>
          </select>
          <select
            v-model="typeFilter"
            class="bg-white dark:bg-gray-800 border-2 border-black dark:border-white p-2 px-3 font-bold focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white min-w-[120px]"
          >
            <option value="">
              All Types
            </option>
            <option value="mock">
              Mock Test
            </option>
            <option value="pyq">
              Previous Year
            </option>
          </select>
        </div>

        <button
          class="bg-brutal-pink border-2 border-black dark:border-white px-4 py-2 font-black uppercase hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff] text-black whitespace-nowrap"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>

      <!-- Test List Strips -->
      <div
        v-if="loading"
        class="text-center py-20"
      >
        <div class="animate-spin text-4xl inline-block">
          ⏳
        </div>
        <p class="font-bold mt-2">
          Loading Tests...
        </p>
      </div>

      <div
        v-else-if="filteredExams.length === 0"
        class="text-center py-20 border-4 border-black dark:border-white border-dashed bg-gray-50 dark:bg-gray-800"
      >
        <h3 class="text-2xl font-black text-black dark:text-white">
          NO TESTS FOUND
        </h3>
        <p class="font-bold text-gray-500 dark:text-gray-400">
          Try changing or clearing your filters.
        </p>
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <!-- List Item -->
        <div
          v-for="(test, index) in filteredExams"
          :key="test.id"
          :class="[
            'border-4 border-black dark:border-white p-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff] hover:translate-x-1 transition-transform',
            index % 3 === 0 ? 'bg-brutal-lime' : index % 3 === 1 ? 'bg-brutal-pink' : 'bg-brutal-cyan'
          ]"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span
                v-if="test.isPremium"
                class="bg-brutal-yellow border-2 border-black px-2 text-xs font-black"
              >PREMIUM</span>
              <h3 class="text-xl md:text-2xl font-black uppercase leading-tight">
                {{ test.name }}
              </h3>
            </div>

            <p class="font-bold text-sm mb-2 max-w-2xl line-clamp-1 opacity-80">
              {{ test.description }}
            </p>

            <div class="flex flex-wrap gap-2">
              <span class="bg-white border-2 border-black px-2 py-0.5 text-xs font-bold uppercase">{{ test.difficulty || 'Medium' }}</span>
              <span class="bg-white border-2 border-black px-2 py-0.5 text-xs font-bold uppercase">{{ test.duration || 60 }}M</span>
              <span class="bg-white border-2 border-black px-2 py-0.5 text-xs font-bold uppercase">{{ test.questions || 100 }} Q</span>
            </div>
          </div>

          <div class="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end flex-wrap">
            <div class="text-right min-w-[80px]">
              <div class="font-black text-lg">
                {{ test.attempts?.toLocaleString() || 0 }}
              </div>
              <div class="text-xs font-bold uppercase opacity-60">
                Attempts
              </div>
            </div>

            <div class="text-right min-w-[80px]">
              <div class="font-black text-lg">
                {{ test.rating || '4.0' }}
              </div>
              <div class="text-xs font-bold uppercase opacity-60">
                Rating
              </div>
            </div>

            <button
              class="bg-brutal-green border-4 border-black dark:border-white px-6 py-3 text-xl md:text-2xl font-black uppercase hover:bg-white hover:text-black hover:shadow-none shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] transition-all min-w-[100px] flex-shrink-0"
              @click="startTest(test.id)"
            >
              START
            </button>
          </div>
        </div>
      </div>

      <!-- Login CTA (Sticky Bottom or Inline) -->
      <div
        v-if="isGuestLimitReached"
        class="mt-8 border-4 border-black dark:border-white bg-white dark:bg-gray-900 p-6 shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff] text-center"
      >
        <h3 class="text-2xl font-black uppercase mb-2 text-black dark:text-white">
          You've reached the free limit!
        </h3>
        <p class="font-bold mb-4 text-black dark:text-white">
          Create an account to access 1000+ more tests and track your progress.
        </p>
        <router-link
          to="/login"
          class="inline-block bg-brutal-pink border-4 border-black dark:border-white px-8 py-3 font-black uppercase hover:bg-black hover:text-white transition-colors"
        >
          Sign Up Now
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTestsStore } from '@/stores/tests'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const testsStore = useTestsStore()
const authStore = useAuthStore()

const selectedCategory = ref('')
const difficultyFilter = ref('')
const typeFilter = ref('')

const loading = computed(() => testsStore.loading)
const filteredExams = computed(() => testsStore.items)
const isGuestLimitReached = computed(() => testsStore.isGuestLimitReached)

const selectCategory = (cat: string) => {
  if (selectedCategory.value === cat) selectedCategory.value = ''
  else selectedCategory.value = cat
  // In a real app, we'd trigger a fetch here.
  // For hybrid mode, if it's guest, we only have 2 tests anyway.
  // If user, we'd fetch with filters.
  fetchTests()
}

const clearFilters = () => {
  selectedCategory.value = ''
  difficultyFilter.value = ''
  typeFilter.value = ''
  fetchTests()
}

const fetchTests = async () => {
   await testsStore.fetch({
     exam: selectedCategory.value, // Mapping category to 'exam' field broadly or handle better mapping
     difficulty: difficultyFilter.value,
   })
}

const startTest = (id: string) => {
  if (!authStore.session && isGuestLimitReached.value) {
    alert("You've reached the guest limit of 2 tests! Please login.")
    router.push('/login')
    return
  }

  if (!authStore.session) {
     testsStore.incrementGuestAttempt()
  }

  router.push(`/test/${id}`)
}

onMounted(() => {
  testsStore.initGuestAttempts()
  fetchTests()
})
</script>
