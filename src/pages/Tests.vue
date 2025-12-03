<template>
  <section class="max-w-7xl mx-auto px-4 py-16">
    <!-- Header -->
    <div class="text-center mb-12">
      <div class="inline-block mb-6">
        <div class="bg-brutal-cyan border-4 border-black shadow-brutal px-8 py-4 transform rotate-[-1deg]">
          <h1 class="heading-brutal text-3xl md:text-4xl">
            Mock Tests
          </h1>
        </div>
      </div>
      <p class="text-brutal text-lg">
        Choose from 1000+ mock tests across all competitive exams
      </p>
    </div>

    <!-- Exam Categories -->
    <div class="mb-12">
      <h2 class="subheading-brutal text-2xl mb-6">
        Exam Categories
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(category, key) in examCategories" 
          :key="key"
          :class="[
            'card p-6 cursor-pointer transform transition-all duration-200 hover:rotate-0',
            selectedCategory === key ? 'ring-4 ring-brutal-cyan' : '',
            `card-${category.color} rotate-[-1deg]`
          ]"
          @click="selectCategory(key)"
        >
          <div class="flex items-center gap-4 mb-4">
            <div class="w-16 h-16 bg-brutal-white border-4 border-black shadow-brutal flex items-center justify-center">
              <span class="text-3xl">{{ category.icon }}</span>
            </div>
            <div>
              <h3 class="font-black text-xl">
                {{ category.name }}
              </h3>
              <p class="text-sm font-bold text-brutal-gray">
                {{ category.subcategories.length }} exams
              </p>
            </div>
          </div>
          <p class="text-brutal text-sm font-bold">
            {{ category.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Selected Category Subcategories -->
    <div
      v-if="selectedCategory"
      class="mb-12"
    >
      <h2 class="subheading-brutal text-2xl mb-6">
        {{ examCategories[selectedCategory].name }} - Subcategories
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="subcategory in examCategories[selectedCategory].subcategories" 
          :key="subcategory.id"
          :class="[
            'bg-brutal-white border-4 border-black p-4 cursor-pointer transform transition-all duration-200 hover:rotate-0',
            selectedSubcategory === subcategory.id ? 'ring-4 ring-brutal-pink' : 'rotate-[-1deg]'
          ]"
          @click="selectSubcategory(subcategory.id)"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ subcategory.icon }}</span>
            <div>
              <h3 class="font-black">
                {{ subcategory.name }}
              </h3>
              <p class="text-sm font-bold text-brutal-gray">
                {{ subcategory.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-8">
      <div class="bg-brutal-yellow border-4 border-black shadow-brutal p-6 transform rotate-[1deg]">
        <div class="flex flex-wrap gap-4 items-center">
          <select
            v-model="difficultyFilter"
            class="select"
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
            class="select"
          >
            <option value="">
              All Types
            </option>
            <option value="mock">
              Mock Test
            </option>
            <option value="previous">
              Previous Year
            </option>
            <option value="practice">
              Practice Set
            </option>
          </select>
          
          <select
            v-model="premiumFilter"
            class="select"
          >
            <option value="">
              All Tests
            </option>
            <option value="false">
              Free
            </option>
            <option value="true">
              Premium
            </option>
          </select>
          
          <button
            class="btn-primary btn-primary-pink"
            @click="clearFilters"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Test Grid -->
    <div
      v-if="filteredExams.length"
      class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <div
        v-for="(exam, index) in filteredExams"
        :key="exam.id"
        :class="[
          'card p-6 transform transition-all duration-200 hover:rotate-0',
          index % 3 === 0 ? 'card-brutal-lime rotate-[-1deg]' : 
          index % 3 === 1 ? 'card-brutal-pink rotate-[1deg]' : 
          'card-brutal-cyan rotate-[-2deg]'
        ]"
      >
        <!-- Premium Badge -->
        <div
          v-if="exam.isPremium"
          class="mb-3"
        >
          <span class="badge badge-yellow font-black">👑 PREMIUM</span>
        </div>
        
        <div class="mb-4">
          <h3 class="subheading-brutal text-xl mb-2">
            {{ exam.name }}
          </h3>
          <p class="text-brutal text-sm font-bold mb-3">
            {{ exam.description }}
          </p>
          
          <div class="flex items-center gap-3 text-brutal font-bold mb-3">
            <span class="badge badge-cyan">{{ exam.difficulty }}</span>
            <span class="badge badge-pink">{{ exam.duration }}m</span>
            <span class="badge badge-lime">{{ exam.questions }} Q</span>
          </div>
          
          <!-- Stats -->
          <div class="flex justify-between text-sm font-black text-brutal-gray">
            <span>👥 {{ exam.attempts.toLocaleString() }} attempts</span>
            <span>⭐ {{ exam.rating }}</span>
            <span>📊 {{ exam.avgScore }}% avg</span>
          </div>
        </div>
        
        <router-link
          :to="'/test/' + exam.id"
          :class="[
            'w-full btn-primary',
            index % 3 === 0 ? 'btn-primary-lime' : 
            index % 3 === 1 ? 'btn-primary-pink' : 
            'btn-primary-cyan'
          ]"
        >
          {{ $t('actions.start') }}
        </router-link>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-16"
    >
      <div class="bg-brutal-white border-4 border-black shadow-brutal p-12 max-w-md mx-auto transform rotate-[-1deg]">
        <div class="text-6xl mb-4">
          📚
        </div>
        <h3 class="subheading-brutal mb-4">
          No Tests Found
        </h3>
        <p class="text-brutal mb-6">
          Try adjusting your filters or check back later for new tests.
        </p>
        <button
          class="btn-primary btn-primary-brutal"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { examCategories, mockExams } from '@/lib/data/examData'

const selectedCategory = ref('')
const selectedSubcategory = ref('')
const difficultyFilter = ref('')
const typeFilter = ref('')
const premiumFilter = ref('')

const filteredExams = computed(() => {
  let exams = mockExams
  
  if (selectedCategory.value) {
    exams = exams.filter(exam => exam.category === selectedCategory.value)
  }
  
  if (selectedSubcategory.value) {
    exams = exams.filter(exam => exam.subcategory === selectedSubcategory.value)
  }
  
  if (difficultyFilter.value) {
    exams = exams.filter(exam => exam.difficulty === difficultyFilter.value)
  }
  
  if (typeFilter.value) {
    exams = exams.filter(exam => exam.tags.includes(typeFilter.value))
  }
  
  if (premiumFilter.value) {
    exams = exams.filter(exam => exam.isPremium.toString() === premiumFilter.value)
  }
  
  return exams
})

const selectCategory = (category: string) => {
  selectedCategory.value = category
  selectedSubcategory.value = ''
}

const selectSubcategory = (subcategory: string) => {
  selectedSubcategory.value = subcategory
}

const clearFilters = () => {
  selectedCategory.value = ''
  selectedSubcategory.value = ''
  difficultyFilter.value = ''
  typeFilter.value = ''
  premiumFilter.value = ''
}
</script>
