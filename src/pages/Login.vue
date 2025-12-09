<template>
  <section class="max-w-md mx-auto px-4 py-12">
    <div class="flex gap-2 mb-6">
      <button
        class="px-3 py-2 border rounded"
        :class="{ 'bg-black text-white': mode==='email' }"
        @click="mode='email'"
      >
        Email
      </button>
      <button
        class="px-3 py-2 border rounded"
        :class="{ 'bg-black text-white': mode==='phone' }"
        @click="mode='phone'"
      >
        Phone
      </button>
      <button
        class="px-3 py-2 border rounded"
        :class="{ 'bg-black text-white': mode==='google' }"
        @click="mode='google'"
      >
        Google
      </button>
    </div>
    <form
      v-if="mode==='email'"
      class="space-y-4"
      @submit.prevent="loginEmail"
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
      <button
        class="w-full btn-primary"
        :disabled="!strongPassword"
      >
        Login
      </button>
    </form>
    <form
      v-else-if="mode==='phone'"
      class="space-y-4"
      @submit.prevent="submitPhone"
    >
      <div class="flex gap-2">
        <select
          v-model="country"
          class="px-3 py-2 border rounded"
        >
          <option
            v-for="c in countries"
            :key="c.code"
            :value="c.dial"
          >
            {{ c.name }} {{ c.dial }}
          </option>
        </select>
        <input
          v-model="phone"
          type="tel"
          class="flex-1 px-3 py-2 border rounded"
          placeholder="Phone"
        >
      </div>
      <div
        v-if="otpSent"
        class="space-y-2"
      >
        <input
          v-model="otp"
          class="w-full px-3 py-2 border rounded"
          placeholder="OTP"
        >
        <button
          class="w-full btn-primary"
          @click.prevent="verify"
        >
          Verify
        </button>
      </div>
      <div v-else>
        <button class="w-full btn-primary">
          Send OTP
        </button>
      </div>
    </form>
    <div
      v-else
      class="space-y-4"
    >
      <button
        class="w-full btn-primary"
        @click="google"
      >
        Continue with Google
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const mode = ref<'email'|'phone'|'google'>('email')
const email = ref('')
const password = ref('')
const country = ref('+91')
const phone = ref('')
const otpSent = ref(false)
const otp = ref('')
const countries = [
  { name: 'India', code: 'IN', dial: '+91' },
  { name: 'United States', code: 'US', dial: '+1' },
  { name: 'United Kingdom', code: 'GB', dial: '+44' }
]
const strongPassword = computed(() => {
  const v = password.value
  const hasUpper = /[A-Z]/.test(v)
  const hasLower = /[a-z]/.test(v)
  const hasNum = /\d/.test(v)
  const hasSym = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v)
  return v.length >= 8 && hasUpper && hasLower && hasNum && hasSym
})
async function loginEmail() { await auth.login(email.value, password.value) }
async function submitPhone() {
  const full = `${country.value}${phone.value}`
  await auth.requestOtp(full)
  otpSent.value = true
}
async function verify() {
  const full = `${country.value}${phone.value}`
  await auth.verifyOtp(full, otp.value)
}
async function google() { await auth.loginWithGoogle() }
</script>
