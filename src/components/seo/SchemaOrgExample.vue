<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">
      GPA Calculator
    </h1>
    
    <!-- Tool content would go here -->
    <div class="bg-white p-4 rounded-lg shadow">
      <p>This is a sample GPA calculator tool.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSchemaOrg } from '@/composables/useSchemaOrg';
import { useRoute } from 'vue-router';

const route = useRoute();
const { setWebApplication, setBreadcrumbs } = useSchemaOrg();

// Set up schema.org data
onMounted(() => {
  const baseUrl = window.location.origin;
  const currentUrl = `${baseUrl}${route.path}`;
  
  // Set WebApplication schema
  setWebApplication({
    name: 'GPA Calculator',
    description: 'Calculate your GPA with our free online calculator. Supports 4.0, 5.0, and 10.0 grade scales with weighted calculations.',
    url: currentUrl,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      '4.0, 5.0, and 10.0 grade scales',
      'Weighted GPA calculation',
      'Cumulative GPA tracking',
      'Mobile-friendly interface',
      'No registration required'
    ]
  });

  // Set breadcrumbs
  setBreadcrumbs([
    { name: 'Home', item: baseUrl },
    { name: 'Tools', item: `${baseUrl}/tools` },
    { name: 'GPA Calculator' }
  ]);
});
</script>
