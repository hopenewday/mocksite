<template>
  <div class="faq-section mt-8">
    <h2 class="text-2xl font-bold mb-6 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 mr-2 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Frequently Asked Questions
    </h2>
    
    <div class="space-y-4">
      <div 
        v-for="(faq, index) in faqs" 
        :key="index"
        class="border border-gray-200 rounded-lg overflow-hidden"
        :class="{ 'mb-4': index < faqs.length - 1 }"
      >
        <button
          class="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
          :aria-expanded="openFaqs[index] ? 'true' : 'false'"
          :aria-controls="`faq-${index}`"
          @click="toggleFaq(index)"
        >
          <span class="font-medium text-gray-900">{{ faq.question }}</span>
          <svg 
            class="w-5 h-5 text-gray-500 transform transition-transform duration-200" 
            :class="{ 'rotate-180': openFaqs[index] }"
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
          :id="`faq-${index}`"
          class="px-6 py-4 bg-white"
          :class="{ 'hidden': !openFaqs[index] }"
        >
          <p class="text-gray-600">
            {{ faq.answer }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface FAQ {
  question: string;
  answer: string;
}

const props = defineProps<{
  faqs: FAQ[];
  defaultOpen?: boolean;
}>();

const openFaqs = ref<boolean[]>([]);

// Initialize all FAQs as closed by default
onMounted(() => {
  openFaqs.value = props.faqs.map(() => props.defaultOpen || false);
});

const toggleFaq = (index: number) => {
  openFaqs.value = openFaqs.value.map((isOpen, i) => 
    i === index ? !isOpen : isOpen
  );
};
</script>
