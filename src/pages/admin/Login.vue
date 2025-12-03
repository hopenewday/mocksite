<template>
  <section class="max-w-md mx-auto px-4 py-12">
    <h2 class="text-2xl font-semibold mb-6">
      Admin Login
    </h2>
    <form
      class="space-y-4"
      @submit.prevent="login"
    >
      <input
        v-model="email"
        type="email"
        class="w-full px-3 py-2 border rounded"
        placeholder="Email"
      >
      <input
        v-model="password"
        type="password"
        class="w-full px-3 py-2 border rounded"
        placeholder="Password"
      >
      <button class="w-full btn-primary">
        Login
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
async function login() {
  await auth.login(email.value, password.value)
  router.push((route.query.redirect as string) || '/admin')
}
</script>
