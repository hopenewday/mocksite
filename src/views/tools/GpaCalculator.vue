<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Tool Header -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        GPA Calculator
      </h1>
      <p class="text-lg text-gray-600">
        Calculate your Grade Point Average (GPA) with our free online calculator. 
        Supports multiple grading scales and weighted calculations.
      </p>
    </header>

    <!-- Main Tool Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Tool Interface -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <!-- Tool-specific content would go here -->
          <div class="space-y-6">
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Grading Scale
              </label>
              <select class="w-full p-2 border border-gray-300 rounded-md">
                <option>4.0 Scale (A=4.0, B=3.0, etc.)</option>
                <option>5.0 Scale (A=5.0, B=4.0, etc.)</option>
                <option>10.0 Scale</option>
              </select>
            </div>
            
            <!-- Course list would be dynamically generated -->
            <div class="space-y-4">
              <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-md">
                <input
                  type="text"
                  placeholder="Course Name"
                  class="flex-1 p-2 border rounded"
                >
                <input
                  type="number"
                  placeholder="Credits"
                  class="w-20 p-2 border rounded"
                >
                <select class="w-24 p-2 border rounded">
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                  <option>F</option>
                </select>
                <button class="text-red-500 hover:text-red-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              
              <button class="flex items-center text-blue-600 hover:text-blue-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Add Another Course
              </button>
            </div>
            
            <div class="mt-6 p-4 bg-blue-50 rounded-md">
              <div class="flex justify-between items-center">
                <span class="font-medium">GPA:</span>
                <span class="text-2xl font-bold">3.75</span>
              </div>
            </div>
            
            <div class="flex space-x-4 mt-6">
              <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Calculate GPA
              </button>
              <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>
        
        <!-- How To Section -->
        <HowToSection 
          :steps="howToSteps" 
          :default-open="true"
          class="mb-8"
        />
        
        <!-- FAQ Section -->
        <FaqSection 
          :faqs="faqs" 
          :default-open="false"
        />
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Related Tools -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-medium text-lg mb-4">
            Related Tools
          </h3>
          <ul class="space-y-2">
            <li
              v-for="tool in relatedTools"
              :key="tool.name"
              class="group"
            >
              <a
                :href="tool.url"
                class="flex items-center p-2 rounded-md hover:bg-gray-50"
              >
                <span class="text-blue-600 group-hover:text-blue-800">{{ tool.name }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 ml-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Share Tool -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-medium text-lg mb-4">
            Share This Tool
          </h3>
          <div class="flex space-x-2">
            <button
              v-for="platform in sharePlatforms"
              :key="platform.name" 
              class="p-2 rounded-full hover:bg-gray-100"
              :title="`Share on ${platform.name}`"
            >
              <component
                :is="platform.icon"
                class="h-5 w-5"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToolSEO } from '@/utils/seo';
import FaqSection from '@/components/ui/FaqSection.vue';
import HowToSection from '@/components/ui/HowToSection.vue';

// Define FAQ items
const faqs = [
  {
    question: 'How do I calculate my GPA?',
    answer: 'Enter your grades and credit hours for each course, and the calculator will automatically compute your GPA based on the selected grading scale.'
  },
  {
    question: 'What is the difference between weighted and unweighted GPA?',
    answer: 'Weighted GPA takes into account the difficulty of your courses (like honors or AP classes) and can be higher than 4.0, while unweighted GPA is on a standard 4.0 scale.'
  },
  {
    question: 'How do I improve my GPA?',
    answer: 'Focus on improving your grades in current and future courses, retake courses where you received low grades if possible, and consider taking additional courses to offset lower grades.'
  }
];

// Define How-To steps
const howToSteps = [
  {
    name: 'Select Grading Scale',
    text: 'Choose the appropriate grading scale for your institution (4.0, 5.0, or 10.0 scale).',
    image: '/images/howto/select-scale.jpg'
  },
  {
    name: 'Add Your Courses',
    text: 'Enter each course name, number of credits, and the grade you received or expect to receive.',
    image: '/images/howto/add-courses.jpg'
  },
  {
    name: 'Add More Courses',
    text: 'Click the "Add Another Course" button to include all your courses in the calculation.',
    image: '/images/howto/add-more.jpg'
  },
  {
    name: 'View Your GPA',
    text: 'Your GPA will be calculated and displayed at the bottom of the form.',
    image: '/images/howto/view-results.jpg'
  }
];

// Related tools
const relatedTools = [
  { name: 'CGPA Calculator', url: '/tools/academic/cgpa-calculator' },
  { name: 'Grade Calculator', url: '/tools/academic/grade-calculator' },
  { name: 'Final Grade Calculator', url: '/tools/academic/final-grade-calculator' },
  { name: 'Test Score Calculator', url: '/tools/academic/test-score-calculator' }
];

// Share platforms
const sharePlatforms = [
  { 
    name: 'Facebook',
    icon: 'FacebookIcon'
  },
  { 
    name: 'Twitter',
    icon: 'TwitterIcon'
  },
  { 
    name: 'LinkedIn',
    icon: 'LinkedInIcon'
  },
  { 
    name: 'Email',
    icon: 'MailIcon'
  },
  { 
    name: 'Link',
    icon: 'LinkIcon'
  }
];

// Initialize SEO
const { initSEO } = useToolSEO({
  name: 'GPA Calculator',
  description: 'Calculate your Grade Point Average (GPA) with our free online calculator. Supports 4.0, 5.0, and 10.0 grade scales with weighted calculations.',
  slug: 'gpa-calculator',
  category: 'academic',
  features: [
    '4.0, 5.0, and 10.0 grade scales',
    'Weighted GPA calculation',
    'Cumulative GPA tracking',
    'Mobile-friendly interface',
    'No registration required',
    'Save and share results'
  ],
  faqs: faqs,
  howToSteps: howToSteps,
  keywords: ['gpa calculator', 'grade point average', 'gpa scale', 'weighted gpa', 'unweighted gpa', 'gpa converter'],
  imagePath: '/images/og/gpa-calculator.jpg'
});

// Initialize component
onMounted(() => {
  initSEO();
});
</script>

<style scoped>
.form-group {
  @apply mb-4;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-group input,
.form-group select {
  @apply w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500;
}

.form-group input:focus,
.form-group select:focus {
  @apply ring-1 ring-blue-500;
}
</style>
