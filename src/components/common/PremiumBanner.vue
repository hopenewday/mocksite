<template>
  <div class="bg-brutal-pink border-4 border-black shadow-brutal p-6 transform rotate-[1deg]">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-black text-xl mb-2">
          👑 Go Premium
        </h3>
        <p class="font-bold mb-4">
          Unlock all mock tests and features
        </p>
        <ul class="space-y-2 text-sm font-bold">
          <li
            v-for="feature in premiumFeatures"
            :key="feature"
            class="flex items-center gap-2"
          >
            <span class="text-green-600">✅</span>
            {{ feature }}
          </li>
        </ul>
      </div>
      <div class="text-center">
        <div class="bg-brutal-yellow border-4 border-black p-4 mb-4 transform rotate-[-2deg]">
          <div class="text-3xl font-black">
            ₹299
          </div>
          <div class="text-sm font-bold">
            per month
          </div>
        </div>
        <button 
          class="btn-primary btn-primary-yellow px-6 py-3 font-black"
          @click="showPaymentModal = true"
        >
          Upgrade Now
        </button>
      </div>
    </div>
    
    <!-- Payment Modal -->
    <div
      v-if="showPaymentModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-brutal-white border-4 border-black p-8 max-w-md w-full transform rotate-[-1deg]">
        <h3 class="font-black text-xl mb-4">
          Choose Your Plan
        </h3>
        
        <div class="space-y-4 mb-6">
          <div 
            v-for="plan in plans"
            :key="plan.id"
            :class="[
              'border-4 border-black p-4 cursor-pointer transform transition-all',
              selectedPlan === plan.id 
                ? 'bg-brutal-cyan ring-4 ring-brutal-pink' 
                : 'bg-brutal-white hover:bg-brutal-cyan/20'
            ]"
            @click="selectedPlan = plan.id"
          >
            <div class="flex justify-between items-center">
              <div>
                <h4 class="font-black">
                  {{ plan.name }}
                </h4>
                <p class="text-sm font-bold text-brutal-gray">
                  {{ plan.description }}
                </p>
              </div>
              <div class="text-right">
                <div class="font-black text-xl">
                  ₹{{ plan.price }}
                </div>
                <div class="text-sm font-bold">
                  {{ plan.duration }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex gap-4">
          <button 
            :disabled="!selectedPlan"
            class="btn-primary btn-primary-cyan flex-1 disabled:opacity-50"
            @click="processPayment"
          >
            Proceed to Payment
          </button>
          <button 
            class="btn-primary btn-primary-pink"
            @click="showPaymentModal = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showPaymentModal = ref(false)
const selectedPlan = ref('')

const premiumFeatures = [
  '1000+ mock tests',
  'Detailed analytics',
  'Previous year papers',
  'Ad-free experience',
  'Unlimited downloads',
  'Priority support',
  'Advanced performance insights',
  'Custom study plans'
]

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    description: 'Billed monthly',
    price: 299,
    duration: '/month'
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    description: 'Save 20%',
    price: 719,
    duration: '/3 months'
  },
  {
    id: 'yearly',
    name: 'Yearly',
    description: 'Save 40%',
    price: 2159,
    duration: '/year'
  }
]

const processPayment = () => {
  // Integrate with payment gateway
  console.log('Processing payment for plan:', selectedPlan.value)
  showPaymentModal.value = false
}
</script>
