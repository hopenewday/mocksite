<template>
  <section class="max-w-3xl mx-auto px-4 py-10">
    <h2 class="text-2xl font-semibold mb-4">
      Welcome to Job Alerts
    </h2>
    <div class="card p-5 space-y-4">
      <div>
        <div class="font-semibold mb-1">
          1. Browse open positions
        </div>
        <p>Visit Jobs to browse by Category or search for specific opportunities. Clicking a job will redirect you to the application portal.</p>
      </div>
      <div>
        <div class="font-semibold mb-1">
          2. Enable Text-to-Speech
        </div>
        <p>Use the TTS controls to have the platform read job details aloud while you navigate.</p>
      </div>
      <div>
        <div class="font-semibold mb-1">
          3. Customize your experience
        </div>
        <p>Adjust voice and speech rate, use keyboard navigation, and explore micro-interactions for feedback.</p>
      </div>
      <div>
        <div class="font-semibold mb-1">
          4. Accessibility
        </div>
        <p>All controls support focus rings, aria labels, and high-contrast text for readability.</p>
      </div>
    </div>
    <div class="mt-6 flex gap-3">
      <router-link
        to="/jobs"
        class="btn-primary"
      >
        Go to Jobs
      </router-link>
      <router-link
        to="/"
        class="btn-secondary"
      >
        Back to Home
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
// guided onboarding content page
</script>
