<template>
  <div class="how-to-section mt-8">
    <h2 class="text-2xl font-bold mb-6 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 mr-2 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      How to Use
    </h2>
    
    <div class="space-y-4">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="border-l-4 border-green-500 bg-green-50 rounded-r-lg overflow-hidden"
      >
        <button
          class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-green-100 transition-colors"
          :aria-expanded="openSteps[index] ? 'true' : 'false'"
          :aria-controls="`step-${index}`"
          @click="toggleStep(index)"
        >
          <div class="flex items-start">
            <span class="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-bold mr-3">
              {{ index + 1 }}
            </span>
            <span class="font-medium text-gray-900">{{ step.name }}</span>
          </div>
          <svg 
            class="w-5 h-5 text-gray-500 transform transition-transform duration-200" 
            :class="{ 'rotate-180': openSteps[index] }"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        <div 
          :id="`step-${index}`"
          class="px-6 pb-4 pl-14 bg-white"
          :class="{ 'hidden': !openSteps[index] }"
        >
          <p class="text-gray-600">
            {{ step.text }}
          </p>
          
          <!-- Optional image for the step -->
          <div
            v-if="step.image"
            class="mt-3"
          >
            <img 
              :src="step.image" 
              :alt="step.name" 
              class="max-w-full h-auto rounded-lg border border-gray-200"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

const props = defineProps<{
  steps: HowToStep[];
  defaultOpen?: boolean;
}>();

const openSteps = ref<boolean[]>([]);

// Initialize all steps as closed by default
onMounted(() => {
  openSteps.value = props.steps.map(() => props.defaultOpen || false);
  // Auto-open first step if defaultOpen is true
  if (props.defaultOpen && props.steps.length > 0) {
    openSteps.value[0] = true;
  }
});

const toggleStep = (index: number) => {
  openSteps.value = openSteps.value.map((isOpen, i) => 
    i === index ? !isOpen : isOpen
  );
};
</script>
