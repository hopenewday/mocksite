<template>
  <section class="max-w-6xl mx-auto px-4 py-10">
    <div class="flex gap-3 mb-6">
      <router-link
        to="/admin/tests"
        class="px-3 py-1 rounded border"
      >
        Tests
      </router-link>
      <router-link
        to="/admin/questions"
        class="px-3 py-1 rounded border"
      >
        Questions
      </router-link>
      <router-link
        to="/admin/upload"
        class="px-3 py-1 rounded border"
      >
        Bulk Upload
      </router-link>
      <router-link
        to="/admin/analytics"
        class="px-3 py-1 rounded border"
      >
        Analytics
      </router-link>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="border rounded p-4">
        Tests
      </div>
      <div class="border rounded p-4">
        Questions
      </div>
      <div class="border rounded p-4">
        Users
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>